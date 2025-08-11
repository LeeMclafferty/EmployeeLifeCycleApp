using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static App.Server.Models.PersonRecord;

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
                string message = string.Join(", ", ModelState.Keys) + " keys not valid.";
                return BadRequest(message);
            }

            _context.PersonRecords.Add(personRecord);
            await _context.SaveChangesAsync();
            return Ok(personRecord);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<List<PersonRecord>>> GetAll()
        {
            var records = await _context.PersonRecords
                .Include(p => p.Department)
                .Include(p => p.Team)
                .ToListAsync();
            return Ok(records);
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<PersonRecord>> GetById(int id)
        {
            var person = await _context.PersonRecords
                .Include(p => p.Department)
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (person == null)
                return NotFound(new { message = "Person not found" });

            return Ok(person);
        }

        [HttpGet("Phase")]
        public async Task<ActionResult<List<PersonRecord>>> GetByPhase(LifeCyclePhase phase)
        {
            try
            {
                var records = await _context.PersonRecords
                    .Where(t => t.Phase == phase)
                    .Include(p => p.Department)
                    .Include(p => p.Team)
                    .ToListAsync();

                return Ok(records);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server error: {ex.Message}");
            }
        }

        [HttpPut("Update")]
        public async Task<ActionResult> Update(PersonRecord personRecord)
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

            var existing = await _context.PersonRecords.FindAsync(personRecord.Id);
            if (existing == null) return NotFound(new { message = "Person not found" });

            _context.Entry(existing).CurrentValues.SetValues(personRecord);
            await _context.SaveChangesAsync();
            return Ok(personRecord);
        }

        [HttpPut("{id:int}/phase")]
        public async Task<IActionResult> UpdatePhase(int id, [FromBody] PhaseUpdateDto dto)
        {
            var existing = await _context.PersonRecords.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Person not found" });

            existing.Phase = dto.Phase;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public sealed class PhaseUpdateDto
        {
            public LifeCyclePhase Phase { get; set; }
        }
    }
}
