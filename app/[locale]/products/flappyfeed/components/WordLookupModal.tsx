'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Star, Check, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { WordDefinition, SavedWord } from '../lib/types';

interface Props {
  word: string;
  definition?: WordDefinition | null;
  contextSentence?: string;
  sourceTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onAskAI?: (word: string) => void;
}

export default function WordLookupModal({
  word,
  definition,
  contextSentence,
  sourceTitle,
  isOpen,
  onClose,
  onAskAI,
}: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentDef, setCurrentDef] = useState<WordDefinition | null>(definition || null);
  const [isLoading, setIsLoading] = useState(false);

  const cleanWord = (word || '').replace(/[^a-zA-Z'-]/g, '');

  // Sync or fetch definition
  useEffect(() => {
    if (!isOpen || !cleanWord) return;

    // Check saved state in local storage
    try {
      const stored = localStorage.getItem('flappy_saved_words');
      if (stored) {
        const list: SavedWord[] = JSON.parse(stored);
        setIsSaved(list.some((w) => w.word.toLowerCase() === cleanWord.toLowerCase()));
      } else {
        setIsSaved(false);
      }
    } catch {
      setIsSaved(false);
    }

    // If definition already provided with translation, use it directly
    if (definition && definition.translation && definition.translation !== '暂无释义') {
      setCurrentDef(definition);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch online definition from /api/v1/dict/lookup
    let isCancelled = false;
    setIsLoading(true);

    fetch(`/api/v1/dict/lookup?word=${encodeURIComponent(cleanWord)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Lookup failed');
        return res.json();
      })
      .then((data: WordDefinition) => {
        if (!isCancelled && data) {
          setCurrentDef({
            word: cleanWord,
            phonetic: data.phonetic || definition?.phonetic || '',
            part_of_speech: data.part_of_speech || definition?.part_of_speech || '',
            translation: data.translation || definition?.translation || '暂无释义',
            definition: data.definition || definition?.definition || '',
            example: data.example || definition?.example || '',
            cn_example: data.cn_example || definition?.cn_example || '',
            image_url: data.image_url || definition?.image_url || null,
          });
        }
      })
      .catch((err) => {
        console.warn('Word lookup fallback error:', err);
        if (!isCancelled) {
          setCurrentDef(
            definition || {
              word: cleanWord,
              translation: '暂无中文释义',
              definition: `English word: ${cleanWord}`,
            }
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, cleanWord, definition]);

  if (!isOpen || !word) return null;

  const playPronunciation = () => {
    if (typeof window === 'undefined') return;
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const toggleSaveWord = () => {
    try {
      const stored = localStorage.getItem('flappy_saved_words');
      let list: SavedWord[] = stored ? JSON.parse(stored) : [];

      if (isSaved) {
        list = list.filter((w) => w.word.toLowerCase() !== cleanWord.toLowerCase());
        setIsSaved(false);
      } else {
        const newWord: SavedWord = {
          word: cleanWord,
          phonetic: currentDef?.phonetic || definition?.phonetic,
          translation: currentDef?.translation || definition?.translation || '暂无释义',
          contextSentence,
          sourceTitle,
          addedAt: Date.now(),
        };
        list = [newWord, ...list];
        setIsSaved(true);
      }
      localStorage.setItem('flappy_saved_words', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to update local storage:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-2xl bg-[#141829] border border-purple-500/30 p-5 shadow-2xl shadow-purple-950/70 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 单词头部 */}
        <div className="space-y-1 pr-8">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-xl font-extrabold tracking-tight text-white capitalize">
              {cleanWord}
            </h3>
            {currentDef?.part_of_speech && (
              <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded">
                {currentDef.part_of_speech}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {currentDef?.phonetic && <span>{currentDef.phonetic}</span>}
            <button
              onClick={playPronunciation}
              disabled={isPlayingAudio}
              className="flex items-center gap-1 text-purple-300 hover:text-purple-200 bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-800/40 transition-colors active:scale-95"
              title="播放单词发音"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-purple-400' : ''}`} />
              <span className="text-[11px]">朗读</span>
            </button>
          </div>
        </div>

        {/* 释义与翻译 */}
        <div className="my-4 space-y-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <div className="text-[11px] text-slate-400 font-medium mb-1">简明中文释义</div>
            <div className="text-sm font-semibold text-purple-200">
              {isLoading ? (
                <span className="text-purple-300/80 animate-pulse flex items-center gap-1.5 font-normal text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>正在查询词典释义...</span>
                </span>
              ) : (
                currentDef?.translation || '暂无中文释义'
              )}
            </div>
          </div>

          {currentDef?.definition && (
            <div>
              <div className="text-[11px] text-slate-400 font-medium mb-1">英英释义</div>
              <div className="text-slate-300 leading-relaxed italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                {currentDef.definition}
              </div>
            </div>
          )}

          {currentDef?.example && (
            <div>
              <div className="text-[11px] text-slate-400 font-medium mb-1">典型例句</div>
              <div className="text-slate-300 leading-relaxed font-normal">
                “{currentDef.example}”
              </div>
            </div>
          )}
        </div>

        {/* 底部快捷操作 */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={toggleSaveWord}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
            <span>{isSaved ? '已收藏生词' : '收藏到生词本'}</span>
          </button>

          {onAskAI && (
            <button
              onClick={() => {
                onClose();
                onAskAI(cleanWord);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              title="呼出 AI 私教深入解析该词"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI 深度剖析</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
