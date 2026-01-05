# LLM Service Design

**调用接口：** 阿里云Qwen API

## 设计

### 输入值

**System Prompt：** 系统提示    
**User Prompt：** 用户输入
**Web Search:** 是否启动网络搜索

### 返回值

**Response：** 模型返回值

### 中间层

中间层的任务是调用者与LLM提供者的桥梁，方便选择不同的提供商（不同的提供商调用可能稍有不同），方便未来切换提供商    
选择方式：自动选择（一般不同环境只存在一个选择者，一旦唯一选择者不可达则选择Default Provider(不提供任何有价值返回)）  

由于Codespace的网络环境无法访问北京区域的阿里云百炼服务，所以增加一个Default Provider(不提供任何有价值返回)    

## 调用者

目前的调用者包括：    
* DailyPromptEngine    
* WritingService