-- ============================================
-- AnimeTrips - UGC: Checkins & Reviews
-- ============================================

-- ============================================
-- 1. spot_checkins テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS spot_checkins (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_name  text NOT NULL,
  work_title text NOT NULL DEFAULT '',
  lat        double precision,
  lng        double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE spot_checkins IS 'スポット訪問チェックイン';

CREATE INDEX idx_spot_checkins_spot_work ON spot_checkins (spot_name, work_title);
CREATE INDEX idx_spot_checkins_user_id ON spot_checkins (user_id);

-- 1ユーザー × 1スポット × 1作品 = 1チェックイン
CREATE UNIQUE INDEX idx_spot_checkins_unique
  ON spot_checkins (user_id, spot_name, work_title);

ALTER TABLE spot_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spot_checkins_select" ON spot_checkins
  FOR SELECT USING (true);
CREATE POLICY "spot_checkins_insert_own" ON spot_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_checkins_delete_own" ON spot_checkins
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. spot_reviews テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS spot_reviews (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_name    text NOT NULL,
  work_title   text NOT NULL DEFAULT '',
  rating       integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment      text,
  photo_url    text,
  tips         text,
  best_angle   text,
  visited_date date,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE spot_reviews IS 'スポットユーザーレビュー';

CREATE INDEX idx_spot_reviews_spot_work ON spot_reviews (spot_name, work_title);
CREATE INDEX idx_spot_reviews_user_id ON spot_reviews (user_id);
CREATE INDEX idx_spot_reviews_created_at ON spot_reviews (created_at DESC);

ALTER TABLE spot_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spot_reviews_select" ON spot_reviews
  FOR SELECT USING (true);
CREATE POLICY "spot_reviews_insert_own" ON spot_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spot_reviews_update_own" ON spot_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "spot_reviews_delete_own" ON spot_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- NOTE: Supabase Storage
-- ============================================
-- review-photos バケットは Supabase Dashboard で作成:
--   名前: review-photos
--   公開: true
--   INSERT: authenticated users
--   SELECT: anyone
