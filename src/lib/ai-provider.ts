/**
 * Multi-Provider AI Service - OPTIONAL FEATURE
 * 
 * This module provides OPTIONAL AI-powered analysis features.
 * The app works FULLY without any AI configuration.
 * 
 * PRIMARY: Algorithm-based analysis (see bias-engine.ts)
 * SECONDARY: AI analysis (only if user configures their own API keys)
 * 
 * Supported Providers (user must provide their own keys):
 * - OpenAI (ChatGPT): GPT-4o, GPT-4-turbo, GPT-3.5-turbo
 * - Anthropic (Claude): Claude 3.5 Sonnet, Claude 3 Opus
 * - Google (Gemini): Gemini 2.5 Flash, Gemini 1.5 Pro
 * - xAI (Grok): Grok-2, Grok-beta
 * - Moonshot (Kimi): Moonshot-v1-8k, Moonshot-v1-32k
 * 
 * NO ZAI SDK - User brings their own API keys
 */

// ============================================
// PROVIDER DOCUMENTATION
// ============================================

export const PROVIDER_DOCS = {
  openai: {
    name: 'OpenAI (ChatGPT)',
    envKey: 'OPENAI_API_KEY',
    keyFormat: 'sk-proj-...',
    keyPrefix: 'sk-',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    pricing: 'GPT-4o: $2.50/1M input, $10.00/1M output',
    rateLimit: 'Tier 1: 500 RPM, Tier 2: 5000 RPM',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
    notes: [
      'API key starts with "sk-" or "sk-proj-"',
      'GPT-4o recommended for best quality',
      'GPT-4o-mini for cost-effective analysis',
    ],
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    envKey: 'ANTHROPIC_API_KEY',
    keyFormat: 'sk-ant-api03-...',
    keyPrefix: 'sk-ant-',
    getKeyUrl: 'https://console.anthropic.com/settings/keys',
    pricing: 'Claude 3.5 Sonnet: $3.00/1M input, $15.00/1M output',
    rateLimit: 'Tier 1: 50 RPM, Tier 2: 500 RPM',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    notes: [
      'API key starts with "sk-ant-"',
      'Claude 3.5 Sonnet recommended for nuanced analysis',
      'Excellent at following complex instructions',
    ],
  },
  gemini: {
    name: 'Google (Gemini)',
    envKey: 'GEMINI_API_KEY',
    keyFormat: 'AIza...',
    keyPrefix: 'AIza',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    pricing: 'Gemini 2.5 Flash: FREE tier available, $0.075/1M input',
    rateLimit: '15 RPM (free), 2000 RPM (paid)',
    models: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.5-flash',
    notes: [
      'API key starts with "AIza"',
      'Free tier available with generous limits',
      'Gemini 2.5 Flash recommended for speed',
    ],
  },
  grok: {
    name: 'xAI (Grok)',
    envKey: 'GROK_API_KEY',
    keyFormat: 'xai-...',
    keyPrefix: 'xai-',
    getKeyUrl: 'https://console.x.ai/',
    pricing: 'Grok-2: $2.00/1M input, $10.00/1M output',
    rateLimit: 'Varies by tier',
    models: ['grok-2-latest', 'grok-2-1212', 'grok-beta'],
    defaultModel: 'grok-2-latest',
    notes: [
      'API key starts with "xai-"',
      'Grok has access to real-time X/Twitter data',
      'Good for news and current events analysis',
    ],
  },
  kimi: {
    name: 'Moonshot (Kimi)',
    envKey: 'KIMI_API_KEY',
    keyFormat: 'sk-...',
    keyPrefix: 'sk-',
    getKeyUrl: 'https://platform.moonshot.cn/console/api-keys',
    pricing: 'Moonshot-v1: ¥0.012/1K tokens',
    rateLimit: '100 RPM',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    notes: [
      'Chinese AI provider with long context',
      'Good for Chinese language content',
      '128K context model available',
    ],
  },
};

// ============================================
// PROVIDER CONFIGURATION
// ============================================

interface ProviderConfig {
  name: string;
  envKey: string;
  models: string[];
  defaultModel: string;
  endpoint: string;
  parseResponse: (response: unknown) => string;
  buildRequest: (messages: { role: string; content: string }[], model: string) => unknown;
  headers: (apiKey: string) => Record<string, string>;
}

