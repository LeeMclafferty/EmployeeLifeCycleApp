using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignedTaskController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AssignedTaskController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<AssignedTask>> GetAssignedTaskById(int id)
        {
            var assignedTask = await _context.AssignedTask
                .Include(t => t.TaskTemplate)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (assignedTask == null)
                return NotFound(new {message = "Assigned Task not found"});

            return Ok(assignedTask);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<List<AssignedTask>>> GetAllAssignedTask()
        {
            var assignedTaskList = await _context.AssignedTask
                    .Include(t => t.TaskTemplate)
                    .ToListAsync();

            if (assignedTaskList == null || !assignedTaskList.Any())
                return NotFound(new { message = "No assigned tasks found" });

            return Ok(assignedTaskList);
        }

        [HttpGet("ByNewHire/{id}")]
        public async Task<IActionResult> GetAssignedTasksByNewHire(int id)
        {
            try
            {
                var tasks = await _context.AssignedTask
                    .Include(t => t.TaskTemplate)
                    .Where(t => t.NewHireId == id)
                    .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server error: {ex.Message}");
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(AssignedTask assignedTask)
        {
            string message = string.Empty;
            if (!ModelState.IsValid)
            {
                foreach(var entry in ModelState)
                {
                    message += (entry.Key + ", ");
                }
                message += "keys not valid.";
                return BadRequest(message);
            }

            _context.AssignedTask.Add(assignedTask);
            await _context.SaveChangesAsync();
            return Ok(assignedTask);
        }

        [HttpPut("Update")]
        public async Task<ActionResult> Update(AssignedTask assignedTask)
        {
            string message = string.Empty;
            if (!ModelState.IsValid)
            {
                foreach (var entry in ModelState)
                {
                    message += (entry.Key + ", ");
                }
                message += "keys not valid.";
                return BadRequest(message);
            }

            _context.AssignedTask.Update(assignedTask);
            await _context.SaveChangesAsync();
            return Ok(assignedTask);
        }
    }
}
