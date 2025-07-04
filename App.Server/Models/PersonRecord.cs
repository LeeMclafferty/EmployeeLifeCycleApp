using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{
    public class PersonRecord
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        [Required]
        public string? LastName { get; set; }
        public string? PreferredName { get; set; }
        public string? Initials { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        public string? PhoneNumber { get; set; }
        public int? DeskNumber { get; set; }
        public string? EmailAddress { get; set; }
        public bool IsFullyRemote { get; set; } = false;

        public string? JobTitle { get; set; }
        public string? JobLevel { get; set; }
        public string? Department { get; set; }
    }
}
