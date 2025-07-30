using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TeamController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<Team>> GetById(int id)
        {
            var team = await _context.Teams
                .Include(t => t.Department)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (team == null)
                return NotFound(new { message = "Team not found." });

            return Ok(team);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAll()
        {
            var teams = await _context.Teams
                .Include(t => t.Department)
                .ToListAsync();

            if(!teams.Any())
            {
                return NotFound(new {message = "Unable to find any teams."});
            }

            return Ok(teams);
        }
    }
}
