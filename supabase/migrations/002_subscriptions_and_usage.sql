-- ============================================
-- AnimeTrips - Subscriptions & Usage Migration
-- ============================================

-- ============================================
-- 1. profiles テーブル（Stripe Customer紐付け）
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id  TEXT UNIQUE,
  display_name        TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE profiles IS 'ユーザープロフィール（Stripe Customer紐付け）';

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
-- Webhook (service role) bypass RLS by default

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. subscriptions テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT NOT NULL,
  stripe_subscription_id  TEXT NOT NULL UNIQUE,
  stripe_price_id         TEXT NOT NULL DEFAULT '',
  status                  TEXT NOT NULL DEFAULT 'active',
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
  billing_cycle_count     INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE subscriptions IS 'Stripeサブスクリプション管理';

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions (stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions (stripe_subscription_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
-- Service role (webhooks) handles INSERT/UPDATE (bypasses RLS)

-- ============================================
-- 3. usage_logs テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  TEXT NOT NULL DEFAULT '',
  action      TEXT NOT NULL DEFAULT 'generate_plan',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE usage_logs IS '機能使用回数ログ';

CREATE INDEX idx_usage_logs_user_id ON usage_logs (user_id);
CREATE INDEX idx_usage_logs_session_id ON usage_logs (session_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs (created_at DESC);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert usage logs (anonymous or authenticated)
CREATE POLICY "usage_logs_insert" ON usage_logs
  FOR INSERT WITH CHECK (true);

-- Users can read their own logs; anonymous reads by session_id
CREATE POLICY "usage_logs_select" ON usage_logs
  FOR SELECT USING (
    auth.uid() = user_id
    OR (user_id IS NULL AND session_id != '')
  );

-- ============================================
-- 4. generated_plans に user_id カラム追加
-- ============================================
ALTER TABLE generated_plans
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_generated_plans_user_id ON generated_plans (user_id);

-- ============================================
-- 5. updated_at トリガー（既存関数を再利用）
-- ============================================
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
