using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using ReadWithWrite.Data;
using ReadWithWrite.Models;
using Xunit;

namespace ReadWithWrite.Tests;

public class ArticlesIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ArticlesIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        
        // Ensure database is created for tests
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        }
    }

    [Fact]
    public async Task GetArticles_ReturnsSuccessAndPagedResult()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/articles?page=1&pageSize=5");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ArticlesResponse>();
        
        Assert.NotNull(result);
        Assert.Equal(1, result.Page);
        Assert.Equal(5, result.PageSize);
        Assert.NotNull(result.Items);
    }

    [Fact]
    public async Task GetArticles_WithData_ReturnsCorrectItems()
    {
        // Arrange
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            
            // Ensure clean state for this test if needed, 
            // but since it's SQLite file-based in the app, we just add some test data
            var testArticle = new Article
            {
                Id = "test-id-" + Guid.NewGuid(),
                Title = "Test Article",
                Link = "https://example.com/test",
                PublishDate = DateTimeOffset.Now,
                SourceName = "Test Source",
                SourceId = Guid.NewGuid()
            };
            db.Articles.Add(testArticle);
            await db.SaveChangesAsync();
        }

        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/articles?page=1&pageSize=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ArticlesResponse>();
        
        Assert.NotNull(result);
        Assert.Contains(result.Items, a => a.Title == "Test Article");
    }

    private class ArticlesResponse
    {
        public List<Article> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
