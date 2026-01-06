using System.Text.Json;
using ReadWithWrite.Models;

namespace ReadWithWrite.Services;

public interface IRssSourceService
{
    Task<IEnumerable<RssSourceDto>> GetAllAsync();
    Task AddAsync(RssSourceUploadRequest request);
}

public class FileRssSourceService : IRssSourceService
{
    private readonly string _filePath;
    private readonly ILogger<FileRssSourceService> _logger;

    public FileRssSourceService(IWebHostEnvironment env, ILogger<FileRssSourceService> logger)
    {
        _filePath = Path.Combine(env.ContentRootPath, "Data", "rss-sources.json");
        _logger = logger;
    }

    public async Task<IEnumerable<RssSourceDto>> GetAllAsync()
    {
        _logger.LogDebug("Reading RSS sources from {FilePath}", _filePath);
        if (!File.Exists(_filePath))
        {
            _logger.LogWarning("RSS sources file not found at {FilePath}", _filePath);
            return Enumerable.Empty<RssSourceDto>();
        }

        try
        {
            using var stream = File.OpenRead(_filePath);
            var sources = await JsonSerializer.DeserializeAsync<List<RssSourceDto>>(stream) ?? new List<RssSourceDto>();
            _logger.LogDebug("Successfully read {Count} RSS sources", sources.Count);
            return sources;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading RSS sources from file.");
            return Enumerable.Empty<RssSourceDto>();
        }
    }

    public async Task AddAsync(RssSourceUploadRequest request)
    {
        _logger.LogInformation("Adding new RSS source: {Url}", request.Url);
        var sources = (await GetAllAsync()).ToList();
        
        var newSource = new RssSourceDto
        {
            Id = Guid.NewGuid(),
            Url = request.Url,
            Name = request.Name ?? "Unknown Source",
            Description = "User uploaded source"
        };

        sources.Add(newSource);

        try
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(sources, options);
            await File.WriteAllTextAsync(_filePath, json);
            _logger.LogInformation("Successfully added and saved new RSS source: {Url}", request.Url);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error writing RSS source to file.");
            throw;
        }
    }
}
