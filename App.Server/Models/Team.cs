using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{
    public class Team
    {
        [Key]
        public int Id{get; set;}
        public string Name { get; set; } = string.Empty;

        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
    }
}
