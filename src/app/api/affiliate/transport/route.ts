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

各パターンのJSON:
- type: "flight" | "train" | "shinkansen" | "bus" | "car" | "taxi" のいずれか
- name: 交通手段名（例: "東海道新幹線 のぞみ"）
- duration: 所要時間（例: "約2時間30分"）
- price: 料金目安（例: "約14,000円"）
- transfers: 乗り換え回数（数値）
- recommendation: おすすめポイント1文

JSON配列のみ出力。マークダウンや説明は一切不要。
例: [{"type":"shinkansen","name":"東海道新幹線","duration":"約2時間","price":"約14,000円","transfers":0,"recommendation":"最速で快適"}]`;
}

function parseResponse(text: string): RawOption[] {
  // マークダウンのコードブロックを除去
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // JSON配列を抽出（前後にテキストがある場合）
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    cleaned = arrayMatch[0];
  }

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

/** Claude APIが失敗した場合のフォールバック交通手段 */
function buildFallbackOptions(from: string, to: string): TransportOption[] {
  return [
    {
      type: 'train',
      icon: getTransportIcon('train'),
      name: `${from}→${to} 電車`,
      duration: '時間は経路による',
      price: '経路検索で確認',
      transfers: 0,
      recommendation: 'Google Mapsで最適ルートを検索してください',
      bookingUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}/?travelmode=transit`,
      source: 'google_maps',
    },
    {
      type: 'car',
      icon: getTransportIcon('car'),
      name: `${from}→${to} レンタカー`,
      duration: '距離による',
      price: 'レンタカー検索で確認',
      transfers: 0,
      recommendation: '自由に移動できるのが魅力',
      bookingUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}/?travelmode=driving`,
      source: 'google_maps',
    },
    {
      type: 'taxi',
      icon: getTransportIcon('taxi'),
      name: `タクシー / 配車アプリ`,
      duration: '距離による',
      price: '距離に応じた料金',
      transfers: 0,
      recommendation: '駅から聖地スポットへの移動に便利',
      bookingUrl: null,
      source: 'info_only',
    },
  ];
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
      return NextResponse.json({ options: buildFallbackOptions(from, to) });
    }

    let rawOptions: RawOption[];
    try {
      rawOptions = parseResponse(block.text);
    } catch {
      console.error('Transport JSON parse failed:', block.text.slice(0, 200));
      return NextResponse.json({ options: buildFallbackOptions(from, to) });
    }

    if (!rawOptions || rawOptions.length === 0) {
      return NextResponse.json({ options: buildFallbackOptions(from, to) });
    }

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
    // エラー時はフォールバックを返す（空配列ではなく）
    return NextResponse.json({ options: buildFallbackOptions(from, to) });
  }
}
