using System.ComponentModel.DataAnnotations;

namespace App.Server.Models
{
    public class UserRole
    {
        public int Id { get; set; }
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = "User";
    }
}
