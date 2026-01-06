using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ReadWithWrite.Services;

public interface IPromptService
{
    Task<string> GetPromptAsync(string promptName);
}

public class PromptService : IPromptService
{
    private readonly string _basePath;
    private readonly ILogger<PromptService> _logger;

    public PromptService(string basePath, ILogger<PromptService> logger)
    {
        _basePath = basePath;
        _logger = logger;
    }

    public async Task<string> GetPromptAsync(string promptName)
    {
        var filePath = Path.Combine(_basePath, $"{promptName}.txt");
        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Prompt file not found: {FilePath}", filePath);
            return string.Empty;
        }
        
        _logger.LogDebug("Reading prompt from: {FilePath}", filePath);
        return await File.ReadAllTextAsync(filePath);
    }
}
