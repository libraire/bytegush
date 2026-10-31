'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Flame,
  Volume2,
  Lightbulb,
  SkipForward,
  RotateCcw,
  Trophy,
  Zap,
  VolumeX,
  Keyboard as KeyboardIcon,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  GameWord,
  CefrLevel,
  CharItem,
  CharState,
  PlayMode,
  GameStats,
} from '../lib/types';
import {
  WORD_BANK,
  LEVEL_METADATA,
  getLevelForStreak,
  getStreakProgress,
  getRandomWord,
} from '../lib/wordBank';
import { soundManager } from '../lib/sound';

const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function WordGameStudio() {
  const t = useTranslations('HowToSay');

  // 模式与难度
  const [playMode, setPlayMode] = useState<PlayMode>('adaptive');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1');

  // 当前单词与字符状态
  const [currentWord, setCurrentWord] = useState<GameWord>(() => getRandomWord('A1'));
  const [chars, setChars] = useState<CharItem[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [usedHint, setUsedHint] = useState<boolean>(false);
  const [showCnHint, setShowCnHint] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [shakeWrong, setShakeWrong] = useState<boolean>(false);

  // 连击与数据统计
  const [stats, setStats] = useState<GameStats>({
    currentStreak: 0,
    maxStreak: 0,
    totalSolved: 0,
    totalFails: 0,
    solvedWordIds: [],
  });

  // 用于在键盘事件中读取最新 ref
  const charsRef = useRef<CharItem[]>([]);
  const isCompletedRef = useRef<boolean>(false);
  const isFailedRef = useRef<boolean>(false);
  const currentWordRef = useRef<GameWord>(currentWord);

  useEffect(() => {
    charsRef.current = chars;
  }, [chars]);

  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  useEffect(() => {
    isFailedRef.current = isFailed;
  }, [isFailed]);

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  // 初始化声音设置和历史数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStats = localStorage.getItem('howtosay_game_stats_v2');
      if (storedStats) {
        try {
          const parsed = JSON.parse(storedStats);
          setStats((prev) => ({
            ...prev,
            maxStreak: parsed.maxStreak || 0,
            totalSolved: parsed.totalSolved || 0,
            totalFails: parsed.totalFails || 0,
          }));
        } catch {
          // ignore
        }
      }
      setSoundEnabled(soundManager.isEnabled());
    }
  }, []);

  // 保存统计
  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    if (typeof window !== 'undefined') {
      localStorage.setItem('howtosay_game_stats_v2', JSON.stringify(newStats));
    }
  };

  // 生成字符槽
  const initWordChars = useCallback((wordStr: string) => {
    const rawChars = wordStr
      .toLowerCase()
      .split('')
      .map((c, i) => {
        const isSep = c === '-' || c === ' ';
        return {
          char: c,
          index: i,
          state: (isSep ? 3 : 0) as CharState,
          inputChar: isSep ? c : '',
        };
      });
    setChars(rawChars);
    setIsCompleted(false);
    setIsFailed(false);
    setUsedHint(false);
    setShakeWrong(false);
    setShowCnHint(false);
  }, []);

  // 切换新词
  const loadNextWord = useCallback(
    (customLevel?: CefrLevel) => {
      const targetLevel =
        customLevel ||
        (playMode === 'adaptive' ? getLevelForStreak(stats.currentStreak) : selectedLevel);
      const nextWord = getRandomWord(targetLevel, currentWordRef.current.id);
      setCurrentWord(nextWord);
      initWordChars(nextWord.word);
    },
    [playMode, selectedLevel, stats.currentStreak, initWordChars]
  );

  // 初始化第一个词
  useEffect(() => {
    initWordChars(currentWord.word);
  }, [currentWord.word, initWordChars]);

  // 朗读当前单词发音
  const speakCurrentWord = useCallback((text?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text || currentWordRef.current.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }, []);

  // 检查是否完成
  const checkComplete = (charList: CharItem[]) => {
    let hasPlayable = false;
    for (const c of charList) {
      if (c.state === 3) continue;
      hasPlayable = true;
      if (c.state !== 1) return false;
    }
    return hasPlayable;
  };

  // 获取下一个待输入或错误的字符位置
  const getNextPendingChar = (charList: CharItem[]) => {
    for (const c of charList) {
      if (c.state !== 1 && c.state !== 3) {
        return c;
      }
    }
    return null;
  };

  // 获取最近一个已输入的字符位置（用于 Backspace）
  const getLastEnteredChar = (charList: CharItem[]) => {
    for (let i = charList.length - 1; i >= 0; i--) {
      if (charList[i].state !== 0 && charList[i].state !== 3) {
        return charList[i];
      }
    }
    return null;
  };

  // 处理输入单个字母
  const handleCharInput = useCallback(
    (inputKey: string) => {
      if (isCompletedRef.current || isFailedRef.current) return;

      const lowerKey = inputKey.toLowerCase();
      if (!/^[a-z]$/.test(lowerKey)) return;

      const currentList = charsRef.current;
      const targetSlot = getNextPendingChar(currentList);
      if (!targetSlot) return;

      const updated = currentList.map((item) => {
        if (item.index === targetSlot.index) {
          const isMatch = item.char === lowerKey;
          return {
            ...item,
            state: (isMatch ? 1 : 2) as CharState,
            inputChar: lowerKey,
          };
        }
        return item;
      });

      const isMatch = targetSlot.char === lowerKey;
      if (isMatch) {
        soundManager.play('press');
        setShakeWrong(false);
      } else {
        soundManager.play('alert');
        setShakeWrong(true);
        setTimeout(() => setShakeWrong(false), 400);
      }

      setChars(updated);

      // 判断是否拼写完且全部正确
      if (checkComplete(updated)) {
        setIsCompleted(true);
        soundManager.play('complete');
        speakCurrentWord(currentWordRef.current.word);

        // 连击结算
        const nextStreak = stats.currentStreak + 1;
        const newMaxStreak = Math.max(stats.maxStreak, nextStreak);
        const newStats: GameStats = {
          ...stats,
          currentStreak: nextStreak,
          maxStreak: newMaxStreak,
          totalSolved: stats.totalSolved + 1,
          solvedWordIds: Array.from(new Set([...stats.solvedWordIds, currentWordRef.current.id])),
        };
        saveStats(newStats);
      }
    },
    [stats, speakCurrentWord]
  );

  // 处理退格
  const handleBackspace = useCallback(() => {
    if (isCompletedRef.current || isFailedRef.current) return;
    soundManager.play('press');

    setChars((prev) => {
      const lastChar = getLastEnteredChar(prev);
      if (!lastChar) return prev;
      return prev.map((item) => {
        if (item.index === lastChar.index) {
          return {
            ...item,
            state: 0 as CharState,
            inputChar: '',
          };
        }
        return item;
      });
    });
  }, []);

  // 提示下一个字母 (按 1 或 H 键)
  const handleHint = useCallback(() => {
    if (isCompletedRef.current || isFailedRef.current) return;
    setUsedHint(true);
    soundManager.play('press');

    setChars((prev) => {
      const nextSlot = getNextPendingChar(prev);
      if (!nextSlot) return prev;
      const updated = prev.map((item) => {
        if (item.index === nextSlot.index) {
          return {
            ...item,
            state: 1 as CharState,
            inputChar: item.char,
          };
        }
        return item;
      });

      if (checkComplete(updated)) {
        setIsCompleted(true);
        soundManager.play('complete');
        speakCurrentWord(currentWordRef.current.word);
        // 使用提示通关：连击维持或计次
        const nextStreak = stats.currentStreak + 1;
        saveStats({
          ...stats,
          currentStreak: nextStreak,
          maxStreak: Math.max(stats.maxStreak, nextStreak),
          totalSolved: stats.totalSolved + 1,
          solvedWordIds: Array.from(new Set([...stats.solvedWordIds, currentWordRef.current.id])),
        });
      }
      return updated;
    });
  }, [stats, speakCurrentWord]);

  // 放弃 / 跳过 (连击归零)
  const handleSkip = useCallback(() => {
    if (isCompletedRef.current) {
      loadNextWord();
      return;
    }
    soundManager.play('alert');
    setIsFailed(true);

    // 揭示所有正确字母
    setChars((prev) =>
      prev.map((item) => ({
        ...item,
        state: 1 as CharState,
        inputChar: item.char,
      }))
    );

    // 连击归零
    saveStats({
      ...stats,
      currentStreak: 0,
      totalFails: stats.totalFails + 1,
    });
  }, [stats, loadNextWord]);

  // 全局键盘监听 (沿用原生 HowToSay 交互)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在外部输入框中打字时拦截
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const key = e.key;

      if (key === 'ArrowRight') {
        e.preventDefault();
        if (isCompletedRef.current || isFailedRef.current) {
          loadNextWord();
        } else {
          handleSkip();
        }
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        if (isCompletedRef.current || isFailedRef.current) {
          loadNextWord();
        } else {
          // 未完成时按 Enter 提示一个字母
          handleHint();
        }
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === '1') {
        e.preventDefault();
        handleHint();
      } else if (key === '2') {
        e.preventDefault();
        speakCurrentWord();
      } else if (key === '3') {
        e.preventDefault();
        setShowCnHint((prev) => !prev);
      } else if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        handleCharInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCharInput, handleBackspace, handleHint, handleSkip, loadNextWord, speakCurrentWord]);

  // 自适应难度进阶计算
  const adaptiveProgress = getStreakProgress(stats.currentStreak);
  const currentLevelMeta = LEVEL_METADATA[currentWord.level];

  // 遮罩释义与例句中的英文原词
  const maskWord = (text: string, target: string, completed: boolean) => {
    if (completed || !text || !target) return text;
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}(s|es|ed|ing|d)?\\b`, 'gi');
    let masked = text.replace(regex, '______');
    if (masked.toLowerCase().includes(target.toLowerCase())) {
      const fallbackRegex = new RegExp(escaped, 'gi');
      masked = masked.replace(fallbackRegex, '______');
    }
    return masked;
  };

  // 虚拟键盘行
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 顶部状态与连击仪表盘 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 连击数卡片 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/60 border border-amber-500/25 p-4 flex items-center justify-between shadow-lg shadow-amber-950/20 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium text-amber-400/90 tracking-wide flex items-center gap-1.5">
              <Flame className={`w-4 h-4 text-amber-400 ${stats.currentStreak > 0 ? 'animate-bounce' : ''}`} />
              {t('currentStreak')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {stats.currentStreak}
              </span>
              <span className="text-xs text-amber-300/70 font-mono">{t('streaking')}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono justify-end">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t('bestRecord', { count: stats.maxStreak })}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">{t('solvedWords', { count: stats.totalSolved })}</div>
          </div>
        </div>

        {/* 难度级别卡片 */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono font-medium flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              {t('wordDifficulty')}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold border ${currentLevelMeta.color}`}
            >
              {currentWord.level} · {t(`levels.${currentWord.level}.badge` as any)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((star) => (
                <div
                  key={star}
                  className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
                    star <= currentWord.levelNumber
                      ? star <= 2
                        ? 'bg-cyan-400'
                        : star <= 4
                        ? 'bg-amber-400'
                        : 'bg-rose-500 shadow-sm shadow-rose-500/50'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-400 truncate">{t(`levels.${currentWord.level}.desc` as any)}</p>
          </div>
        </div>

        {/* 模式选择与音效开关 */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex flex-col justify-between backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              {t('gameMode')}
            </span>
            <button
              onClick={() => {
                const next = !soundEnabled;
                soundManager.setEnabled(next);
                setSoundEnabled(next);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? t('soundEnabledTip') : t('soundDisabledTip')}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>

          {/* 模式切换胶囊 */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setPlayMode('adaptive');
                loadNextWord(getLevelForStreak(stats.currentStreak));
              }}
              className={`py-1 rounded-lg font-medium transition-all ${
                playMode === 'adaptive'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('modeAdaptive')}
            </button>
            <button
              onClick={() => setPlayMode('fixed')}
              className={`py-1 rounded-lg font-medium transition-all ${
                playMode === 'fixed'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('modeFixed')}
            </button>
          </div>

          {playMode === 'fixed' ? (
            <div className="flex items-center justify-between gap-1 pt-1">
              {CEFR_ORDER.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    loadNextWord(lvl);
                  }}
                  className={`flex-1 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>{t('modeAdaptive')}:</span>
              <span className="text-amber-400 font-semibold">
                {adaptiveProgress.nextTier
                  ? t('progressNext', { count: adaptiveProgress.neededForNext, tier: adaptiveProgress.nextTier })
                  : t('progressMax')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 核心猜词主卡片 */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-900/80 border transition-all duration-300 p-6 sm:p-8 shadow-2xl backdrop-blur-xl ${
          isCompleted
            ? 'border-emerald-500/50 shadow-emerald-950/30'
            : isFailed
            ? 'border-rose-500/50 shadow-rose-950/30'
            : 'border-slate-800 shadow-slate-950/50'
        }`}
      >
        {/* 背景光晕装饰 */}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none animate-pulse" />
        )}
        {isFailed && (
          <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />
        )}

        <div className="space-y-6">
          {/* 英文解释与发音提示区域 (采用英文解释来猜英文单词) */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wide">
                {currentWord.pos}
              </span>
              <span className="font-mono text-slate-400 text-sm">{currentWord.phonetic}</span>
              <button
                onClick={() => speakCurrentWord()}
                className="p-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all hover:scale-110 active:scale-95"
                title="播放发音 (快捷键 2)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* 核心英文解释大卡片 */}
            <div className="max-w-2xl mx-auto rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5 sm:p-6 shadow-inner text-center space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400/80" />
                <span>{t('englishDefHeader')}</span>
              </div>

              {/* 核心英文解释，遮罩单词 */}
              <p className="text-slate-100 font-sans text-lg sm:text-xl font-medium leading-relaxed">
                &ldquo;
                {maskWord(currentWord.en, currentWord.word, isCompleted || isFailed)}
                &rdquo;
              </p>

              {/* 挖空例句提示 */}
              {currentWord.example && (
                <div className="pt-2 text-xs sm:text-sm text-slate-400 font-serif italic border-t border-slate-800/60">
                  <span className="text-slate-500 not-italic font-mono text-[11px] mr-1.5 uppercase">{t('exampleLabel')}</span>
                  &ldquo;{maskWord(currentWord.example, currentWord.word, isCompleted || isFailed)}&rdquo;
                </div>
              )}

              {/* 中文对照 (答对/放弃后自动展示；答题时可按 3 或点击查看提示) */}
              <div className="pt-1">
                {isCompleted || isFailed ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 animate-fadeIn">
                    <span className="text-emerald-400/70 font-mono">{t('nativeClueLabel')}</span>
                    <span className="font-medium text-slate-200">{currentWord.cn}</span>
                    {currentWord.exampleCn && (
                      <span className="text-slate-400 hidden sm:inline">({currentWord.exampleCn})</span>
                    )}
                  </div>
                ) : showCnHint ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-fadeIn">
                    <span className="text-amber-400/80 font-mono">{t('nativeClueLabel')}</span>
                    <span className="font-medium">{currentWord.cn}</span>
                    <button
                      onClick={() => setShowCnHint(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 ml-1 underline"
                    >
                      {t('hide')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCnHint(true)}
                    className="text-[11px] font-mono text-slate-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                    title="Shortcut: 3"
                  >
                    <span>{t('nativeCluePrompt')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 核心字符输入格子 (Character Slots - 沿用之前输入方式) */}
          <div
            className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 transition-transform ${
              shakeWrong ? 'animate-shake' : ''
            }`}
          >
            {chars.map((charItem) => {
              // 0: 未输入 (待输入)
              if (charItem.state === 0) {
                return (
                  <div
                    key={charItem.index}
                    className="w-10 sm:w-14 h-13 sm:h-16 rounded-xl bg-slate-950 border-2 border-slate-700/80 shadow-inner flex items-center justify-center font-mono font-bold text-xl sm:text-3xl text-slate-300 relative group"
                  >
                    <span className="w-4 h-0.5 bg-slate-600 rounded-full group-hover:bg-amber-400 transition-colors" />
                  </div>
                );
              }

              // 1: 正确 (绿色)
              if (charItem.state === 1) {
                return (
                  <div
                    key={charItem.index}
                    className="w-10 sm:w-14 h-13 sm:h-16 rounded-xl bg-emerald-500 text-white font-mono font-extrabold text-xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transform transition-all scale-100 animate-popIn uppercase"
                  >
                    {charItem.char}
                  </div>
                );
              }

              // 2: 错误 (红色报警)
              if (charItem.state === 2) {
                return (
                  <div
                    key={charItem.index}
                    className="w-10 sm:w-14 h-13 sm:h-16 rounded-xl bg-rose-500 text-white font-mono font-extrabold text-xl sm:text-3xl flex items-center justify-center shadow-lg shadow-rose-500/40 transform transition-all animate-shake uppercase"
                  >
                    {charItem.inputChar}
                  </div>
                );
              }

              // 3: 连字符或空格
              return (
                <div
                  key={charItem.index}
                  className="w-6 sm:w-8 h-13 sm:h-16 flex items-center justify-center font-mono font-bold text-slate-500 text-xl"
                >
                  {charItem.char === ' ' ? ' ' : '-'}
                </div>
              );
            })}
          </div>

          {/* 状态结算条与下一步按钮 */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isCompleted ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{t('correctStreak')}</span>
                </div>
                <button
                  onClick={() => loadNextWord()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{t('nextWord')}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-100">
                    Enter ↵
                  </span>
                </button>
              </div>
            ) : isFailed ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-sm font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>{t('comboBroken')}</span>
                </div>
                <button
                  onClick={() => loadNextWord()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{t('restartChallenge')}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-100">
                    Enter ↵
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleHint}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95"
                  title="Hint (1)"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{t('hintBtn')}</span>
                </button>

                <button
                  onClick={handleBackspace}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95"
                  title="Backspace"
                >
                  <span>{t('backspaceBtn')}</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95"
                  title="Skip (→)"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>{t('skipBtn')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端触控软键盘 (仅在手机端/触屏小屏显示，桌面端自动隐藏) */}
      <div className="block md:hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 space-y-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <KeyboardIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('touchKeyboardTitle')}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{t('mobileOnly')}</span>
        </div>

        <div className="space-y-1.5">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleCharInput(letter)}
                  className="flex-1 max-w-[34px] sm:max-w-[42px] h-10 sm:h-12 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 font-mono font-bold text-sm sm:text-base border border-slate-700/80 shadow-sm flex items-center justify-center uppercase transition-all duration-75 select-none"
                >
                  {letter}
                </button>
              ))}
              {rowIndex === 2 && (
                <button
                  onClick={handleBackspace}
                  className="px-3 h-10 sm:h-12 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-rose-500 active:text-white text-rose-300 font-mono font-bold text-sm border border-slate-700 flex items-center justify-center transition-all select-none"
                  title="退格"
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 桌面端极客快捷键指示条 (仅在桌面端显示，极简无干扰) */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 font-mono py-1">
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-amber-300 border border-slate-700 font-semibold shadow-sm">
            A - Z
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.typeLetters')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 font-semibold shadow-sm">
            Backspace
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.backspace')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-amber-300 border border-slate-700 font-semibold shadow-sm">
            1
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.hint')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 font-semibold shadow-sm">
            2
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.pronounce')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-amber-300 border border-slate-700 font-semibold shadow-sm">
            3
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.nativeHint')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 font-semibold shadow-sm">
            →
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.skip')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded-md bg-slate-800/90 text-emerald-400 border border-slate-700 font-semibold shadow-sm">
            Enter
          </kbd>
          <span className="text-slate-400">{t('keyShortcuts.next')}</span>
        </span>
      </div>
    </div>
  );
}
