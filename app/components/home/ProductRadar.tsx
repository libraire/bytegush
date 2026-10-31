"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, Star, Compass, Filter, Sparkles, Github } from 'lucide-react';
import { ProductItem } from '../../types/home';

interface ProductRadarProps {
  products: ProductItem[];
  searchQuery: string;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { id: 'all', label: '全部产品', emoji: '🌟' },
  { id: 'ai', label: 'AI 智能', emoji: '🧠' },
  { id: 'dev', label: '独立开发与部署', emoji: '💻' },
  { id: 'productivity', label: '效率与知识库', emoji: '⚡' },
  { id: 'learning', label: '语言与阅读', emoji: '📚' },
  { id: 'design', label: '设计与 UI', emoji: '🎨' },
];

export default function ProductRadar({
  products,
  searchQuery,
  selectedCategory,
  onCategorySelect,
}: ProductRadarProps) {
  const [pricingFilter, setPricingFilter] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. 分类筛选
      if (selectedCategory === 'originals') {
        if (!item.isOriginal) return false;
      } else if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 2. 收费模式筛选
      if (pricingFilter !== 'all') {
        if (pricingFilter === 'free' && item.pricing !== 'Free') return false;
        if (pricingFilter === 'opensource' && item.pricing !== 'Open Source') return false;
        if (pricingFilter === 'freemium' && item.pricing !== 'Freemium') return false;
      }

      // 3. 搜索匹配
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchTagline = item.tagline.toLowerCase().includes(q);
        const matchVerdict = item.verdict.toLowerCase().includes(q);
        const matchCategory = item.categoryLabel?.toLowerCase().includes(q);
        const matchPlatforms = item.platforms.some((p) => p.toLowerCase().includes(q));
        return matchName || matchTagline || matchVerdict || matchCategory || matchPlatforms;
      }

      return true;
    });
  }, [products, selectedCategory, pricingFilter, searchQuery]);

  return (
    <section className="mb-20 sm:mb-28" id="radar">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-700 bg-paper-100 border border-paper-200 px-2.5 py-1 rounded-md shadow-tactile mb-2.5">
            <Compass className="w-3.5 h-3.5 text-ink-600" />
            <span>CURATED RADAR · 软件索引库</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ink-900 tracking-tight">
            精选数字工具雷达
          </h2>
          <p className="text-ink-600 text-xs sm:text-sm mt-1.5 max-w-xl font-sans">
            经受住时间检验的克制工具，附带我们实际生产力体验后的客观推荐理由。
          </p>
        </div>

        {/* 收费筛选微调 - 实体开关感 */}
        <div className="flex items-center gap-1 bg-paper-100 p-1 rounded-xl self-start md:self-auto border border-paper-200 shadow-tactile">
          {[
            { id: 'all', label: '全部' },
            { id: 'free', label: '完全免费' },
            { id: 'freemium', label: '免费增值' },
            { id: 'opensource', label: '开源' },
          ].map((pf) => (
            <button
              key={pf.id}
              onClick={() => setPricingFilter(pf.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-150 ${
                pricingFilter === pf.id
                  ? 'bg-white text-ink-900 shadow-tactile font-semibold'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {pf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 分类切换器 - 索引卡抽屉标签 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-150 active:translate-y-px ${
                isActive
                  ? 'bg-ink-900 text-paper-50 shadow-tactile font-medium'
                  : 'bg-white text-ink-700 hover:bg-paper-50 border border-paper-200 hover:border-paper-300 shadow-tactile'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 结果计数提示 */}
      <div className="flex items-center justify-between text-xs font-mono text-ink-400 mb-6 px-1">
        <span>[ 索引收录: {filteredProducts.length} 款软件 ]</span>
        {searchQuery && (
          <span>
            检索匹配：“<span className="text-amber-800 font-semibold">{searchQuery}</span>”
          </span>
        )}
      </div>

      {/* 软件卡片列表 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-paper-200 shadow-tactile hover:shadow-tactile-hover hover:border-paper-300 transition-all duration-200"
              >
                <div>
                  {/* 头部图标与标签 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-paper-50 border border-paper-200 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform duration-200">
                        {product.emoji || '📦'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-serif font-bold text-ink-900 group-hover:text-amber-800 transition-colors">
                            {product.name}
                          </h3>
                          {product.isOriginal && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                              自研
                            </span>
                          )}
                          {product.badge && !product.isOriginal && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-600 bg-paper-100 border border-paper-200">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-ink-400">
                          {product.categoryLabel || product.category}
                        </span>
                      </div>
                    </div>

                    {product.rating && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-paper-100 border border-paper-200 text-ink-700 text-xs font-mono font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* 一句话定位 */}
                  <p className="text-xs font-semibold text-ink-800 mb-2">
                    {product.tagline}
                  </p>

                  {/* 核心评测理由 (Verdict) */}
                  <div className="text-xs text-ink-600 leading-relaxed mb-4 bg-paper-50/70 p-2.5 rounded-xl border border-dashed border-paper-300 font-sans">
                    <span className="font-semibold text-ink-800">为什么推荐：</span>
                    {product.verdict}
                  </div>
                </div>

                {/* 底部平台与链接 */}
                <div className="pt-3 border-t border-paper-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {product.platforms.slice(0, 2).map((plat) => (
                      <span
                        key={plat}
                        className="px-1.5 py-0.5 rounded bg-paper-100 text-[10px] font-mono text-ink-600 border border-paper-200"
                      >
                        {plat}
                      </span>
                    ))}
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-mono text-emerald-700 border border-emerald-200/60">
                      {product.pricing}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs font-mono text-ink-500 hover:text-ink-900 transition-colors"
                    >
                      评测
                    </Link>
                    <span className="text-paper-300">|</span>
                    {product.githubUrl && (
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-400 hover:text-ink-800 p-0.5"
                        aria-label="GitHub 仓库"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={product.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-medium text-ink-800 hover:text-amber-800 transition-colors"
                    >
                      <span>官网</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-paper-200 shadow-tactile">
          <p className="text-ink-500 text-xs font-mono mb-3">未找到匹配的软件记录</p>
          <button
            onClick={() => {
              onCategorySelect('all');
              setPricingFilter('all');
            }}
            className="text-xs font-mono font-semibold text-amber-800 hover:underline"
          >
            重置所有筛选条件
          </button>
        </div>
      )}
    </section>
  );
}
