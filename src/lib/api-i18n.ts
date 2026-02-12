/**
 * Locale-specific strings for API routes.
 * These are used in server-side API handlers (not client components).
 */

export type SupportedLocale = 'ja' | 'en' | 'zh' | 'ko';

const LANGUAGE_NAME: Record<SupportedLocale, string> = {
  ja: '日本語',
  en: 'English',
  zh: '中文',
  ko: '한국어',
};

/** Instruction to append to Claude prompts so responses are in the user's language */
export function getLanguageInstruction(locale: SupportedLocale): string {
  if (locale === 'ja') return ''; // Default language, no extra instruction needed
  const lang = LANGUAGE_NAME[locale];
  return `\n\n【重要】すべてのテキスト出力（title, summary, anime_scene, access, tips, nearby_food内のname/genre/budget, total_budget_estimate, best_season など）を${lang}で記述してください。JSON構造のキー名は英語のままにしてください。`;
}

/** Chat system prompt locale instruction */
export function getChatLanguageInstruction(locale: SupportedLocale): string {
  if (locale === 'ja') return '回答は簡潔で親しみやすい日本語で、200文字以内を目安にしてください。';
  switch (locale) {
    case 'en':
      return 'Respond in concise, friendly English. Keep answers under 200 words.';
    case 'zh':
      return '请用简洁友好的中文回答，控制在200字以内。';
    case 'ko':
      return '간결하고 친근한 한국어로 답변해주세요. 200자 이내로 작성해주세요.';
  }
}

/** Hotel prompt locale instruction */
export function getHotelLanguageInstruction(locale: SupportedLocale): string {
  if (locale === 'ja') return '';
  const lang = LANGUAGE_NAME[locale];
  return `\nOutput all text values (name, features) in ${lang}. Keep JSON keys in English.`;
}

/** Transport prompt locale instruction */
export function getTransportLanguageInstruction(locale: SupportedLocale): string {
  if (locale === 'ja') return '';
  const lang = LANGUAGE_NAME[locale];
  return `\nOutput all text values (name, duration, price, recommendation) in ${lang}. Keep JSON keys in English.`;
}

/** Budget labels for generate-plan prompts */
const BUDGET_LABELS: Record<SupportedLocale, Record<string, string>> = {
  ja: { low: '節約（1日5,000円以内）', medium: '標準（1日10,000〜15,000円）', high: 'リッチ（1日30,000円以上OK）' },
  en: { low: 'Budget (under ¥5,000/day)', medium: 'Standard (¥10,000–15,000/day)', high: 'Luxury (¥30,000+/day OK)' },
  zh: { low: '经济（每天5,000日元以内）', medium: '标准（每天10,000〜15,000日元）', high: '豪华（每天30,000日元以上）' },
  ko: { low: '절약（1일 5,000엔 이내）', medium: '표준（1일 10,000〜15,000엔）', high: '럭셔리（1일 30,000엔 이상 OK）' },
};

export function getBudgetLabel(locale: SupportedLocale, budget: string): string {
  return BUDGET_LABELS[locale]?.[budget] ?? BUDGET_LABELS.ja[budget] ?? '';
}

/** Companions labels */
const COMPANIONS_LABELS: Record<SupportedLocale, Record<string, string>> = {
  ja: { solo: 'ひとり旅', couple: 'カップル', friends: '友達グループ', family: 'ファミリー' },
  en: { solo: 'Solo', couple: 'Couple', friends: 'Friends', family: 'Family' },
  zh: { solo: '独自旅行', couple: '情侣', friends: '朋友', family: '家庭' },
  ko: { solo: '혼자 여행', couple: '커플', friends: '친구', family: '가족' },
};

export function getCompanionsLabel(locale: SupportedLocale, companions: string): string {
  return COMPANIONS_LABELS[locale]?.[companions] ?? COMPANIONS_LABELS.ja[companions] ?? '';
}

/** Custom companions label */
const CUSTOM_COMPANIONS: Record<SupportedLocale, { adults: string; children: string; unit: string; separator: string; fallback: string }> = {
  ja: { adults: '大人', children: '子供', unit: '人', separator: '・', fallback: '大人1人' },
  en: { adults: '', children: '', unit: ' adult(s)', separator: ', ', fallback: '1 adult' },
  zh: { adults: '成人', children: '儿童', unit: '人', separator: '・', fallback: '成人1人' },
  ko: { adults: '성인', children: '어린이', unit: '명', separator: '・', fallback: '성인 1명' },
};

