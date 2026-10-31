import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import { fetchArticlesSafe } from '../data/articlesData';
import ArticleEditButton from './ArticleEditButton';
import LatestButton from './LatestButton';

export const metadata: Metadata = {
  title: '评测专栏 - Bytegush',
  description:
    '以真实工作流为核心的数字工具品味策展、独立开发架构手记与自研产品深度复盘。',
};

export default async function ArticlesPage() {
  const articles = await fetchArticlesSafe();

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 py-12 pb-28">
      {/* 顶部背景星云光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 顶部标题区 */}
        <div className="border-b border-white/10 pb-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>BYTEGUSH ESSAYS & REVIEWS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            评测专栏
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            拒绝千篇一律的营销套话。以真实工作流为核心，沉淀挑剔的工具选品体验、独立开发架构实录与自研产品设计复盘。
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>共收录 {articles.length} 篇深度手记</span>
            </div>
            <LatestButton />
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-8">
          {articles.map((article, idx) => (
            <article
              key={article.id || idx}
              className="group relative bg-[#0D1222]/70 hover:bg-[#12182D]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-xl space-y-4"
            >
              {/* 日期与徽标 */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    {article.published_at
                      ? format(new Date(article.published_at), 'yyyy-MM-dd')
                      : '2026-10-31'}
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  深度专栏 · 0{idx + 1}
                </span>
              </div>

              {/* 文章标题 */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors leading-snug">
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              {/* 文章摘要 */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {article.summary}
              </p>

              {/* 底部操作与阅读指引 */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-purple-400 group-hover:text-purple-300 font-semibold group-hover:translate-x-0.5 transition-all"
                >
                  <span>阅读全文</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-4">
                  <ArticleEditButton articleUserId={article.user_id} slug={article.slug} />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
