-- ============================================
-- NichTrip AI - Initial Migration
-- ============================================

-- UUID生成の有効化
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. anime_works テーブル
-- ============================================
CREATE TABLE anime_works (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  title_en    TEXT NOT NULL DEFAULT '',
  genre       TEXT NOT NULL DEFAULT '',
  year        INTEGER NOT NULL,
  image_url   TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE anime_works IS 'アニメ・映画・漫画作品マスタ';
COMMENT ON COLUMN anime_works.title IS '作品タイトル（日本語）';
COMMENT ON COLUMN anime_works.title_en IS '作品タイトル（英語）';
COMMENT ON COLUMN anime_works.genre IS 'ジャンル（映画, TVアニメ, 漫画 等）';
COMMENT ON COLUMN anime_works.year IS '公開/放送開始年';

CREATE INDEX idx_anime_works_title ON anime_works (title);
CREATE INDEX idx_anime_works_year ON anime_works (year);

-- ============================================
-- 2. pilgrimage_spots テーブル
-- ============================================
CREATE TABLE pilgrimage_spots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id           UUID NOT NULL REFERENCES anime_works(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  address           TEXT NOT NULL DEFAULT '',
  lat               DOUBLE PRECISION NOT NULL,
  lng               DOUBLE PRECISION NOT NULL,
  scene_description TEXT NOT NULL DEFAULT '',
  episode           TEXT NOT NULL DEFAULT '',
  access_info       TEXT NOT NULL DEFAULT '',
  google_place_id   TEXT NOT NULL DEFAULT '',
  tags              TEXT[] NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE pilgrimage_spots IS 'アニメ聖地スポット';
COMMENT ON COLUMN pilgrimage_spots.work_id IS '関連するアニメ作品のID';
COMMENT ON COLUMN pilgrimage_spots.lat IS '緯度';
COMMENT ON COLUMN pilgrimage_spots.lng IS '経度';
COMMENT ON COLUMN pilgrimage_spots.scene_description IS '登場シーンの説明';
COMMENT ON COLUMN pilgrimage_spots.episode IS '登場話数・パート';
COMMENT ON COLUMN pilgrimage_spots.tags IS '検索用タグ配列';

CREATE INDEX idx_pilgrimage_spots_work_id ON pilgrimage_spots (work_id);
CREATE INDEX idx_pilgrimage_spots_tags ON pilgrimage_spots USING GIN (tags);
CREATE INDEX idx_pilgrimage_spots_location ON pilgrimage_spots (lat, lng);

-- ============================================
-- 3. generated_plans テーブル
-- ============================================
CREATE TABLE generated_plans (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- リクエスト情報
  theme                 TEXT NOT NULL CHECK (theme IN ('pilgrimage', 'powerspot', 'gourmet')),
  keyword               TEXT NOT NULL,
  departure             TEXT NOT NULL DEFAULT '',
  days                  INTEGER NOT NULL CHECK (days >= 1 AND days <= 14),
  budget                TEXT NOT NULL CHECK (budget IN ('low', 'medium', 'high')),
  companions            TEXT NOT NULL CHECK (companions IN ('solo', 'couple', 'friends', 'family')),
  -- 生成結果
  plan_title            TEXT NOT NULL DEFAULT '',
  plan_summary          TEXT NOT NULL DEFAULT '',
  plan_data             JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_budget_estimate TEXT NOT NULL DEFAULT '',
  best_season           TEXT NOT NULL DEFAULT '',
  -- メタデータ
  session_id            TEXT NOT NULL DEFAULT '',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE generated_plans IS 'AIが生成した旅行プラン';
COMMENT ON COLUMN generated_plans.theme IS 'テーマ: pilgrimage=聖地巡礼, powerspot=パワースポット, gourmet=グルメ';
COMMENT ON COLUMN generated_plans.plan_data IS '日程ごとのスポット情報 (PlanDay[] の JSON)';
COMMENT ON COLUMN generated_plans.session_id IS 'ブラウザセッション識別子';

CREATE INDEX idx_generated_plans_theme ON generated_plans (theme);
CREATE INDEX idx_generated_plans_keyword ON generated_plans (keyword);
CREATE INDEX idx_generated_plans_session_id ON generated_plans (session_id);
CREATE INDEX idx_generated_plans_created_at ON generated_plans (created_at DESC);

-- ============================================
-- Row Level Security（RLS）
-- ============================================
ALTER TABLE anime_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilgrimage_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

-- anime_works: 誰でも読み取り可
CREATE POLICY "anime_works_select" ON anime_works
  FOR SELECT USING (true);

-- pilgrimage_spots: 誰でも読み取り可
CREATE POLICY "pilgrimage_spots_select" ON pilgrimage_spots
  FOR SELECT USING (true);

-- generated_plans: 誰でも読み書き可（セッション単位で管理）
CREATE POLICY "generated_plans_select" ON generated_plans
  FOR SELECT USING (true);

CREATE POLICY "generated_plans_insert" ON generated_plans
  FOR INSERT WITH CHECK (true);

-- ============================================
-- updated_at 自動更新トリガー
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_anime_works_updated_at
  BEFORE UPDATE ON anime_works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pilgrimage_spots_updated_at
  BEFORE UPDATE ON pilgrimage_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
