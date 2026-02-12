import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildRakutenSearchUrl } from '@/lib/affiliate';
import type { HotelItem } from '@/lib/types';

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function parseBudgetRange(budget?: string): { min?: number; max?: number } {
  switch (budget) {
    case 'low':
      return { max: 8000 };
    case 'medium':
      return { min: 8000, max: 15000 };
    case 'high':
      return { min: 15000 };
    default:
      return {};
  }
}

async function fetchRakutenHotels(params: {
  keyword?: string;
  lat?: number;
  lng?: number;
  budget?: string;
}): Promise<HotelItem[]> {
  const appId = process.env.RAKUTEN_APP_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (!appId) return [];

  const url = new URL(
    'https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20170426'
  );
  url.searchParams.set('applicationId', appId);
  url.searchParams.set('format', 'json');
  url.searchParams.set('hits', '5');
  url.searchParams.set('datumType', '1');

  if (affiliateId) {
    url.searchParams.set('affiliateId', affiliateId);
  }

  if (params.lat && params.lng) {
    url.searchParams.set('latitude', String(params.lat));
    url.searchParams.set('longitude', String(params.lng));
    url.searchParams.set('searchRadius', '3');
  }

  if (params.keyword) {
    url.searchParams.set('keyword', params.keyword);
  }

  const budgetRange = parseBudgetRange(params.budget);
  if (budgetRange.max) {
    url.searchParams.set('maxCharge', String(budgetRange.max));
  }
  if (budgetRange.min) {
    url.searchParams.set('minCharge', String(budgetRange.min));
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Rakuten API: ${res.status}`);

  const data = await res.json();
  const hotels: any[] = data.hotels ?? [];

  return hotels.map((h: any) => {
    const info = h.hotel?.[0]?.hotelBasicInfo;
    if (!info) return null;

    const features: string[] = [];
    if (info.parkingInformation && info.parkingInformation !== 'なし') {
      features.push('駐車場あり');
    }
    if (info.nearestStation) {
      features.push(`${info.nearestStation}駅`);
    }

    return {
      name: info.hotelName ?? '',
      price: info.hotelMinCharge ?? 0,
      priceDisplay: `¥${(info.hotelMinCharge ?? 0).toLocaleString()}〜/泊`,
      rating: info.reviewAverage ?? null,
      imageUrl: info.hotelImageUrl ?? info.hotelThumbnailUrl ?? null,
      features,
      bookingUrl:
        info.affiliateUrl ??
        info.hotelInformationUrl ??
        buildRakutenSearchUrl(info.hotelName ?? params.keyword ?? ''),
      source: 'rakuten' as const,
    };
  }).filter(Boolean) as HotelItem[];
}

async function fallbackWithClaude(keyword: string): Promise<HotelItem[]> {
  try {
    const prompt = `${keyword}周辺のおすすめホテルを3件提案してください。

各ホテルのJSON:
- name: ホテル名
- price: 1泊の目安料金（数値）
- features: 特徴を2つ（配列）

JSON配列のみ出力。余計な説明やマークダウンは不要。`;

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
      rating: null,
      imageUrl: null,
      features: h.features ?? [],
      bookingUrl: buildRakutenSearchUrl(keyword),
      source: 'fallback' as const,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
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
    const hotels = await fetchRakutenHotels({
      keyword: keyword || undefined,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      budget,
    });

    if (hotels.length > 0) {
      return NextResponse.json({ hotels });
    }

    // 楽天で見つからない場合はClaude fallback
    const fallback = await fallbackWithClaude(keyword || '周辺');
    return NextResponse.json({ hotels: fallback });
  } catch (error) {
    console.error('affiliate/hotels error:', error);

    // エラー時もfallback試行
    try {
      const fallback = await fallbackWithClaude(keyword || '周辺');
      return NextResponse.json({ hotels: fallback });
    } catch {
      return NextResponse.json({ hotels: [] });
    }
  }
}
