export type A8Affiliate = {
  id: number;
  name: string;
  fullName: string;
  descKey: string;
  linkUrl: string;
  impTagUrl: string;
  reward: string;
  category: "hotel" | "tour" | "transport" | "rental_car" | "activity" | "restaurant";
};

export const HOTEL_AFFILIATES: A8Affiliate[] = [
  {
    id: 1,
    name: "エアトリ",
    fullName: "エアトリ国内ホテル予約",
    descKey: "af_1",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4D6H96+AD2+3B3JUQ",
    impTagUrl: "https://www19.a8.net/0.gif?a8mat=4AXA8D+4D6H96+AD2+3B3JUQ",
    reward: "2.8%",
    category: "hotel",
  },
  {
    id: 2,
    name: "トラベリスト",
    fullName: "トラベリスト",
    descKey: "af_2",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4EDCGQ+4XZI+BWVTE",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8D+4EDCGQ+4XZI+BWVTE",
    reward: "3%",
    category: "hotel",
  },
  {
    id: 3,
    name: "Yahoo!トラベル",
    fullName: "Yahoo!トラベル",
    descKey: "af_3",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4FK7OA+4ZCO+60OXE",
    impTagUrl: "https://www10.a8.net/0.gif?a8mat=4AXA8D+4FK7OA+4ZCO+60OXE",
    reward: "1%",
    category: "hotel",
  },
  {
    id: 5,
    name: "イオンコンパス",
    fullName: "イオンコンパス国内宿泊",
    descKey: "af_5",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4G5NA2+5RZ8+5YJRM",
    impTagUrl: "https://www14.a8.net/0.gif?a8mat=4AXA8D+4G5NA2+5RZ8+5YJRM",
    reward: "2%",
    category: "hotel",
  },
  {
    id: 7,
    name: "JTB",
    fullName: "JTB",
    descKey: "af_7",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3ZHICA+15A4+63OYA",
    impTagUrl: "https://www17.a8.net/0.gif?a8mat=4AXA8D+3ZHICA+15A4+63OYA",
    reward: "1.57%",
    category: "hotel",
  },
  {
    id: 8,
    name: "池の平ホテル",
    fullName: "池の平ホテル＆リゾーツ",
    descKey: "af_8",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3YW2QI+562W+5YJRM",
    impTagUrl: "https://www15.a8.net/0.gif?a8mat=4AXA8D+3YW2QI+562W+5YJRM",
    reward: "2%",
    category: "hotel",
  },
  {
    id: 10,
    name: "グランピング",
    fullName: "リゾートグランピングドットコム",
    descKey: "af_10",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3YAN4Q+5Q4K+5YJRM",
    impTagUrl: "https://www10.a8.net/0.gif?a8mat=4AXA8D+3YAN4Q+5Q4K+5YJRM",
    reward: "1.2%",
    category: "hotel",
  },
  {
    id: 11,
    name: "沖縄ツーリスト",
    fullName: "沖縄ツーリスト",
    descKey: "af_11",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4BZM1M+5R8A+5ZMCI",
    impTagUrl: "https://www13.a8.net/0.gif?a8mat=4AXA8D+4BZM1M+5R8A+5ZMCI",
    reward: "2%",
    category: "hotel",
  },
  {
    id: 17,
    name: "ゆめやど",
    fullName: "ゆめやど",
    descKey: "af_17",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3UQ1I2+44YI+HXKQQ",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8D+3UQ1I2+44YI+HXKQQ",
    reward: "3%",
    category: "hotel",
  },
  {
    id: 21,
    name: "日本旅行",
    fullName: "日本旅行（赤い風船）",
    descKey: "af_21",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3QK09M+Z9G+C3BAQ",
    impTagUrl: "https://www15.a8.net/0.gif?a8mat=4AXA8D+3QK09M+Z9G+C3BAQ",
    reward: "830円",
    category: "hotel",
  },
];

