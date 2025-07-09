using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data.Entity;

namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskTemplateController : ControllerBase
    {
        private readonly AppDbContext _context;

        TaskTemplateController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<TaskTemplate>> GetTask(int id)
        {
            var taskTemplate = await _context.TaskTemplates.FindAsync(id);
            if(taskTemplate == null)
                return NotFound( new { message = "Task template not found"});

            return Ok(taskTemplate);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<List<TaskTemplate>>> GetAll()
        {
            var taskList = await _context.TaskTemplates.ToListAsync();
            if (taskList.IsNullOrEmpty())
                return NotFound(new { message = "Unable to fetch all task templates"});
            
            return Ok(taskList);
        }

        [HttpPost("Create")]
        public async Task<ActionResult> Create(TaskTemplate taskTemplate)
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

            _context.TaskTemplates.Add(taskTemplate);
            _context.SaveChanges();
            return Ok(taskTemplate);
        }

        [HttpPut("Update")]
        public async Task<ActionResult> Update(TaskTemplate taskTemplate)
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

            _context.TaskTemplates.Update(taskTemplate);
            await _context.SaveChangesAsync();
            return Ok(taskTemplate);
        }
    }
}
