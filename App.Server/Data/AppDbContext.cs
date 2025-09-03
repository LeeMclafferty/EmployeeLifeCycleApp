using App.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<PersonRecord> PersonRecords { get; set; }
        public DbSet<TaskTemplate> TaskTemplates { get; set; }
        public DbSet<AssignedTask> AssignedTask { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskTemplate>()
                .HasMany(t => t.ApplicableDepartments)
                .WithMany()
                .UsingEntity(j => j.ToTable("TaskTemplateApplicableDepartments"));

            // Explicitly configure PersonRecord -> Department
            modelBuilder.Entity<PersonRecord>()
                .HasOne(p => p.Department)
                .WithMany()
                .HasForeignKey(p => p.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Explicitly configure PersonRecord -> Team
            modelBuilder.Entity<PersonRecord>()
                .HasOne(p => p.Team)
                .WithMany()
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
