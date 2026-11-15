"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {
  Sparkles,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  Volume2,
  Bot,
  Activity,
  Flame,
  ArrowRight,
  BookOpen,
  Layers,
  Dumbbell
} from 'lucide-react';

interface SlideConfig {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  tag: string;
  headlinePrefix: string;
  headlineGradient: string;
  description: string;
  stats: { label: string; value: string }[];
  primaryCta: { label: string; href: string; icon: string; isDownload?: boolean };
  secondaryCta?: { label: string; href: string; isExternal?: boolean; isInternal?: boolean };
  badges: string[];
  themeGlow: string;
  accentColor: string;
  dockColor: string;
}

const slides: SlideConfig[] = [
  {
    id: 'flappyfeed',
    name: 'FlappyFeed',
    shortName: 'FlappyFeed',
    emoji: '🕊️',
    tag: 'TikTok 风格短语流 · 随时随地碎片化学英语',
    headlinePrefix: '像刷短视频一样',
    headlineGradient: '沉浸式刷英语',
    description:
      '告别枯燥死板背单词。竖滑手势秒开即刷，原声音频与文本毫秒级精准对齐，点词即查，上下文 AI 私教随时随地答疑解惑。',
    stats: [
      { label: '经典文学名篇', value: '1490+' },
      { label: '端侧零延迟 TTS', value: '0ms' },
      { label: 'CEFR 全层级过滤', value: 'A1~C2' },
    ],
    primaryCta: {
      label: '免费下载 Android 安装包',
      href: 'https://flappy.bytegush.com/release/app-release.apk',
      icon: 'download',
      isDownload: true,
    },
    secondaryCta: {
      label: '🕊️ 体验Web版',
      href: '/products/flappyfeed/play',
      isInternal: true,
    },
    badges: ['支持 Android 8.0+', '纯净零广告', '离线随播伴读'],
    themeGlow: 'from-violet-950/80 via-purple-950/40 to-[#0F0F17]',
    accentColor: 'border-purple-500/40 text-purple-300',
    dockColor: 'hover:border-purple-400 text-purple-400 bg-purple-500/10',
  },
  {
    id: 'starjar',
    name: 'StarJar 星愿瓶',
    shortName: 'StarJar',
    emoji: '⭐',
    tag: '亲子微习惯打卡 · 激发内在自驱力的星愿魔法',
    headlinePrefix: '把每次自律与微小坚持',
    headlineGradient: '点亮为瓶中的璀璨星河',
    description:
      '让成长看得见、摸得着。通过日常微习惯打卡积攒发光的物理碰撞星辰，兑换家庭心愿契约，灌溉专属微缩生态小星球。用治愈系正向反馈告别催促与焦虑。',
    stats: [
      { label: '物理拟真碰撞', value: '3D星愿瓶' },
      { label: '微缩生态灌溉', value: '小星球' },
      { label: '双向正向激励', value: '心愿契约' },
    ],
    primaryCta: {
      label: '免费下载 Android 安装包',
      href: 'https://starjar.bytegush.com/release/app-release.apk',
      icon: 'download',
    },
    badges: ['告别说教式养育', '自驱力正向循环', '治愈美学无广告'],
    themeGlow: 'from-amber-950/70 via-yellow-950/30 to-[#0A0D1A]',
    accentColor: 'border-amber-500/40 text-amber-300',
    dockColor: 'hover:border-amber-400 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'workout',
    name: '造己健身 (Workout)',
    shortName: '造己健身',
    emoji: '⚡',
    tag: '硬核科学力量 · 纯粹无干扰的三维肌群解剖手记',
    headlinePrefix: '解剖每一次受力发力',
    headlineGradient: '重塑清晰受控的肌体力量',
    description:
      '拒绝臃肿社交推销与杂乱打卡。内置千组肌群解剖动作库、OHSA 动力链体态筛查、精准离心向心节奏与超量恢复监控，每一次训练都数据分明、硬核高效。',
    stats: [
      { label: '肌群受力解剖动作', value: '1000+' },
      { label: '动力链体态筛查', value: 'OHSA' },
      { label: '疲劳与超量恢复', value: '实时 RPE' },
    ],
    primaryCta: {
      label: '📱 微信扫码体验小程序',
      href: '#workout-preview',
      icon: 'activity',
    },
    badges: ['纯粹无广告', '拒绝私教推销', '科学解剖与动力学导向'],
    themeGlow: 'from-emerald-950/70 via-teal-950/30 to-[#0A0E17]',
    accentColor: 'border-emerald-500/40 text-emerald-300',
    dockColor: 'hover:border-emerald-400 text-emerald-400 bg-emerald-500/10',
  },
];

