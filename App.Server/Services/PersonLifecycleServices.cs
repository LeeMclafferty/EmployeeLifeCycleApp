using App.Server.Data;
using App.Server.Models;
using System.Data.Entity;
using static App.Server.Models.PersonRecord;

namespace App.Server.Services
{
    public class PersonLifecycleServices
    {

        public record PhaseChangeResult(
            bool Success, int TasksCreated, string? ErrorMessage
            );

        private readonly AppDbContext _context;
        private readonly ILogger<PersonLifecycleServices> _logger;

        PersonLifecycleServices(AppDbContext context, ILogger<PersonLifecycleServices> logger)
        {
            _context = context;
            _logger = logger;
        }


        public async Task<PhaseChangeResult> SetPhaseAsync(int personId, LifeCyclePhase newPhase, CancellationToken ct)
        {
            await using var tx = await _context.Database.BeginTransactionAsync(ct);

            var person = await _context.PersonRecords
                .FirstOrDefaultAsync(p => p.Id == personId, ct);
            if (person == null) return new(false, 0, "Person not found");
            if (person.DepartmentId == null) return new(false, 0, "Person has no department");

            // If not moving to Onboarding, just update phase.
            if (newPhase != LifeCyclePhase.Onboarding)
            {
                person.Phase = newPhase;
                await _context.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
                return new(true, 0, "Updated phase successfully");
            }

            // If already Onboarding, nothing to do.
            if (person.Phase == LifeCyclePhase.Onboarding)
            {
                await tx.CommitAsync(ct);
                return new(true, 0, "Already in Onboarding");
            }

            // 1) candidates (templates applicable to this person's department)
            var candidates = await _context.TaskTemplates
                .AsNoTracking()
                .Where(t => t.ApplicableDepartments.Any(d => d.Id == person.DepartmentId))
                .Select(t => new
                {
                    TemplateId = t.Id,
                    t.Title,
                    t.Description
                })
                .ToListAsync(ct);

            var templateIds = candidates.Select(c => c.TemplateId).Distinct().ToList();

            // If no templates, still allow phase change with 0 tasks.
            if (templateIds.Count == 0)
            {
                person.Phase = LifeCyclePhase.Onboarding;
                await _context.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
                return new(true, 0, "No templates for department; phase updated with 0 tasks");
            }

            // 2) E: which template IDs already exist for this person
            var existingIds = await _context.AssignedTask
                .AsNoTracking()
                .Where(a => a.NewHireId == personId && templateIds.Contains(a.TaskTemplateId))
                .Select(a => a.TaskTemplateId)
                .ToListAsync(ct);
            var existing = new HashSet<int>(existingIds);

            // 3) M: missing templates we must create now
            var missing = candidates.Where(c => !existing.Contains(c.TemplateId)).ToList();

            // 4) Map M -> AssignedTask (defaults only)
            foreach (var m in missing)
            {
                _context.AssignedTask.AddAsync(new AssignedTask
                {
                    NewHireId = personId,
                    TaskTemplateId = m.TemplateId,
                    IsComplete = false, // adjust enum/name
                    CompletedAt = null,
                    Notes = null
            }

            // 5) Update phase and commit atomically
            person.Phase = LifeCyclePhase.Onboarding;

            try
            {
                await _context.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);
                return new(true, missing.Count, $"Created {missing.Count} tasks");
            }
            catch (DbUpdateException ex)
            {
                await tx.RollbackAsync(ct);
                _logger.LogError(ex, "Failed onboarding task generation for Person {PersonId}", personId);
                return new(false, 0, "Failed to create onboarding tasks");
            }
        }

    }
}
