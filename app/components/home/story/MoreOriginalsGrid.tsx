"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, ExternalLink, Terminal, Flame, Play, Layout, Chrome } from 'lucide-react';

interface OriginalItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  emoji: string;
  href: string;
  badge: string;
  isExternal?: boolean;
  accentGradient: string;
  borderGlow: string;
}

const moreOriginals: OriginalItem[] = [
  {
    id: 'woop',
    name: 'Woop',
    tagline: '面向开发者的瑞士军刀级效率工具箱',
    description: '无需到处搜索杂乱的在线小工具，聚合编解码、格式化、JWT、加解密与转换，本地内存即时安全执行。',
    category: '开发效率',
    emoji: '🛠️',
    href: '/products/woop',
    badge: '网页即用',
    accentGradient: 'from-teal-400 to-emerald-400',
    borderGlow: 'hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]',
  },
  {
    id: 'howtosay',
    name: 'HowToSay',
    tagline: '英单连续推测挑战 · 极简打字连击背词',
    description: '采用全英文释义线索沉浸式猜词，键盘逐字母精准敲击反馈，基于国际 CEFR (A1~C2) 动态自适应晋级。',
    category: '语言挑战',
    emoji: '🔥',
    href: '/products/howtosay',
    badge: '互动小品',
    accentGradient: 'from-amber-400 to-orange-400',
    borderGlow: 'hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
  {
    id: 'player',
    name: 'AI Player',
    tagline: '双语智能伴读与毫秒级字幕播放器',
    description: '支持加载本地视频与音轨，AI 逐句拆解难句长句与俚语语法，打造沉浸式影子跟读工作台。',
    category: '音视频AI',
    emoji: '▶️',
    href: '/products/player',
    badge: '网页即用',
    accentGradient: 'from-blue-400 to-indigo-400',
    borderGlow: 'hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
  },
  {
    id: 'bona',
    name: 'Bona',
    tagline: '重塑心流的高审美数字工作台',
    description: '整合任务看板、思维卡片与深度专注时钟，极简主义设计与离线优先架构，摆脱信息过载。',
    category: '心流生产力',
    emoji: '✨',
    href: '/products/bona',
    badge: 'Mac App',
    accentGradient: 'from-violet-400 to-purple-400',
    borderGlow: 'hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
  },
  {
    id: 'focus-ai',
    name: 'Focus AI',
    tagline: 'Gemini 与网页无缝集成的侧边栏扩展',
    description: '驻留在浏览器侧边的智能助手，快速总结长文、提炼核心论点、代码释疑，随看随问。',
    category: '浏览器扩展',
    emoji: '🧩',
    href: 'https://chromewebstore.google.com/detail/focus-ai-enhancing-your-g/pfpneagkphfohdecjjcpkgjgmdkbhbea',
    badge: 'Chrome插件',
    isExternal: true,
    accentGradient: 'from-sky-400 to-cyan-400',
    borderGlow: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
  },
];

export default function MoreOriginalsGrid() {
  return (
    <section id="more-originals" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* 区域标题 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BYTEGUSH WORKSHOP · 独立手作矩阵</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              更多自研效率小品与工具
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              立足真实痛点亲手打磨的软件矩阵。坚持轻量即开、离线优先、拒绝冗余追踪骚扰。
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>全栈纯粹自研 · 持续演进</span>
          </div>
        </div>

        {/* 便当格 (Bento Grid) 卡片布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {moreOriginals.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${item.borderGlow}`}
            >
              <div>
                {/* 顶栏图标与分类 */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                        {item.name}
                      </h3>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 border border-white/10 text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-2">
                  {item.tagline}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* 底部直达链接 */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                  点击进入体验 ➔
                </span>

                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  <span>立即探索</span>
                  {item.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
