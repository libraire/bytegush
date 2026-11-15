'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, X, Volume2, Trash2, Search, Star, ExternalLink } from 'lucide-react';
import { SavedWord } from '../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: string) => void;
}

export default function VocabularyDrawer({ isOpen, onClose, onSelectWord }: Props) {
  const [words, setWords] = useState<SavedWord[]>([]);
  const [search, setSearch] = useState('');

  const loadWords = () => {
    try {
      const stored = localStorage.getItem('flappy_saved_words');
      if (stored) {
        setWords(JSON.parse(stored));
      } else {
        setWords([]);
      }
    } catch {
      setWords([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadWords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const removeWord = (wordToRemove: string) => {
    try {
      const updated = words.filter((w) => w.word.toLowerCase() !== wordToRemove.toLowerCase());
      setWords(updated);
      localStorage.setItem('flappy_saved_words', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const playWord = (word: string) => {
    if (typeof window === 'undefined') return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const filtered = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      (w.translation && w.translation.includes(search))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full sm:w-[420px] h-full bg-[#0D111F] border-l border-purple-500/30 flex flex-col text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#12182B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>生词本 (Vocabulary Notebook)</span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                  {words.length} 词
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">随时复习、点读与巩固生词记忆</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="p-3 bg-[#0F1424] border-b border-slate-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索收藏的生词或释义..."
              className="w-full bg-[#080B14] border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* 生词列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-2 text-slate-500 text-xs">
              <BookOpen className="w-8 h-8 text-slate-600 mb-1" />
              <div>{search ? '未找到匹配的生词' : '生词本空空如也'}</div>
              <div className="text-[11px] text-slate-600">在刷流时点击文章中的任意单词即可加入生词本</div>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.word}
                className="p-3 rounded-xl bg-[#141A2E] border border-slate-800 hover:border-purple-500/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-purple-200 capitalize">
                      {item.word}
                    </span>
                    {item.phonetic && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.phonetic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playWord(item.word)}
                      className="p-1 rounded text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="朗读"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeWord(item.word)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="移除生词"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {item.translation}
                </div>

                {item.contextSentence && (
                  <div className="text-[11px] text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-800/80">
                    “{item.contextSentence}”
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
