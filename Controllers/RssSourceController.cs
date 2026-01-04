using Microsoft.AspNetCore.Mvc;
using ReadWithWrite.Models;
using ReadWithWrite.Services;

namespace ReadWithWrite.Controllers;

[ApiController]
[Route("api/rss-sources")]
public class RssSourceController : ControllerBase
{
    private readonly IRssSourceService _rssSourceService;

    public RssSourceController(IRssSourceService rssSourceService)
    {
        _rssSourceService = rssSourceService;
    }

    [HttpPost]
    public async Task<IActionResult> UploadRssSource([FromBody] RssSourceUploadRequest request)
    {
        await _rssSourceService.AddAsync(request);
        return Ok(new { message = "RSS source uploaded successfully", url = request.Url });
    }

    [HttpGet("recommended")]
    public async Task<ActionResult<IEnumerable<RssSourceDto>>> GetRecommendedRssSources()
    {
        var sources = await _rssSourceService.GetAllAsync();
        return Ok(sources);
    }
}
