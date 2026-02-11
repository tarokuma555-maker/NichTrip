// アニメ作品
export type AnimeWork = {
  id: string;
  title: string;
  title_en: string;
  genre: string;
  year: number;
  image_url: string;
  description: string;
};

// 聖地スポット
export type PilgrimageSpot = {
  id: string;
  work_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  scene_description: string;
  episode: string;
  access_info: string;
  google_place_id: string;
  tags: string[];
};

// プラン生成リクエスト
export type PlanRequest = {
  theme: 'pilgrimage' | 'powerspot' | 'gourmet';
  keyword: string;
  keywords?: string[]; // 複数作品（Proプラン用）
  departure: string;
  days: number;
  budget: 'low' | 'medium' | 'high' | 'custom';
  budgetMin?: number;
  budgetMax?: number;
  companions: 'solo' | 'couple' | 'friends' | 'family' | 'custom';
  companionsAdults?: number;
  companionsChildren?: number;
};

// 生成されたプランのスポット
export type PlanSpot = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  anime_scene?: string;
  episode?: string;
  stay_minutes: number;
  access: string;
  tips: string;
  nearby_food: {
    name: string;
    genre: string;
    budget: string;
  };
};

// 生成されたプランの1日分
export type PlanDay = {
  day: number;
  title: string;
  spots: PlanSpot[];
};

// 生成されたプラン全体
export type GeneratedPlan = {
  title: string;
  summary: string;
  days: PlanDay[];
  total_budget_estimate: string;
  best_season: string;
};

// UGC: チェックイン
export type SpotCheckin = {
  id: string;
  user_id: string;
  spot_name: string;
  work_title: string | null;
  created_at: string;
};

// UGC: レビュー
export type SpotReview = {
  id: string;
  user_id: string;
  spot_name: string;
  work_title: string | null;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  tips: string | null;
  best_angle: string | null;
  visited_date: string | null;
  created_at: string;
};

// UGC: APIレスポンス
export type UGCData = {
  checkinCount: number;
  userCheckedIn: boolean;
  reviews: SpotReview[];
  totalReviewCount: number;
};

// アフィリエイト: 交通手段
export type TransportOption = {
  type: 'flight' | 'shinkansen' | 'train' | 'bus' | 'car' | 'taxi';
  icon: string;
  name: string;
  duration: string;
  price: string;
  transfers: number;
  recommendation: string;
  bookingUrl: string | null;
  source: string;
};

// アフィリエイト: 宿泊施設
export type HotelItem = {
  name: string;
  price: number;
  priceDisplay: string;
  rating: number | null;
  imageUrl: string | null;
  features: string[];
  bookingUrl: string;
  source: 'rakuten' | 'fallback';
};
