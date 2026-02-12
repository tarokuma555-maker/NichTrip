import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildBookingHotelUrl, buildBookingAffiliateUrl } from '@/lib/affiliate';
import type { HotelItem } from '@/lib/types';
import { parseLocale, getHotelLanguageInstruction, getHotelFallback } from '@/lib/api-i18n';
import type { SupportedLocale } from '@/lib/api-i18n';

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function budgetHint(budget?: string): string {
  switch (budget) {
    case 'low':
      return '1泊8,000円以下の';
    case 'medium':
      return '1泊8,000〜15,000円程度の';
    case 'high':
      return '1泊15,000円以上の高級';
    default:
      return '';
  }
}

async function fetchHotelsWithClaude(params: {
  keyword?: string;
  lat?: number;
  lng?: number;
  budget?: string;
  locale: SupportedLocale;
}): Promise<HotelItem[]> {
  const location = params.keyword || '周辺';
  const hint = budgetHint(params.budget);
  const coordHint =
    params.lat && params.lng
      ? `（緯度${params.lat}, 経度${params.lng}付近）`
      : '';

  const prompt = `${location}${coordHint}の${hint}おすすめホテル・旅館を3件提案してください。
実在するホテルを提案してください。

各ホテルのJSON:
- name: ホテル名（正式名称）
- price: 1泊の目安料金（数値・円）
- rating: 評価（5点満点の小数, 例: 4.2）
- features: 特徴を2つ（配列）
- area: エリア名（市区町村レベル）

JSON配列のみ出力。余計な説明やマークダウンは不要。${getHotelLanguageInstruction(params.locale)}`;

  const message = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== 'text') return [];

  const cleaned = block.text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const raw: any[] = JSON.parse(cleaned);

  return raw.map((h) => ({
    name: h.name,
    price: h.price ?? 0,
    priceDisplay: `¥${(h.price ?? 0).toLocaleString()}〜/泊`,
    rating: h.rating ?? null,
    imageUrl: null,
    features: h.features ?? [],
    bookingUrl: buildBookingHotelUrl(h.name, h.area),
    source: 'booking' as const,
  }));
}

export async function GET(request: NextRequest) {
  const locale = parseLocale(request.nextUrl.searchParams.get('locale'));
  const keyword = request.nextUrl.searchParams.get('keyword') ?? '';
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');
  const budget = request.nextUrl.searchParams.get('budget') ?? undefined;

  if (!keyword && !lat) {
    return NextResponse.json(
      { error: 'keyword または lat/lng は必須です' },
      { status: 400 }
    );
  }

  try {
    const hotels = await fetchHotelsWithClaude({
      keyword: keyword || undefined,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      budget,
      locale,
    });

    if (hotels.length > 0) {
      return NextResponse.json({ hotels });
    }

    // Claude生成も失敗した場合、エリア検索リンクのみ返す
    const fallback = getHotelFallback(locale);
    return NextResponse.json({
      hotels: [
        {
          name: `${keyword || fallback.searchHotels}`,
          price: 0,
          priceDisplay: fallback.compareRates,
          rating: null,
          imageUrl: null,
          features: [fallback.searchOnBooking],
          bookingUrl: buildBookingAffiliateUrl(keyword || '日本'),
          source: 'booking' as const,
        },
      ],
    });
  } catch (error) {
    console.error('affiliate/hotels error:', error);

    // エラー時はエリア検索リンクのみ
    const fallback = getHotelFallback(locale);
    return NextResponse.json({
      hotels: [
        {
          name: `${keyword || fallback.searchHotels}`,
          price: 0,
          priceDisplay: fallback.compareRates,
          rating: null,
          imageUrl: null,
          features: [fallback.searchOnBooking],
          bookingUrl: buildBookingAffiliateUrl(keyword || '日本'),
          source: 'booking' as const,
        },
      ],
    });
  }
}
