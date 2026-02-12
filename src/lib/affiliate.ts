/**
 * アフィリエイトリンク生成ユーティリティ
 */

const IATA_CODES: Record<string, string> = {
  東京: 'TYO', '東京都': 'TYO',
  大阪: 'KIX', '大阪府': 'KIX',
  名古屋: 'NGO',
  福岡: 'FUK', '福岡県': 'FUK',
  札幌: 'CTS', '北海道': 'CTS',
  那覇: 'OKA', '沖縄': 'OKA', '沖縄県': 'OKA',
  仙台: 'SDJ', '宮城': 'SDJ', '宮城県': 'SDJ',
  広島: 'HIJ', '広島県': 'HIJ',
  新千歳: 'CTS',
  関西: 'KIX',
  成田: 'NRT',
  羽田: 'HND',
  中部: 'NGO',
  神戸: 'UKB',
  鹿児島: 'KOJ', '鹿児島県': 'KOJ',
  松山: 'MYJ', '愛媛': 'MYJ',
  長崎: 'NGS', '長崎県': 'NGS',
  熊本: 'KMJ', '熊本県': 'KMJ',
  高松: 'TAK', '香川': 'TAK',
  新潟: 'KIJ', '新潟県': 'KIJ',
  石垣: 'ISG',
  宮古: 'MMY',
};

function toIata(city: string): string | null {
  for (const [key, code] of Object.entries(IATA_CODES)) {
    if (city.includes(key)) return code;
  }
  return null;
}

function getMarker(): string {
  return process.env.TRAVELPAYOUTS_MARKER ?? '';
}

/** Aviasales フライト検索URL */
export function buildFlightUrl(
  from: string,
  to: string,
  date?: string
): string | null {
  const marker = getMarker();
  if (!marker) return null;

  const fromCode = toIata(from);
  const toCode = toIata(to);
  if (!fromCode || !toCode) return null;

  const dateStr = date
    ? date.replace(/-/g, '').slice(2) // YYMMDD
    : '';

  return `https://www.aviasales.com/search/${fromCode}${dateStr}${toCode}${dateStr}1?marker=${marker}`;
}

/** DiscoverCars レンタカーURL */
export function buildRentalCarUrl(): string | null {
  const marker = getMarker();
  if (!marker) return null;
  return `https://tp.media/r?marker=${marker}&trs=267122&p=7869&u=https%3A%2F%2Fwww.discovercars.com%2F`;
}

/** えきねっと（新幹線/JR） */
export function buildTrainUrl(): string {
  return 'https://www.eki-net.com/';
}

/** バス比較ナビ */
export function buildBusUrl(): string {
  return 'https://www.bushikaku.net/';
}

/** タクシー（Uber） */
export function buildTaxiUrl(): string {
  return process.env.TAXI_AFFILIATE_URL ?? 'https://m.uber.com/';
}

/** type に応じた予約URL */
export function getTransportUrl(
  type: string,
  from?: string,
  to?: string,
  date?: string
): string | null {
  switch (type) {
    case 'flight':
      return buildFlightUrl(from ?? '', to ?? '', date) ?? null;
    case 'shinkansen':
    case 'train':
      return buildTrainUrl();
    case 'bus':
      return buildBusUrl();
    case 'car':
      return buildRentalCarUrl();
    case 'taxi':
      return buildTaxiUrl();
    default:
      return null;
  }
}

/** type に応じた source ラベル */
export function getTransportSource(type: string): string {
  switch (type) {
    case 'flight':
      return 'aviasales';
    case 'shinkansen':
    case 'train':
      return 'ekinet';
    case 'bus':
      return 'bushikaku';
    case 'car':
      return 'discovercars';
    case 'taxi':
      return 'info_only';
    default:
      return 'other';
  }
}

/** type に応じたアイコン */
export function getTransportIcon(type: string): string {
  switch (type) {
    case 'flight': return '✈️';
    case 'shinkansen': return '🚄';
    case 'train': return '🚃';
    case 'bus': return '🚌';
    case 'car': return '🚗';
    case 'taxi': return '🚕';
    default: return '🚃';
  }
}

/** tp.media アフィリエイトが有効か（Booking.comプログラム参加済み） */
function isBookingAffiliateEnabled(): boolean {
  return process.env.BOOKING_AFFILIATE_ENABLED === 'true' && !!getMarker();
}

/** Booking.com アフィリエイトURL（tp.media経由、未参加時は直リンク） */
export function buildBookingAffiliateUrl(
  location: string,
  checkin?: string,
  checkout?: string,
  adults?: number
): string {
  // 生の文字列で組み立て、encodeURIComponentは最後の1回だけ
  let bookingUrl = `https://www.booking.com/searchresults.ja.html?ss=${location}`;
  if (checkin) bookingUrl += `&checkin=${checkin}`;
  if (checkout) bookingUrl += `&checkout=${checkout}`;
  if (adults) bookingUrl += `&group_adults=${adults}`;
  if (!isBookingAffiliateEnabled()) return bookingUrl;
  const marker = getMarker();
  const projectId = process.env.TRAVELPAYOUTS_PROJECT_ID ?? '';
  return `https://tp.media/r?marker=${marker}${
    projectId ? `&trs=${projectId}` : ''
  }&p=504&u=${encodeURIComponent(bookingUrl)}`;
}

/** Booking.com ホテル名検索URL（tp.media経由、未参加時は直リンク） */
export function buildBookingHotelUrl(hotelName: string, area?: string): string {
  const query = area ? `${hotelName} ${area}` : hotelName;
  // 生の文字列で組み立て、encodeURIComponentは最後の1回だけ
  const bookingUrl = `https://www.booking.com/searchresults.ja.html?ss=${query}`;
  if (!isBookingAffiliateEnabled()) return bookingUrl;
  const marker = getMarker();
  const projectId = process.env.TRAVELPAYOUTS_PROJECT_ID ?? '';
  return `https://tp.media/r?marker=${marker}${
    projectId ? `&trs=${projectId}` : ''
  }&p=504&u=${encodeURIComponent(bookingUrl)}`;
}
