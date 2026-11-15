export interface AIModelProvider {
  id: string;
  name: string;
  category: 'domestic' | 'international' | 'custom';
  defaultBaseUrl: string;
  defaultModel: string;
  models: string[];
  docUrl: string;
  keyPlaceholder: string;
  description: string;
}

export interface UserAIConfig {
  provider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export const AI_PROVIDERS: AIModelProvider[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek (深度求索)',
    category: 'domestic',
    defaultBaseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    docUrl: 'https://platform.deepseek.com/api_keys',
    keyPlaceholder: 'sk-...',
    description: '国内超高性价比与高水准模型，支持 V3 极速伴学与 R1 深度思维链',
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    category: 'international',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'o1', 'o3-mini', 'gpt-4-turbo'],
    docUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-proj-...',
    description: '全球顶尖通用大模型，支持最新 GPT-4o 与深度推理 o 系列',
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'international',
    defaultBaseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    docUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-...',
    description: '文学感与双语信达雅精译天花板，英语语法解构极具母语直觉',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'international',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    docUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...',
    description: 'Google 最新多模态大模型，超快响应与百万级上下文理解',
  },
  {
    id: 'moonshot',
    name: 'Kimi (月之暗面)',
    category: 'domestic',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    docUrl: 'https://platform.moonshot.cn/console/api-keys',
    keyPlaceholder: 'sk-...',
    description: '国内长文本与语境理解标杆，回答亲切细致',
  },
  {
    id: 'qwen',
    name: '通义千问 (阿里云百炼)',
    category: 'domestic',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-plus', 'qwen-turbo', 'qwen-max', 'qwen2.5-72b-instruct'],
    docUrl: 'https://bailian.console.aliyun.com/',
    keyPlaceholder: 'sk-...',
    description: '阿里云百炼官方 OpenAI 兼容接口，稳定快速且并发高',
  },
  {
    id: 'zhipu',
    name: '智谱 GLM (BigModel)',
    category: 'domestic',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    models: ['glm-4-flash', 'glm-4-plus'],
    docUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    keyPlaceholder: '...',
    description: '清华系智谱大模型，GLM-4-Flash 调用免费且响应极速',
  },
  {
    id: 'siliconflow',
    name: '硅基流动 (SiliconFlow)',
    category: 'domestic',
    defaultBaseUrl: 'https://api.siliconflow.cn/v1',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
    models: ['deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1', 'Qwen/Qwen2.5-72B-Instruct'],
    docUrl: 'https://cloud.siliconflow.cn/account/ak',
    keyPlaceholder: 'sk-...',
    description: '国内聚合平台，提供 DeepSeek R1/V3 与开源全家桶高速 API',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (多模型聚合)',
    category: 'international',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'deepseek/deepseek-chat',
    models: ['deepseek/deepseek-chat', 'deepseek/deepseek-r1', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-haiku'],
    docUrl: 'https://openrouter.ai/keys',
    keyPlaceholder: 'sk-or-v1-...',
    description: '海外聚合平台，充值一个 Key 畅通使用所有顶级大模型',
  },
  {
    id: 'custom',
    name: '自定义 (OpenAI 兼容 / OneAPI / Ollama)',
    category: 'custom',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    models: ['llama3', 'qwen2.5', 'deepseek-r1'],
    docUrl: '',
    keyPlaceholder: 'sk-... (本地无鉴权可填任意字符)',
    description: '支持任何反向代理、公司私有大模型网关或本地 Ollama / vLLM',
  },
];

export const STORAGE_KEY = 'bytegush_player_ai_config';

export function getStoredAIConfig(): UserAIConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.apiKey) {
      return parsed as UserAIConfig;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredAIConfig(config: UserAIConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearStoredAIConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

