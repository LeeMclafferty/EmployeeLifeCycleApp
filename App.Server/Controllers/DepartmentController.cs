using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<Department>> GetById(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
                return NotFound(new { message = "Department not found" });

            return Ok(department);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var departments = await _context.Departments.ToListAsync();

                if (!departments.Any())
                    return NotFound(new { message = "Unable to find any departments" });

                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Server error: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }
    }
}
