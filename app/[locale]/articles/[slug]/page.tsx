import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { fetchArticleBySlugSafe } from '@/app/data/articlesData';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlugSafe(slug);

  if (!article) {
    return {
      title: '文章不存在 - Bytegush 专栏',
    };
  }

  return {
    title: `${article.title} - 专栏 · Bytegush`,
    description: article.summary || 'Bytegush 深度架构与独立思考专栏',
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlugSafe(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 py-12 pb-32">
      {/* 顶部背景星云光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 返回专栏导航 */}
        <div className="mb-10">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>返回专栏</span>
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="border-b border-white/10 pb-10 mb-12 space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-purple-400 bg-purple-950/80 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Bytegush 深度专栏</span>
            </span>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={article.published_at || undefined}>
                {article.published_at
                  ? format(new Date(article.published_at), 'yyyy-MM-dd')
                  : '2026-10-31'}
              </time>
            </div>
            <span>·</span>
            <span>作者：Bytegush 主理人</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.2]">
            {article.title}
          </h1>

          {article.summary && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1222]/80 border border-white/10 text-slate-300 text-sm sm:text-base leading-relaxed font-normal shadow-inner">
              <span className="text-purple-400 font-bold mr-1">摘要：</span>
              {article.summary}
            </div>
          )}
        </header>

        {/* Markdown 文章正文 */}
        <div className="prose prose-invert prose-purple max-w-none text-slate-300 leading-relaxed text-sm sm:text-base font-normal space-y-6 prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2.5 prose-h3:text-lg sm:prose-h3:text-xl prose-p:leading-relaxed prose-li:text-slate-300 prose-code:text-purple-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-pre:bg-[#0D1222] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-4 prose-pre:shadow-2xl prose-blockquote:border-l-4 prose-blockquote:border-purple-500/60 prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-300 prose-blockquote:not-italic prose-hr:border-white/10">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* 底部互动与返回 */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>浏览更多专栏文章</span>
          </Link>

          <div>
            © {new Date().getFullYear()} Bytegush. All articles crafted with passion.
          </div>
        </div>

      </div>
    </article>
  );
}
