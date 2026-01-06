using ReadWithWrite.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;

namespace ReadWithWrite.Services;

public interface IDailyPromptEngine
{
    Task<WritingTopic> GetOrGenerateDailyTopicAsync(DateTime date);
}

public class DailyPromptEngine : IDailyPromptEngine
{
    private readonly IHostEnvironment _env;
    private readonly ILLMService _llmService;
    private readonly ILogger<DailyPromptEngine> _logger;

    public DailyPromptEngine(IHostEnvironment env, ILogger<DailyPromptEngine> logger, ILLMService llmService)
    {
        _env = env;
        _llmService = llmService;
        _logger = logger;
    }

    public async Task<WritingTopic> GetOrGenerateDailyTopicAsync(DateTime date)
    {
        _logger.LogInformation("Generating daily topic for date: {Date}", date.ToShortDateString());
        var content = await GenerateDailyTopicAsync();
        var topic = new WritingTopic
        {
            Id = Guid.NewGuid(),
            Date = date,
            Content = content
        };
        return topic;
    }

    // Generate daily topic from LLM
    private async Task<string> GenerateDailyTopicAsync()
    {
        var systemPrompt = await GetSystemPromptAsync();
        var userPrompt = String.Empty;
        // Enable search so the LLM can query its configured search backend (e.g., web or knowledge base)
        // to find current/trending topics, in addition to following the static system prompt instructions.
        var topic = await _llmService.GenerateResponseAsync(systemPrompt, userPrompt, enableSearch: true);
        return topic;
    }


    // Get system prompt for daily topic generation
    private async Task<string> GetSystemPromptAsync()
    {
        var filePath = Path.Combine(_env.ContentRootPath, "Data", "Prompts", "DailyTopic.txt");
        if (!File.Exists(filePath))
        {
            _logger.LogError("System prompt file not found at path: {FilePath}", filePath);
            throw new FileNotFoundException("System prompt file not found.", filePath);
        }

        return await File.ReadAllTextAsync(filePath);
    }
}
