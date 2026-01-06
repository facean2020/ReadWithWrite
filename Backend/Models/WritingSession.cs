using System;

namespace ReadWithWrite.Models;

public class WritingSession
{
    public Guid Id { get; set; }
    public Guid? TopicId { get; set; }
    public required string OriginalText { get; set; } // User's original input
    public string? OriginalLanguage { get; set; } // User's original language
    public string? RevisedText { get; set; } // Content revised by the LLM
    public string? Feedback { get; set; } // Editing suggestions provided by the LLM
    public DateTime CreatedAt { get; set; }
}
