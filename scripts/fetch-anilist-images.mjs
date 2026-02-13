#!/usr/bin/env node
/**
 * AniList GraphQL API から各作品のカバー画像URLを取得するスクリプト
 * Usage: node scripts/fetch-anilist-images.mjs
 *
 * - data/pilgrimage-spots.json から511作品を読み込み
 * - work-visuals.ts にローカル画像がある作品はスキップ
 * - AniList API で検索し coverImage URL を取得
 * - 結果を data/work-images.json に保存
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const ANILIST_URL = "https://graphql.anilist.co";
const DELAY_MS = 800; // ~75 req/min (limit is 90)
const OUTPUT_PATH = join(ROOT, "data", "work-images.json");
const SPOTS_PATH = join(ROOT, "data", "pilgrimage-spots.json");

// Titles that already have local images in work-visuals.ts (skip these)
const LOCAL_IMAGE_TITLES = new Set([
  "進撃の巨人", "DEATH NOTE", "鋼の錬金術師 BROTHERHOOD", "ワンパンマン",
  "鬼滅の刃", "ソードアート・オンライン", "僕のヒーローアカデミア",
  "HUNTER×HUNTER", "NARUTO", "東京喰種", "君の名は。", "呪術廻戦",
  "STEINS;GATE", "ONE PIECE", "聲の形", "ノーゲーム・ノーライフ",
  "コードギアス", "Re:ゼロから始める異世界生活", "四月は君の嘘",
  "とらドラ！", "モブサイコ100", "僕だけがいない街", "暗殺教室",
  "Angel Beats!", "BLEACH", "ハイキュー!!", "約束のネバーランド",
  "この素晴らしい世界に祝福を!", "千と千尋の神隠し", "新世紀エヴァンゲリオン",
  "ヴァイオレット・エヴァーガーデン",
  "青春ブタ野郎はバニーガール先輩の夢を見ない", "Dr.STONE",
  "かぐや様は告らせたい", "チェンソーマン", "SPY×FAMILY",
  "ヴィンランド・サガ", "PSYCHO-PASS",
  "あの日見た花の名前を僕達はまだ知らない。",
  "転生したらスライムだった件", "葬送のフリーレン", "推しの子",
  "スラムダンク", "魔法少女まどか☆マギカ", "涼宮ハルヒの憂鬱",
  "けいおん!", "ラブライブ!", "薬屋のひとりごと", "天気の子",
  "すずめの戸締まり",
  // Newly added local images
  "化物語", "ぼっち・ざ・ろっく！", "CLANNAD", "花咲くいろは", "氷菓",
  "夏目友人帳", "響け！ユーフォニアム", "たまゆら", "東京リベンジャーズ",
  "ゆるキャン△", "機動戦士ガンダム 水星の魔女", "ガンダム00", "ガンダムSEED",
]);

const QUERY = `
query ($search: String, $type: MediaType) {
  Media(search: $search, type: $type, sort: SEARCH_MATCH) {
    id
    title {
      native
      romaji
      english
    }
    coverImage {
      extraLarge
      large
    }
  }
}
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize title for better AniList search matching
 */
function normalizeTitle(title) {
  return title
    .replace(/（追加スポット）/g, "")
    .replace(/\(追加スポット\)/g, "")
    .replace(/（別スポット）/g, "")
    .replace(/\s*Season\s*\d+/gi, "")
    .replace(/\s*シーズン\d+/g, "")
    .replace(/\s*第\d+期/g, "")
    .replace(/\s*\d+期$/g, "")
    .replace(/！/g, "!")
    .replace(/？/g, "?")
    .trim();
}

async function searchAniList(searchTitle, type = "ANIME") {
  const resp = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: QUERY,
      variables: { search: searchTitle, type },
    }),
  });

  if (resp.status === 429) {
    console.log("  Rate limited, waiting 60s...");
    await sleep(61000);
    return searchAniList(searchTitle, type);
  }

  if (!resp.ok) {
    console.error(`  HTTP ${resp.status} for "${searchTitle}"`);
    return null;
  }

  const json = await resp.json();
  return json?.data?.Media ?? null;
}

async function main() {
  // Load existing progress if any
  let existing = { images: {}, unmatched: [] };
  if (existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
      console.log(`Loaded existing progress: ${Object.keys(existing.images).length} images`);
    } catch {
      // ignore
    }
  }

  // Load all works
  const spots = JSON.parse(readFileSync(SPOTS_PATH, "utf-8"));
  const works = spots.map((w) => ({
    title: w.work_title,
    titleEn: w.work_title_en,
    genre: w.work_genre,
  }));

  // Filter to works that need images
  const toFetch = works.filter(
    (w) => !LOCAL_IMAGE_TITLES.has(w.title) && !existing.images[w.title]
  );

  console.log(`Total works: ${works.length}`);
  console.log(`Local images: ${LOCAL_IMAGE_TITLES.size}`);
  console.log(`Already fetched: ${Object.keys(existing.images).length}`);
  console.log(`To fetch: ${toFetch.length}`);
  console.log("---");

  const images = { ...existing.images };
  const unmatchedSet = new Set(existing.unmatched || []);
  let matched = 0;
  let failed = 0;

  for (let i = 0; i < toFetch.length; i++) {
    const work = toFetch[i];
    const normalized = normalizeTitle(work.title);
    const progress = `[${i + 1}/${toFetch.length}]`;

    // Search by Japanese title
    await sleep(DELAY_MS);
    let result = await searchAniList(normalized);

    // Fallback to English title
    if (!result && work.titleEn) {
      console.log(`${progress} "${work.title}" → trying EN: "${work.titleEn}"`);
      await sleep(DELAY_MS);
      result = await searchAniList(work.titleEn);
    }

    if (result?.coverImage) {
      const imageUrl = result.coverImage.extraLarge || result.coverImage.large;
      images[work.title] = imageUrl;
      unmatchedSet.delete(work.title);
      matched++;
      console.log(`${progress} ✓ ${work.title} → ${result.title.native || result.title.romaji}`);
    } else {
      unmatchedSet.add(work.title);
      failed++;
      console.log(`${progress} ✗ ${work.title}`);
    }

    // Save progress every 20 works
    if ((i + 1) % 20 === 0) {
      saveOutput(images, unmatchedSet);
      console.log(`  (saved progress: ${Object.keys(images).length} images)`);
    }
  }

  // Final save
  saveOutput(images, unmatchedSet);

  console.log("\n=== DONE ===");
  console.log(`Matched: ${matched}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total images in file: ${Object.keys(images).length}`);
  console.log(`Unmatched: ${unmatchedSet.size}`);
  if (unmatchedSet.size > 0) {
    console.log("Unmatched titles:");
    for (const t of unmatchedSet) {
      console.log(`  - ${t}`);
    }
  }
}

function saveOutput(images, unmatchedSet) {
  const output = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      totalImages: Object.keys(images).length,
      unmatched: unmatchedSet.size,
    },
    images,
    unmatched: Array.from(unmatchedSet),
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
