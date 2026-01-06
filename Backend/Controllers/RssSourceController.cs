using Microsoft.AspNetCore.Mvc;
using ReadWithWrite.Models;
using ReadWithWrite.Services;

namespace ReadWithWrite.Controllers;

[ApiController]
[Route("api/rss-sources")]
public class RssSourceController : ControllerBase
{
    private readonly IRssSourceService _rssSourceService;
    private readonly ILogger<RssSourceController> _logger;

    public RssSourceController(IRssSourceService rssSourceService, ILogger<RssSourceController> logger)
    {
        _rssSourceService = rssSourceService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UploadRssSource([FromBody] RssSourceUploadRequest request)
    {
        _logger.LogInformation("Uploading RSS source: {Url}", request.Url);
        try
        {
            await _rssSourceService.AddAsync(request);
            _logger.LogInformation("Successfully uploaded RSS source: {Url}", request.Url);
            return Ok(new { message = "RSS source uploaded successfully", url = request.Url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading RSS source: {Url}", request.Url);
            return StatusCode(500, "Internal server error while uploading RSS source");
        }
    }

    [HttpGet("recommended")]
    public async Task<ActionResult<IEnumerable<RssSourceDto>>> GetRecommendedRssSources()
    {
        _logger.LogInformation("Getting recommended RSS sources");
        var sources = await _rssSourceService.GetAllAsync();
        _logger.LogInformation("Returning {Count} recommended RSS sources", sources.Count());
        return Ok(sources);
    }
}