export const TOUR_AFFILIATES: A8Affiliate[] = [
  {
    id: 4,
    name: "ビッグホリデー",
    fullName: "ビッグホリデー国内旅行",
    descKey: "af_4",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4DRWUY+57BW+5YJRM",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8D+4DRWUY+57BW+5YJRM",
    reward: "2%",
    category: "tour",
  },
  {
    id: 9,
    name: "スキーツアー",
    fullName: "ビッグホリデースキーツアー",
    descKey: "af_9",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4CL1NE+57BW+BWVTE",
    impTagUrl: "https://www10.a8.net/0.gif?a8mat=4AXA8D+4CL1NE+57BW+BWVTE",
    reward: "2%",
    category: "tour",
  },
  {
    id: 12,
    name: "エアトリツアー",
    fullName: "エアトリ ニーズツアー",
    descKey: "af_12",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3VWWPM+AD2+2BETUQ",
    impTagUrl: "https://www16.a8.net/0.gif?a8mat=4AXA8D+3VWWPM+AD2+2BETUQ",
    reward: "1000-2000円",
    category: "tour",
  },
  {
    id: 14,
    name: "スキー&スノボ",
    fullName: "エアトリ スキー＆スノーボード",
    descKey: "af_14",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3XP7IY+AD2+3MZKSY",
    impTagUrl: "https://www15.a8.net/0.gif?a8mat=4AXA8D+3XP7IY+AD2+3MZKSY",
    reward: "1700円",
    category: "tour",
  },
  {
    id: 18,
    name: "神戸クルーズ",
    fullName: "THE KOBE CRUISE",
    descKey: "af_18",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3VBH3U+59HO+5YRHE",
    impTagUrl: "https://www18.a8.net/0.gif?a8mat=4AXA8D+3VBH3U+59HO+5YRHE",
    reward: "1000円",
    category: "tour",
  },
];

export const TRANSPORT_AFFILIATES: A8Affiliate[] = [
  {
    id: 13,
    name: "高速バス",
    fullName: "エアトリ 夜行・高速バス",
    descKey: "af_13",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3X3RX6+AD2+3H18R6",
    impTagUrl: "https://www15.a8.net/0.gif?a8mat=4AXA8D+3X3RX6+AD2+3H18R6",
    reward: "4.5%",
    category: "transport",
  },
];

export const RENTAL_CAR_AFFILIATES: A8Affiliate[] = [
  {
    id: 6,
    name: "イオンレンタカー",
    fullName: "イオンコンパス全国レンタカー",
    descKey: "af_6",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+4EYS2I+5RZ8+BWVTE",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8D+4EYS2I+5RZ8+BWVTE",
    reward: "1%",
    category: "rental_car",
  },
  {
    id: 16,
    name: "EARTHCAR",
    fullName: "EARTHCAR",
    descKey: "af_16",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3U4LWA+43U8+HV7V6",
    impTagUrl: "https://www12.a8.net/0.gif?a8mat=4AXA8D+3U4LWA+43U8+HV7V6",
    reward: "8%",
    category: "rental_car",
  },
  {
    id: 19,
    name: "エアトリレンタカー",
    fullName: "エアトリレンタカー",
    descKey: "af_19",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3TJ6AI+AD2+2TAOV6",
    impTagUrl: "https://www19.a8.net/0.gif?a8mat=4AXA8D+3TJ6AI+AD2+2TAOV6",
    reward: "420円",
    category: "rental_car",
  },
  {
    id: 20,
    name: "skyticket",
    fullName: "skyticketレンタカー",
    descKey: "af_20",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3SCB2Y+DRA+356I3M",
    impTagUrl: "https://www17.a8.net/0.gif?a8mat=4AXA8D+3SCB2Y+DRA+356I3M",
    reward: "3%",
    category: "rental_car",
  },
  {
    id: 22,
    name: "たびらい",
    fullName: "たびらいレンタカー",
    descKey: "af_22",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3RQVH6+1EQO+TSBEA",
    impTagUrl: "https://www14.a8.net/0.gif?a8mat=4AXA8D+3RQVH6+1EQO+TSBEA",
    reward: "230円",
    category: "rental_car",
  },
  {
    id: 23,
    name: "スカイレンタカー",
    fullName: "スカイレンタカー",
    descKey: "af_23",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3SXQOQ+2AIA+61C2Q",
    impTagUrl: "https://www13.a8.net/0.gif?a8mat=4AXA8D+3SXQOQ+2AIA+61C2Q",
    reward: "500円",
    category: "rental_car",
  },
  {
    id: 24,
    name: "レンナビ",
    fullName: "レンナビ",
    descKey: "af_24",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3R5FVE+35UM+5YJRM",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8D+3R5FVE+35UM+5YJRM",
    reward: "300円",
    category: "rental_car",
  },
];

