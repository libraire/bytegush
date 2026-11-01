"use client";

import React from 'react';
import Image from 'next/image';
import {
  Volume2,
  Star,
  Bot,
  CheckCircle2,
  Dumbbell,
  Play
} from 'lucide-react';

interface PhoneWrapperProps {
  children: React.ReactNode;
  accentBorderColor?: string;
  glowColor?: string;
}

export function PhoneWrapper({
  children,
  accentBorderColor = 'rgba(139, 92, 246, 0.35)',
  glowColor = 'rgba(139, 92, 246, 0.25)',
}: PhoneWrapperProps) {
  return (
    <div className="relative group/device w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] mx-auto select-none">
      {/* 底部扩散式环境光晕 */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-[56px] blur-2xl opacity-40 group-hover/device:opacity-60 transition-opacity duration-700 pointer-events-none"
        style={{ background: glowColor }}
      />

      {/* 硬件物理外壳 (CNC 阳极氧化铝质感 + 极窄边框) */}
      <div
        className="relative aspect-[9/18.8] bg-[#0C0E17] rounded-[48px] p-2.5 sm:p-3 border-[3px] sm:border-[3.5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out"
        style={{
          borderColor: accentBorderColor,
        }}
      >
        {/* 顶部灵动岛与镜头 */}
        <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 flex items-center justify-between px-3 shadow-md pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#151926]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1d2233]" />
        </div>

        {/* OLED 屏幕视口 */}
        <div className="relative w-full h-full bg-[#080A12] rounded-[38px] overflow-hidden border border-white/5 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FlappyFeedMockup() {
  return (
    <PhoneWrapper
      accentBorderColor="rgba(168, 85, 247, 0.45)"
      glowColor="rgba(168, 85, 247, 0.3)"
    >
      <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100">
        {/* 顶部应用栏 */}
        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#26263A]">
          <div className="flex items-center gap-1.5 font-bold text-purple-300">
            <Image
              src="/products/flappy/app-icon.svg"
              alt="FlappyFeed"
              width={18}
              height={18}
              className="rounded-md"
            />
            <span>FlappyFeed</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] bg-[#1E1B30] px-2 py-0.5 rounded-full text-slate-300 border border-purple-900/40 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>中级 B1-B2</span>
          </div>
        </div>

        {/* 核心短语卡片 */}
        <div className="my-auto space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-amber-400/90 font-semibold tracking-wider uppercase">
            <span>📖 The Great Gatsby</span>
            <span className="text-[10px] text-slate-500 font-mono">01 / 1490</span>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            In my younger and more vulnerable years my father gave me some advice that I’ve
            been turning over in my mind ever since.
          </p>

          {/* 正在跟读对齐的高亮卡片 */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-950/90 via-[#1A182C] to-[#161622] border border-purple-500/50 shadow-lg shadow-purple-500/10 space-y-1.5">
            <div className="flex items-start gap-1.5 text-purple-200 font-semibold text-xs leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping mt-1 flex-shrink-0" />
              <span>
                “Whenever you feel like criticizing any one,” he told me, “just remember that
                all the people in this world haven&apos;t had the advantages that you&apos;ve had.”
              </span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-[#26263A]">
              “每逢你想要批评任何人的时候，”他对我说，“你要记住，这个世界上所有人并非都具备你拥有的优势。”
            </div>
          </div>

          {/* 点词即查交互气泡浮层 */}
          <div className="bg-[#1E1B30]/95 border border-purple-400/50 rounded-xl p-2.5 shadow-xl text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-300 text-xs">criticizing</span>
              <span className="text-[10px] text-slate-400 font-mono">/ˈkrɪtɪsaɪzɪŋ/</span>
            </div>
            <div className="text-[10px] text-slate-300">v. 批评；指责；挑剔</div>
            <div className="flex gap-2 pt-0.5">
              <span className="text-[9px] text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/50 flex items-center gap-1">
                <Volume2 className="w-2.5 h-2.5" /> 发音
              </span>
              <span className="text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> 生词本
              </span>
            </div>
          </div>
        </div>

        {/* 底部播放与 AI 伴学 */}
        <div className="space-y-1.5 pt-2 border-t border-[#26263A]">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1 text-purple-300 text-[11px] font-mono">
              <span>🇺🇸</span> 美音原声 1.0x
            </span>
            <span className="bg-purple-950/70 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI 私教实时解惑
            </span>
          </div>
          <div className="text-center text-[9px] text-slate-500 font-mono">
            👆 上下滑动即刷语料 · 毫秒级跟读高亮
          </div>
        </div>
      </div>
    </PhoneWrapper>
  );
}

export function StarJarMockup() {
  return (
    <PhoneWrapper
      accentBorderColor="rgba(245, 158, 11, 0.45)"
      glowColor="rgba(245, 158, 11, 0.3)"
    >
      <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100">
        {/* 顶部生态栏 */}
        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-amber-900/30">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <span>🪐</span>
            <span>晨晨的小星球</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full text-amber-300 text-[10px] font-mono">
            <span>⭐</span>
            <span>128 颗星愿</span>
          </div>
        </div>

        {/* 核心微缩生态与习惯项 */}
        <div className="my-auto space-y-2.5 text-center">
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-amber-500/10 to-indigo-950/40 border border-amber-500/30 flex items-center justify-center p-2 shadow-inner">
            <Image
              src="/products/starjar/terrarium.png"
              alt="StarJar 微缩生态"
              width={100}
              height={100}
              className="object-contain drop-shadow-[0_10px_20px_rgba(245,158,11,0.25)] animate-pulse"
            />
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[8px] font-bold">
              Lv.3 繁茂
            </div>
          </div>

          <div className="space-y-1.5 text-left text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-slate-200 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>早起自主整理书包与桌椅</span>
              </div>
              <span className="text-amber-400 font-bold font-mono text-[10px]">+3 ⭐</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-slate-200 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>自主阅读课外经典 25 分钟</span>
              </div>
              <span className="text-amber-400 font-bold font-mono text-[10px]">+5 ⭐</span>
            </div>
          </div>

          {/* 心愿契约进度条 */}
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/40 text-left space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-amber-200 font-semibold">🎯 乐高探索号航天飞机</span>
              <span className="text-amber-400 font-mono font-bold">128 / 150</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-[85%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>
          </div>
        </div>

        {/* 底部互动提示 */}
        <div className="pt-2 border-t border-amber-900/30 text-center text-[9px] text-amber-300/80 font-mono">
          ✨ 物理拟真碰撞星辰 · 治愈微缩生态陪伴
        </div>
      </div>
    </PhoneWrapper>
  );
}

export function WorkoutMockup() {
  return (
    <PhoneWrapper
      accentBorderColor="rgba(16, 185, 129, 0.45)"
      glowColor="rgba(16, 185, 129, 0.28)"
    >
      <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100">
        {/* 顶部训练栏 */}
        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-emerald-900/40">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>今日胸背力量超集</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full text-emerald-300 text-[9px] font-mono">
            <span>第 4 / 6 组</span>
          </div>
        </div>

        {/* 动作与动力链解剖 */}
        <div className="my-auto space-y-2.5 text-left">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">高位绳索下拉</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 font-mono">
                RPE 8.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Cable Lateral Pulldown · 背阔肌主项</p>
          </div>

          {/* 肌肉动作图片与解剖受力 */}
          <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 bg-slate-900/60">
            <div className="aspect-[16/9] relative">
              <Image
                src="/products/workout/pulldown.jpg"
                alt="高位下拉肌群解剖"
                fill
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A12] via-transparent to-transparent" />
            </div>
          </div>

          {/* 肌群受力配比条 */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-emerald-500/20 space-y-1.5">
            <div className="text-[9px] text-slate-400 flex justify-between font-mono">
              <span className="text-emerald-300">背阔肌 (核心受力束) 82%</span>
              <span>肱二 12%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-400 w-[82%]" />
              <div className="h-full bg-teal-300 w-[12%]" />
              <div className="h-full bg-slate-600 w-[6%]" />
            </div>
          </div>
        </div>

        {/* 底部离心节奏与超量恢复 */}
        <div className="space-y-1.5 pt-2 border-t border-emerald-900/40">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current" /> 离心 3s - 停顿 1s - 向心 1s
            </span>
            <span className="text-slate-500">超量恢复中</span>
          </div>
          <div className="text-center text-[9px] text-slate-500 font-mono">
            🔬 1000+ 肌群受力解剖 · OHSA 动力链体态筛查
          </div>
        </div>
      </div>
    </PhoneWrapper>
  );
}
