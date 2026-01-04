using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using ReadWithWrite.Data;
using ReadWithWrite.Models;
using Xunit;

namespace ReadWithWrite.Tests;

public class WritingIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public WritingIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;

        // Ensure Writing database is created for tests
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<WritingDbContext>();
            db.Database.EnsureCreated();
        }
    }

    [Fact]
    public async Task GetDailyPrompt_ReturnsSuccessAndPrompt()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/writing/daily-prompt");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<DailyPromptResponse>();

        Assert.NotNull(result);
        Assert.NotEmpty(result.Prompt);
        Assert.NotEmpty(result.Date);
    }

    [Fact]
    public async Task Revise_ReturnsSuccessAndRevisedText()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new { text = "I has went to school yesterday." };

        // Act
        var response = await client.PostAsJsonAsync("/api/writing/revise", request);

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ReviseResponse>();

        Assert.NotNull(result);
        Assert.Equal(request.text, result.Original);
        Assert.Contains("went", result.Revised);
        Assert.NotEmpty(result.Feedback);
    }

    [Fact]
    public async Task Revise_EmptyText_ReturnsBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new { text = "" };

        // Act
        var response = await client.PostAsJsonAsync("/api/writing/revise", request);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    private class DailyPromptResponse
    {
        public string Prompt { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }

    private class ReviseResponse
    {
        public string Original { get; set; } = string.Empty;
        public string Revised { get; set; } = string.Empty;
        public string Feedback { get; set; } = string.Empty;
    }
}