export const RESTAURANT_AFFILIATES: A8Affiliate[] = [
  {
    id: 31,
    name: "Retty",
    fullName: "Retty（レストラン予約）",
    descKey: "af_31",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8F+GAG0EY+4EI4+BWVTE",
    impTagUrl: "https://www12.a8.net/0.gif?a8mat=4AXA8F+GAG0EY+4EI4+BWVTE",
    reward: "200円",
    category: "restaurant",
  },
  {
    id: 32,
    name: "一休.com",
    fullName: "一休.com レストラン",
    descKey: "af_32",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8F+FXCH3U+1OK+NX736",
    impTagUrl: "https://www11.a8.net/0.gif?a8mat=4AXA8F+FXCH3U+1OK+NX736",
    reward: "1%",
    category: "restaurant",
  },
];

export const ACTIVITY_AFFILIATES: A8Affiliate[] = [
  {
    id: 15,
    name: "たびらい",
    fullName: "たびらいアクティビティ",
    descKey: "af_15",
    linkUrl: "https://px.a8.net/svt/ejp?a8mat=4AXA8D+3WICBE+1EQO+1NJK7M",
    impTagUrl: "https://www17.a8.net/0.gif?a8mat=4AXA8D+3WICBE+1EQO+1NJK7M",
    reward: "200円",
    category: "activity",
  },
];

/** Shuffle array and return first `count` items */
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomHotelAffiliates(count: number): A8Affiliate[] {
  return pickRandom(HOTEL_AFFILIATES, count);
}

export function getRentalCarAffiliates(): A8Affiliate[] {
  return RENTAL_CAR_AFFILIATES;
}

export function getRandomRentalCarAffiliates(count: number): A8Affiliate[] {
  return pickRandom(RENTAL_CAR_AFFILIATES, count);
}

export function getBusAffiliate(): A8Affiliate {
  return TRANSPORT_AFFILIATES[0];
}

export function getTourAffiliates(): A8Affiliate[] {
  return TOUR_AFFILIATES;
}

export function getRandomTourAffiliates(count: number): A8Affiliate[] {
  return pickRandom(TOUR_AFFILIATES, count);
}

export function getActivityAffiliates(): A8Affiliate[] {
  return ACTIVITY_AFFILIATES;
}

export function getRestaurantAffiliates(): A8Affiliate[] {
  return RESTAURANT_AFFILIATES;
}

export function getMixedAffiliates(count: number): A8Affiliate[] {
  const all = [
    ...HOTEL_AFFILIATES,
    ...TOUR_AFFILIATES,
    ...RENTAL_CAR_AFFILIATES,
    ...ACTIVITY_AFFILIATES,
  ];
  return pickRandom(all, count);
}

export function getAffiliatesByCategory(
  category: "hotel" | "tour" | "transport" | "rental_car" | "activity" | "mixed",
  count: number
): A8Affiliate[] {
  switch (category) {
    case "hotel":
      return pickRandom(HOTEL_AFFILIATES, count);
    case "tour":
      return pickRandom(TOUR_AFFILIATES, count);
    case "transport":
      return TRANSPORT_AFFILIATES.slice(0, count);
    case "rental_car":
      return pickRandom(RENTAL_CAR_AFFILIATES, count);
    case "activity":
      return ACTIVITY_AFFILIATES.slice(0, count);
    case "mixed":
      return getMixedAffiliates(count);
  }
}

