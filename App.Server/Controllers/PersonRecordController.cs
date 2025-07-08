using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonRecordController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PersonRecordController(AppDbContext context) 
        { 
            _context = context;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(PersonRecord personRecord)
        {
            if (!ModelState.IsValid)
            {
                // Log each error to the console
                foreach (var entry in ModelState)
                {
                    foreach (var error in entry.Value.Errors)
                    {
                        Console.WriteLine($"Model error in '{entry.Key}': {error.ErrorMessage}");
                    }
                }

                return BadRequest(ModelState);
            }

            _context.PersonRecords.Add(personRecord);
            await _context.SaveChangesAsync();
            return Ok(personRecord);
        }

        [HttpGet("Get")]
        public async Task<List<PersonRecord>> GetAll() 
        {
            return await _context.PersonRecords.ToListAsync();
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<PersonRecord>> GetById(int id)
        {
            var person = await _context.PersonRecords.FindAsync(id);
            if (person == null)
                return NotFound(new { message = "Person not found" });

            return Ok(person);
        }

        [HttpPut("Update")]
        public async Task<ActionResult> Update(PersonRecord personRecord)
        {
            if (!ModelState.IsValid)
            {
                // Log each error to the console
                foreach (var entry in ModelState)
                {
                    foreach (var error in entry.Value.Errors)
                    {
                        Console.WriteLine($"Model error in '{entry.Key}': {error.ErrorMessage}");
                    }
                }

                return BadRequest(ModelState);
            }

            _context.Update(personRecord);
            await _context.SaveChangesAsync();
            return Ok(personRecord);
        }
    }
}
