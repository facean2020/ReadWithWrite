using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ReadWithWrite.Services;

public class AliyunQwenProvider : ILLMProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ILogger<AliyunQwenProvider> _logger;

    public AliyunQwenProvider(HttpClient httpClient, IConfiguration configuration, ILogger<AliyunQwenProvider> logger)
    {
        _httpClient = httpClient;
        // _apiKey = configuration["LLM:AliyunApiKey"] ?? string.Empty; // Read API Key from secret_api_key.txt ranther than Configuration, I removed LLM:AliyunApiKey from appsettings.json
        _apiKey = System.IO.File.ReadAllText("secret_api_key.txt").Trim();
        _logger = logger;
    }

    public async Task<string> ChatAsync(string systemPrompt, string userPrompt, bool enableSearch)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogError("Aliyun API Key is missing in configuration.");
            return "Error: API Key is missing.";
        }

        _logger.LogInformation("Sending request to Aliyun Qwen API. Search enabled: {EnableSearch}", enableSearch);

        var requestBody = new
        {
            model = "qwen-plus",
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            enable_search = enableSearch,
            search_options = enableSearch ? new { forced_search = true } : null
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        try
        {
            var response = await _httpClient.PostAsync("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(responseString);
                var result = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? string.Empty;
                _logger.LogInformation("Successfully received response from Aliyun Qwen API.");
                return result;
            }
            else
            {
                _logger.LogError("Aliyun Qwen API request failed with status code: {StatusCode}. Response: {Response}", response.StatusCode, responseString);
                return $"Request failed: {response.StatusCode}\n{responseString}";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while calling Aliyun Qwen API.");
            return $"An error occurred: {ex.Message}";
        }
    }
}
