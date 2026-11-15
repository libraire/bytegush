"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Download,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  Users,
  MessageSquare,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import FlappyFeedBetaModal from './FlappyFeedBetaModal';
import WorkoutQrModal from './WorkoutQrModal';

interface SlideData {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  tag: string;
  headlinePrefix: string;
  headlineGradient: string;
  description: string;
  stats: { label: string; value: string }[];
  primaryCta: { label: string; href: string; isDownload?: boolean; isExternal?: boolean };
  secondaryCta?: { label: string; href: string; isExternal?: boolean; isInternal?: boolean };
  badges: string[];
  themeGlow: string;
  accentGradient: string;
  activeColor: string;
  nextSlideName?: string;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(min: number, max: number, value: number): number {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

export default function ProductParallaxShowcase() {
  const t = useTranslations('Home');
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [betaModalApp, setBetaModalApp] = useState<'flappyfeed' | 'starjar' | null>(null);
  const [isWorkoutQrModalOpen, setIsWorkoutQrModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const slidesData: SlideData[] = useMemo(() => [
    {
      id: 'flappyfeed',
      name: t('slides.flappyfeed.name'),
      shortName: t('slides.flappyfeed.shortName'),
      emoji: '🕊️',
      tag: t('slides.flappyfeed.tag'),
      headlinePrefix: t('slides.flappyfeed.headlinePrefix'),
      headlineGradient: t('slides.flappyfeed.headlineGradient'),
      description: t('slides.flappyfeed.description'),
      stats: [
        { label: t('slides.flappyfeed.stats.stat1Label'), value: t('slides.flappyfeed.stats.stat1Value') },
        { label: t('slides.flappyfeed.stats.stat2Label'), value: t('slides.flappyfeed.stats.stat2Value') },
        { label: t('slides.flappyfeed.stats.stat3Label'), value: t('slides.flappyfeed.stats.stat3Value') },
      ],
      primaryCta: {
        label: t('slides.flappyfeed.primaryCta'),
        href: 'https://flappy.bytegush.com/release/app-release.apk',
        isDownload: true,
      },
      secondaryCta: {
        label: t('slides.flappyfeed.secondaryCta'),
        href: '/products/flappyfeed/play',
        isInternal: true,
      },
      badges: (t.raw('slides.flappyfeed.badges') as string[]) || [],
      themeGlow: 'radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)',
      accentGradient: 'from-purple-400 via-violet-200 to-indigo-300',
      activeColor: 'text-purple-400 border-purple-400 shadow-purple-500/30',
      nextSlideName: t('slides.starjar.name'),
    },
    {
      id: 'starjar',
      name: t('slides.starjar.name'),
      shortName: t('slides.starjar.shortName'),
      emoji: '⭐',
      tag: t('slides.starjar.tag'),
      headlinePrefix: t('slides.starjar.headlinePrefix'),
      headlineGradient: t('slides.starjar.headlineGradient'),
      description: t('slides.starjar.description'),
      stats: [
        { label: t('slides.starjar.stats.stat1Label'), value: t('slides.starjar.stats.stat1Value') },
        { label: t('slides.starjar.stats.stat2Label'), value: t('slides.starjar.stats.stat2Value') },
        { label: t('slides.starjar.stats.stat3Label'), value: t('slides.starjar.stats.stat3Value') },
      ],
      primaryCta: {
        label: t('slides.starjar.primaryCta'),
        href: 'https://starjar.bytegush.com/release/app-release.apk',
        isDownload: true,
      },
      badges: (t.raw('slides.starjar.badges') as string[]) || [],
      themeGlow: 'radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)',
      accentGradient: 'from-amber-300 via-yellow-100 to-amber-400',
      activeColor: 'text-amber-400 border-amber-400 shadow-amber-500/30',
      nextSlideName: t('slides.workout.name'),
    },
    {
      id: 'workout',
      name: t('slides.workout.name'),
      shortName: t('slides.workout.shortName'),
      emoji: '⚡',
      tag: t('slides.workout.tag'),
      headlinePrefix: t('slides.workout.headlinePrefix'),
      headlineGradient: t('slides.workout.headlineGradient'),
      description: t('slides.workout.description'),
      stats: [
        { label: t('slides.workout.stats.stat1Label'), value: t('slides.workout.stats.stat1Value') },
        { label: t('slides.workout.stats.stat2Label'), value: t('slides.workout.stats.stat2Value') },
        { label: t('slides.workout.stats.stat3Label'), value: t('slides.workout.stats.stat3Value') },
      ],
      primaryCta: {
        label: t('slides.workout.primaryCta'),
        href: '#workout-qr',
      },
      badges: (t.raw('slides.workout.badges') as string[]) || [],
      themeGlow: 'radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.24) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
      accentGradient: 'from-emerald-400 via-teal-200 to-cyan-300',
      activeColor: 'text-emerald-400 border-emerald-400 shadow-emerald-500/30',
      nextSlideName: t('slides.sharereader.name'),
    },
    {
      id: 'sharereader',
      name: t('slides.sharereader.name'),
      shortName: t('slides.sharereader.shortName'),
      emoji: '📖',
      tag: t('slides.sharereader.tag'),
      headlinePrefix: t('slides.sharereader.headlinePrefix'),
      headlineGradient: t('slides.sharereader.headlineGradient'),
      description: t('slides.sharereader.description'),
      stats: [
        { label: t('slides.sharereader.stats.stat1Label'), value: t('slides.sharereader.stats.stat1Value') },
        { label: t('slides.sharereader.stats.stat2Label'), value: t('slides.sharereader.stats.stat2Value') },
        { label: t('slides.sharereader.stats.stat3Label'), value: t('slides.sharereader.stats.stat3Value') },
      ],
      primaryCta: {
        label: t('slides.sharereader.primaryCta'),
        href: '#',
      },
      badges: (t.raw('slides.sharereader.badges') as string[]) || [],
      themeGlow: 'radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.28) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)',
      accentGradient: 'from-sky-400 via-blue-200 to-indigo-300',
      activeColor: 'text-sky-400 border-sky-400 shadow-sky-500/30',
      nextSlideName: t('slides.flappyfeed.name'),
    },
  ], [t]);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = containerRef.current.offsetHeight - windowHeight;

      const rawProgress = totalScrollable > 0 ? -rect.top / totalScrollable : 0;
      const p = clamp(rawProgress, 0, 1);
      setProgress(p);

      if (p < 0.25) {
        setActiveIdx(0);
      } else if (p < 0.50) {
        setActiveIdx(1);
      } else if (p < 0.75) {
        setActiveIdx(2);
      } else {
        setActiveIdx(3);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targets = [0.06, 0.33, 0.62, 0.92];
    const targetP = targets[index] ?? 0;
    const targetY = containerTop + targetP * totalScrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#flappyfeed') scrollToSlide(0);
      else if (hash === '#starjar') scrollToSlide(1);
      else if (hash === '#workout') scrollToSlide(2);
      else if (hash === '#sharereader') scrollToSlide(3);
    };

    const timer = setTimeout(handleHash, 250);
    window.addEventListener('hashchange', handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // 计算平滑过渡曲线:
  // 过渡 0 -> 1 发生在 [0.18, 0.32]
  // 过渡 1 -> 2 发生在 [0.43, 0.57]
  // 过渡 2 -> 3 发生在 [0.68, 0.82]
  const t1 = smoothstep(0.18, 0.32, progress);
  const t2 = smoothstep(0.43, 0.57, progress);
  const t3 = smoothstep(0.68, 0.82, progress);

  // 1. 左侧文案层变换
  const leftTransforms = [
    {
      opacity: 1 - t1,
      translateY: -30 * t1,
    },
    {
      opacity: t1 < 1 ? t1 : 1 - t2,
      translateY: t1 < 1 ? 30 * (1 - t1) : -30 * t2,
    },
    {
      opacity: t2 < 1 ? t2 : 1 - t3,
      translateY: t2 < 1 ? 30 * (1 - t2) : -30 * t3,
    },
    {
      opacity: t3,
      translateY: 30 * (1 - t3),
    },
  ];

  // 2. 手机内部各应用屏幕垂直滑移 (手机硬件框不动，内部界面上下滑动切换)
  const phoneTransforms = [
    {
      translateY: -100 * t1,
      opacity: 1 - 0.3 * t1,
    },
    {
      translateY: t1 < 1 ? 100 * (1 - t1) : -100 * t2,
      opacity: t1 < 1 ? t1 : 1 - 0.3 * t2,
    },
    {
      translateY: 100 * (1 - t2),
      opacity: t2,
    },
  ];

  // 3. 背景光晕渐变透明度
  const glowOpacities = [
    Math.max(0, 1 - t1),
    t1 < 1 ? t1 : Math.max(0, 1 - t2),
    t2 < 1 ? t2 : Math.max(0, 1 - t3),
    t3,
  ];

  // 手机边框微光随产品变幻
  const phoneBorderColors = [
    'rgba(139, 92, 246, 0.4)',
    'rgba(245, 158, 11, 0.4)',
    'rgba(16, 185, 129, 0.4)',
    'rgba(56, 189, 248, 0.4)',
  ];
  const phoneGlowShadows = [
    'rgba(139, 92, 246, 0.22)',
    'rgba(245, 158, 11, 0.22)',
    'rgba(16, 185, 129, 0.22)',
    'rgba(56, 189, 248, 0.22)',
  ];

  return (
    <div className="relative w-full bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* 顶部全局视差滚动进度指示条 */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-amber-400 via-emerald-400 to-sky-400 transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* 视差滚动总轨道容器：420vh 留足 4 款产品的平滑滚动旅程 */}
      <div ref={containerRef} className="relative w-full h-[420vh]">
        {/* 锚点以支持直接通过 URL 哈希跳转 */}
        <div id="flappyfeed" className="absolute top-0 pointer-events-none" />
        <div id="starjar" className="absolute top-[28%] pointer-events-none" />
        <div id="workout" className="absolute top-[58%] pointer-events-none" />
        <div id="sharereader" className="absolute top-[85%] pointer-events-none" />

        {/* 粘性居中舞台 (Sticky Stage)：移动端手机居中背景、文案下半部分覆盖；桌面端左文右图分栏协同滚动 */}
        <div className="sticky top-0 h-screen h-[100dvh] w-full flex flex-col justify-center overflow-hidden">

          {/* 三重液态星云光晕：根据滚动位置无缝融合 */}
          {slidesData.map((s, idx) => (
            <div
              key={`glow-${s.id}`}
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                background: s.themeGlow,
                opacity: glowOpacities[idx],
              }}
            />
          ))}

          {/* 舞台核心网格内容 */}
          <div className="relative z-10 max-w-[1560px] 2xl:max-w-[1720px] mx-auto w-full h-full lg:h-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center">
            <div className="relative w-full h-full lg:h-auto lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 2xl:gap-24 lg:items-center">

              {/* ===================== 设备展示舞台 (移动端居中全屏偏上呈现，桌面端右侧 5 列) ===================== */}
              <div className="absolute inset-0 lg:relative lg:inset-auto lg:col-span-5 flex justify-center items-start lg:items-center h-full lg:h-[580px] xl:lg:h-[620px] w-full z-10 pointer-events-none lg:pointer-events-auto">

                {/* 1. 移动端手机硬件外壳 (展示 FlappyFeed, StarJar, 造己健身) */}
                <div
                  className="absolute inset-0 flex items-start pt-10 sm:pt-14 lg:pt-0 lg:items-center justify-center transition-all duration-200 ease-out select-none"
                  style={{
                    opacity: 1 - t3,
                    transform: `scale(${1 - 0.06 * t3}) translateY(${24 * t3}px)`,
                    visibility: 1 - t3 <= 0.01 ? 'hidden' : 'visible',
                    pointerEvents: activeIdx < 3 ? 'auto' : 'none',
                  }}
                >
                  {/* 物理设备边框：完整真实比例机身（280-320px），上半部尽显 App 界面，下半部延伸由渐变优雅遮罩 */}
                  <div
                    className="relative w-[275px] sm:w-[315px] lg:w-auto lg:h-full aspect-[9/18.5] bg-[#0E111C] rounded-[40px] sm:rounded-[44px] lg:rounded-[48px] p-2.5 sm:p-3 border-[3px] sm:border-[4px] shadow-2xl transition-colors duration-500 ease-out select-none flex-shrink-0"
                    style={{
                      borderColor: phoneBorderColors[Math.min(activeIdx, 2)],
                      boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 50px ${phoneGlowShadows[Math.min(activeIdx, 2)]}`,
                    }}
                  >
                    {/* 顶部微型听筒微细节 (置于边框上，不遮挡真实 App 界面内容) */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 bg-slate-700/80 rounded-full z-30 pointer-events-none" />

                    {/* 手机屏幕视口 (Screen Viewport)：溢出隐藏，内部由 3 层真实截图上下平滑滑动置换 */}
                    <div className="relative w-full h-full bg-[#080A12] rounded-[32px] sm:rounded-[34px] lg:rounded-[36px] overflow-hidden border border-white/5">

                      {/* ====== 01. FLAPPYFEED 真实界面截图 (随滚动向上滑出或滑入，点击直达 Web 播放页) ====== */}
                      <Link
                        href="/products/flappyfeed/play"
                        title="点击直接体验 Web 版"
                        className="absolute inset-0 transition-all duration-75 ease-out overflow-hidden bg-[#0A0D18] block group cursor-pointer"
                        style={{
                          transform: `translate3d(0, ${phoneTransforms[0].translateY}%, 0)`,
                          opacity: phoneTransforms[0].opacity,
                          pointerEvents: activeIdx === 0 ? 'auto' : 'none',
                          visibility: phoneTransforms[0].opacity <= 0.01 ? 'hidden' : 'visible',
                        }}
                      >
                        <Image
                          src="/screenshot/flappyfeed.jpg"
                          alt="FlappyFeed App 真实界面"
                          fill
                          priority
                          sizes="(max-width: 1024px) 320px, 360px"
                          className="object-cover object-top select-none pointer-events-none group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-purple-950/20 transition-colors flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-500/50 text-purple-200 text-xs font-bold shadow-xl flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>{t('slides.flappyfeed.secondaryCta')}</span>
                          </span>
                        </div>
                      </Link>

                      {/* ====== 02. STARJAR 星星瓶真实界面截图 (随滚动向上滑入或滑出) ====== */}
                      <div
                        className="absolute inset-0 transition-all duration-75 ease-out overflow-hidden bg-[#F2F8FF]"
                        style={{
                          transform: `translate3d(0, ${phoneTransforms[1].translateY}%, 0)`,
                          opacity: phoneTransforms[1].opacity,
                          pointerEvents: activeIdx === 1 ? 'auto' : 'none',
                          visibility: phoneTransforms[1].opacity <= 0.01 ? 'hidden' : 'visible',
                        }}
                      >
                        <Image
                          src="/screenshot/starjar-v2.jpg"
                          alt="StarJar 星星瓶 App 真实界面"
                          fill
                          sizes="(max-width: 1024px) 320px, 360px"
                          className="object-cover object-top select-none pointer-events-none"
                        />
                      </div>

                      {/* ====== 03. WORKOUT 造己健身真实界面截图 (随滚动向上滑入完成态) ====== */}
                      <div
                        className="absolute inset-0 transition-all duration-75 ease-out overflow-hidden bg-[#0D111A]"
                        style={{
                          transform: `translate3d(0, ${phoneTransforms[2].translateY}%, 0)`,
                          opacity: phoneTransforms[2].opacity,
                          pointerEvents: activeIdx === 2 ? 'auto' : 'none',
                          visibility: phoneTransforms[2].opacity <= 0.01 ? 'hidden' : 'visible',
                        }}
                      >
                        <Image
                          src="/screenshot/fitness.jpg"
                          alt="造己健身 App 真实界面"
                          fill
                          sizes="(max-width: 1024px) 320px, 360px"
                          className="object-cover object-top select-none pointer-events-none"
                        />
                      </div>

                      {/* 手机屏幕高光反光层 (Glass Reflection) */}
                      <div className="pointer-events-none absolute inset-0 rounded-[32px] sm:rounded-[34px] lg:rounded-[36px] bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent z-20" />

                      {/* 手机底部 Home Indicator 小横条 */}
                      <div
                        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-1 rounded-full z-30 pointer-events-none transition-colors duration-300 ${
                          activeIdx === 1 ? 'bg-black/25' : 'bg-white/20'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 桌面端笔记本电脑硬件外壳 (展示 ShareReader) */}
                <div
                  className="absolute inset-0 flex items-start pt-16 sm:pt-20 lg:pt-0 lg:items-center justify-center transition-all duration-200 ease-out select-none px-1 sm:px-2"
                  style={{
                    opacity: t3,
                    transform: `scale(${0.94 + 0.06 * t3}) translateY(${24 * (1 - t3)}px)`,
                    visibility: t3 <= 0.01 ? 'hidden' : 'visible',
                    pointerEvents: activeIdx === 3 ? 'auto' : 'none',
                  }}
                >
                  <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[610px] mx-auto scale-90 sm:scale-100 origin-top lg:origin-center">
                    {/* 底部扩散式深蓝环境微光 */}
                    <div className="absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl opacity-40 bg-sky-500/20 pointer-events-none" />

                    {/* ================= 上半部：笔记本屏幕外壳 (Lid / Retina Display) ================= */}
                    <div className="relative bg-[#111422] rounded-t-[18px] sm:rounded-t-[22px] p-2 sm:p-2.5 border-t border-x border-[#2E374E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                      {/* 顶部超窄边框与微型高清摄像头 */}
                      <div className="flex items-center justify-center pb-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b] border border-sky-400/40 flex items-center justify-center">
                            <div className="w-0.5 h-0.5 rounded-full bg-sky-400" />
                          </div>
                          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      </div>

                      {/* 笔记本内屏视口 (Display Viewport) */}
                      <div className="relative aspect-[16/10.5] bg-[#070A12] rounded-[10px] sm:rounded-[12px] overflow-hidden border border-white/10 flex flex-col">
                        {/* macOS 风格软件窗口标题栏 */}
                        <div className="flex items-center justify-between px-3 py-1.5 sm:py-2 border-b border-white/10 bg-[#0A0E1A]/95 backdrop-blur-md">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                            <div className="ml-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-300">
                              <span className="text-sky-400">📖</span>
                              <span className="font-semibold text-white">ShareReader</span>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-400 truncate max-w-[130px] sm:max-w-[190px]">Attention_Is_All_You_Need.pdf</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono bg-sky-950/80 border border-sky-800/60 text-sky-300 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>AI 大模型支持 · 智能伴读</span>
                          </div>
                        </div>

                        {/* 双轨研读工作台主体：左侧 PDF 原著微观，右侧发散思维树 */}
                        <div className="flex-1 grid grid-cols-12 gap-2 p-2 sm:p-2.5 overflow-hidden text-xs">
                          {/* 左侧 7 列：PDF 文献研读区 */}
                          <div className="col-span-7 bg-[#05070E] rounded-xl p-2 sm:p-2.5 border border-white/5 flex flex-col justify-between">
                            <div className="space-y-1 sm:space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 font-mono pb-1 border-b border-white/5">
                                <span className="flex items-center gap-1">
                                  <span className="text-slate-400">Sec 3.2</span>
                                  <span>·</span>
                                  <span>P.4 / 15</span>
                                </span>
                                <span className="text-sky-400 bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-800/40">125% 聚焦</span>
                              </div>

                              <p className="text-[9px] sm:text-[10.5px] text-slate-400 leading-relaxed font-serif line-clamp-2">
                                An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values...
                              </p>

                              {/* 划选高亮与公式提取 */}
                              <div className="p-1.5 sm:p-2 rounded-lg bg-sky-500/10 border border-sky-400/40 text-[9px] sm:text-[10px] text-sky-200">
                                <div className="flex items-center justify-between font-mono text-[8.5px] sm:text-[9px] text-sky-300 font-bold mb-0.5">
                                  <span>[公式框选 · Scaled Dot-Product]</span>
                                  <span className="text-[8px] px-1 py-0.5 bg-sky-900/60 rounded text-sky-200 font-normal">已锚定原著坐标</span>
                                </div>
                                <div className="font-serif italic text-white text-[10px] sm:text-[11px] tracking-wide">
                                  Attention(Q, K, V) = softmax(QK^T / √d_k)V
                                </div>
                              </div>

                              {/* 划选专属操作胶囊 */}
                              <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-sky-600/40 border border-sky-400/50 text-[8.5px] sm:text-[9px] text-sky-200 flex items-center gap-0.5 shadow-sm">
                                  🎯 聚焦研读
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-purple-600/40 border border-purple-400/50 text-[8.5px] sm:text-[9px] text-purple-200 flex items-center gap-0.5 shadow-sm">
                                  🌿 发散追问
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-600/40 border border-amber-400/50 text-[8.5px] sm:text-[9px] text-amber-200 flex items-center gap-0.5 shadow-sm">
                                  📝 原著边注
                                </span>
                              </div>
                            </div>

                            <div className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-white/5">
                              <span>物理坐标双向高亮穿梭</span>
                              <span className="text-emerald-400 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                双轨同步
                              </span>
                            </div>
                          </div>

                          {/* 右侧 5 列：围绕论文讨论与学术共读 */}
                          <div className="col-span-5 bg-[#080B15] rounded-xl p-2 sm:p-2.5 border border-sky-900/30 flex flex-col justify-between space-y-1.5">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-sky-300 font-bold">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3 text-sky-400" />
                                  <span>围绕论文讨论</span>
                                </div>
                                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded-full">3人共读</span>
                              </div>

                              {/* 同行研读探讨卡片 */}
                              <div className="p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-[8.5px] sm:text-[9px] space-y-0.5">
                                <div className="flex items-center justify-between text-sky-300 font-mono font-semibold">
                                  <span>[同行探讨 · Alex]</span>
                                  <span className="text-sky-400 underline underline-offset-1 text-[8px]">P.4 锚点 ↗</span>
                                </div>
                                <div className="text-slate-300 leading-tight">
                                  这里的 √d_k 缩放因子，如何保证点积不会进入 Softmax 梯度饱和区？
                                </div>
                              </div>

                              {/* AI 伴读与学者评注 */}
                              <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[8.5px] sm:text-[9px] space-y-0.5">
                                <div className="flex items-center justify-between text-purple-300 font-mono font-semibold">
                                  <span>[AI 伴读解析]</span>
                                  <span className="text-[8px] text-purple-400 font-mono">FlashAttention</span>
                                </div>
                                <div className="text-slate-400 leading-tight">
                                  点积过大易导致梯度极小，结合后续 FlashAttention Tiling 还能兼顾内存。
                                </div>
                              </div>
                            </div>

                            <div className="p-1 rounded-lg bg-sky-950/60 border border-sky-800/40 text-[8px] sm:text-[8.5px] text-sky-300 text-center font-mono">
                              💡 划选论文任意段落，即刻与同行展开深度讨论
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ================= 下半部：笔记本键盘底座与转轴 (Laptop Base & Hinge) ================= */}
                    <div className="relative">
                      {/* 转轴与连接缝隙 */}
                      <div className="h-1 sm:h-1.5 bg-[#0D101C] border-t border-[#1C2235] mx-4 sm:mx-6 rounded-t-sm" />

                      {/* 笔记本机身底座 (Aluminum Chassis Base) */}
                      <div className="h-4 sm:h-5 bg-gradient-to-b from-[#1C2235] via-[#161B2B] to-[#0F1320] border-x border-b border-[#2E374E] rounded-b-[14px] sm:rounded-b-[18px] shadow-[0_15px_35px_rgba(0,0,0,0.9)] relative flex items-start justify-center">
                        {/* 居中开合凹槽 (Display Opening Notch / Thumb Indent) */}
                        <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-[#090C15] rounded-b-md border-x border-b border-[#252D42] shadow-inner" />
                        {/* 侧边接口微细节 */}
                        <div className="absolute left-3 sm:left-4 top-1.5 w-2 h-1 bg-[#090C15] rounded-sm" />
                        <div className="absolute right-3 sm:right-4 top-1.5 w-2 h-1 bg-[#090C15] rounded-sm" />
                      </div>

                      {/* 笔记本底部桌面投影 */}
                      <div className="w-[90%] mx-auto h-2 bg-sky-500/10 blur-md rounded-full mt-0.5" />
                    </div>
                  </div>
                </div>

              </div>

              {/* ===================== 移动端专属：全宽中下部暗夜渐变遮罩 (自然隐去手机下半部，完全遮住文字区域) ===================== */}
              <div className="lg:hidden pointer-events-none absolute -left-4 -right-4 sm:-left-6 sm:-right-6 md:-left-8 md:-right-8 bottom-0 h-[68%] sm:h-[64%] bg-gradient-to-t from-[#080B14] from-50% via-[#080B14] via-68% via-[#080B14]/85 via-84% to-transparent z-20" />

              {/* ===================== 文案与转化 CTA (移动端位于中部与下部之间黄金区域，由渐变遮罩整体托起；桌面端左侧 7 列) ===================== */}
              <div className="relative lg:col-span-7 z-30 w-full flex flex-col justify-end lg:justify-center items-center lg:items-start h-full lg:h-[480px] pointer-events-none pb-28 sm:pb-36 lg:pb-0">
                {slidesData.map((slide, index) => {
                  const transform = leftTransforms[index];
                  const isActive = activeIdx === index;

                  return (
                    <div
                      key={`left-${slide.id}`}
                      className="absolute inset-0 flex flex-col justify-end lg:justify-center items-center lg:items-start transition-all duration-75 ease-out px-4 sm:px-6 lg:px-0 pb-28 sm:pb-36 lg:pb-0 pointer-events-auto"
                      style={{
                        opacity: transform.opacity,
                        transform: `translate3d(0, ${transform.translateY}px, 0)`,
                        pointerEvents: isActive ? 'auto' : 'none',
                        visibility: transform.opacity <= 0.01 ? 'hidden' : 'visible',
                      }}
                    >
                      {/* 文案与 CTA 内容区：无外边框/无卡片框，移动端居中并由下半部渐变遮罩衬托；桌面端左侧对齐 */}
                      <div className="w-full max-w-[360px] sm:max-w-[440px] lg:max-w-none flex flex-col items-center lg:items-start space-y-3 sm:space-y-4 lg:space-y-5 text-center lg:text-left">
                        {/* 产品定位胶囊标签 · 可点击直达落地页 */}
                        <Link
                          href={slide.id === 'flappyfeed' ? '/products/flappyfeed' : `#${slide.id}`}
                          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all text-[11px] sm:text-xs font-medium text-slate-300 group"
                        >
                          <span className="text-sm">{slide.emoji}</span>
                          <span className="font-semibold text-white group-hover:text-purple-300 transition-colors">{slide.name}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">{slide.tag}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        {/* 标题 */}
                        <h2 className="text-xl sm:text-2xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.16] drop-shadow-md">
                          {slide.headlinePrefix}
                          <br />
                          <span className={`bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent`}>
                            {slide.headlineGradient}
                          </span>
                        </h2>

                        {/* 核心定位 */}
                        <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-sm sm:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto lg:mx-0 leading-relaxed font-normal line-clamp-2">
                          {slide.description}
                        </p>

                        {/* 关键亮点数据 */}
                        <div className="pt-0.5 flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2.5 lg:gap-3 text-xs sm:text-sm text-slate-300">
                          {slide.stats.map((stat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 bg-white/5 lg:bg-[#121829]/90 px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-lg sm:rounded-xl border border-white/10 lg:border-white/15 backdrop-blur-md shadow-sm"
                            >
                              <span
                                className={`font-bold text-[11px] sm:text-sm lg:text-base ${index === 0
                                    ? 'text-purple-300'
                                    : index === 1
                                      ? 'text-amber-400'
                                      : index === 2
                                        ? 'text-emerald-400'
                                        : 'text-sky-300'
                                  }`}
                              >
                                {stat.value}
                              </span>
                              <span className="text-slate-400 text-[10px] sm:text-xs">{stat.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA 按钮 */}
                        <div className="pt-0.5 sm:pt-1.5 lg:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
                          {slide.id === 'flappyfeed' ? (
                            <>
                              {/* 体验Web版：首页最显眼的渐变主转化入口 */}
                              <Link
                                href="/products/flappyfeed/play"
                                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-purple-600/30"
                              >
                                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-200" />
                                <span>{slide.secondaryCta?.label || '体验Web版'}</span>
                                <ArrowRight className="w-4 h-4 text-purple-200" />
                              </Link>

                              {/* Android 安装包下载与内测登记 */}
                              <button
                                type="button"
                                onClick={() => setBetaModalApp('flappyfeed')}
                                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                                <span>{slide.primaryCta.label}</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <a
                                href={slide.primaryCta.href}
                                target={slide.id === 'starjar' || slide.id === 'workout' || slide.id === 'sharereader' ? undefined : (slide.primaryCta.isDownload || slide.primaryCta.isExternal ? '_blank' : undefined)}
                                rel={slide.id === 'starjar' || slide.id === 'workout' || slide.id === 'sharereader' ? undefined : "noreferrer"}
                                onClick={(e) => {
                                  if (slide.id === 'starjar') {
                                    e.preventDefault();
                                    setBetaModalApp('starjar');
                                  } else if (slide.id === 'workout') {
                                    e.preventDefault();
                                    setIsWorkoutQrModalOpen(true);
                                  } else if (slide.id === 'sharereader') {
                                    e.preventDefault();
                                  }
                                }}
                                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 text-white ${index === 3 ? 'cursor-default' : 'cursor-pointer'} ${index === 1
                                    ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                                    : index === 2
                                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                                      : 'bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 shadow-sky-950/40'
                                  }`}
                              >
                                {slide.primaryCta.isDownload ? (
                                  <Download className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                ) : slide.primaryCta.isExternal ? (
                                  <ExternalLink className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                ) : slide.id === 'sharereader' ? (
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse mr-0.5" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                )}
                                <span>{slide.primaryCta.label}</span>
                              </a>

                              {slide.secondaryCta && (
                                slide.secondaryCta.isInternal ? (
                                  <Link
                                    href={slide.secondaryCta.href}
                                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 hover:from-purple-900/90 hover:to-indigo-900/90 text-purple-200 font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-purple-950/50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                                    <span>{slide.secondaryCta.label}</span>
                                  </Link>
                                ) : (
                                  <a
                                    href={slide.secondaryCta.href}
                                    target={slide.secondaryCta.isExternal ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                                  >
                                    <span>{slide.secondaryCta.label}</span>
                                    {slide.secondaryCta.isExternal && (
                                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                                    )}
                                  </a>
                                )
                              )}
                            </>
                          )}
                        </div>

                        {/* 特性打勾提示 */}
                        <div className="hidden lg:flex text-xs text-slate-400 flex-wrap items-center justify-start gap-4 pt-1">
                          {slide.badges.map((b, bIdx) => (
                            <span key={bIdx} className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{b}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 谷歌安卓内测登记与独立 APK 下载弹窗 */}
      <FlappyFeedBetaModal
        isOpen={betaModalApp !== null}
        onClose={() => setBetaModalApp(null)}
        app={betaModalApp || 'flappyfeed'}
      />

      {/* 造己健身 微信小程序码弹窗 */}
      <WorkoutQrModal
        isOpen={isWorkoutQrModalOpen}
        onClose={() => setIsWorkoutQrModalOpen(false)}
      />
    </div>
  );
}
