'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Check, ChevronRight, Volume2, Sparkles, Headphones, Lock } from 'lucide-react';
import { FeedItem } from '../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  feedList: FeedItem[];
  currentIndex: number;
  onSelectArticle: (index: number) => void;
  isAuthenticated?: boolean;
  allowedArticleIndex?: number;
}

type AudioFilterType = 'all' | 'native_audio' | 'tts';

export default function ArticleSearchModal({
  isOpen,
  onClose,
  feedList,
  currentIndex,
  onSelectArticle,
  isAuthenticated = false,
  allowedArticleIndex = 0,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [audioFilter, setAudioFilter] = useState<AudioFilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setAudioFilter('all');
      setSelectedCategory('all');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Count items
  const nativeAudioCount = feedList.filter((item) => item.has_audio).length;
  const ttsCount = feedList.length - nativeAudioCount;

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(feedList.map((item) => item.category).filter(Boolean)))];

  const filtered = feedList
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      // 1. Audio mode filter
      if (audioFilter === 'native_audio' && !item.has_audio) return false;
      if (audioFilter === 'tts' && item.has_audio) return false;

      // 2. Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // 3. Search term filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSource = item.source?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchHasAudio = (q.includes('原声') || q.includes('音频') || q.includes('播客') || q.includes('podcast')) && item.has_audio;
      const matchText = item.sentences?.some((s) => s.text.toLowerCase().includes(q) || s.translation.includes(q));

      return matchTitle || matchSource || matchCategory || matchHasAudio || matchText;
    });

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#121626] border border-purple-500/30 shadow-2xl shadow-purple-950/80 overflow-hidden flex flex-col max-h-[85vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部搜索栏 */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#151B30]">
          <Search className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索文章标题、作者、或英文关键词..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 核心音源筛选栏：原声列表 / 全部 / 文本朗读 */}
        <div className="px-4 py-2 bg-[#0D1120] border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-mono text-[11px] mr-1">音源：</span>
            <button
              onClick={() => setAudioFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                audioFilter === 'all'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              全部 ({feedList.length})
            </button>

            <button
              onClick={() => setAudioFilter('native_audio')}
              className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                audioFilter === 'native_audio'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-950/40'
                  : 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60 border border-emerald-800/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>🎙️ 真实原声列表 ({nativeAudioCount})</span>
            </button>

            <button
              onClick={() => setAudioFilter('tts')}
              className={`px-3 py-1 rounded-xl transition-all ${
                audioFilter === 'tts'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              🤖 文本朗读 ({ttsCount})
            </button>
          </div>
        </div>

        {/* 分类快捷标签 */}
        <div className="px-4 py-2 bg-[#0F1424] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? '全部类目' : cat}
            </button>
          ))}
        </div>

        {/* 结果列表 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs sm:text-sm">
              <BookOpen className="w-8 h-8 text-slate-600 mb-1" />
              <div>未找到匹配的文章</div>
              <div className="text-[11px] text-slate-500">尝试切换上方“全部 / 真实原声”或清除关键词</div>
            </div>
          ) : (
            filtered.map(({ item, originalIndex }) => {
              const isCurrent = currentIndex === originalIndex;
              return (
                <div
                  key={item.id || originalIndex}
                  onClick={() => {
                    onSelectArticle(originalIndex);
                    onClose();
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-purple-950/80 border-purple-500/70 shadow-lg shadow-purple-950/50'
                      : 'bg-[#151A2E]/70 border-slate-800 hover:bg-[#1A2038] hover:border-purple-500/40'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0 text-left">
                    {/* 徽章栏 */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.has_audio ? (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>🎙️ 真实原声</span>
                          {item.total_duration_ms && (
                            <span className="text-emerald-400/80">({formatDuration(item.total_duration_ms)})</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/50">
                          🤖 文本伴读
                        </span>
                      )}

                      <span className="text-[11px] font-mono text-purple-300 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                        {item.category || '精选'}
                      </span>

                      <span className="text-xs text-slate-400 truncate">
                        {item.source}
                      </span>

                      <span className="text-[10px] font-mono text-slate-500">
                        {item.sentences?.length} 句
                      </span>
                    </div>

                    {/* 文章标题 */}
                    <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                      {item.title}
                    </h4>

                    {/* 首句预览 */}
                    {item.sentences?.[0] && (
                      <p className="text-xs text-slate-400 line-clamp-1 italic font-sans">
                        “{item.sentences[0].text}”
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCurrent ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>正在阅读</span>
                      </span>
                    ) : !isAuthenticated && originalIndex !== allowedArticleIndex ? (
                      <span className="text-[11px] font-mono text-purple-300 font-medium flex items-center gap-1 bg-purple-950/60 border border-purple-800/50 px-2 py-1 rounded-lg">
                        <Lock className="w-3 h-3 text-purple-400" />
                        <span>登录解锁</span>
                      </span>
                    ) : (
                      <button className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-600/30 text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 底部统计 */}
        <div className="p-3 border-t border-slate-800 bg-[#0F1424] text-xs text-slate-400 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span>找到 {filtered.length} 篇语料</span>
            {audioFilter === 'native_audio' && (
              <span className="text-emerald-400 font-medium">当前已锁定真实原声播客</span>
            )}
          </div>
          <span>按 ESC 关闭</span>
        </div>
      </div>
    </div>
  );
}
