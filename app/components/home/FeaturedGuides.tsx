"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Layers } from 'lucide-react';
import { GuideArticle } from '../../types/home';

interface FeaturedGuidesProps {
  guides: GuideArticle[];
}

export default function FeaturedGuides({ guides }: FeaturedGuidesProps) {
  return (
    <section className="mb-20 sm:mb-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-700 bg-paper-100 border border-paper-200 px-2.5 py-1 rounded-md shadow-tactile mb-2.5">
            <BookOpen className="w-3.5 h-3.5 text-ink-600" />
            <span>FIELD ESSAYS · 独立专栏</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ink-900 tracking-tight">
            深度评测与实战手记
          </h2>
          <p className="text-ink-600 text-xs sm:text-sm mt-1.5 max-w-xl font-sans">
            无商业赞助、不写公关套话。只有真实生产力场景下的硬核对比、避坑经验与真实工作流。
          </p>
        </div>

        <Link
          href="/articles"
          className="inline-flex items-center text-xs font-mono font-semibold text-ink-700 hover:text-ink-900 transition-colors group"
        >
          <span>查阅全部专栏文章</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {guides.map((guide, index) => {
          const typeBadgeStyles =
            guide.type === 'review'
              ? 'bg-amber-50 text-amber-900 border-amber-200/80'
              : guide.type === 'tutorial'
              ? 'bg-stone-100 text-ink-800 border-paper-300'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200/80';

          return (
            <Link
              key={guide.id}
              href="/articles"
              className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-paper-200 shadow-tactile hover:shadow-tactile-hover hover:border-paper-300 transition-all duration-200"
            >
              <div>
                {/* 顶部标签、期号与阅读时间 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-ink-400">
                      NO.0{index + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${typeBadgeStyles}`}
                    >
                      {guide.typeLabel}
                    </span>
                  </div>
                  <div className="flex items-center text-[11px] font-mono text-ink-400 gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-ink-900 group-hover:text-amber-800 transition-colors leading-snug mb-3">
                  {guide.title}
                </h3>

                {/* 摘要 */}
                <p className="text-xs sm:text-sm text-ink-600 line-clamp-3 leading-relaxed mb-6 font-sans">
                  {guide.summary}
                </p>
              </div>

              {/* 涉及的工具与阅读引导 */}
              <div>
                <div className="pt-4 border-t border-paper-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Layers className="w-3 h-3 text-ink-400 mr-0.5" />
                    {guide.featuredTools.map((tool) => (
                      <span
                        key={tool}
                        className="px-1.5 py-0.5 rounded bg-paper-100 border border-paper-200 text-[10px] font-mono text-ink-600"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-medium text-ink-700 group-hover:text-amber-800 inline-flex items-center gap-0.5 ml-2">
                    精读 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
