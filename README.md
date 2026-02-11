# NichTrip AI

テーマを選ぶだけで、AIがあなただけのニッチ旅を作る。

アニメ聖地巡礼をはじめとした「ニッチな旅」の旅程を、Claude AI が自動生成するWebアプリケーションです。

## 主な機能

- **AI旅程生成** — 作品名・出発地・日数・予算・同行者を入力すると、Claude が最適な旅程を作成
- **聖地データベース** — 10作品・45スポットの聖地情報を収録
- **ルートマップ** — Google Maps 上にスポットとルートを表示
- **シェア** — X（Twitter）投稿 / 画像保存 でプランを共有

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 14 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| AI | Claude API (@anthropic-ai/sdk) |
| データベース | Supabase (PostgreSQL) |
| 地図 | Google Maps (@react-google-maps/api) |
| 画像生成 | html2canvas |

## ディレクトリ構成

```
nichtrip/
├── data/
│   └── pilgrimage-spots.json   # 聖地スポットの静的データ
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql     # テーブル定義
│   └── seed.sql                # 初期データ
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-plan/route.ts  # AI プラン生成
│   │   │   ├── works/route.ts          # 作品一覧
│   │   │   └── spots/route.ts          # スポット一覧
│   │   ├── plan/
│   │   │   ├── page.tsx                # プラン作成ページ
│   │   │   └── PlanPageContent.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # トップページ
│   │   └── globals.css
│   ├── components/
│   │   ├── ConditionForm.tsx    # 条件入力フォーム
│   │   ├── LoadingAnimation.tsx # AI生成中アニメーション
│   │   ├── MapView.tsx          # Google Maps 表示
│   │   ├── PlanTimeline.tsx     # 旅程タイムライン
│   │   ├── PopularWorks.tsx     # 作品カルーセル
│   │   ├── ShareButton.tsx      # X シェア / 画像保存
│   │   ├── SpotCard.tsx         # スポット詳細カード
│   │   ├── ThemeSelector.tsx    # テーマ選択カード
│   │   └── WorkSearch.tsx       # 作品検索バー
│   └── lib/
│       ├── supabase.ts          # Supabase クライアント
│       └── types.ts             # 型定義
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## セットアップ

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <your-repo-url>
cd nichtrip
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、以下の4つの環境変数を設定してください。

```bash
cp .env.local.example .env.local  # もしくは手動作成
```

```env
# Claude API（必須：プラン生成に使用）
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Supabase（必須：データベース）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Google Maps（任意：地図表示に使用。未設定でもプラン生成は動作）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxxxx
```

#### 各サービスのキー取得方法

| キー | 取得元 |
|------|--------|
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上 → `anon` `public` キー |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) → Maps JavaScript API を有効化 |

### 3. Supabase のセットアップ

Supabase プロジェクトを作成したら、SQL Editor で以下を順に実行してください。

```bash
# 1. テーブル作成
supabase/migrations/001_initial.sql

# 2. 初期データ投入
supabase/seed.sql
```

### 4. ローカル開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリが起動します。

## Vercel へのデプロイ

### 1. GitHub にプッシュ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel でプロジェクトをインポート

1. [vercel.com/new](https://vercel.com/new) にアクセス
2. GitHub リポジトリを選択
3. Framework Preset が **Next.js** になっていることを確認
4. **Environment Variables** に以下を追加:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxxxx` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaxxxxx` |

5. **Deploy** をクリック

### 注意事項

- `NEXT_PUBLIC_` プレフィックスの環境変数はクライアントに露出します。秘密にすべきキー（`ANTHROPIC_API_KEY`）にはプレフィックスを付けていません。
- Google Maps API キーは HTTP リファラー制限を設定してください（本番ドメインのみ許可）。
- Supabase の RLS ポリシーにより、`anime_works` と `pilgrimage_spots` は読み取り専用、`generated_plans` は読み書き可能です。

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 (http://localhost:3000) |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |

## ライセンス

Private