/* ===== Ad Feed Card Data ===== */

export type AdFeedCardData = {
  id: string;
  affiliateId: number;
  displayName: string;
  tagline: string;
  photoUrl: string;
  description: string;
  tip1Label: string;
  tip1Text: string;
  tip2Label: string;
  tip2Text: string;
};

export const AD_FEED_CARDS: AdFeedCardData[] = [
  {
    id: "ad-jtb",
    affiliateId: 7,
    displayName: "JTB 国内旅行予約",
    tagline: "聖地近くの宿を最安値で比較",
    photoUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop&q=80",
    description: "JTBなら全国の人気エリアのホテル・旅館を簡単比較。聖地巡礼に最適な立地のお宿が見つかります。早期予約割引やポイント還元も充実。",
    tip1Label: "特典",
    tip1Text: "早期予約で最大30%OFF。会員登録でポイント2倍キャンペーン中",
    tip2Label: "おすすめ",
    tip2Text: "聖地から徒歩圏内のホテルを地図から簡単検索できます",
  },
  {
    id: "ad-airtrip-hotel",
    affiliateId: 1,
    displayName: "エアトリ 国内ホテル",
    tagline: "最安値保証で格安ホテルを即予約",
    photoUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80",
    description: "国内最大級の宿泊比較サイト。聖地巡礼の旅にぴったりのホテルが見つかります。当日予約OK、キャンセル無料プランも多数。",
    tip1Label: "特典",
    tip1Text: "アプリ限定クーポンで最大5,000円OFF",
    tip2Label: "便利",
    tip2Text: "地図検索で聖地スポットの近くの宿がすぐ見つかる",
  },
  {
    id: "ad-yahoo-travel",
    affiliateId: 3,
    displayName: "Yahoo!トラベル 宿泊予約",
    tagline: "PayPayポイントが貯まる&使える",
    photoUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&h=600&fit=crop&q=80",
    description: "Yahoo!トラベルならPayPayポイントがたっぷり貯まる。聖地の近くで泊まれる宿泊施設を豊富なクチコミと一緒にチェック。",
    tip1Label: "特典",
    tip1Text: "PayPayポイント最大10%還元。日曜日はさらにお得",
    tip2Label: "便利",
    tip2Text: "Yahoo! IDでかんたんログイン。予約もスムーズ",
  },
  {
    id: "ad-travelist",
    affiliateId: 2,
    displayName: "トラベリスト ホテル比較",
    tagline: "厳選ホテルを最安値で比較・予約",
    photoUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop&q=80",
    description: "トラベリストは厳選されたホテルだけを掲載。価格比較が簡単で、旅行プランに合った最安値の宿が見つかります。",
    tip1Label: "特典",
    tip1Text: "初回予約で500円OFFクーポンプレゼント",
    tip2Label: "人気",
    tip2Text: "アニメの聖地周辺ホテルの特集ページあり",
  },
  {
    id: "ad-bigholiday",
    affiliateId: 4,
    displayName: "ビッグホリデー 国内ツアー",
    tagline: "航空券+宿泊のセットがお得",
    photoUrl: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=600&fit=crop&q=80",
    description: "航空券と宿泊がセットでお得なパッケージツアー。聖地巡礼の遠征旅行にぴったり。全国各地への格安ツアーが充実。",
    tip1Label: "お得",
    tip1Text: "航空券+宿泊セットで個別予約より最大40%お得",
    tip2Label: "便利",
    tip2Text: "出発地と目的地を選ぶだけで最安プランが見つかる",
  },
  {
    id: "ad-earthcar",
    affiliateId: 16,
    displayName: "EARTHCAR レンタカー",
    tagline: "聖地巡礼ドライブに最適",
    photoUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&q=80",
    description: "格安レンタカーで聖地を自由に巡ろう。車でしか行けない聖地スポットも効率的に回れます。24時間いつでもネット予約OK。",
    tip1Label: "価格",
    tip1Text: "業界最安級！12時間2,000円台から利用可能",
    tip2Label: "便利",
    tip2Text: "主要駅・空港近くに店舗多数。乗り捨てプランもあり",
  },
  {
    id: "ad-okinawa-tourist",
    affiliateId: 11,
    displayName: "沖縄ツーリスト 宿泊予約",
    tagline: "沖縄聖地巡礼なら地元のプロへ",
    photoUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop&q=80",
    description: "沖縄に強い沖縄ツーリスト。沖縄を舞台にしたアニメの聖地巡礼に最適な宿泊プランが見つかります。離島ツアーも充実。",
    tip1Label: "限定",
    tip1Text: "沖縄の離島ホテルも豊富に取り揃え",
    tip2Label: "おすすめ",
    tip2Text: "レンタカー付きプランでドライブ聖地巡礼も楽々",
  },
  {
    id: "ad-yumeyado",
    affiliateId: 17,
    displayName: "ゆめやど 温泉旅館予約",
    tagline: "巡礼の疲れを癒す温泉宿",
    photoUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop&q=80",
    description: "聖地巡礼の後は温泉でゆったり。全国の厳選された温泉旅館を特別プランでご案内。お得な平日限定プランも多数。",
    tip1Label: "特典",
    tip1Text: "平日限定の特別価格プランが充実。1人旅プランも",
    tip2Label: "こだわり",
    tip2Text: "口コミ高評価の温泉宿だけを厳選掲載",
  },
  {
    id: "ad-nihon-ryokou",
    affiliateId: 21,
    displayName: "日本旅行 赤い風船",
    tagline: "安心の老舗旅行会社で予約",
    photoUrl: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=800&h=600&fit=crop&q=80",
    description: "日本旅行の「赤い風船」ブランドで安心の旅行予約。JR+宿泊のセットプランが特にお得。新幹線で聖地巡礼するなら最適。",
    tip1Label: "お得",
    tip1Text: "JRセットプランで新幹線+宿泊がお得に。Web限定割引も",
    tip2Label: "安心",
    tip2Text: "老舗旅行会社ならではのサポート体制で安心の旅を",
  },
  {
    id: "ad-tabirai-activity",
    affiliateId: 15,
    displayName: "たびらい アクティビティ",
    tagline: "聖地で特別な体験を予約",
    photoUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=600&fit=crop&q=80",
    description: "聖地巡礼をもっと楽しく。現地のアクティビティや体験プランを事前予約。SUP、カヤック、着物体験など人気体験が多数。",
    tip1Label: "人気",
    tip1Text: "体験・アクティビティの種類が豊富。当日予約OKも多数",
    tip2Label: "おすすめ",
    tip2Text: "聖地の近くで楽しめるアクティビティをエリアで検索",
  },
  {
    id: "ad-skyticket",
    affiliateId: 20,
    displayName: "skyticket レンタカー",
    tagline: "全国のレンタカーを一括比較",
    photoUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80",
    description: "全国のレンタカー会社を一括比較して最安値で予約。聖地が点在するエリアの巡礼ドライブに最適。格安プランが充実。",
    tip1Label: "比較",
    tip1Text: "大手〜格安まで一括比較。最安値がすぐわかる",
    tip2Label: "便利",
    tip2Text: "空港・主要駅から乗れる格安プランが人気",
  },
  {
    id: "ad-ikenohira",
    affiliateId: 8,
    displayName: "池の平ホテル＆リゾーツ",
    tagline: "白樺湖リゾートでアニメコラボ",
    photoUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80",
    description: "白樺湖のリゾートホテル。アニメとのコラボイベントも開催される人気スポット。家族旅行にもカップル旅にもおすすめ。",
    tip1Label: "注目",
    tip1Text: "アニメコラボ企画を定期開催。限定グッズも",
    tip2Label: "施設",
    tip2Text: "温泉・プール・遊園地が揃うオールインワンリゾート",
  },
];
