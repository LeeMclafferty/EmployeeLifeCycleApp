﻿using System.ComponentModel.DataAnnotations;

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
        public int DepartmentId { get; set; }
        public TaskPhase taskPhase { get; set; }
    }
}
