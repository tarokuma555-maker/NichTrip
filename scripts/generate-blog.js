#!/usr/bin/env node

/**
 * AnimeTrips ブログ記事自動生成スクリプト
 *
 * 処理フロー:
 * 1. topics.jsonから status: "pending" の最初のトピックを取得
 * 2. テーマ（A/B/C/D）に応じたプロンプトテンプレートを選択
 * 3. Claude APIに記事生成をリクエスト
 * 4. 3ファイルを生成:
 *    - content/blog/ja/YYYY-MM-DD-slug.mdx （サイト用フル記事）
 *    - blog/note-drafts/YYYY-MM-DD-slug.md （note要約版）
 *    - blog/image-prompts/YYYY-MM-DD-slug.md （画像生成プロンプト）
 * 5. topics.jsonの該当トピックのstatusを "published" に更新
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT, getPromptForTopic } = require('./prompt-templates');

const TOPICS_PATH = path.join(__dirname, 'topics.json');
const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog', 'ja');
const NOTE_DIR = path.join(__dirname, '..', 'blog', 'note-drafts');
const IMAGE_DIR = path.join(__dirname, '..', 'blog', 'image-prompts');

/**
 * topics.jsonからpendingの最初のトピックを取得
 */
function getNextTopic() {
  const data = JSON.parse(fs.readFileSync(TOPICS_PATH, 'utf-8'));
  const topic = data.topics.find(t => t.status === 'pending');
  return { topic, data };
}

/**
 * topics.jsonのステータスを更新
 */
function markTopicPublished(data, topicId) {
  const topic = data.topics.find(t => t.id === topicId);
  if (topic) {
    topic.status = 'published';
    topic.published_at = new Date().toISOString();
  }
  fs.writeFileSync(TOPICS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * Claude APIのレスポンスからJSONを抽出・パースする
 */
function parseResponse(text) {
  // コードブロックで囲まれている場合を処理
  let jsonStr = text.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }
  return JSON.parse(jsonStr);
}

/**
 * MDXフロントマター付きのブログ記事ファイルを生成
 */
function writeBlogPost(result, dateStr) {
  const { blog_post } = result;
  const slug = blog_post.slug;
  const filename = `${dateStr}-${slug}.mdx`;

  const frontmatter = `---
title: "${blog_post.title.replace(/"/g, '\\"')}"
publishedAt: "${dateStr}"
updatedAt: "${dateStr}"
excerpt: "${blog_post.meta_description.replace(/"/g, '\\"')}"
tags: ${JSON.stringify(blog_post.tags)}
author: "AnimeTrips編集部"
---`;

  const content = `${frontmatter}\n\n${blog_post.body_mdx}\n`;

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  const filePath = path.join(BLOG_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Blog post written: ${filePath}`);

  return { slug, filename };
}

/**
 * note用要約記事を生成
 */
function writeNoteDraft(result, dateStr) {
  const { note_summary } = result;
  const slug = result.blog_post.slug;
  const filename = `${dateStr}-${slug}.md`;

  const content = `# ${note_summary.title}

${note_summary.body}

---
${note_summary.hashtags.join(' ')}
`;

  fs.mkdirSync(NOTE_DIR, { recursive: true });
  const filePath = path.join(NOTE_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Note draft written: ${filePath}`);
}

/**
 * 画像プロンプトファイルを生成
 */
function writeImagePrompts(result, dateStr) {
  const { image_prompts } = result;
  const slug = result.blog_post.slug;
  const filename = `${dateStr}-${slug}.md`;

  let content = `# 画像プロンプト: ${result.blog_post.title}

## アイキャッチ画像

### 日本語プロンプト
${image_prompts.eyecatch}

### English Prompt
${image_prompts.eyecatch_en}

---

## 挿入画像
`;

  if (image_prompts.insert_images && image_prompts.insert_images.length > 0) {
    image_prompts.insert_images.forEach((img, i) => {
      content += `
### ${i + 1}. ${img.description}

**日本語プロンプト:**
${img.prompt_ja}

**English Prompt:**
${img.prompt_en}

---
`;
    });
  }

  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  const filePath = path.join(IMAGE_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Image prompts written: ${filePath}`);
}

/**
 * X告知文をコンソールに出力
 */
function printXPost(result) {
  if (result.x_post) {
    console.log('\n--- X告知文 ---');
    console.log(result.x_post);
    console.log('---\n');
  }
}

/**
 * メイン処理
 */
async function main() {
  // APIキーの確認
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
    process.exit(1);
  }

  // 次のトピックを取得
  const { topic, data } = getNextTopic();
  if (!topic) {
    console.log('All topics have been published! Please add new topics to topics.json.');
    // GitHub Actionsの出力として設定
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'no_topics=true\n');
    }
    process.exit(0);
  }

  console.log(`Generating blog post for topic #${topic.id}: ${topic.title_hint}`);

  // Claude APIクライアントの初期化
  const client = new Anthropic.default();

  // プロンプトの生成
  const userPrompt = getPromptForTopic(topic);

  // Claude APIリクエスト
  console.log('Calling Claude API...');
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  // レスポンスの解析
  const responseText = message.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  console.log('Parsing response...');
  const result = parseResponse(responseText);

  // 日付の生成
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  // ファイルの生成
  const { slug } = writeBlogPost(result, dateStr);
  writeNoteDraft(result, dateStr);
  writeImagePrompts(result, dateStr);
  printXPost(result);

  // トピックのステータス更新
  markTopicPublished(data, topic.id);
  console.log(`Topic #${topic.id} marked as published.`);

  // GitHub Actionsの出力
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `title=${result.blog_post.title}\n`);
  }

  console.log('Done!');
}

main().catch(err => {
  console.error('Error generating blog post:', err);
  process.exit(1);
});
