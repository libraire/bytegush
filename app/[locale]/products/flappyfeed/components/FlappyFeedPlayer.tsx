'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Repeat1,
  Languages,
  Bot,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCustomAuth } from '@/app/context/CustomAuthProvider';
import { FeedItem, SentenceItem, WordDefinition, DifficultyFilter, PlaybackRate } from '../lib/types';
import { SEED_CORPUS } from '../lib/seedCorpus';
import WordLookupModal from './WordLookupModal';
import AITutorDrawer from './AITutorDrawer';
import VocabularyDrawer from './VocabularyDrawer';
import ArticleSearchModal from './ArticleSearchModal';
import LoginGateModal from './LoginGateModal';

export default function FlappyFeedPlayer() {
  const t = useTranslations('FlappyFeed');
  const { user, isAuthenticated, openAuthModal } = useCustomAuth();

  // Feed List and Filtering
  const [feedList, setFeedList] = useState<FeedItem[]>(SEED_CORPUS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // Authentication gating: unauthenticated visitors can only listen to 1 free article
  const [allowedArticleIndex] = useState<number>(0);
  const [showLoginGate, setShowLoginGate] = useState(false);

  // Auto-close login gate if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginGate(false);
    }
  }, [isAuthenticated]);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1.0);
  const [isLoopingSentence, setIsLoopingSentence] = useState(false);
  const [showBilingual, setShowBilingual] = useState(true);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');

  // Modal / Drawer state
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    definition?: WordDefinition | null;
    sentence?: string;
  } | null>(null);
  const [aiTarget, setAiTarget] = useState<{ text: string; context?: string } | null>(null);
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // DOM Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedAudioArticleIdRef = useRef<string | null>(null);
  const currentItemRef = useRef<FeedItem | undefined>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const currentItem: FeedItem | undefined = feedList[currentIndex];
  currentItemRef.current = currentItem;
  const currentSentence: SentenceItem | undefined = currentItem?.sentences?.[currentSentenceIndex];

  // Helper: Gently scroll active sentence into view (centered vertically)
  const scrollActiveSentenceIntoView = useCallback((index: number) => {
    const el = document.querySelector(`[data-sentence-idx="${index}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Pause playback helper (used when opening modals/drawers or gating)
  const pausePlayback = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
    }
    setIsPlaying(false);
  }, []);

  // Card Navigation (Conventional buttons) with authentication gate
  const goToNext = useCallback(() => {
    if (!isAuthenticated) {
      pausePlayback();
      setShowLoginGate(true);
      return;
    }
    if (currentIndex < feedList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, feedList.length, isAuthenticated, pausePlayback]);

  const goToPrev = useCallback(() => {
    if (!isAuthenticated) {
      pausePlayback();
      setShowLoginGate(true);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, isAuthenticated, pausePlayback]);

  const selectArticle = useCallback((index: number) => {
    if (!isAuthenticated && index !== allowedArticleIndex) {
      pausePlayback();
      setIsSearchOpen(false);
      setShowLoginGate(true);
      return;
    }
    if (index >= 0 && index < feedList.length) {
      setCurrentIndex(index);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allowedArticleIndex, feedList.length, isAuthenticated, pausePlayback]);

  // TTS Engine (Native Web Speech API - 100% reliable)
  const playSentenceTTS = useCallback((sentenceIdx: number) => {
    if (!currentItem?.sentences?.length || typeof window === 'undefined') {
      setIsPlaying(false);
      return;
    }
    const sentence = currentItem.sentences[sentenceIdx];
    if (!sentence) {
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence.text);
      utterance.lang = currentItem.accent || accent;
      utterance.rate = playbackRate;

      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentSentenceIndex(sentenceIdx);
        scrollActiveSentenceIntoView(sentenceIdx);
      };

      utterance.onend = () => {
        if (isLoopingSentence) {
          ttsTimeoutRef.current = setTimeout(() => playSentenceTTS(sentenceIdx), 400);
        } else if (sentenceIdx + 1 < currentItem.sentences.length) {
          ttsTimeoutRef.current = setTimeout(() => playSentenceTTS(sentenceIdx + 1), 500);
        } else {
          setIsPlaying(false);
          // When the free passage completes, prompt unauthenticated user to log in
          if (!isAuthenticated) {
            setShowLoginGate(true);
          }
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis cancel/error:', e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [accent, currentItem, isAuthenticated, isLoopingSentence, playbackRate, scrollActiveSentenceIntoView]);

  // Replay free article helper
  const replayFreeArticle = useCallback(() => {
    setCurrentSentenceIndex(0);
    if (currentItem?.has_audio && currentItem.audio_url && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        playSentenceTTS(0);
      });
    } else {
      playSentenceTTS(0);
    }
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentItem, playSentenceTTS]);

  // When AI tutor or search modal opens, immediately pause playback
  useEffect(() => {
    if (aiTarget || isSearchOpen) {
      pausePlayback();
    }
  }, [aiTarget, isSearchOpen, pausePlayback]);

  // Play/Pause Toggle
  const togglePlayPause = useCallback(() => {
    if (currentItem?.has_audio && currentItem.audio_url && audioRef.current) {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Audio play failed, auto fallback to TTS:', err);
          playSentenceTTS(currentSentenceIndex);
        });
      }
    } else {
      if (isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
      } else {
        playSentenceTTS(currentSentenceIndex);
      }
    }
  }, [currentItem, currentSentenceIndex, isPlaying, playSentenceTTS]);

  // Jump to specific sentence
  const seekToSentence = useCallback((index: number) => {
    if (!currentItem?.sentences) return;
    const sentence = currentItem.sentences[index];
    if (!sentence) return;

    setCurrentSentenceIndex(index);
    scrollActiveSentenceIntoView(index);

    if (currentItem.has_audio && currentItem.audio_url && audioRef.current) {
      const start = (sentence.start_ms ?? (sentence as any).startMs ?? 0) / 1000;
      audioRef.current.currentTime = start;
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          playSentenceTTS(index);
        });
      }
    } else {
      playSentenceTTS(index);
    }
  }, [currentItem, isPlaying, playSentenceTTS, scrollActiveSentenceIntoView]);

  // Cycle playback speed
  const cyclePlaybackRate = useCallback(() => {
    const rates: PlaybackRate[] = [0.8, 1.0, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  }, [playbackRate]);

  // 1. Fetch remote feed from /api/v1/feed with fallback to SEED_CORPUS
  useEffect(() => {
    async function loadRemoteFeed() {
      setIsLoadingFeed(true);
      try {
        const queryParams = new URLSearchParams();
        if (difficultyFilter !== 'all') {
          queryParams.set('difficulty', difficultyFilter);
        }
        queryParams.set('limit', '100');

        const res = await fetch(`/api/v1/feed?${queryParams.toString()}`);
        if (res.ok) {
          const data: FeedItem[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalized = data.map((item) => ({
              ...item,
              sentences: item.sentences.map((s, idx) => ({
                ...s,
                order: s.order ?? idx,
                start_ms: s.start_ms ?? (s as any).startMs ?? 0,
                end_ms: s.end_ms ?? (s as any).endMs ?? 0,
              })),
            }));

            // Keep currently active article index without jumping or interrupting playback
            const currentActiveId = currentItemRef.current?.id;
            setFeedList(normalized);

            if (currentActiveId) {
              const matchedIdx = normalized.findIndex((i) => i.id === currentActiveId);
              if (matchedIdx !== -1) {
                setCurrentIndex(matchedIdx);
              }
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Using offline seed corpus fallback:', err);
      } finally {
        setIsLoadingFeed(false);
      }

      if (difficultyFilter === 'all') {
        setFeedList(SEED_CORPUS);
      } else {
        const filtered = SEED_CORPUS.filter((i) => i.difficulty === difficultyFilter);
        setFeedList(filtered.length > 0 ? filtered : SEED_CORPUS);
      }
    }

    loadRemoteFeed();
  }, [difficultyFilter]);

  // 2. Setup Audio only when the selected article genuinely changes
  const activeArticleId = currentItem?.id;
  useEffect(() => {
    if (!activeArticleId) return;

    // Avoid restarting/cutting audio if the active article has not changed
    if (loadedAudioArticleIdRef.current === activeArticleId) {
      return;
    }
    loadedAudioArticleIdRef.current = activeArticleId;

    setCurrentSentenceIndex(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentItem?.has_audio && currentItem.audio_url && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentItem.audio_url;
      audio.playbackRate = playbackRate;
      audio.load();

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          // If browser policy blocks auto-play before user gesture, handle gracefully
          console.log('Autoplay deferred until user interaction:', err);
          setIsPlaying(false);
        });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }

    return () => {
      if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
    };
  }, [activeArticleId, currentItem?.has_audio, currentItem?.audio_url]);

  // 3. Audio Time Update & Synchronization
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !currentItem?.sentences?.length) return;

    const ms = Math.floor(audio.currentTime * 1000);
    const sentences = currentItem.sentences;
    const curSentence = sentences[currentSentenceIndex];

    if (
      isLoopingSentence &&
      curSentence &&
      curSentence.end_ms &&
      curSentence.start_ms !== undefined &&
      curSentence.start_ms !== null
    ) {
      if (ms >= curSentence.end_ms) {
        audio.currentTime = curSentence.start_ms / 1000;
        return;
      }
    }

    const activeIdx = sentences.findIndex((s) => {
      const start = s.start_ms ?? (s as any).startMs ?? 0;
      const end = s.end_ms ?? (s as any).endMs ?? Infinity;
      return ms >= start && ms <= end;
    });

    if (activeIdx !== -1 && activeIdx !== currentSentenceIndex) {
      setCurrentSentenceIndex(activeIdx);
      scrollActiveSentenceIntoView(activeIdx);
    }
  };

  // Keyboard Shortcuts (Space for play/pause, R for loop, B for bilingual)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'r':
          setIsLoopingSentence((prev) => !prev);
          break;
        case 'b':
          setShowBilingual((prev) => !prev);
          break;
        case '/':
          e.preventDefault();
          setIsSearchOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  // Word Click Handler
  const handleWordClick = (word: string, sentence: string) => {
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, '').toLowerCase();
    if (!cleanWord) return;

    const vocabDef = currentItem?.vocabulary?.[cleanWord];
    setSelectedWord({
      word: cleanWord,
      definition: vocabDef || null,
      sentence,
    });
  };

  return (
    <div className="w-full max-w-4xl h-full rounded-2xl sm:rounded-3xl border border-purple-500/30 bg-[#0C101E]/95 shadow-2xl shadow-purple-950/40 flex flex-col overflow-hidden text-slate-100">
      {/* Hidden Audio Player with safe fallback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (!isAuthenticated) {
            pausePlayback();
            setShowLoginGate(true);
          } else {
            goToNext();
          }
        }}
        onError={() => {
          console.warn('Audio tag failed to load source, fallback to TTS');
          setIsPlaying(false);
        }}
        className="hidden"
      />

      {/* ===================== 1. TOP FIXED HEADER & ARTICLE NAVIGATION ===================== */}
      <header className="flex-shrink-0 z-20 py-2.5 px-3 sm:px-5 border-b border-slate-800/80 bg-[#0B0F1D]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
        {/* 左侧：常规按钮切换 上一篇 / 下一篇 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-semibold text-slate-200 border border-white/5 flex items-center gap-1 transition-colors"
            title="切换到上一篇文章"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>上一篇</span>
          </button>

          <span className="text-xs font-mono text-slate-400 px-1.5">
            {currentIndex + 1} / {feedList.length}
          </span>

          <button
            onClick={goToNext}
            disabled={currentIndex === feedList.length - 1}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-semibold text-slate-200 border border-white/5 flex items-center gap-1 transition-colors"
            title="切换到下一篇文章"
          >
            <span>下一篇</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 右侧：登录状态/登录按钮、搜索切换、生词本与双语开关 */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('otp')}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              title="登录即可解锁全部 1490+ 篇名著语料"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>{t('loginBtn')}</span>
              <span className="text-[10px] bg-purple-950/80 border border-purple-400/30 px-1.5 py-0.2 rounded-full text-purple-200 ml-0.5">
                1/1
              </span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/50 border border-purple-800/50 px-2.5 py-1 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="max-w-[90px] truncate">
                {user?.name || user?.email?.split('@')[0] || 'VIP'}
              </span>
            </div>
          )}

          {/* 搜索切换按钮 */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="搜索语料库或从目录中自由切换文章 (快捷键: /)"
          >
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span>搜索文章</span>
          </button>

          <button
            onClick={() => setShowBilingual((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              showBilingual
                ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                : 'bg-white/5 text-slate-400 border-white/5'
            }`}
            title="切换英汉双语对照 / 纯英盲听模式 (快捷键: B)"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showBilingual ? '双语对照' : '纯英磨耳'}</span>
          </button>

          <button
            onClick={() => setIsVocabOpen(true)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors"
            title="打开生词本"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline text-xs">生词本</span>
          </button>
        </div>
      </header>

      {/* ===================== 2. MIDDLE SCROLLABLE TEXT STREAM ===================== */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-5 min-h-0 select-text scroll-smooth"
      >
        {/* 文章元信息与标题 */}
        <section className="mb-4 space-y-2 text-left border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-800/40">
              {currentItem?.category || '综合精选'}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              来源：{currentItem?.source}
            </span>
            <span className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              难度：{currentItem?.difficulty?.toUpperCase()}
            </span>
            <span className="text-[11px] text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-md font-mono">
              {currentItem?.accent === 'en-GB' ? '🇬🇧 英音' : '🇺🇸 美音'}
            </span>
            {currentItem?.has_audio ? (
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>🎙️ 真实原声播客</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono">
                🤖 文本伴读
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentItem?.title}
          </h1>
        </section>

        {/* 紧凑双语精读排版 */}
        <article className="text-left select-text space-y-2.5 sm:space-y-3 my-2 pb-6">
          {currentItem?.sentences?.map((sentence, idx) => {
            const isCurrent = currentSentenceIndex === idx;
            return (
              <div
                key={idx}
                data-sentence-idx={idx}
                onClick={() => seekToSentence(idx)}
                className={`group cursor-pointer transition-all duration-150 -mx-2.5 px-2.5 py-1.5 sm:py-2 rounded-lg ${
                  isCurrent
                    ? 'bg-purple-950/40 ring-1 ring-purple-500/30 shadow-sm'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                {/* 英文原文 */}
                <div
                  className={`text-base sm:text-lg leading-snug sm:leading-relaxed font-sans tracking-normal transition-colors ${
                    isCurrent ? 'text-white font-medium' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {sentence.text.split(' ').map((rawWord, wIdx) => {
                    const clean = rawWord.replace(/[^a-zA-Z'-]/g, '');
                    return (
                      <span
                        key={wIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWordClick(clean, sentence.text);
                        }}
                        className="inline-block mr-1 transition-colors hover:text-purple-300 cursor-pointer"
                        title="轻点查词"
                      >
                        {rawWord}
                      </span>
                    );
                  })}

                  {/* 句末轻量 AI 伴学快捷按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAiTarget({
                        text: sentence.text,
                        context: currentItem?.title,
                      });
                    }}
                    className={`inline-flex items-center gap-0.5 ml-1.5 px-1 py-0.5 rounded text-[10px] font-mono transition-opacity align-middle ${
                      isCurrent
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50 opacity-100'
                        : 'text-slate-500 hover:text-purple-300 hover:bg-purple-950/50 opacity-0 group-hover:opacity-100'
                    }`}
                    title="针对此句呼出 AI 私教进行语法拆解与 A2 降级"
                  >
                    <Bot className="w-2.5 h-2.5" />
                    <span>AI</span>
                  </button>
                </div>

                {/* 中文翻译：紧凑排在原文正下方 */}
                {showBilingual && sentence.translation && (
                  <p
                    className={`mt-0.5 sm:mt-1 text-xs sm:text-sm leading-normal font-normal transition-colors ${
                      isCurrent ? 'text-purple-300/90 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {sentence.translation}
                  </p>
                )}
              </div>
            );
          })}
        </article>
      </main>

      {/* ===================== 3. BOTTOM FIXED AUDIO CONTROL BAR ===================== */}
      <footer className="flex-shrink-0 z-20 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800/80 bg-[#0D1224]/95 backdrop-blur-xl flex items-center justify-between gap-2 shadow-lg">
        {/* 左侧：复读与倍速切换 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsLoopingSentence((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLoopingSentence
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
            }`}
            title="单句循环复读磨耳朵 (快捷键: R)"
          >
            <Repeat1 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">单句复读</span>
          </button>

          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-xs font-mono font-bold transition-colors"
            title="切换语速 (0.8x / 1.0x / 1.25x)"
          >
            {playbackRate.toFixed(1)}x
          </button>
        </div>

        {/* 中间：大播放/暂停按钮 */}
        <div>
          <button
            onClick={togglePlayPause}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
            title="播放 / 暂停 (快捷键: 空格键)"
          >
            {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />}
          </button>
        </div>

        {/* 右侧：当前句进度与 AI 私教 */}
        <div className="flex items-center gap-2">
          {currentItem?.sentences?.length ? (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              第 {currentSentenceIndex + 1} / {currentItem.sentences.length} 句
            </span>
          ) : null}

          <button
            onClick={() => {
              const cur = currentItem?.sentences?.[currentSentenceIndex];
              setAiTarget({
                text: cur?.text || currentItem?.title || '',
                context: currentItem?.title,
              });
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
            title="呼出 AI 私教针对当前句答疑"
          >
            <Bot className="w-4 h-4" />
            <span>AI 私教</span>
          </button>
        </div>
      </footer>

      {/* ===================== MODALS & DRAWERS ===================== */}
      {/* 1. 点词即查浮层 */}
      {selectedWord && (
        <WordLookupModal
          isOpen={Boolean(selectedWord)}
          onClose={() => setSelectedWord(null)}
          word={selectedWord.word}
          definition={selectedWord.definition}
          contextSentence={selectedWord.sentence}
          sourceTitle={currentItem?.title}
          onAskAI={(word) => {
            setAiTarget({ text: word, context: selectedWord.sentence });
          }}
        />
      )}

      {/* 2. 上下文感知 AI 私教抽屉 */}
      {aiTarget && (
        <AITutorDrawer
          isOpen={Boolean(aiTarget)}
          onClose={() => setAiTarget(null)}
          targetText={aiTarget.text}
          contextSentence={aiTarget.context}
        />
      )}

      {/* 3. 生词本侧边抽屉 */}
      <VocabularyDrawer
        isOpen={isVocabOpen}
        onClose={() => setIsVocabOpen(false)}
      />

      {/* 4. 语料搜索与目录切换弹窗 */}
      <ArticleSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        feedList={feedList}
        currentIndex={currentIndex}
        onSelectArticle={selectArticle}
        isAuthenticated={isAuthenticated}
        allowedArticleIndex={allowedArticleIndex}
      />

      {/* 5. 未登录体验完 1 篇后拦截与登录引导弹窗 */}
      <LoginGateModal
        isOpen={showLoginGate}
        onClose={() => setShowLoginGate(false)}
        onLogin={() => openAuthModal('otp')}
        onReplay={replayFreeArticle}
      />
    </div>
  );
}