const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  openai: {
    name: 'ChatGPT',
    envKey: 'OPENAI_API_KEY',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    parseResponse: (response: unknown) => {
      const r = response as { choices?: Array<{ message?: { content?: string } }> };
      return r.choices?.[0]?.message?.content || '';
    },
    buildRequest: (messages, model) => ({
      model,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
  },
  anthropic: {
    name: 'Claude',
    envKey: 'ANTHROPIC_API_KEY',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    endpoint: 'https://api.anthropic.com/v1/messages',
    parseResponse: (response: unknown) => {
      const r = response as { content?: Array<{ text?: string }> };
      return r.content?.[0]?.text || '';
    },
    buildRequest: (messages, model) => {
      const systemMessage = messages.find(m => m.role === 'system');
      const otherMessages = messages.filter(m => m.role !== 'system');
      return {
        model,
        messages: otherMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        system: systemMessage?.content,
        max_tokens: 4096,
      };
    },
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }),
  },
  gemini: {
    name: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    models: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    parseResponse: (response: unknown) => {
      const r = response as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return r.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },
    buildRequest: (messages, model) => {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      return { contents };
    },
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    }),
  },
  grok: {
    name: 'Grok',
    envKey: 'GROK_API_KEY',
    models: ['grok-2-latest', 'grok-2-1212', 'grok-beta'],
    defaultModel: 'grok-2-latest',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    parseResponse: (response: unknown) => {
      const r = response as { choices?: Array<{ message?: { content?: string } }> };
      return r.choices?.[0]?.message?.content || '';
    },
    buildRequest: (messages, model) => ({
      model,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
  },
  kimi: {
    name: 'Kimi',
    envKey: 'KIMI_API_KEY',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    defaultModel: 'moonshot-v1-8k',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    parseResponse: (response: unknown) => {
      const r = response as { choices?: Array<{ message?: { content?: string } }> };
      return r.choices?.[0]?.message?.content || '';
    },
    buildRequest: (messages, model) => ({
      model,
      messages,
      max_tokens: 8192,
      temperature: 0.7,
    }),
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
  },
};

// ============================================
// PROVIDER SELECTION
// ============================================

let activeProviders: string[] = [];
let currentIndex = 0;
let lastProviderRefresh = 0;
const REFRESH_INTERVAL = 60000;

/**
 * Check if AI is available (at least one provider configured)
 */
export function isAIAvailable(): boolean {
  return getActiveProviders().length > 0;
}

/**
 * Validate API key format for a provider
 */
export function validateApiKey(provider: string, key: string): { valid: boolean; message: string } {
  const docs = PROVIDER_DOCS[provider as keyof typeof PROVIDER_DOCS];
  
  if (!docs) {
    return { valid: false, message: `Unknown provider: ${provider}` };
  }
  
  // Check for demo/placeholder keys
  if (key.includes('demo') || key.includes('REPLACE') || key.includes('placeholder')) {
    return { 
      valid: false, 
      message: `This is a demo placeholder key. Get your real API key from ${docs.getKeyUrl}` 
    };
  }
  
  // Check key prefix if known
  if (docs.keyPrefix && !key.startsWith(docs.keyPrefix)) {
    return { 
      valid: false, 
      message: `Invalid key format. ${docs.name} keys should start with "${docs.keyPrefix}". Expected format: ${docs.keyFormat}` 
    };
  }
  
  // Minimum length check
  if (key.length < 10) {
    return { valid: false, message: 'API key is too short' };
  }
  
  return { valid: true, message: 'API key format is valid' };
}

/**
 * Get list of active providers with validated API keys
 */
function getActiveProviders(): string[] {
  const now = Date.now();
  
  if (activeProviders.length > 0 && now - lastProviderRefresh < REFRESH_INTERVAL) {
    return activeProviders;
  }
  
  activeProviders = [];
  
  for (const [key, config] of Object.entries(PROVIDER_CONFIG)) {
    const apiKey = process.env[config.envKey];
    if (apiKey && apiKey.length > 0) {
      const validation = validateApiKey(key, apiKey);
      if (validation.valid) {
        activeProviders.push(key);
      }
    }
  }
  
  lastProviderRefresh = now;
  return activeProviders;
}

/**
 * Get next provider using round-robin
 */
export function getNextProvider(): string | null {
  const providers = getActiveProviders();
  
  if (providers.length === 0) {
    return null;
  }
  
  const provider = providers[currentIndex % providers.length];
  currentIndex = (currentIndex + 1) % providers.length;
  
  return provider;
}

/**
 * Get provider status with documentation
 */
export function getProviderStatus(): Array<{
  id: string;
  name: string;
  active: boolean;
  keySet: boolean;
  keyValid: boolean;
  validationMessage: string;
  documentation: typeof PROVIDER_DOCS.openai;
}> {
  const activeList = getActiveProviders();
  
  return Object.entries(PROVIDER_CONFIG).map(([key, config]) => {
    const apiKey = process.env[config.envKey];
    const keySet = !!apiKey && apiKey.length > 0;
    const validation = keySet ? validateApiKey(key, apiKey) : { valid: false, message: 'Not configured' };
    
    return {
      id: key,
      name: config.name,
      active: activeList.includes(key),
      keySet,
      keyValid: validation.valid,
      validationMessage: validation.message,
      documentation: PROVIDER_DOCS[key as keyof typeof PROVIDER_DOCS],
    };
  });
}

// ============================================
// AI RESPONSE INTERFACE
// ============================================

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
  tokensUsed?: number;
  duration: number;
}

// ============================================
// CONTENT GENERATION - USER'S API KEYS ONLY
// ============================================

/**
 * Generate content using AI with user's own API keys
 * Returns null if no AI provider is configured
 */
