using App.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Controllers
{
    [ApiController]
    [Route("api/export")]
    public class ExportController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public ExportController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("Excel")]
        public async Task<IActionResult> Excel()
        {
            var records = await _appDbContext.PersonRecords.ToListAsync();
            var workbook = new ClosedXML.Excel.XLWorkbook();
            var worksheet = workbook.Worksheets.Add("People Export");

            // Headers of rows
            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "First Name";
            worksheet.Cell(1, 3).Value = "Middle Name";
            worksheet.Cell(1, 4).Value = "Last Name";
            worksheet.Cell(1, 5).Value = "Preferred Name";
            worksheet.Cell(1, 6).Value = "Initials";

            worksheet.Cell(1, 7).Value = "Start Date";
            worksheet.Cell(1, 8).Value = "End Date";
            worksheet.Cell(1, 9).Value = "Phone Number";
            worksheet.Cell(1, 10).Value = "Email Address";

            worksheet.Cell(1, 11).Value = "Fully Remote";
            worksheet.Cell(1, 12).Value = "Job Title";
            worksheet.Cell(1, 13).Value = "Job Level";
            worksheet.Cell(1, 14).Value = "Department Id";
            worksheet.Cell(1, 15).Value = "Team Id";
            worksheet.Cell(1, 16).Value = "Phase";


            // Content of rows
            var row = 2;
            foreach (var record in records)
            {
                worksheet.Cell(row, 1).Value = record.Id;
                worksheet.Cell(row, 2).Value = record.FirstName;
                worksheet.Cell(row, 3).Value = record.MiddleName;
                worksheet.Cell(row, 4).Value = record.LastName;
                worksheet.Cell(row, 5).Value = record.PreferredName;
                worksheet.Cell(row, 6).Value = record.Initials;

                worksheet.Cell(row, 7).Value = record.StartDate?.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 8).Value = record.EndDate?.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 9).Value = record.PhoneNumber;
                worksheet.Cell(row, 10).Value = record.EmailAddress;

                worksheet.Cell(row, 11).Value = record.IsFullyRemote ? "Yes" : "No";
                worksheet.Cell(row, 12).Value = record.JobTitle;
                worksheet.Cell(row, 13).Value = record.JobLevel;
                worksheet.Cell(row, 14).Value = record.DepartmentId;
                worksheet.Cell(row, 15).Value = record.TeamId;
                worksheet.Cell(row, 16).Value = record.Phase.ToString();

                row++;
            }

            // Adjust column widths to fit content
            worksheet.Columns().AdjustToContents();

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return File(
                    content,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "PersonRecords.xlsx"
                );
            }
        }
    }
}
