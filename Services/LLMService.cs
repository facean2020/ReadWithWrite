using System.Threading.Tasks;

namespace ReadWithWrite.Services;

public interface ILLMService
{
    Task<(string Revised, string Feedback)> ReviseAsync(string systemPrompt, string userContent);
}

public class MockLLMService : ILLMService
{
    public Task<(string Revised, string Feedback)> ReviseAsync(string systemPrompt, string userContent)
    {
        // Temporary mock implementation
        if (userContent.Contains("I has went"))
        {
            return Task.FromResult((
                "I went to school yesterday.",
                "Verb tense error: 'has went' → 'went'. Also, 'I has' should be 'I have' or simply use past simple."
            ));
        }

        return Task.FromResult((
            userContent,
            "Your writing looks good! No major issues found."
        ));
    }
}
