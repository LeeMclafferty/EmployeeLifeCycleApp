using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }
}
