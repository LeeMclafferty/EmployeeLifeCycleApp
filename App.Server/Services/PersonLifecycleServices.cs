using App.Server.Data;
using App.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using static App.Server.Models.PersonRecord;

namespace App.Server.Services
{
    public class PersonLifecycleService
    {
        public record PhaseChangeResult(bool Success, int TasksCreated, string? ErrorMessage);

        private readonly AppDbContext _context;
        private readonly ILogger<PersonLifecycleService> _logger;

        public PersonLifecycleService(AppDbContext context, ILogger<PersonLifecycleService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PhaseChangeResult> SetPhaseAsync(int personId, LifeCyclePhase newPhase, CancellationToken ct)
        {
            var person = await _context.PersonRecords.FirstOrDefaultAsync(p => p.Id == personId, ct);
            if (person == null) return new(false, 0, "Person not found");
            if (person.DepartmentId == null) return new(false, 0, "Person has no department");

            // If not moving to Onboarding, just update phase (no transaction needed)
            if (newPhase != LifeCyclePhase.Onboarding)
            {
                if(person.Phase == LifeCyclePhase.Onboarding)
                {
                    await _context.AssignedTask
                        .Where(a => a.NewHireId == personId)
                        .ExecuteDeleteAsync(ct);
                }
                person.Phase = newPhase;
                await _context.SaveChangesAsync(ct);
                return new(true, 0, "Phase updated");
            }

            // Already Onboarding — nothing to do
            if (person.Phase == LifeCyclePhase.Onboarding)
                return new(true, 0, "Already in Onboarding");

            // Find templates applicable to this person's department (many-to-many nav)
            var candidates = await _context.TaskTemplates
                .AsNoTracking()
                .Where(tt => tt.ApplicableDepartments.Any(d => d.Id == person.DepartmentId))
                .Select(tt => new { tt.Id })
                .ToListAsync(ct);

            if (candidates.Count == 0)
                return new(false, 0, "No templates configured for this department");

            var templateIds = candidates.Select(c => c.Id).Distinct().ToList();

            // One transaction for both: create tasks (idempotent) + set phase
            await using var tx = await _context.Database.BeginTransactionAsync(ct);
            try
            {
                // Re-check existing inside the transaction to minimize race window
                var existingIds = await _context.AssignedTask.AsNoTracking()
                    .Where(a => a.NewHireId == personId && templateIds.Contains(a.TaskTemplateId))
                    .Select(a => a.TaskTemplateId)
                    .ToListAsync(ct);

                var missingIds = templateIds.Except(existingIds).ToList();

                if (missingIds.Count > 0)
                {
                    var newTasks = missingIds.Select(id => new AssignedTask
                    {
                        NewHireId = personId,
                        TaskTemplateId = id,
                        IsComplete = false,
                        CompletedAt = null,
                        Notes = null
                    }).ToList();

                    await _context.AssignedTask.AddRangeAsync(newTasks, ct);
                }

                person.Phase = LifeCyclePhase.Onboarding;

                var tasksCreated = missingIds.Count;
                await _context.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);

                _logger.LogInformation("Onboarding tasks created: {Count} for person {PersonId} in dept {DeptId}",
                    tasksCreated, personId, person.DepartmentId);

                return new(true, tasksCreated, tasksCreated == 0
                    ? "Phase updated; tasks already existed"
                    : $"Created {tasksCreated} tasks");
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
            {
                // Race: another request inserted tasks first. Treat as success; just set phase.
                await tx.RollbackAsync(ct);

                await using var tx2 = await _context.Database.BeginTransactionAsync(ct);
                var fresh = await _context.PersonRecords.FirstAsync(p => p.Id == personId, ct);
                fresh.Phase = LifeCyclePhase.Onboarding;
                await _context.SaveChangesAsync(ct);
                await tx2.CommitAsync(ct);

                _logger.LogInformation("Phase set to Onboarding after unique-key race for person {PersonId}", personId);
                return new(true, 0, "Phase updated; tasks already existed");
            }
            catch (DbUpdateException ex)
            {
                await tx.RollbackAsync(ct);
                _logger.LogError(ex, "Failed onboarding task generation for Person {PersonId}", personId);
                return new(false, 0, "Failed to create onboarding tasks");
            }
        }

        private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
            ex.InnerException is SqlException sql && (sql.Number == 2627 || sql.Number == 2601);
    }
}
