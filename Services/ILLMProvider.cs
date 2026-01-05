using System.Threading.Tasks;

namespace ReadWithWrite.Services;

public interface ILLMProvider
{
    Task<string> ChatAsync(string systemPrompt, string userPrompt, bool enableSearch);
}
