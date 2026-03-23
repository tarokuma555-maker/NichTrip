/**
 * Claude API用プロンプトテンプレート
 * テーマA〜Dごとのプロンプトを生成する
 */

const SYSTEM_PROMPT = `あなたはAnimeTrips（アニメ聖地巡礼Webアプリ）の専門ブログライターです。

AnimeTripsは以下の特徴を持つWebアプリです:
- 500以上のアニメ作品、1,900以上の聖地巡礼スポットを収録
- 地図付きでスポットを検索・閲覧できる
- 日本語・英語・中国語・韓国語の4言語対応
- 無料プラン + Pro版（月額¥480）
- URL: https://anime-trips.com

記事のトーン:
- 親しみやすく、読者に話しかけるような口調
- 「僕」は使わず「です/ます」調
- 熱意を持ちつつ押し売りしない
- 具体的な情報（住所、アクセス、所要時間）を含める
- AnimeTripsへの誘導は記事末尾に自然に1回だけ

SEO対策:
- タイトルにメインキーワードを含める
- h2, h3の見出しにキーワードを自然に含める
- 記事冒頭100文字以内にキーワードを入れる
- メタディスクリプション（120文字以内）を生成する

重要: レスポンスは必ず有効なJSON形式で返してください。Markdownのコードブロックで囲まないでください。`;

const RESPONSE_FORMAT = `
以下のJSON形式で返してください（コードブロックで囲まずに直接JSONを返してください）:
{
  "blog_post": {
    "title": "記事タイトル",
    "slug": "url-friendly-slug（英語、ハイフン区切り）",
    "meta_description": "メタディスクリプション120文字以内",
    "tags": ["聖地巡礼", "作品名", "地域名"],
    "body_mdx": "記事本文（Markdown形式、フロントマターなし、## から始める）"
  },
  "note_summary": {
    "title": "note用タイトル",
    "body": "note用要約本文（Markdown形式）",
    "hashtags": ["#聖地巡礼", "#作品名", "#AnimeTrips"]
  },
  "image_prompts": {
    "eyecatch": "アイキャッチ画像用プロンプト（日本語）",
    "eyecatch_en": "Same prompt in English for better quality",
    "insert_images": [
      {
        "description": "画像の説明",
        "prompt_ja": "日本語プロンプト",
        "prompt_en": "English prompt"
      }
    ]
  },
  "x_post": "X告知用テキスト（140文字以内、URL含まず）"
}`;

const IMAGE_PROMPT_GUIDELINES = `
画像プロンプトの条件:
- スタイル: アニメイラスト風（新海誠テイスト）
- アスペクト比: 16:9
- 色調: 明るく鮮やか、透明感のある光
- 人物: 旅行者風の若者（後ろ姿推奨）
- テキスト: 画像内に文字は一切入れない
- 各プロンプトには被写体・構図・アクション・場所・スタイルの5要素を含める`;

/**
 * テーマAのプロンプト生成（モデルコース系）
 */
function themeA(topic) {
  return `以下の情報を元に、聖地巡礼モデルコースのブログ記事を作成してください。

作品名: ${topic.work_name}
地域: ${topic.region}
主要スポット: ${topic.key_spots ? topic.key_spots.join(', ') : '（自由に選定）'}
ターゲットキーワード: ${topic.target_keywords.join(', ')}
季節のヒント: ${topic.season_tip || '通年'}

記事の構成:
1. 導入（作品と地域の魅力を簡潔に）
2. コース概要（所要時間、移動手段、予算）
3. 時系列のスポット紹介（各スポットにアクセス・見どころ・撮影ポイント）
4. ランチスポット（作品関連があれば優先）
5. 巡礼のコツ・注意点
6. AnimeTripsでの確認方法（自然な誘導）
7. まとめ

同時に、note用の要約版（フル記事の30〜40%の分量）、
画像生成AI用の画像プロンプト、X告知文も生成してください。
${IMAGE_PROMPT_GUIDELINES}
${RESPONSE_FORMAT}`;
}

/**
 * テーマBのプロンプト生成（スポットまとめ系）
 */
function themeB(topic) {
  return `以下の情報を元に、聖地巡礼スポットまとめのブログ記事を作成してください。

作品名: ${topic.work_name}
地域: ${topic.region}
主要スポット: ${topic.key_spots ? topic.key_spots.join(', ') : '（自由に選定）'}
ターゲットキーワード: ${topic.target_keywords.join(', ')}
季節のヒント: ${topic.season_tip || '通年'}

記事の構成:
1. 導入（作品紹介と聖地巡礼の魅力）
2. スポット一覧（各スポットに: 場所名、住所/アクセス、作中シーン、見どころ、撮影ポイント）
3. 巡礼の際の注意点・マナー
4. おすすめの巡礼ルート（効率的な回り方）
5. AnimeTripsでの確認方法（自然な誘導）
6. まとめ

各スポットはh3見出しで区切り、具体的な情報を豊富に含めてください。
同時に、note用の要約版（フル記事の30〜40%の分量）、
画像生成AI用の画像プロンプト、X告知文も生成してください。
${IMAGE_PROMPT_GUIDELINES}
${RESPONSE_FORMAT}`;
}

/**
 * テーマCのプロンプト生成（AnimeTrips紹介・使い方系）
 */
function themeC(topic) {
  return `以下の情報を元に、AnimeTripsの紹介・使い方に関するブログ記事を作成してください。

タイトルヒント: ${topic.title_hint}
ターゲットキーワード: ${topic.target_keywords.join(', ')}

記事の構成:
1. 導入（聖地巡礼の課題や悩み → AnimeTripsが解決）
2. AnimeTripsの主要機能紹介（マップ検索、作品別スポット、多言語対応など）
3. 具体的な使い方・活用シーン
4. 無料版とPro版の違い（該当する場合）
5. ユーザーの声・活用事例（想定）
6. まとめ

押し売り感を出さず、聖地巡礼を楽しむためのツールとして自然に紹介してください。
同時に、note用の要約版（フル記事の30〜40%の分量）、
画像生成AI用の画像プロンプト、X告知文も生成してください。
${IMAGE_PROMPT_GUIDELINES}
${RESPONSE_FORMAT}`;
}

/**
 * テーマDのプロンプト生成（聖地巡礼ノウハウ・Tips系）
 */
function themeD(topic) {
  return `以下の情報を元に、聖地巡礼のノウハウ・Tips系のブログ記事を作成してください。

タイトルヒント: ${topic.title_hint}
ターゲットキーワード: ${topic.target_keywords.join(', ')}
季節のヒント: ${topic.season_tip || '通年'}

記事の構成:
1. 導入（読者の悩みや課題に共感）
2. メインコンテンツ（具体的なTips・ノウハウを番号付きリストで）
3. 実践例・具体的なエピソード
4. よくある失敗と対策
5. まとめ（AnimeTripsの活用を自然に1文添える）

実用的で、読者がすぐに行動に移せるような内容にしてください。
同時に、note用の要約版（フル記事の30〜40%の分量）、
画像生成AI用の画像プロンプト、X告知文も生成してください。
${IMAGE_PROMPT_GUIDELINES}
${RESPONSE_FORMAT}`;
}

/**
 * テーマに応じたプロンプトを返す
 */
function getPromptForTopic(topic) {
  switch (topic.theme) {
    case 'A': return themeA(topic);
    case 'B': return themeB(topic);
    case 'C': return themeC(topic);
    case 'D': return themeD(topic);
    default: return themeB(topic);
  }
}

module.exports = { SYSTEM_PROMPT, getPromptForTopic };
