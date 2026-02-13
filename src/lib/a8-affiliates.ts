export type A8Affiliate = {
  id: number;
  name: string;
  fullName: string;
  descKey: string;
  linkUrl: string;
  impTagUrl: string;
  reward: string;
  category: "hotel" | "tour" | "transport" | "rental_car" | "activity";
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
