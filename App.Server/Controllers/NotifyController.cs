using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace App.Server.Controllers
{
    [ApiController]
    [Route("api/notify")]
    public class NotifyController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly string _flowUrl = "https://prod-93.westus.logic.azure.com:443/workflows/26212596701846e1a7aa9c2e9c336e34/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3jHszyqtF5mjzoLfLndsk5hxysPlvTAXc8lYyQYxWVc";

        public NotifyController(HttpClient http) => _http = http;

        public record Payload(string MessageHtml, string LifecyclePhase);

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Payload p)
        {
            if (string.IsNullOrWhiteSpace(p.MessageHtml))
                return BadRequest("MessageHtml is required.");
            if (string.IsNullOrWhiteSpace(p.LifecyclePhase))
                return BadRequest("LifecyclePhase is required in payload.");

            var body = JsonSerializer.Serialize(new { p.MessageHtml, p.LifecyclePhase });
            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var resp = await _http.PostAsync(_flowUrl, content);

            if (!resp.IsSuccessStatusCode)
                return StatusCode((int)resp.StatusCode, await resp.Content.ReadAsStringAsync());

            return Ok(new { status = "sent" });
        }
    }
}
