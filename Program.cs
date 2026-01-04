using Microsoft.EntityFrameworkCore;
using ReadWithWrite.Data;
using ReadWithWrite.Services;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<WritingDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("WritingConnection")));

builder.Services.AddScoped<IRssSourceService, FileRssSourceService>();
builder.Services.AddHostedService<RssFetchService>();

// Writing Services
builder.Services.AddScoped<IPromptService>(sp => 
{
    var logger = sp.GetRequiredService<ILogger<PromptService>>();
    return new PromptService(Path.Combine(builder.Environment.ContentRootPath, "Data", "Prompts"), logger);
});
builder.Services.AddScoped<IDailyPromptEngine, DailyPromptEngine>();
builder.Services.AddScoped<ILLMService, MockLLMService>();
builder.Services.AddScoped<WritingService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
            var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
            if (exceptionHandlerPathFeature?.Error != null)
            {
                logger.LogError(exceptionHandlerPathFeature.Error, "Unhandled exception occurred.");
            }
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { message = "An unexpected error occurred." });
        });
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
