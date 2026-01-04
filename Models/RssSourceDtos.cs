namespace ReadWithWrite.Models;

public class RssSourceUploadRequest
{
    public string Url { get; set; } = string.Empty;
    public string? Name { get; set; }
}

public class RssSourceDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
