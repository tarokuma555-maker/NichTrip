import spotsData from "../../data/pilgrimage-spots.json";

// ---------- Types ----------

export type WorkSpot = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  scene_description: string;
  episode: string;
  access_info: string;
  tags: string[];
};

export type WorkEntry = {
  slug: string;
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spots: WorkSpot[];
};

// ---------- Slug generation ----------

function generateSlug(titleEn: string): string {
  return titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- Build index (runs once at module load) ----------

const allWorks: WorkEntry[] = [];
const slugToWork = new Map<string, WorkEntry>();
const slugCount = new Map<string, number>();

for (const raw of spotsData) {
  let slug = generateSlug(raw.work_title_en);
  const count = slugCount.get(slug) ?? 0;
  slugCount.set(slug, count + 1);
  if (count > 0) {
    slug = `${slug}-${count + 1}`;
  }

  const entry: WorkEntry = {
    slug,
    title: raw.work_title,
    title_en: raw.work_title_en,
    year: raw.work_year,
    genre: raw.work_genre,
    spots: raw.spots.map((s) => ({
      name: s.name,
      address: s.address,
      lat: s.lat,
      lng: s.lng,
      scene_description: s.scene_description,
      episode: s.episode,
      access_info: s.access_info,
      tags: s.tags,
    })),
  };

  allWorks.push(entry);
  slugToWork.set(slug, entry);
}

// ---------- Prefecture extraction ----------

const PREFECTURE_RE = /^(.+?[都道府県])/;

function getPrefecture(address: string): string | null {
  const m = address.match(PREFECTURE_RE);
  return m ? m[1] : null;
}

function getWorkPrefectures(work: WorkEntry): Set<string> {
  const prefs = new Set<string>();
  for (const s of work.spots) {
    const p = getPrefecture(s.address);
    if (p) prefs.add(p);
  }
  return prefs;
}

// ---------- Public API ----------

export function getAllWorks(): WorkEntry[] {
  return allWorks;
}

export function getWorkBySlug(slug: string): WorkEntry | undefined {
  return slugToWork.get(slug);
}

export function getRelatedWorks(work: WorkEntry, limit = 6): WorkEntry[] {
  const prefs = getWorkPrefectures(work);
  if (prefs.size === 0) return [];

  const related: WorkEntry[] = [];
  for (const w of allWorks) {
    if (w.slug === work.slug) continue;
    const wPrefs = getWorkPrefectures(w);
    const prefsArr = Array.from(prefs);
    for (let pi = 0; pi < prefsArr.length; pi++) {
      if (wPrefs.has(prefsArr[pi])) {
        related.push(w);
        break;
      }
    }
    if (related.length >= limit) break;
  }
  return related;
}

export function getAllSlugs(): string[] {
  return allWorks.map((w) => w.slug);
}