export default function ProductShowcaseReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartY = useRef(0);
  const reelRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      goToSlide(activeIndex + 1);
    } else {
      // 在最后一个 slide 向下滑动时，平滑滚动至下方内容区
      const contentEl = document.getElementById('workshop-content');
      if (contentEl) {
        contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1);
    }
  }, [activeIndex, goToSlide]);

  // 滚轮事件监听 (带防抖与平滑切换)
  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // 仅在 reel 区域顶端且用户有明显垂直滚动意图时响应
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top >= -50 && rect.bottom <= window.innerHeight + 100;

      if (!isInViewport) return;

      if (Math.abs(e.deltaY) < 25) return;

      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        // 向下滚动
        if (activeIndex < slides.length - 1) {
          e.preventDefault();
          setIsTransitioning(true);
          goToSlide(activeIndex + 1);
          wheelTimeout = setTimeout(() => setIsTransitioning(false), 600);
        }
      } else if (e.deltaY < 0) {
        // 向上滚动
        if (activeIndex > 0 && window.scrollY <= 10) {
          e.preventDefault();
          setIsTransitioning(true);
          goToSlide(activeIndex - 1);
          wheelTimeout = setTimeout(() => setIsTransitioning(false), 600);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [activeIndex, isTransitioning, goToSlide]);

  // 触摸手势事件
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diffY) > 50) {
      if (diffY < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const currentSlide = slides[activeIndex];

  return (
    <section
      id="showcase-reel"
      ref={reelRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#0A0D18] text-slate-100 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 动态背景光晕特效 */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentSlide.themeGlow} transition-colors duration-700 pointer-events-none`}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-40 bg-purple-600/30 transition-all duration-700" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-30 bg-indigo-600/30 transition-all duration-700" />

      {/* 顶部微型广播条 */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md py-2 px-4 text-xs font-mono text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">BYTEGUSH STUDIO</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 hidden sm:inline">独立软件手作矩阵 · 官方发布与流量总站</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hidden md:inline font-mono">上下滑动切换产品大屏 (0{activeIndex + 1}/03)</span>
            <button
              onClick={() => {
                const contentEl = document.getElementById('workshop-content');
                if (contentEl) contentEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>查看教程与评测</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主展示区 (Main Slide Stage) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* 左侧：文案与核心引导 */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-500 transform">
            {/* 震撼主标题 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18]">
              {currentSlide.headlinePrefix}
              <br />
              <span
                className={`bg-clip-text text-transparent ${
                  activeIndex === 0
                    ? 'bg-gradient-to-r from-purple-400 via-violet-200 to-indigo-300'
                    : activeIndex === 1
                    ? 'bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400'
                    : 'bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-300'
                }`}
              >
                {currentSlide.headlineGradient}
              </span>
            </h1>

            {/* 详细痛点与定位描述 */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentSlide.description}
            </p>

            {/* 核心数据徽章组 */}
            <div className="pt-1 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
              {currentSlide.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md"
                >
                  <span
                    className={`font-bold text-sm sm:text-base ${
                      activeIndex === 0
                        ? 'text-purple-300'
                        : activeIndex === 1
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA 按钮组 (主转化 + 免安装 Demo / 手记) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={currentSlide.primaryCta.href}
                target={currentSlide.primaryCta.isDownload ? '_blank' : undefined}
                rel="noreferrer"
                className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 text-white ${
                  activeIndex === 0
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-purple-600/30'
                    : activeIndex === 1
                    ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                }`}
              >
                {currentSlide.primaryCta.isDownload ? (
                  <Download className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>{currentSlide.primaryCta.label}</span>
              </a>

              {currentSlide.secondaryCta && (
                currentSlide.secondaryCta.isInternal ? (
                  <Link
                    href={currentSlide.secondaryCta.href}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 hover:from-purple-900/90 hover:to-indigo-900/90 text-purple-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/50"
                  >
                    <span>{currentSlide.secondaryCta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
                  </Link>
                ) : (
                  <a
                    href={currentSlide.secondaryCta.href}
                    target={currentSlide.secondaryCta.isExternal ? '_blank' : undefined}
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{currentSlide.secondaryCta.label}</span>
                    {currentSlide.secondaryCta.isExternal && (
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </a>
                )
              )}
            </div>

            {/* 特性打勾提示 */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              {currentSlide.badges.map((b, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 右侧：高度逼真的沉浸式产品仿真 Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            {/* === SLIDE 1: FLAPPYFEED PHONE MOCKUP === */}
            {activeIndex === 0 && (
              <div className="relative w-[300px] sm:w-[320px] aspect-[9/18.5] bg-[#0F0F17] rounded-[44px] p-3 border-4 border-[#2E2A48] shadow-2xl shadow-purple-950/80 transition-all duration-500">
                {/* 手机听筒/刘海 */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                {/* 屏幕内真实 UI 模拟 */}
                <div className="w-full h-full bg-[#0F0F17] rounded-[34px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 select-none border border-[#26263A]">
                  {/* 顶部栏 */}
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-[#26263A]">
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
                    <div className="flex items-center gap-1 text-[11px] bg-[#1E1B30] px-2 py-0.5 rounded-full text-slate-300 border border-purple-900/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>中级 B1-B2</span>
                    </div>
                  </div>

                  {/* 卡片核心内容：正在高亮朗读的英文短篇 */}
                  <div className="my-auto space-y-3.5">
                    <div className="text-xs text-amber-400/90 font-semibold tracking-wider uppercase">
                      📖 The Great Gatsby · 经典文学
                    </div>

                    <p className="text-slate-400 leading-relaxed text-xs">
                      In my younger and more vulnerable years my father gave me some advice that I’ve
                      been turning over in my mind ever since.
                    </p>

                    {/* 当前正在高亮随播的句子 */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/90 via-[#1A182C] to-[#161622] border border-purple-500/50 shadow-lg shadow-purple-500/10 space-y-1.5">
                      <div className="flex items-start gap-2 text-purple-200 font-semibold text-xs leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping mt-1 flex-shrink-0" />
                        <span>
                          “Whenever you feel like criticizing any one,” he told me, “just remember that
                          all the people in this world haven&apos;t had the advantages that you&apos;ve had.”
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1.5 border-t border-[#26263A]">
                        “每逢你想要批评任何人的时候，”他对我说，“你要记住，这个世界上所有人并非都具备你拥有的优势。”
                      </div>
                    </div>

                    {/* 单词即查气泡浮窗模拟 */}
                    <div className="bg-[#1E1B30]/95 border border-purple-400/50 rounded-lg p-2.5 shadow-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-300 text-xs">criticizing</span>
                        <span className="text-[10px] text-slate-400 font-mono">/ˈkrɪtɪsaɪzɪŋ/</span>
                      </div>
                      <div className="text-[11px] text-slate-300">v. 批评；指责；挑剔</div>
                      <div className="flex gap-2 pt-1">
                        <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/50 flex items-center gap-1">
                          <Volume2 className="w-3 h-3" /> 发音
                        </span>
                        <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
                          <Star className="w-3 h-3" /> 生词本
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 底部控制与手势提示 */}
                  <div className="space-y-2 pt-3 border-t border-[#26263A]">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-purple-300">
                        <span>🇺🇸</span> 美音 1.0x
                      </span>
                      <span className="bg-purple-950/70 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <Bot className="w-3 h-3" /> AI 伴学解惑
                      </span>
                    </div>
                    <div className="text-center text-[10px] text-slate-500">
                      👆 上下滑动即刷下一篇语料
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === SLIDE 2: STARJAR TERRARIUM & REWARD JAR MOCKUP === */}
            {activeIndex === 1 && (
              <div className="relative w-[300px] sm:w-[320px] aspect-[9/18.5] bg-[#0A0D18] rounded-[44px] p-3 border-4 border-[#3D2C1B] shadow-2xl shadow-amber-950/80 transition-all duration-500">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                <div className="w-full h-full bg-[#0E1324] rounded-[34px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 select-none border border-[#2E2419]">
                  {/* 顶部习惯打卡状态 */}
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-amber-900/30">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <span>🪐</span>
                      <span>晨晨的小星球</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full text-amber-300 text-[11px] font-mono">
                      <span>⭐</span>
                      <span>128 颗星愿</span>
                    </div>
                  </div>

                  {/* 星愿瓶中心拟真微缩生态插画 */}
                  <div className="my-auto space-y-3 text-center">
                    <div className="relative mx-auto w-36 h-36 rounded-2xl bg-gradient-to-b from-amber-500/10 to-indigo-950/40 border border-amber-500/30 flex items-center justify-center p-2 shadow-inner">
                      <Image
                        src="/products/starjar/terrarium.png"
                        alt="StarJar 微缩生态"
                        width={130}
                        height={130}
                        className="object-contain drop-shadow-[0_10px_20px_rgba(245,158,11,0.25)] animate-pulse"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold">
                        Lv.3 繁茂
                      </div>
                    </div>

                    {/* 今日习惯打卡列表 */}
                    <div className="space-y-1.5 text-left text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-amber-500/20">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>早起自主整理书包与桌椅</span>
                        </div>
                        <span className="text-amber-400 font-bold font-mono">+3 ⭐</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-amber-500/20">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>自主阅读课外经典 25 分钟</span>
                        </div>
                        <span className="text-amber-400 font-bold font-mono">+5 ⭐</span>
                      </div>
                    </div>

                    {/* 目标心愿兑换进度条 */}
                    <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/40 text-left space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-amber-200 font-semibold">🎯 乐高探索号航天飞机</span>
                        <span className="text-amber-400 font-mono font-bold">128 / 150</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-[85%] rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* 底部 */}
                  <div className="pt-2 border-t border-amber-900/30 text-center text-[10px] text-amber-300/80">
                    ✨ 轻触星愿瓶倾听星辰清脆回响
                  </div>
                </div>
              </div>
            )}

            {/* === SLIDE 3: WORKOUT / 造己健身 ATHLETIC LOG MOCKUP === */}
            {activeIndex === 2 && (
              <div className="relative w-[300px] sm:w-[320px] aspect-[9/18.5] bg-[#0A0E17] rounded-[44px] p-3 border-4 border-[#153026] shadow-2xl shadow-emerald-950/80 transition-all duration-500">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                <div className="w-full h-full bg-[#0C141C] rounded-[34px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 select-none border border-[#162D24]">
                  {/* 顶部状态 */}
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-emerald-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <Dumbbell className="w-4 h-4" />
                      <span>今日胸背力量超集</span>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full text-emerald-300 text-[10px] font-mono">
                      <span>第 4 / 6 组</span>
                    </div>
                  </div>

                  {/* 当前进行动作与肌群分析 */}
                  <div className="my-auto space-y-3 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">高位绳索下拉</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 font-mono">
                          RPE 8.5
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Cable Lateral Pulldown · 背部主项</p>
                    </div>

                    {/* 肌肉受力解剖占比 */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-emerald-500/20 space-y-1.5">
                      <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                        <span className="text-emerald-300">背阔肌 (核心受力束) 82%</span>
                        <span>肱二 12%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-400 w-[82%]" />
                        <div className="h-full bg-teal-600 w-[12%]" />
                        <div className="h-full bg-slate-600 w-[6%]" />
                      </div>
                    </div>

                    {/* 组次记录面板 */}
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between p-1.5 rounded bg-black/30 text-slate-400 text-[11px]">
                        <span>Set 1: 55kg × 12 reps</span>
                        <span className="text-emerald-400">✓ 完成</span>
                      </div>
                      <div className="flex justify-between p-1.5 rounded bg-black/30 text-slate-400 text-[11px]">
                        <span>Set 2: 60kg × 10 reps</span>
                        <span className="text-emerald-400">✓ 完成</span>
                      </div>
                      <div className="flex justify-between p-1.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-[11px] font-bold">
                        <span>Set 3: 65kg × 8 reps</span>
                        <span className="text-emerald-400 animate-pulse">顶峰 2s</span>
                      </div>
                    </div>

                    {/* OHSA 动力链体态警示 */}
                    <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-600/30 text-[10px] text-amber-200/90 leading-tight">
                      ⚠️ <span className="font-bold">OHSA 提醒:</span> 下沉肩胛、胸椎微挺，避免耸肩与斜方肌代偿
                    </div>
                  </div>

                  {/* 底部组间休息倒计时 */}
                  <div className="pt-2 border-t border-emerald-900/40 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">⏱️ 组间休息: 01:15</span>
                    <button className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[10px]">
                      跳过休息
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧垂直浮动产品指示器 (Product Switcher Pills) */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2.5 bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
        {slides.map((s, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                isActive
                  ? 'bg-white/15 text-white border border-white/30 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={s.name}
            >
              <span className="text-sm">{s.emoji}</span>
              <span className="font-semibold">{s.shortName}</span>
              <span className="text-[10px] text-slate-400">0{idx + 1}</span>
            </button>
          );
        })}

        <div className="pt-2 border-t border-white/10 flex flex-col gap-1 items-center">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            title="上一款产品"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="下一款产品 / 向下探索"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 底部悬浮指示栏：向下引导 */}
      <div className="relative z-10 py-3 border-t border-white/10 bg-black/40 backdrop-blur-sm text-center">
        <button
          onClick={() => {
            const contentEl = document.getElementById('workshop-content');
            if (contentEl) contentEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span>向下滑动探索 ByteGush 深度评测、实战教程与软件雷达</span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform animate-bounce" />
        </button>
      </div>
    </section>
  );
}
