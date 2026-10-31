import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ExternalLink,
  Star,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Github,
  Laptop,
  Coins,
  Layers,
  Share2,
} from 'lucide-react';
import { curatedProducts, workflowStacks } from '@/app/data/homeData';
import { ProductItem } from '@/app/types/home';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<ProductItem | null> {
  // 1. 尝试从后端 API 获取
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8080';
  try {
    const res = await fetch(`${apiHost}/api/v1/products/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.slug || String(data.id),
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        verdict: data.verdict,
        category: data.category_slug || 'dev',
        categoryLabel: data.category?.name || '精选软件',
        emoji: data.emoji || '🚀',
        websiteUrl: data.website_url,
        githubUrl: data.github_url,
        platforms: data.platforms || ['Web'],
        pricing: data.pricing_type || 'Freemium',
        rating: data.rating || 9.0,
        badge: data.badge,
        isOriginal: !!data.is_original,
        highlights: data.highlights || [],
      };
    }
  } catch (e) {
    // 后端未连通时 fallback
  }

  // 2. 本地静态数据 Fallback
  const found = curatedProducts.find(
    (p) => p.id === slug || p.name.toLowerCase() === slug.toLowerCase()
  );

  return found || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found - Bytegush' };

  return {
    title: `${product.name} 评测与使用指南 - Bytegush`,
    description: `${product.tagline}。${product.verdict}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = slug.toLowerCase();

  if (s === 'flappy' || s === 'flappyfeed') {
    redirect('/products/flappyfeed');
  }
  if (s === 'starjar' || s === 'star-jar') {
    redirect('/products/starjar');
  }
  if (s === 'workout') {
    redirect('/products/workout');
  }

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // 关联的工作流
  const relatedWorkflows = workflowStacks.filter((wf) =>
    wf.tools.some((t) => t.name.toLowerCase() === product.name.toLowerCase())
  );

  // 同类软件推荐 (同分类且不是自己)
  const alternativeProducts = curatedProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fafafc] selection:bg-indigo-100 selection:text-indigo-700 pb-32">
      {/* 顶部面包屑与返回导航 */}
      <div className="border-b border-gray-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/#radar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回软件雷达</span>
          </Link>

          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>首页</span>
            <span>/</span>
            <span>{product.categoryLabel || '软件库'}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {/* 产品头部主卡片 */}
        <div className="relative rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-10 shadow-sm mb-12">
          {product.isOriginal && (
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Bytegush Lab 出品</span>
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl sm:text-5xl shadow-inner flex-shrink-0">
              {product.emoji || '🚀'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {product.name}
                </h1>
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {product.badge}
                  </span>
                )}
                {product.rating && (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-50 border border-amber-100/80 text-amber-700 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating} / 10 卓越</span>
                  </div>
                )}
              </div>

              <p className="text-base sm:text-lg text-gray-600 font-medium mb-4">
                {product.tagline}
              </p>

              {/* 标签栏：平台与付费方式 */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-600 font-medium">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>{product.platforms.join(', ')}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-xs text-emerald-700 font-medium border border-emerald-100/60">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{product.pricing}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA 按钮栏 */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            >
              <span>访问官方网站</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {product.githubUrl && (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>开源代码</span>
              </a>
            )}

            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors"
            >
              <span>相关评测与教程</span>
            </Link>
          </div>
        </div>

        {/* 主体两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Bytegush 评测核心结论 (The Verdict) */}
            <div className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Bytegush 评测结论与推荐理由
                </h2>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
                {product.verdict}
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* 2. 核心亮点特性 */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  核心亮点与关键能力
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. 关联场景工作流 */}
            {relatedWorkflows.length > 0 && (
              <div className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    实战工作流搭配建议
                  </h2>
                </div>
                <div className="space-y-4">
                  {relatedWorkflows.map((wf) => (
                    <div
                      key={wf.id}
                      className="p-5 rounded-2xl border border-purple-100 bg-purple-50/30"
                    >
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {wf.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">{wf.summary}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {wf.tools.map((t) => (
                          <span
                            key={t.name}
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              t.name.toLowerCase() === product.name.toLowerCase()
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            {t.name} ({t.role})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-8">
            {/* 软件规格清单 */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                软件规格明细
              </h3>
              <dl className="divide-y divide-gray-100 text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-gray-400">所属分类</dt>
                  <dd className="font-semibold text-gray-800">
                    {product.categoryLabel || product.category}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-gray-400">支持平台</dt>
                  <dd className="font-semibold text-gray-800">
                    {product.platforms.join(', ')}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-gray-400">付费模式</dt>
                  <dd className="font-semibold text-emerald-600">
                    {product.pricing}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-gray-400">编辑评分</dt>
                  <dd className="font-semibold text-amber-600">
                    ⭐ {product.rating} / 10
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-gray-400">开发者属性</dt>
                  <dd className="font-semibold text-gray-800">
                    {product.isOriginal ? 'Bytegush 独立自研' : '第三方优质团队'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 同类推荐 */}
            {alternativeProducts.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  同类其他推荐
                </h3>
                <div className="space-y-3">
                  {alternativeProducts.map((alt) => (
                    <Link
                      key={alt.id}
                      href={`/products/${alt.id}`}
                      className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                        {alt.emoji || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {alt.name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">
                          {alt.tagline}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
