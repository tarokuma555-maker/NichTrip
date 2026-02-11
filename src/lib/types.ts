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
  departure: string;
  days: number;
  budget: 'low' | 'medium' | 'high';
  companions: 'solo' | 'couple' | 'friends' | 'family';
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
