"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Star, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../../types/home';

interface BytegushOriginalsProps {
  products: ProductItem[];
}

export default function BytegushOriginals({ products }: BytegushOriginalsProps) {
  return (
    <section className="mb-20 sm:mb-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-800 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-md shadow-tactile mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>BYTEGUSH WORKSHOP · 自研手作</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ink-900 tracking-tight">
            自研旗舰与独立工具
          </h2>
          <p className="text-ink-600 text-xs sm:text-sm mt-1.5 max-w-xl font-sans">
            我们在真实痛点中亲手打磨的软件产品。秉持「小而美」的克制美学，离线优先、拒绝追踪，绝无冗余骚扰。
          </p>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center text-xs font-mono font-semibold text-ink-700 hover:text-ink-900 transition-colors group"
        >
          <span>阅读工坊手记与设计哲学</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {products.map((product) => {
          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-paper-200 shadow-tactile hover:shadow-tactile-hover hover:border-paper-300 transition-all duration-200"
            >
              {/* 顶部自研标记与评分 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-paper-50 border border-paper-200 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform duration-200">
                      {product.emoji || '🚀'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-serif font-bold text-ink-900 group-hover:text-amber-800 transition-colors">
                          {product.name}
                        </h3>
                        {product.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-400 font-mono">
                        {product.categoryLabel}
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

                {/* 标语 */}
                <h4 className="text-xs sm:text-sm font-semibold text-ink-800 mb-3">
                  {product.tagline}
                </h4>

                {/* 手作者便签 (Creator's Note) */}
                <div className="text-xs text-ink-600 leading-relaxed mb-4 bg-paper-50/80 p-3 rounded-xl border border-dashed border-paper-300 font-sans">
                  <div className="font-mono text-[10px] uppercase text-amber-800 mb-1">
                    手作初衷 / Note
                  </div>
                  <p className="italic">“{product.verdict}”</p>
                </div>

                {/* 核心亮点 */}
                {product.highlights && product.highlights.length > 0 && (
                  <ul className="space-y-1.5 mb-6">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-xs text-ink-600 gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 底部平台与操作按钮 */}
              <div className="pt-4 border-t border-paper-200/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {product.platforms.map((plat) => (
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
                    详情
                  </Link>
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 text-paper-50 text-xs font-mono font-medium shadow-tactile transition-all active:translate-y-px"
                  >
                    <span>体验</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
