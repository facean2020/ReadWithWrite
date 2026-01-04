using System.ComponentModel.DataAnnotations;

namespace ReadWithWrite.Models;

public class Article
{
    [Key]
    public string Id { get; set; } = string.Empty; // URL Hash or Link
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public DateTimeOffset PublishDate { get; set; }
    public string SourceName { get; set; } = string.Empty;
    public Guid SourceId { get; set; }
}
