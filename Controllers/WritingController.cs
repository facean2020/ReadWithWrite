using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReadWithWrite.Services;

namespace ReadWithWrite.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WritingController : ControllerBase
{
    private readonly WritingService _writingService;
    private readonly ILogger<WritingController> _logger;

    public WritingController(WritingService writingService, ILogger<WritingController> logger)
    {
        _writingService = writingService;
        _logger = logger;
    }

    [HttpGet("daily-prompt")]
    public async Task<IActionResult> GetDailyPrompt()
    {
        _logger.LogInformation("Received request for daily prompt.");
        try
        {
            var topic = await _writingService.GetDailyTopicAsync(DateTime.Today);
            return Ok(new
            {
                prompt = topic.Content,
                date = topic.Date.ToString("yyyy-MM-dd")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching daily prompt.");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("revise")]
    public async Task<IActionResult> Revise([FromBody] ReviseRequest request)
    {
        _logger.LogInformation("Received request for text revision.");
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            _logger.LogWarning("Revision request received with empty text.");
            return BadRequest("Text cannot be empty.");
        }

        try
        {
            var result = await _writingService.ReviseTextAsync(request.Text);
            return Ok(new
            {
                original = result.Original,
                revised = result.Revised,
                feedback = result.Feedback
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during text revision.");
            return StatusCode(500, "Internal server error");
        }
    }
}

public class ReviseRequest
{
    public required string Text { get; set; }
}
