using System.ComponentModel.DataAnnotations;

namespace ReadWithWrite.Models;

public class Article
{
    [Key]
    public string Id { get; set; } = string.Empty; // URL Hash or Link
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? PicUrl { get; set; }
    public DateTimeOffset PublishDate { get; set; }
    public string SourceName { get; set; } = string.Empty;
    public Guid SourceId { get; set; }
}

public class ArticleDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Source { get; set; } = string.Empty;
    public DateTimeOffset PublishDate { get; set; }
    public string Link { get; set; } = string.Empty;
    public string? PicUrl { get; set; }
}
