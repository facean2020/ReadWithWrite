using System.ServiceModel.Syndication;
using System.Xml;
using Microsoft.EntityFrameworkCore;
using ReadWithWrite.Data;
using ReadWithWrite.Models;

namespace ReadWithWrite.Services;

public class RssFetchService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RssFetchService> _logger;
    private readonly TimeSpan _period = TimeSpan.FromMinutes(5);

    public RssFetchService(IServiceScopeFactory scopeFactory, ILogger<RssFetchService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("RSS Fetch Service is starting.");

        using PeriodicTimer timer = new PeriodicTimer(_period);

        try
        {
            // Initial fetch
            await FetchAllRssFeedsAsync(stoppingToken);

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await FetchAllRssFeedsAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("RSS Fetch Service is stopping.");
        }
    }

    private async Task FetchAllRssFeedsAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Fetching RSS feeds at: {time}", DateTimeOffset.Now);

        using var scope = _scopeFactory.CreateScope();
        var rssSourceService = scope.ServiceProvider.GetRequiredService<IRssSourceService>();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var sources = await rssSourceService.GetAllAsync();

        foreach (var source in sources)
        {
            if (stoppingToken.IsCancellationRequested) break;

            try
            {
                await FetchRssFeedAsync(source, dbContext, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching RSS feed from {Url}", source.Url);
            }
        }

        await dbContext.SaveChangesAsync(stoppingToken);
    }

    private async Task FetchRssFeedAsync(RssSourceDto source, AppDbContext dbContext, CancellationToken stoppingToken)
    {
        _logger.LogDebug("Fetching RSS feed from {Url}", source.Url);
        using var reader = XmlReader.Create(source.Url);
        var feed = SyndicationFeed.Load(reader);

        int newArticlesCount = 0;
        foreach (var item in feed.Items)
        {
            var link = item.Links.FirstOrDefault()?.Uri.ToString() ?? item.Id;
            var articleId = ComputeHash(link);

            var exists = await dbContext.Articles.AnyAsync(a => a.Id == articleId, stoppingToken);
            if (!exists)
            {
                var article = new Article
                {
                    Id = articleId,
                    Title = item.Title.Text,
                    Link = link,
                    Summary = item.Summary?.Text ?? item.Content?.ToString(),
                    PublishDate = item.PublishDate != default ? item.PublishDate : item.LastUpdatedTime,
                    SourceName = source.Name,
                    SourceId = source.Id
                };

                dbContext.Articles.Add(article);
                newArticlesCount++;
            }
        }
        _logger.LogInformation("Fetched {Count} new articles from {Url}", newArticlesCount, source.Url);
    }

    private string ComputeHash(string input)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(input);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToHexString(hash);
    }
}
