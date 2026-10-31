export interface SubtitleItem {
  sequence: string;
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  text: string;
  translation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
}

export interface WordCorrection {
  word: string;
  definition: string;
  cn?: string;
}
