/**
 * 楽天トラベル アフィリエイトURL構築ユーティリティ
 * affiliateId はリンクに含まれる公開情報のためハードコード
 */
const RAKUTEN_AFFILIATE_ID = "50e7d9ca.6da1faca.50e7d9cb.74d63632";

/** ホテル固有の予約ページ（アフィリエイト付き） */
export function rakutenHotelUrl(hotelNo: number): string {
  const pc = `https://hotel.travel.rakuten.co.jp/hotelinfo/plan/${hotelNo}`;
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(pc)}&m=${encodeURIComponent(pc)}`;
}

/** エリアキーワードで宿検索（アフィリエイト付き） */
export function rakutenSearchUrl(keyword: string): string {
  const pc = `https://search.travel.rakuten.co.jp/ds/hotellist/Japan?f_teikei=summary&f_keyword=${encodeURIComponent(keyword)}`;
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(pc)}&m=${encodeURIComponent(pc)}`;
}
