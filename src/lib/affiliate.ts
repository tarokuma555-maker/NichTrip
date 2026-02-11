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

function getRakutenAffiliateId(): string {
  return process.env.RAKUTEN_AFFILIATE_ID ?? '';
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

/** タクシー（将来対応用） */
export function buildTaxiUrl(): string | null {
  return process.env.TAXI_AFFILIATE_URL ?? null;
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

/** 楽天トラベル検索ページへのフォールバックURL */
export function buildRakutenSearchUrl(keyword: string): string {
  const affiliateId = getRakutenAffiliateId();
  const encodedKeyword = encodeURIComponent(keyword);
  if (affiliateId) {
    return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Ftravel.rakuten.co.jp%2Fyado%2F${encodedKeyword}%2F`;
  }
  return `https://travel.rakuten.co.jp/yado/${encodedKeyword}/`;
}
