import { getPocketBase, getAdminPocketBase } from './pb';
import { SEED_CORPUS } from '@/app/[locale]/products/flappyfeed/lib/seedCorpus';

export interface SentenceItem {
  order: number;
  text: string;
  translation: string;
  translations?: Record<string, string>;
  start_ms?: number | null;
  end_ms?: number | null;
  image_url?: string | null;
}

export interface WordDefinition {
  word: string;
  phonetic?: string;
  part_of_speech?: string;
  translation?: string;
  definition?: string;
  example?: string;
  cn_example?: string;
  image_url?: string | null;
}

export interface FeedItem {
  id: string;
  title: string;
  source: string;
  category: string;
  difficulty: string;
  accent: string;
  has_audio: boolean;
  audio_url: string;
  total_duration_ms: number;
  is_pro: boolean;
  image_url?: string | null;
  sentences: SentenceItem[];
  vocabulary: Record<string, WordDefinition>;
}

// In-memory cache for ultra-fast < 2ms mobile feed responses
let cachedItems: FeedItem[] | null = null;
let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute auto-refresh

function recordToFeedItem(record: any): FeedItem {
  return {
    id: record.feed_id || record.id,
    title: record.title || '',
    source: record.source || '',
    category: record.category || '',
    difficulty: record.difficulty || 'beginner',
    accent: record.accent || 'en-US',
    has_audio: Boolean(record.has_audio),
    audio_url: record.audio_url || '',
    total_duration_ms: Number(record.total_duration_ms) || 0,
    is_pro: Boolean(record.is_pro),
    image_url: record.image_url || null,
    sentences: Array.isArray(record.sentences) ? record.sentences : [],
    vocabulary: typeof record.vocabulary === 'object' && record.vocabulary !== null ? record.vocabulary : {},
  };
}

export async function getAllFeedItems(forceRefresh = false): Promise<FeedItem[]> {
  const now = Date.now();
  if (!forceRefresh && cachedItems && (now - lastCacheFetchTime < CACHE_TTL_MS)) {
    return cachedItems;
  }

  const seedItems = (SEED_CORPUS as unknown as FeedItem[]) || [];

  try {
    const pb = getPocketBase();
    const records = await pb.collection('flappy_feed').getFullList({
      sort: '-id',
      requestKey: null,
    });
    if (records && records.length > 0) {
      const pbItems = records.map(recordToFeedItem);
      // Ensure seed items (especially the local authentic audio podcasts) are merged and preserved
      const pbIds = new Set(pbItems.map(i => i.id));
      const extraSeeds = seedItems.filter(s => !pbIds.has(s.id));

      const allMerged = [...extraSeeds, ...pbItems];
      // Keep native audio items at the top so they are never lost or buried
      const audioItems = allMerged.filter(i => i.has_audio);
      const regularItems = allMerged.filter(i => !i.has_audio);

      cachedItems = [...audioItems, ...regularItems];
      lastCacheFetchTime = now;
      return cachedItems;
    }
  } catch (err: any) {
    // Graceful fallback without crashing or loud errors in local/offline dev
    if (process.env.NODE_ENV === 'development') {
      console.warn('PocketBase flappy_feed notice: using high-quality seed corpus fallback.');
    }
    if (cachedItems && cachedItems.length > 0) {
      return cachedItems;
    }
  }

  // Gracefully fallback to built-in seed corpus
  cachedItems = seedItems;
  lastCacheFetchTime = now;
  return seedItems;
}

export async function queryFeedStream(options: {
  difficulty?: string | null;
  category?: string | null;
  search?: string | null;
  is_pro?: boolean | null;
  has_audio?: boolean | null;
  limit?: number;
  shuffle?: boolean;
}): Promise<FeedItem[]> {
  let items = await getAllFeedItems();

  if (options.has_audio !== undefined && options.has_audio !== null) {
    items = items.filter(i => i.has_audio === options.has_audio);
  }

  if (options.difficulty && options.difficulty !== 'all') {
    items = items.filter(i => i.difficulty.toLowerCase() === options.difficulty?.toLowerCase());
  }

  if (options.category && options.category !== 'all') {
    items = items.filter(i => i.category === options.category);
  }

  if (options.is_pro !== undefined && options.is_pro !== null) {
    items = items.filter(i => i.is_pro === options.is_pro);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.source.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q)
    );
  }

  const limit = Math.min(Math.max(options.limit || 50, 1), 200);

  // If has_audio is explicitly requested, return all matching audio items
  if (options.has_audio === true) {
    return items.slice(0, limit);
  }

  // For general feed: preserve all authentic native audio items at the top,
  // then shuffle the regular reading articles for variety
  if (options.shuffle !== false && items.length > 1) {
    const audioItems = items.filter(i => i.has_audio);
    const regularItems = items.filter(i => !i.has_audio);

    const shuffled = [...regularItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const merged = [...audioItems, ...shuffled];
    return merged.slice(0, limit);
  }

  return items.slice(0, limit);
}

export async function getFeedItemById(id: string): Promise<FeedItem | null> {
  const all = await getAllFeedItems();
  const found = all.find(i => i.id === id);
  if (found) return found;

  try {
    const pb = getPocketBase();
    const record = await pb.collection('flappy_feed').getFirstListItem(`feed_id="${id}" || id="${id}"`);
    return recordToFeedItem(record);
  } catch {
    return null;
  }
}

export async function getFeedStats() {
  const all = await getAllFeedItems();
  const total = all.length;
  let has_audio_count = 0;
  let pro_count = 0;
  const categories: Record<string, number> = {};
  const difficulty: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };

  for (const item of all) {
    if (item.has_audio) has_audio_count++;
    if (item.is_pro) pro_count++;
    categories[item.category] = (categories[item.category] || 0) + 1;
    if (difficulty[item.difficulty] !== undefined) {
      difficulty[item.difficulty]++;
    } else {
      difficulty[item.difficulty] = 1;
    }
  }

  return {
    total_items: total,
    has_audio_count,
    pro_count,
    standard_count: total - pro_count,
    tts_count: total - has_audio_count,
    categories,
    difficulty,
  };
}

export async function upsertFeedItem(item: Partial<FeedItem> & { id: string }): Promise<FeedItem> {
  const payload = {
    feed_id: item.id,
    title: item.title || '',
    source: item.source || '',
    category: item.category || '',
    difficulty: item.difficulty || 'beginner',
    accent: item.accent || 'en-US',
    has_audio: Boolean(item.has_audio),
    audio_url: item.audio_url || '',
    total_duration_ms: Number(item.total_duration_ms) || 0,
    is_pro: Boolean(item.is_pro),
    image_url: item.image_url || '',
    sentences: item.sentences || [],
    vocabulary: item.vocabulary || {},
  };

  try {
    const pb = await getAdminPocketBase();
    // Check if exists
    let existing;
    try {
      existing = await pb.collection('flappy_feed').getFirstListItem(`feed_id="${item.id}"`);
    } catch {
      existing = null;
    }

    let record;
    if (existing) {
      record = await pb.collection('flappy_feed').update(existing.id, payload);
    } else {
      record = await pb.collection('flappy_feed').create(payload);
    }

    // Invalidate memory cache
    cachedItems = null;
    return recordToFeedItem(record);
  } catch (err) {
    console.error('Failed to upsert item to PocketBase:', err);
    throw err;
  }
}
