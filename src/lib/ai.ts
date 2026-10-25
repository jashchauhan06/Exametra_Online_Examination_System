import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export interface AIMessageOptions {
  systemPrompt?: string;
  prompt: string;
  image?: {
    base64: string;
    mimeType?: string;
  };
  jsonMode?: boolean;
}

/**
 * Extracts and parses a JSON object or array from LLM text response.
 */
export function extractJsonFromResponse<T = any>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    const firstNewline = cleaned.indexOf('\n');
    const lastBacktick = cleaned.lastIndexOf('```');
    if (firstNewline !== -1 && lastBacktick > firstNewline) {
      cleaned = cleaned.substring(firstNewline + 1, lastBacktick).trim();
    } else {
      cleaned = cleaned.replace(/^```(json)?|```$/g, '').trim();
    }
  }
  return JSON.parse(cleaned);
}

function getEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  if ((process.env as any)[`export ${key}`]) return (process.env as any)[`export ${key}`];
  
  // Runtime disk fallback if Next.js dev server was not restarted after .env edit
  try {
    const fs = require('fs');
    const path = require('path');
    const files = ['.env.local', '.env'];
    for (const f of files) {
      const p = path.resolve(process.cwd(), f);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        const match = content.match(new RegExp(`^(?:export\\s+)?${key}\\s*=\\s*["']?([^\\r\\n"']+)["']?`, 'm'));
        if (match && match[1]) {
          process.env[key] = match[1].trim();
          return match[1].trim();
        }
      }
    }
  } catch (err) {
    // Ignore in non-Node environments
  }
  return undefined;
}

/**
 * Executes an AI completion using OpenRouter by default if OPENROUTER_API_KEY is set,
 * or falls back to Google Gemini if GEMINI_API_KEY is configured.
 */
export async function callAI(options: AIMessageOptions): Promise<string> {
  const openRouterKey = getEnv('OPENROUTER_API_KEY');
  const geminiKey = getEnv('GEMINI_API_KEY');

  if (!openRouterKey && !geminiKey) {
    throw new Error('Neither OPENROUTER_API_KEY nor GEMINI_API_KEY is configured.');
  }

  // ── 1. Preferred: OpenRouter (nvidia/nemotron-3-ultra-550b-a55b:free) ──
  if (openRouterKey) {
    try {
      const model = getEnv('OPENROUTER_MODEL') || 'nvidia/nemotron-3-ultra-550b-a55b:free';
      
      const messages: any[] = [];
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }

      if (options.image && options.image.base64) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: options.prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${options.image.mimeType || 'image/jpeg'};base64,${options.image.base64}`
              }
            }
          ]
        });
      } else {
        messages.push({ role: 'user', content: options.prompt });
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://exametra.app',
          'X-Title': 'Exametra Online Examination System',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.warn(`OpenRouter request failed (${res.status}): ${errorBody}. Falling back to secondary if available.`);
        if (!geminiKey) {
          throw new Error(`OpenRouter Error (${res.status}): ${errorBody}`);
        }
      } else {
        const data = await res.json();
        const msg = data.choices?.[0]?.message;
        const content = msg?.content || msg?.text || msg?.reasoning;
        if (content) return String(content).trim();
        throw new Error('Empty response from OpenRouter');
      }
    } catch (openRouterErr: any) {
      console.warn('OpenRouter error:', openRouterErr.message);
      if (!geminiKey) throw openRouterErr;
    }
  }

  // ── 2. Fallback: Google Gemini API ──
  if (geminiKey) {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const systemText = options.systemPrompt ? `${options.systemPrompt}\n\n` : '';

        if (options.image && options.image.base64) {
          const imagePart = {
            inlineData: {
              data: options.image.base64,
              mimeType: options.image.mimeType || 'image/jpeg',
            },
          };
          const result = await model.generateContent([
            `${systemText}${options.prompt}`,
            imagePart,
          ]);
          return (await result.response).text().trim();
        } else {
          const result = await model.generateContent(`${systemText}${options.prompt}`);
          return (await result.response).text().trim();
        }
      } catch (err: any) {
        console.warn(`Gemini model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini models failed.');
  }

  throw new Error('No AI provider succeeded.');
}
