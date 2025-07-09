using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{
    public class AssignedTask
    {
        [Key]
        public int Id { get; set; }
        public int TaskTemplateId { get; set; }
        public int NewHireId { get; set; }
        public bool IsComplete { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }

        public TaskTemplate? TaskTemplate { get; set; }

    }
}