export async function generateContent(
  prompt: string, 
  systemPrompt?: string,
  preferredProvider?: string
): Promise<AIResponse> {
  // Check if any provider is available
  let provider = preferredProvider || '';
  
  if (provider) {
    const providers = getActiveProviders();
    if (!providers.includes(provider)) {
      provider = getNextProvider() || '';
    }
  } else {
    provider = getNextProvider() || '';
  }
  
  if (!provider) {
    throw new Error('No AI providers configured. Add your API key in Settings to enable AI analysis, or use the algorithm-based analysis.');
  }
  
  const config = PROVIDER_CONFIG[provider];
  const apiKey = process.env[config.envKey];
  
  if (!apiKey) {
    throw new Error(`API key not configured for ${config.name}. Add your key in Settings.`);
  }
  
  const startTime = Date.now();
  
  try {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });
    
    // Build request
    const requestBody = config.buildRequest(messages, config.defaultModel);
    
    // Special handling for Gemini (different endpoint format)
    let endpoint = config.endpoint;
    if (provider === 'gemini') {
      endpoint = `${config.endpoint}/${config.defaultModel}:generateContent?key=${apiKey}`;
    }
    
    // Make API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: config.headers(apiKey),
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${config.name} API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    const text = config.parseResponse(result);
    
    const duration = Date.now() - startTime;
    
    return {
      text,
      provider: config.name,
      model: config.defaultModel,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    const docs = PROVIDER_DOCS[provider as keyof typeof PROVIDER_DOCS];
    let enhancedError = `[${config.name}] ${errorMessage}`;
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      enhancedError += `\n\nSolution: Check your API key at ${docs?.getKeyUrl || 'provider console'}`;
    } else if (errorMessage.includes('429') || errorMessage.includes('rate')) {
      enhancedError += `\n\nRate limit info: ${docs?.rateLimit || 'Check provider documentation'}`;
    }
    
    throw new Error(enhancedError);
  }
}

/**
 * Generate JSON content with schema validation
 * Returns null if no AI provider is configured
 */
export async function generateJSON<T>(
  prompt: string, 
  systemPrompt?: string,
  preferredProvider?: string
): Promise<{ data: T; provider: string; model: string; duration: number }> {
  // Check availability first
  if (!isAIAvailable()) {
    throw new Error('No AI providers configured. Use algorithm-based analysis instead.');
  }
  
  const provider = preferredProvider || getNextProvider() || '';
  const config = PROVIDER_CONFIG[provider];
  
  if (!config) {
    throw new Error('Invalid provider specified');
  }
  
  const apiKey = process.env[config.envKey];
  if (!apiKey) {
    throw new Error(`API key not configured for ${config.name}`);
  }
  
  const startTime = Date.now();
  
  try {
    const jsonSystemPrompt = `${systemPrompt || ''}
    
IMPORTANT: You must respond with ONLY valid JSON. No markdown formatting, no code blocks, no explanations - just the raw JSON object.

Response format: {"key": "value"}`;
    
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system', content: jsonSystemPrompt },
      { role: 'user', content: prompt },
    ];
    
    const requestBody = config.buildRequest(messages, config.defaultModel);
    
    let endpoint = config.endpoint;
    if (provider === 'gemini') {
      endpoint = `${config.endpoint}/${config.defaultModel}:generateContent?key=${apiKey}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: config.headers(apiKey),
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${config.name} API error: ${response.status}`);
    }
    
    const result = await response.json();
    const text = config.parseResponse(result);
    
    // Parse JSON from response
    let data: T;
    try {
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.slice(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.slice(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.slice(0, -3);
      }
      
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]) as T;
      } else {
        data = JSON.parse(cleanText) as T;
      }
    } catch {
      throw new Error(`Failed to parse JSON response. Raw response: ${text.substring(0, 500)}`);
    }
    
    const duration = Date.now() - startTime;
    
    return {
      data,
      provider: config.name,
      model: config.defaultModel,
      duration,
    };
  } catch (error) {
    throw error;
  }
}

// ============================================
// STATISTICS
// ============================================

export async function getProviderStats(): Promise<Array<{
  provider: string;
  totalRequests: number;
  successRate: number;
  avgDuration: number;
}>> {
  // Import db only if needed
  const { db } = await import('./db');
  
  const logs = await db.requestLog.groupBy({
    by: ['provider'],
    _count: { id: true },
    _avg: { duration: true },
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  
  const successCounts = await db.requestLog.groupBy({
    by: ['provider'],
    _count: { id: true },
    where: {
      success: true,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  
  const successMap = new Map(successCounts.map(s => [s.provider, s._count.id]));
  
  return logs.map(log => ({
    provider: log.provider,
    totalRequests: log._count.id,
    successRate: successMap.get(log.provider) 
      ? (successMap.get(log.provider)! / log._count.id) * 100 
      : 0,
    avgDuration: log._avg.duration || 0,
  }));
}

// Re-export provider docs for use in other files
export { PROVIDER_DOCS as AI_PROVIDERS };
