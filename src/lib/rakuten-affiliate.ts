/**
 * 楽天トラベル URL構築ユーティリティ
 */

/** エリアキーワードで楽天トラベル宿検索 */
export function rakutenSearchUrl(keyword: string): string {
  return `https://search.travel.rakuten.co.jp/ds/hotellist/Japan?f_teikei=summary&f_keyword=${encodeURIComponent(keyword)}`;
}
