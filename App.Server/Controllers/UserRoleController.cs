using App.Server.Authorization;
using App.Server.Data;
using App.Server.Extensions;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRoleController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserRole/Roles
        [HttpGet("Roles")]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRoles()
        {
            return await _context.UserRoles.ToListAsync();
        }

        // GET: api/UserRole/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRole>> GetUserRole(int id)
        {
            var role = await _context.UserRoles.FindAsync(id);
            if (role == null) return NotFound();
            return role;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserRole()
        {
            var email = User.GetEmail();
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var roles = await _context.UserRoles
                .Where(u => u.Email == email)
                .Select(u => u.Role)
                .ToListAsync();

            if (!roles.Any())
                return NotFound();

            return Ok(new { email, roles });
        }

        // POST: api/UserRole
        [AuthorizeRole("SuperAdmin")]
        [HttpPost]
        public async Task<ActionResult<UserRole>> PostUserRole(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserRole), new { id = userRole.Id }, userRole);
        }

        // PUT: api/UserRole/{id}
        [AuthorizeRole("SuperAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRole(int id, UserRole userRole)
        {
            if (id != userRole.Id) return BadRequest();

            _context.Entry(userRole).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/UserRole/{id}
        [AuthorizeRole("SuperAdmin")]
        [HttpDelete("{email}/{role}")]
        public async Task<IActionResult> DeleteUserRole(string email, string role)
        {
            var entry = await _context.UserRoles
                .FirstOrDefaultAsync(u => u.Email == email && u.Role == role);

            if (entry == null) return NotFound();

            _context.UserRoles.Remove(entry);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }

}
