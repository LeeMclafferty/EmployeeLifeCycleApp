using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data.Entity;

namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignedTaskController : ControllerBase
    {
        private readonly AppDbContext _context;
        AssignedTaskController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<AssignedTask>> GetAssignedTaskById(int id)
        {
            var assignedTask = await _context.AssignedTask.FindAsync(id);
            if(assignedTask == null)
                return NotFound(new {message = "Assigned Task not found"});

            return Ok(assignedTask);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<List<AssignedTask>>> GetAllAssignedTask()
        {
            var assignedTaskList = await _context.AssignedTask.ToListAsync();
            if (assignedTaskList.IsNullOrEmpty())
                return NotFound(new { message = "Unable to fetch all AssignedTask" });

            return Ok(assignedTaskList);
        }

        [HttpGet("ByNewHire/{id}")]
        public async Task<ActionResult<List<AssignedTask>>> GetByNewHireId(int id)
        {
            var tasks = await _context.AssignedTask
                .Include(t => t.TaskTemplate)
                .Where(t => t.NewHireId == id)
                .ToListAsync();

            if (tasks.IsNullOrEmpty())
                return NotFound("No assigned tasks found for this hire.");


            return Ok(tasks);
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
    }
}
