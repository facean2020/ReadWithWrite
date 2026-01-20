using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReadWithWrite.Data;
using ReadWithWrite.Models;

namespace ReadWithWrite.Services;

public class WritingService
{
    private readonly WritingDbContext _context;
    private readonly IDailyPromptEngine _promptEngine;
    private readonly IPromptService _promptService;
    private readonly ILLMService _llmService;
    private readonly ILogger<WritingService> _logger;

    public WritingService(
        WritingDbContext context,
        IDailyPromptEngine promptEngine,
        IPromptService promptService,
        ILLMService llmService,
        ILogger<WritingService> logger)
    {
        _context = context;
        _promptEngine = promptEngine;
        _promptService = promptService;
        _llmService = llmService;
        _logger = logger;
    }

    public async Task<WritingTopic> GetDailyTopicAsync(DateTime date)
    {
        _logger.LogInformation("Fetching daily topic for date: {Date}", date.ToShortDateString());
        var topic = await _context.WritingTopics
            .FirstOrDefaultAsync(t => t.Date == date.Date);

        if (topic == null)
        {
            _logger.LogInformation("No topic found in database for {Date}. Generating new topic.", date.ToShortDateString());
            topic = await _promptEngine.GetOrGenerateDailyTopicAsync(date);
            _context.WritingTopics.Add(topic);
            await _context.SaveChangesAsync();
            _logger.LogInformation("New topic generated and saved with ID: {TopicId}", topic.Id);
        }

        return topic;
    }

    public async Task<(string Original, string Revised, string Feedback)> ReviseTextAsync(string text, string? originalLanguage = null)
    {
        _logger.LogInformation("Starting text revision process. Language: {Language}", originalLanguage ?? "Not specified");
        var systemPrompt = await _promptService.GetPromptAsync("WritingRevise");
        
        if (string.IsNullOrEmpty(systemPrompt))
        {
            const string message = "Required system prompt 'WritingRevise' is not configured.";
            _logger.LogError(message);
            throw new InvalidOperationException(message);
        }

        var (revised, feedback) = await _llmService.ReviseAsync(systemPrompt, text);

        var session = new WritingSession
        {
            Id = Guid.NewGuid(),
            OriginalText = text,
            OriginalLanguage = originalLanguage,
            RevisedText = revised,
            Feedback = feedback,
            CreatedAt = DateTime.UtcNow
        };

        _context.WritingSessions.Add(session);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Writing session saved with ID: {SessionId}", session.Id);

        return (text, revised, feedback);
    }

    // Untested
    public async Task<WritingSession[]> GetArrayAsync(int pageNumber, int pageSize)
    {
        _logger.LogInformation("Fetching writing sessions. Page: {PageNumber}, Size: {PageSize}", pageNumber, pageSize);
        WritingSession[] sessions = await _context.WritingSessions
            .AsNoTracking()
            .OrderByDescending(ws => ws.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToArrayAsync();
        _logger.LogInformation("Fetched {SessionCount} writing sessions.", sessions.Length);
        return sessions;
    }

    // Untested
    public async Task<WritingSession?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching writing session by ID: {SessionId}", id);
        var session = await _context.WritingSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(ws => ws.Id == id);

        if (session == null)
        {
            _logger.LogWarning("No writing session found with ID: {SessionId}", id);
        }
        else
        {
            _logger.LogInformation("Writing session found with ID: {SessionId}", id);
        }

        return session;
    }

    // Untested
    public async Task<int> GetTotalCountAsync()
    {
        _logger.LogInformation("Fetching total count of writing sessions.");
        int count = await _context.WritingSessions.CountAsync();
        _logger.LogInformation("Total writing sessions count: {Count}", count);
        return count;
    }
}
