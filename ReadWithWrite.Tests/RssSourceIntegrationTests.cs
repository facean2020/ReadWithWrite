using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using ReadWithWrite.Models;
using Xunit;

namespace ReadWithWrite.Tests;

public class RssSourceIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public RssSourceIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetRecommendedRssSources_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/rss-sources/recommended");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
        
        var sources = await response.Content.ReadFromJsonAsync<IEnumerable<RssSourceDto>>();
        Assert.NotNull(sources);
        Assert.NotEmpty(sources);
    }

    [Fact]
    public async Task UploadRssSource_ReturnsSuccess()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RssSourceUploadRequest
        {
            Url = "https://example.com/rss",
            Name = "Example RSS"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/rss-sources", request);

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.NotNull(result);
    }
}
