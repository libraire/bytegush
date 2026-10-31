export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CharState = 0 | 1 | 2 | 3;
// 0: 未输入 (待输入)
// 1: 正确 (绿色)
// 2: 错误 (红色报警)
// 3: 连字符或空格 (自动填入)

export interface CharItem {
  char: string;
  index: number;
  state: CharState;
  inputChar: string;
}

export interface GameWord {
  id: string;
  word: string;
  phonetic: string;
  pos: string; // 词性, e.g. "v." | "n." | "adj." | "adv."
  cn: string;
  en: string;
  level: CefrLevel;
  levelNumber: number; // 1 to 6
  example: string;
  exampleCn: string;
  distractors?: string[];
}

export type PlayMode = 'adaptive' | 'fixed';

export interface GameStats {
  currentStreak: number;
  maxStreak: number;
  totalSolved: number;
  totalFails: number;
  solvedWordIds: string[];
}
