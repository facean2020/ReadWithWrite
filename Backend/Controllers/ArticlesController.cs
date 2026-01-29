using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadWithWrite.Data;
using ReadWithWrite.Models;

namespace ReadWithWrite.Controllers;

[ApiController]
[Route("api/articles")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<ArticlesController> _logger;

    public ArticlesController(AppDbContext dbContext, ILogger<ArticlesController> _logger)
    {
        _dbContext = dbContext;
        this._logger = _logger;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetArticles([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("Getting articles: page {Page}, pageSize {PageSize}", page, pageSize);
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var query = _dbContext.Articles
            .AsEnumerable() // SQLite doesn't support DateTimeOffset in OrderBy directly in some versions/providers
            .OrderByDescending(a => a.PublishDate);

        var totalCount = query.Count();
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Source = a.SourceName,
                PublishDate = a.PublishDate,
                Link = a.Link,
                PicUrl = a.PicUrl
            })
            .ToList();

        _logger.LogInformation("Returning {Count} articles out of {TotalCount}", items.Count, totalCount);
        return Ok(new
        {
            items,
            totalCount,
            page,
            pageSize
        });
    }
}
