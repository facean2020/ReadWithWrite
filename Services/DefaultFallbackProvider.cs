using System.Threading.Tasks;

namespace ReadWithWrite.Services;

public class DefaultFallbackProvider : ILLMProvider
{
    public Task<string> ChatAsync(string systemPrompt, string userPrompt, bool enableSearch)
    {
        return Task.FromResult("The current environment does not support LLM calls (Default Fallback Provider)");
    }
}
