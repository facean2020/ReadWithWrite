# LLM Service Design

**API Used:** Alibaba Cloud Qwen API

## Design

### Input Values

**System Prompt:** System instruction    
**User Prompt:** User input
**Web Search:** Whether to enable web search

### Return Values

**Response:** Model output

### Intermediate Layer

The task of the intermediate layer is to serve as a bridge between the caller and the LLM provider, facilitating the selection of different providers (as calls may vary slightly between providers) and making it easy to switch providers in the future.    
Selection Method: Automatic selection (generally, only one provider exists in a given environment; if the unique provider is unreachable, the Default Provider is selected, which returns no meaningful output).  

Due to network restrictions in Codespace that prevent access to Alibaba Cloud Bailian services in the Beijing region, a Default Provider (which returns no meaningful output) has been added.    

## Callers

Current callers include:    
* DailyPromptEngine    
* WritingService