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

        // GET: api/UserRole
        [HttpGet]
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

            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(u => u.Email == email);

            if (userRole == null)
                return NotFound();

            return Ok(new { email = userRole.Email, role = userRole.Role });
        }

        // POST: api/UserRole
        [AuthorizeRole("Admin")]
        [HttpPost]
        public async Task<ActionResult<UserRole>> PostUserRole(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserRole), new { id = userRole.Id }, userRole);
        }

        // PUT: api/UserRole/{id}
        [AuthorizeRole("Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRole(int id, UserRole userRole)
        {
            if (id != userRole.Id) return BadRequest();

            _context.Entry(userRole).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/UserRole/{id}
        [AuthorizeRole("Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRole(int id)
        {
            var role = await _context.UserRoles.FindAsync(id);
            if (role == null) return NotFound();

            _context.UserRoles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
