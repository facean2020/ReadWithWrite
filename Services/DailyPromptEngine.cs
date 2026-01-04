using System;
using System.Threading.Tasks;
using ReadWithWrite.Models;

namespace ReadWithWrite.Services;

public interface IDailyPromptEngine
{
    Task<WritingTopic> GetOrGenerateDailyTopicAsync(DateTime date);
}

public class DailyPromptEngine : IDailyPromptEngine
{
    public Task<WritingTopic> GetOrGenerateDailyTopicAsync(DateTime date)
    {
        // Temporary mock implementation
        return Task.FromResult(new WritingTopic
        {
            Id = Guid.NewGuid(),
            Content = "Describe a recent technological breakthrough and its potential impact on society.",
            Date = date.Date
        });
    }
}
