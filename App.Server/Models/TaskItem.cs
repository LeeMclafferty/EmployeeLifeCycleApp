using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{

    public enum TaskPhase
    {
        Onboarding = 0,
        Offboarding = 1
    }

    public class TaskTemplate
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsAutomated { get; set; }
        public List<Department> ApplicableDepartments { get; set; } = new();
        public TaskPhase taskPhase { get; set; }

        // 🔹 Owning team or department
        public int? OwningTeamId { get; set; }
        public Team? OwningTeam { get; set; }
        public int? OwningDepartmentId { get; set; }
        public Department? OwningDepartment { get; set; }
    }
}
