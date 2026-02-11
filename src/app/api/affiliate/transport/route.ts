import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getTransportUrl,
  getTransportSource,
  getTransportIcon,
} from '@/lib/affiliate';
import type { TransportOption } from '@/lib/types';

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

type RawOption = {
  type: string;
  name: string;
  duration: string;
  price: string;
  transfers: number;
  recommendation: string;
};

function buildPrompt(
  from: string,
  to: string,
  companions?: string
): string {
  return `${from}から${to}への交通手段を3パターン提案してください。
${companions ? `同行者: ${companions}` : ''}

※ 以下の重要ルール:
- 長距離（50km以上）: 新幹線/在来線/飛行機/高速バス/レンタカーから選ぶ
- 中距離（10〜50km）: 在来線/バス/レンタカー/タクシーから選ぶ
- 短距離（10km未満）: 在来線/バス/タクシーから選ぶ
- 「駅→聖地スポット」の最後の移動にはタクシーを必ず1つ含める
- タクシーの場合、type は必ず "taxi" にする

各パターンのJSON:
- type: "flight" | "train" | "shinkansen" | "bus" | "car" | "taxi"
- name: 交通手段名
- duration: 所要時間
- price: 料金目安（大人1人）
- transfers: 乗り換え回数
- recommendation: おすすめポイント1文

JSON配列のみ出力。余計な説明やマークダウンは不要。`;
}

function parseResponse(text: string): RawOption[] {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  const date = request.nextUrl.searchParams.get('date') ?? undefined;
  const companions = request.nextUrl.searchParams.get('companions') ?? undefined;

  if (!from || !to) {
    return NextResponse.json(
      { error: 'from と to は必須です' },
      { status: 400 }
    );
  }

  try {
    const prompt = buildPrompt(from, to, companions);

    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== 'text') {
      return NextResponse.json({ options: [] });
    }

    const rawOptions = parseResponse(block.text);

    const options: TransportOption[] = rawOptions.map((opt) => ({
      type: opt.type as TransportOption['type'],
      icon: getTransportIcon(opt.type),
      name: opt.name,
      duration: opt.duration,
      price: opt.price,
      transfers: opt.transfers ?? 0,
      recommendation: opt.recommendation,
      bookingUrl: getTransportUrl(opt.type, from, to, date),
      source: getTransportSource(opt.type),
    }));

    return NextResponse.json({ options });
  } catch (error) {
    console.error('affiliate/transport error:', error);
    return NextResponse.json({ options: [] });
  }
}
