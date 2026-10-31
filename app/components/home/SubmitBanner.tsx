"use client";

import React from 'react';
import Link from 'next/link';
import { Send, Sparkles } from 'lucide-react';

export default function SubmitBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1C1A17] text-paper-50 p-8 sm:p-12 border border-[#33302A] shadow-tactile">
      {/* 细致的点阵装饰 */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF9F5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2B2824] text-amber-300 text-xs font-mono mb-4 border border-[#3E3A33]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AN INVITATION · 致独立软件手艺人</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif tracking-tight mb-3 text-paper-50">
          发现了真正克制且纯粹的宝藏工具？
        </h3>
        <p className="text-paper-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          或者你正在独自打磨一款「小而美」的数字作品？我们深知独立创作的不易，更敬畏每一个尊重用户注意力与隐私的手工艺品。欢迎与工坊联系，我们提供完全客观、零赞助绑架的深度体验与评测推荐。
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-paper-50 text-ink-900 font-mono font-medium text-xs hover:bg-white transition-all shadow-tactile active:translate-y-px"
          >
            <Send className="w-3.5 h-3.5 text-amber-800" />
            <span>自荐或引荐作品</span>
          </Link>
          <a
            href="mailto:bytegush@hotmail.com"
            className="text-xs font-mono text-paper-300 hover:text-paper-50 transition-colors"
          >
            直通邮箱：bytegush@hotmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
