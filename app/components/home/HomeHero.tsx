"use client";

import React from 'react';
import { Search, Sparkles, X, ShieldCheck, Compass, Zap } from 'lucide-react';

interface HomeHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const quickCategories = [
  { id: 'all', label: '全部工具' },
  { id: 'ai', label: '🧠 AI 智能' },
  { id: 'dev', label: '💻 独立开发' },
  { id: 'productivity', label: '⚡ 效率与笔记' },
  { id: 'learning', label: '📚 语言与阅读' },
  { id: 'originals', label: '💎 自研精选' },
];

export default function HomeHero({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
}: HomeHeroProps) {
  return (
    <header className="relative pt-8 pb-14 md:pt-12 md:pb-20 text-center">
      {/* 顶部手作标签 */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-paper-100 border border-paper-300/80 text-ink-700 text-xs font-mono shadow-tactile mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        <span>EDITION 2024 · BYTEGUSH 软件手艺人工坊</span>
      </div>

      {/* 杂志感主标题 */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-ink-900 mb-6 max-w-4xl mx-auto leading-[1.25] tracking-tight">
        器物之美
        <span className="text-amber-800 font-serif italic mx-2 sm:mx-3 relative inline-block">
          自当纯粹
          <span className="absolute left-0 bottom-1 w-full h-[3px] bg-amber-400/40 -z-10 rounded-full" />
        </span>
      </h1>

      {/* 副标题 */}
      <p className="text-sm sm:text-base text-ink-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-sans">
        重回小而美的软件黄金时代。拒绝算法信息茧房与臃肿套路，
        我们挖掘经受住时间检验的克制好物，打磨纯粹趁手的手作工具。
      </p>

      {/* 实体质感检索框 */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="relative flex items-center bg-white rounded-xl border border-paper-300 shadow-tactile hover:border-ink-500 focus-within:border-ink-700 focus-within:ring-2 focus-within:ring-paper-300 transition-all p-1.5 sm:p-2">
            <Search className="w-4 h-4 text-ink-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索手作软件、客观评测、极客场景（如：HowToSay、本地优先、离线...）"
              className="w-full px-3 py-1.5 text-xs sm:text-sm text-ink-900 placeholder:text-ink-400 bg-transparent focus:outline-none font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded text-ink-400 hover:text-ink-700 hover:bg-paper-100 transition-colors mr-1"
                aria-label="清空搜索"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-ink-400 bg-paper-100 border border-paper-200 px-1.5 py-0.5 rounded mr-1">
                按 / 聚焦
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 快速筛选分类 - 实体索引标签感 */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        {quickCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 active:translate-y-px ${
                isActive
                  ? 'bg-ink-900 text-paper-50 shadow-tactile font-medium'
                  : 'bg-white/90 text-ink-700 hover:bg-white border border-paper-200 hover:border-paper-300 shadow-tactile'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 极简工坊四重承诺 */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-ink-500 border-t border-paper-200/90 pt-8 max-w-3xl mx-auto font-mono">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>零弹窗 · 无追踪</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>离线优先 · 极速冷启</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-ink-700" />
          <span>深度实测 · 零赞助恰饭</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>独立手作 · 匠心长青</span>
        </div>
      </div>
    </header>
  );
}
