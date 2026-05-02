// Wikipedia REST/MediaWiki adapter — fetches the LEAD IMAGE (the photo at
// the top of an article) for a given place name. Wikipedia article images
// are curated by editors; vastly more accurate than Wikidata's wdt:P18
// which is community-edited at the entity level and frequently mismatched.
//
// We use MediaWiki Action API's pageimages module which supports batching
// up to 50 titles per request — for ~200 Wikidata results per country
// that's ≤4 HTTP requests instead of 200.
//
// Endpoint: https://{lang}.wikipedia.org/w/api.php
//   action=query
//   prop=pageimages       — get the article's main image
//   pithumbsize=600       — 600px-wide thumbnail
//   piprop=thumbnail      — return the thumbnail URL (not just filename)
//   titles=Title1|Title2  — pipe-separated titles
//   format=json
//   origin=*              — enables CORS for browser fetches

const BATCH_SIZE = 50;
const REQUEST_TIMEOUT_MS = 12_000;

interface PageImagesResponse {
  query?: {
    pages?: Record<string, {
      pageid?: number;
      title: string;
      thumbnail?: { source: string; width: number; height: number };
      pageimage?: string;
    }>;
    normalized?: Array<{ from: string; to: string }>;
    redirects?: Array<{ from: string; to: string }>;
  };
}

const fetchBatch = async (
  titles: string[],
  lang: 'fr' | 'en',
): Promise<Map<string, string>> => {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: 'query',
      prop: 'pageimages',
      pithumbsize: '600',
      piprop: 'thumbnail',
      titles: titles.join('|'),
      format: 'json',
      origin: '*',
      redirects: '1',
    }).toString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return new Map();
    const data: PageImagesResponse = await res.json();

    // Build a normalized→original title map so we can attribute thumbnails
    // back to the user's input title even if Wikipedia normalized it.
    const normMap = new Map<string, string>();
    for (const n of data.query?.normalized ?? []) normMap.set(n.to, n.from);
    for (const r of data.query?.redirects ?? []) {
      const original = normMap.get(r.from) ?? r.from;
      normMap.set(r.to, original);
    }

    const out = new Map<string, string>();
    for (const page of Object.values(data.query?.pages ?? {})) {
      if (!page.thumbnail?.source) continue;
      const inputTitle = normMap.get(page.title) ?? page.title;
      out.set(inputTitle, page.thumbnail.source);
    }
    return out;
  } catch {
    return new Map();
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Fetch lead-image thumbnails for a list of Wikipedia article titles.
 * Returns a Map<title, thumbnailUrl> for titles that have an image.
 * Tries French Wikipedia first, falls back to English for misses.
 */
export async function fetchWikipediaThumbnails(
  titles: string[],
): Promise<Map<string, string>> {
  if (titles.length === 0) return new Map();

  const unique = Array.from(new Set(titles.filter((t) => t && t.trim().length > 0)));
  const merged = new Map<string, string>();

  // Pass 1 — French Wikipedia
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const results = await fetchBatch(batch, 'fr');
    results.forEach((url, title) => merged.set(title, url));
  }

  // Pass 2 — English Wikipedia, only for titles still missing
  const missing = unique.filter((t) => !merged.has(t));
  if (missing.length > 0) {
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      const results = await fetchBatch(batch, 'en');
      results.forEach((url, title) => merged.set(title, url));
    }
  }

  return merged;
}
