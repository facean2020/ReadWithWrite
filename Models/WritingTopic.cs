using System;

namespace ReadWithWrite.Models;

public class WritingTopic
{
    public Guid Id { get; set; }
    public required string Content { get; set; } // The prompt is corresponding to API
    public DateTime Date { get; set; } // Date associated with this topic
}
