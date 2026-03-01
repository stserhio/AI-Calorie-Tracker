import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    console.warn('ANTHROPIC_API_KEY is not set. The /api/parse-food route will not work without it.');
    return null;
  }
  return new Anthropic({ apiKey: key });
}

/** Fetch first available model ID from API so we don't depend on hardcoded names. */
async function getAvailableModelId(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { id: string }[] };
    const id = json?.data?.[0]?.id;
    return typeof id === 'string' ? id : null;
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are a dietitian calculator. Parse the user's text (Russian or English) into separate dishes/products with realistic KBJU (calories, protein, carbs, fat) per item.
Return ONLY valid JSON, no markdown or extra text. Format:
{ "items": [
  { "name": "Dish or product name", "grams": number or null, "calories": number, "protein": number, "carbs": number, "fat": number },
  ...
]}
- Extract each dish/product mentioned (e.g. "запеченная свинина 200г и картошка фри 150г" → two items).
- Estimate grams when mentioned (200, 150g, etc.); if not specified use null.
- Calories, protein, carbs, fat must be realistic totals for that portion (not per 100g unless no weight given).
- Support both Russian and English input.`;

export interface ParseFoodItem {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

function extractText(
  content: Array<{ type: string; text?: string }> | string | undefined
): string {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((block): block is { type: 'text'; text: string } => block?.type === 'text' && typeof block?.text === 'string')
    .map((b) => b.text)
    .join('');
}

export async function POST(req: NextRequest) {
  try {
    const anthropic = getAnthropic();
    if (!anthropic) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const query = body?.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Field "query" (string) is required in the request body.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim() ?? '';
    let modelId = await getAvailableModelId(apiKey);
    if (!modelId) {
      const fallbacks = ['claude-sonnet-4-6', 'claude-3-5-sonnet-20241022', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
      modelId = fallbacks[0];
    }

    const message = await anthropic.messages.create({
      model: modelId,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: query }],
    });

    const responseText = extractText(message.content).trim();
    if (!responseText) {
      console.error('Empty response from Claude. message.content:', JSON.stringify(message.content));
      return NextResponse.json(
        { error: 'Empty response from Claude. Check API key and model access.' },
        { status: 502 }
      );
    }

    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();

    let parsed: { items?: unknown[] };
    try {
      parsed = JSON.parse(cleanJson);
    } catch (error) {
      console.error('Failed to parse JSON from Claude response:', cleanJson);
      return NextResponse.json(
        {
          error: 'Failed to parse JSON from Claude response.',
          raw: responseText,
        },
        { status: 502 }
      );
    }

    const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];
    const items: ParseFoodItem[] = rawItems.map((item: unknown) => {
      const o = item as Record<string, unknown>;
      const gramsRaw = o?.grams != null ? Number(o.grams) : NaN;
      const grams = typeof gramsRaw === 'number' && !Number.isNaN(gramsRaw) ? gramsRaw : 100;
      return {
        name: typeof o?.name === 'string' ? o.name : 'Блюдо',
        grams,
        calories: Number(o?.calories) || 0,
        protein: Number(o?.protein) || 0,
        carbs: Number(o?.carbs) || 0,
        fat: Number(o?.fat) || 0,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in /api/parse-food:', error);
    return NextResponse.json(
      { error: `Internal server error while parsing food. ${message}` },
      { status: 500 }
    );
  }
}
