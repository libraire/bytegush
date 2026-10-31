"use client";

import React from 'react';
import { Gamepad2, Camera, ShieldCheck, Cpu, Layers, Sparkles, Play, ExternalLink, FlaskConical } from 'lucide-react';

export default function PlaygroundSection() {
  return (
    <section id="playground" className="py-20 sm:py-28 lg:py-36 relative">
      <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* 区域标题栏 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-mono uppercase tracking-wider text-fuchsia-300 mb-3">
              <FlaskConical className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>BYTEGUSH LABS · 试验场</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              极客小品与试验场{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-400">
                The Playground
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              好玩、硬核、充满探索欲的原型探索。在浏览器里探索端侧视觉 AI、实时状态机对战与极客交互。
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              云端对战与端侧 AI 在线
            </span>
          </div>
        </div>

        {/* 试验场双子星卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          
          {/* 卡片 1: 干瞪眼扑克 */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] transition-all duration-300">
            <div className="space-y-6">
              
              {/* 顶栏信息 */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                    🃏
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        干瞪眼扑克
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        对战小品
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="text-amber-400">poker.bytegush.com</span>
                      <span>·</span>
                      <span>免下载秒开即玩</span>
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>多人在线</span>
                </span>
              </div>

              {/* 介绍文案 */}
              <p className="text-sm text-slate-300 leading-relaxed">
                极具对抗与局势逆转的经典地方扑克玩法。牌型压制，步步为营，单张也可截胡翻盘。无需安装下载任何客户端，网页秒开即玩。
              </p>

              {/* 核心亮点 */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="text-amber-400 font-bold">⚡</span>
                  <span>免下载网页秒开</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="text-amber-400 font-bold">🃏</span>
                  <span>经典地道规则</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="text-amber-400 font-bold">🌙</span>
                  <span>暗黑极简沉浸牌局</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="text-amber-400 font-bold">🛡️</span>
                  <span>纯净零广告干扰</span>
                </div>
              </div>
            </div>

            {/* 底部 CTA 与备用入口 */}
            <div className="pt-6 sm:pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href="https://poker.bytegush.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>立即开局进入扑克对战</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </a>

              <a
                href="https://poker.meetlovely.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                备用通道 ↗
              </a>
            </div>
          </div>

          {/* 卡片 2: Motion 体感手势 */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.12)] transition-all duration-300">
            <div className="space-y-6">
              
              {/* 顶栏信息 */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                    🦾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Motion 体感手势
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        视觉 AI 动捕
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="text-cyan-400">motion.bytegush.com</span>
                      <span>·</span>
                      <span>摄像头实时动捕</span>
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>端侧骨骼推断</span>
                </span>
              </div>

              {/* 介绍文案 */}
              <p className="text-sm text-slate-300 leading-relaxed">
                基于端侧轻量视觉 AI 骨骼姿态识别与摄像头实时动作捕捉。无需佩戴手环或任何外设硬件，单台笔记本或手机摄像头即可畅玩动作体感互动。
              </p>

              {/* 核心亮点 */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>端侧推理 · 零图像上传</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>免穿戴 · 普通镜头即可</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>60FPS 实时骨骼姿态追踪</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>极客体感交互原型</span>
                </div>
              </div>

              {/* 摄像头权限提醒 */}
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-[11px] text-cyan-200/90 leading-tight flex items-center gap-2">
                <span>💡</span>
                <span>画面全在浏览器端侧内存实时分析，不经过任何服务器中转，隐私绝对安全。</span>
              </div>
            </div>

            {/* 底部 CTA 与备用入口 */}
            <div className="pt-6 sm:pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href="https://motion.bytegush.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>开启摄像头进入体感体验</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </a>

              <a
                href="https://motion.meetlovely.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                备用通道 ↗
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
