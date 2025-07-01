using App.Server.Data;
using App.Server.Models;
using Microsoft.AspNetCore.Mvc;

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
            _context.PersonRecords.Add(personRecord);
            await _context.SaveChangesAsync();
            return Ok(personRecord);
        }
    }
}
