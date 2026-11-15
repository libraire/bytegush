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

export interface SentenceItem {
  order?: number;
  text: string;
  translation: string;
  translations?: Record<string, string>;
  start_ms?: number | null;
  end_ms?: number | null;
  startMs?: number | null;
  endMs?: number | null;
  image_url?: string | null;
}

export interface FeedItem {
  id: string;
  title: string;
  source: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  accent: 'en-US' | 'en-GB' | string;
  has_audio: boolean;
  audio_url?: string;
  total_duration_ms?: number;
  is_pro?: boolean;
  image_url?: string | null;
  sentences: SentenceItem[];
  vocabulary?: Record<string, WordDefinition>;
}

export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
export type AccentFilter = 'all' | 'en-US' | 'en-GB';
export type PlaybackRate = 0.8 | 1.0 | 1.25;

export interface SavedWord {
  word: string;
  phonetic?: string;
  translation?: string;
  contextSentence?: string;
  sourceTitle?: string;
  addedAt: number;
}

export interface ShadowingEvaluation {
  accuracyScore: number;
  fluencyScore: number;
  overallScore: number;
  transcript: string;
  expectedText: string;
  feedback: string;
}