export function getCustomCompanionsLabel(
  locale: SupportedLocale,
  adults: number,
  children: number
): string {
  const c = CUSTOM_COMPANIONS[locale] ?? CUSTOM_COMPANIONS.ja;
  const parts: string[] = [];
  if (locale === 'en') {
    if (adults > 0) parts.push(`${adults} adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} child${children > 1 ? 'ren' : ''}`);
  } else {
    if (adults > 0) parts.push(`${c.adults}${adults}${c.unit}`);
    if (children > 0) parts.push(`${c.children}${children}${c.unit}`);
  }
  return parts.join(c.separator) || c.fallback;
}

/** Budget custom label */
export function getCustomBudgetLabel(locale: SupportedLocale, min: number, max: number): string {
  switch (locale) {
    case 'ja':
      return `総額 ${min.toLocaleString()}円〜${max.toLocaleString()}円`;
    case 'en':
      return `Total ¥${min.toLocaleString()}–¥${max.toLocaleString()}`;
    case 'zh':
      return `总计 ${min.toLocaleString()}日元〜${max.toLocaleString()}日元`;
    case 'ko':
      return `총 ${min.toLocaleString()}엔〜${max.toLocaleString()}엔`;
  }
}

/** No specification fallback */
export function getNoSpecLabel(locale: SupportedLocale): string {
  switch (locale) {
    case 'ja': return '指定なし';
    case 'en': return 'Not specified';
    case 'zh': return '未指定';
    case 'ko': return '미지정';
  }
}

/** Fallback transport strings */
export function getTransportFallback(locale: SupportedLocale) {
  switch (locale) {
    case 'en':
      return {
        train: 'Train', durationUnknown: 'Depends on route', checkRoute: 'Check route',
        rental: 'Rental car', distanceDepends: 'Depends on distance', checkRental: 'Check rental',
        freeTravel: 'Travel freely at your own pace',
        taxi: 'Taxi / Ride-hailing', distanceFare: 'Fare depends on distance',
        taxiConvenient: 'Convenient for station-to-spot travel',
        searchGoogle: 'Search optimal route on Google Maps',
      };
    case 'zh':
      return {
        train: '电车', durationUnknown: '取决于路线', checkRoute: '查看路线',
        rental: '租车', distanceDepends: '取决于距离', checkRental: '查看租车',
        freeTravel: '自由出行',
        taxi: '出租车 / 网约车', distanceFare: '按距离计费',
        taxiConvenient: '从车站到圣地很方便',
        searchGoogle: '在Google Maps上搜索最佳路线',
      };
    case 'ko':
      return {
        train: '전철', durationUnknown: '경로에 따라 다름', checkRoute: '경로 검색',
        rental: '렌터카', distanceDepends: '거리에 따라 다름', checkRental: '렌터카 검색',
        freeTravel: '자유롭게 이동 가능',
        taxi: '택시 / 배차 앱', distanceFare: '거리에 따른 요금',
        taxiConvenient: '역에서 성지까지 이동에 편리',
        searchGoogle: 'Google Maps에서 최적 루트 검색',
      };
    default:
      return {
        train: '電車', durationUnknown: '時間は経路による', checkRoute: '経路検索で確認',
        rental: 'レンタカー', distanceDepends: '距離による', checkRental: 'レンタカー検索で確認',
        freeTravel: '自由に移動できるのが魅力',
        taxi: 'タクシー / 配車アプリ', distanceFare: '距離に応じた料金',
        taxiConvenient: '駅から聖地スポットへの移動に便利',
        searchGoogle: 'Google Mapsで最適ルートを検索してください',
      };
  }
}

/** Hotel fallback strings */
export function getHotelFallback(locale: SupportedLocale) {
  switch (locale) {
    case 'en':
      return { searchHotels: 'Search hotels', compareRates: 'Compare rates', searchOnBooking: 'Search on Booking.com' };
    case 'zh':
      return { searchHotels: '搜索酒店', compareRates: '比较价格', searchOnBooking: '在Booking.com搜索' };
    case 'ko':
      return { searchHotels: '호텔 검색', compareRates: '요금 비교', searchOnBooking: 'Booking.com에서 검색' };
    default:
      return { searchHotels: 'ホテルを検索', compareRates: '料金を比較', searchOnBooking: 'Booking.comで検索' };
  }
}

/** Parse locale from request, defaulting to 'ja' */
export function parseLocale(localeParam: string | null | undefined): SupportedLocale {
  if (localeParam && ['ja', 'en', 'zh', 'ko'].includes(localeParam)) {
    return localeParam as SupportedLocale;
  }
  return 'ja';
}
