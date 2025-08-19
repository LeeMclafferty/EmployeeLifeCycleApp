using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace App.Server.Controllers
{
    [ApiController]
    [Route("api/notify")]
    public class NotifyController : ControllerBase
    {
        private readonly GraphServiceClient _graph;
        public NotifyController(GraphServiceClient graph) => _graph = graph;

        public record Payload(string TeamId, string ChannelId, string MessageHtml);

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Payload p)
        {
            if (string.IsNullOrWhiteSpace(p.TeamId) ||
                string.IsNullOrWhiteSpace(p.ChannelId) ||
                string.IsNullOrWhiteSpace(p.MessageHtml))
                return BadRequest("teamId, channelId, and messageHtml are required.");

            var msg = new ChatMessage
            {
                Body = new ItemBody { ContentType = BodyType.Html, Content = p.MessageHtml }
            };

            await _graph.Teams[p.TeamId].Channels[p.ChannelId].Messages.PostAsync(msg);
            return Ok(new { status = "ok" });
        }
    }
}
