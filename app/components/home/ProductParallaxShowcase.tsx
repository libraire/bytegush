"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Download,
  ExternalLink,
  ChevronDown,
  Star,
  CheckCircle2,
  Volume2,
  Bot,
  Dumbbell,
  ArrowUp,
  FlaskConical,
  Gamepad2,
  Camera,
  ShieldCheck,
  Layers,
  Cpu,
  Play
} from 'lucide-react';

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
  primaryCta: { label: string; href: string; isDownload?: boolean };
  secondaryCta?: { label: string; href: string; isExternal?: boolean };
  badges: string[];
  themeGlow: string;
  accentGradient: string;
  activeColor: string;
  nextSlideName?: string;
}

const slidesData: SlideData[] = [
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
      isDownload: true,
    },
    secondaryCta: {
      label: '🕊️ 查看详细落地页',
      href: '/products/flappyfeed',
      isExternal: false,
    },
    badges: ['支持 Android 8.0+', '纯净零广告', '离线随播伴读'],
    themeGlow: 'radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)',
    accentGradient: 'from-purple-400 via-violet-200 to-indigo-300',
    activeColor: 'text-purple-400 border-purple-400 shadow-purple-500/30',
    nextSlideName: 'StarJar 星愿瓶',
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
      label: '🌟 查看 StarJar 详细落地页',
      href: '/products/starjar',
    },
    secondaryCta: {
      label: '💡 正向习惯机制与手记',
      href: '/products/starjar',
      isExternal: false,
    },
    badges: ['告别说教式养育', '自驱力正向循环', '治愈美学无广告'],
    themeGlow: 'radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)',
    accentGradient: 'from-amber-300 via-yellow-100 to-amber-400',
    activeColor: 'text-amber-400 border-amber-400 shadow-amber-500/30',
    nextSlideName: '造己健身 Workout',
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
      label: '🏋️‍♂️ 查看造己健身详细落地页',
      href: '/products/workout',
    },
    secondaryCta: {
      label: '🔬 动力链动作库与筛查',
      href: '/products/workout',
      isExternal: false,
    },
    badges: ['纯粹无广告', '拒绝私教推销', '科学解剖与动力学导向'],
    themeGlow: 'radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.24) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
    accentGradient: 'from-emerald-400 via-teal-200 to-cyan-300',
    activeColor: 'text-emerald-400 border-emerald-400 shadow-emerald-500/30',
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(min: number, max: number, value: number): number {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

export default function ProductParallaxShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

      if (p < 0.34) {
        setActiveIdx(0);
      } else if (p < 0.68) {
        setActiveIdx(1);
      } else {
        setActiveIdx(2);
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
    const targets = [0.08, 0.50, 0.90];
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
      else if (hash === '#playground') {
        const el = document.getElementById('playground');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const timer = setTimeout(handleHash, 250);
    window.addEventListener('hashchange', handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // 计算平滑过渡曲线:
  // 过渡 0 -> 1 发生在 [0.24, 0.44]
  // 过渡 1 -> 2 发生在 [0.58, 0.78]
  const t1 = smoothstep(0.24, 0.44, progress);
  const t2 = smoothstep(0.58, 0.78, progress);

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
      opacity: t2,
      translateY: 30 * (1 - t2),
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
    t2,
  ];

  // 手机边框微光随产品变幻
  const phoneBorderColors = [
    'rgba(139, 92, 246, 0.4)',
    'rgba(245, 158, 11, 0.4)',
    'rgba(16, 185, 129, 0.4)',
  ];
  const phoneGlowShadows = [
    'rgba(139, 92, 246, 0.22)',
    'rgba(245, 158, 11, 0.22)',
    'rgba(16, 185, 129, 0.22)',
  ];

  return (
    <div className="relative w-full bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* 顶部全局视差滚动进度指示条 */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-amber-400 to-emerald-400 transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* 视差滚动总轨道容器：320vh 留足平滑滚动旅程 */}
      <div ref={containerRef} className="relative w-full h-[320vh]">
        {/* 锚点以支持直接通过 URL 哈希跳转 */}
        <div id="flappyfeed" className="absolute top-0 pointer-events-none" />
        <div id="starjar" className="absolute top-[38%] pointer-events-none" />
        <div id="workout" className="absolute top-[75%] pointer-events-none" />

        {/* 粘性居中舞台 (Sticky Stage)：手机硬件框完全静止钉在视口内，内部屏幕与左侧文案协同滚动 */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          
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
          <div className="relative z-10 max-w-[1560px] 2xl:max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 2xl:gap-24 items-center">
              
              {/* ===================== 左侧：文案与转化 CTA (随滚动平滑升降渐变) ===================== */}
              <div className="lg:col-span-7 relative h-[320px] sm:h-[380px] lg:h-[480px] flex items-center">
                {slidesData.map((slide, index) => {
                  const transform = leftTransforms[index];
                  const isActive = activeIdx === index;

                  return (
                    <div
                      key={`left-${slide.id}`}
                      className="absolute inset-0 flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-5 text-center lg:text-left transition-all duration-75 ease-out"
                      style={{
                        opacity: transform.opacity,
                        transform: `translate3d(0, ${transform.translateY}px, 0)`,
                        pointerEvents: isActive ? 'auto' : 'none',
                        visibility: transform.opacity <= 0.01 ? 'hidden' : 'visible',
                      }}
                    >
                      {/* 标签徽章 */}
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-medium backdrop-blur-md self-center lg:self-start">
                        <span className="text-sm sm:text-base">{slide.emoji}</span>
                        <span className="text-slate-300">{slide.tag}</span>
                      </div>

                      {/* 标题 */}
                      <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.16]">
                        {slide.headlinePrefix}
                        <br />
                        <span className={`bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent`}>
                          {slide.headlineGradient}
                        </span>
                      </h2>

                      {/* 核心定位 */}
                      <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto lg:mx-0 leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                        {slide.description}
                      </p>

                      {/* 关键亮点数据 */}
                      <div className="pt-0.5 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
                        {slide.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 sm:gap-2 bg-[#121829]/70 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm"
                          >
                            <span
                              className={`font-bold text-xs sm:text-base ${
                                index === 0
                                  ? 'text-purple-300'
                                  : index === 1
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {stat.value}
                            </span>
                            <span className="text-slate-400 text-[11px] sm:text-xs">{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA 按钮 */}
                      <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                        <a
                          href={slide.primaryCta.href}
                          target={slide.primaryCta.isDownload ? '_blank' : undefined}
                          rel="noreferrer"
                          className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 text-white ${
                            index === 0
                              ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-purple-600/30'
                              : index === 1
                              ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                          }`}
                        >
                          {slide.primaryCta.isDownload ? (
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          <span>{slide.primaryCta.label}</span>
                        </a>

                        {slide.secondaryCta && (
                          <a
                            href={slide.secondaryCta.href}
                            target={slide.secondaryCta.isExternal ? '_blank' : undefined}
                            rel="noreferrer"
                            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>{slide.secondaryCta.label}</span>
                            {slide.secondaryCta.isExternal && (
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </a>
                        )}
                      </div>

                      {/* 特性打勾提示 */}
                      <div className="hidden sm:flex text-xs text-slate-400 flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                        {slide.badges.map((b, bIdx) => (
                          <span key={bIdx} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ===================== 右侧：完全静止固定的手机硬件外壳 ===================== */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                
                {/* 物理设备边框：完全固定静止，不随滚动发生位置偏移 */}
                <div
                  className="relative h-[40vh] sm:h-[46vh] lg:h-[580px] xl:h-[620px] aspect-[9/18.5] bg-[#0E111C] rounded-[42px] sm:rounded-[48px] p-2.5 sm:p-3 border-[3px] sm:border-[4px] shadow-2xl transition-colors duration-500 ease-out select-none flex-shrink-0"
                  style={{
                    borderColor: phoneBorderColors[activeIdx],
                    boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 50px ${phoneGlowShadows[activeIdx]}`,
                  }}
                >
                  {/* 侧边物理按键微细节 */}
                  <div className="absolute -left-[6px] top-24 w-[3px] h-10 bg-slate-700/60 rounded-l" />
                  <div className="absolute -left-[6px] top-38 w-[3px] h-10 bg-slate-700/60 rounded-l" />
                  <div className="absolute -right-[6px] top-28 w-[3px] h-14 bg-slate-700/60 rounded-r" />

                  {/* 顶部灵动岛 / 听筒镜头打孔 */}
                  <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 flex items-center justify-between px-3 shadow-md pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#181B26]" />
                  </div>

                  {/* 手机屏幕视口 (Screen Viewport)：溢出隐藏，内部由 3 层屏幕上下平滑滑动置换 */}
                  <div className="relative w-full h-full bg-[#080A12] rounded-[36px] overflow-hidden border border-white/5">
                    
                    {/* ====== 01. FLAPPYFEED 屏幕界面 (随滚动向上滑出或滑入) ====== */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100 transition-all duration-75 ease-out"
                      style={{
                        transform: `translate3d(0, ${phoneTransforms[0].translateY}%, 0)`,
                        opacity: phoneTransforms[0].opacity,
                        pointerEvents: activeIdx === 0 ? 'auto' : 'none',
                        visibility: phoneTransforms[0].opacity <= 0.01 ? 'hidden' : 'visible',
                      }}
                    >
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
                        <div className="flex items-center gap-1 text-[11px] bg-[#1E1B30] px-2 py-0.5 rounded-full text-slate-300 border border-purple-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>中级 B1-B2</span>
                        </div>
                      </div>

                      {/* 核心短语流 */}
                      <div className="my-auto space-y-2.5">
                        <div className="text-[11px] text-amber-400/90 font-semibold tracking-wider uppercase">
                          📖 The Great Gatsby · 经典文学
                        </div>

                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          In my younger and more vulnerable years my father gave me some advice that I’ve
                          been turning over in my mind ever since.
                        </p>

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

                        {/* 点词即查交互浮层 */}
                        <div className="bg-[#1E1B30]/95 border border-purple-400/50 rounded-lg p-2 shadow-xl text-xs space-y-1">
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
                          <span className="flex items-center gap-1 text-purple-300 text-[11px]">
                            <span>🇺🇸</span> 美音 1.0x
                          </span>
                          <span className="bg-purple-950/70 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <Bot className="w-3 h-3" /> AI 伴学解惑
                          </span>
                        </div>
                        <div className="text-center text-[9px] text-slate-500 font-mono">
                          👆 继续向下滚动切换至下一款产品
                        </div>
                      </div>
                    </div>

                    {/* ====== 02. STARJAR 屏幕界面 (随滚动向上滑入或滑出) ====== */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100 transition-all duration-75 ease-out"
                      style={{
                        transform: `translate3d(0, ${phoneTransforms[1].translateY}%, 0)`,
                        opacity: phoneTransforms[1].opacity,
                        pointerEvents: activeIdx === 1 ? 'auto' : 'none',
                        visibility: phoneTransforms[1].opacity <= 0.01 ? 'hidden' : 'visible',
                      }}
                    >
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
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-amber-500/20">
                            <div className="flex items-center gap-1.5 text-slate-200 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>早起自主整理书包与桌椅</span>
                            </div>
                            <span className="text-amber-400 font-bold font-mono text-[10px]">+3 ⭐</span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-amber-500/20">
                            <div className="flex items-center gap-1.5 text-slate-200 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>自主阅读课外经典 25 分钟</span>
                            </div>
                            <span className="text-amber-400 font-bold font-mono text-[10px]">+5 ⭐</span>
                          </div>
                        </div>

                        {/* 心愿契约进度条 */}
                        <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-600/40 text-left space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-amber-200 font-semibold">🎯 乐高探索号航天飞机</span>
                            <span className="text-amber-400 font-mono font-bold">128 / 150</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-[85%] rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* 底部互动提示 */}
                      <div className="pt-2 border-t border-amber-900/30 text-center text-[9px] text-amber-300/80 font-mono">
                        ✨ 轻触星愿瓶倾听星辰清脆回响
                      </div>
                    </div>

                    {/* ====== 03. WORKOUT 屏幕界面 (随滚动向上滑入完成态) ====== */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-4 pt-9 sm:pt-10 text-slate-100 transition-all duration-75 ease-out"
                      style={{
                        transform: `translate3d(0, ${phoneTransforms[2].translateY}%, 0)`,
                        opacity: phoneTransforms[2].opacity,
                        pointerEvents: activeIdx === 2 ? 'auto' : 'none',
                        visibility: phoneTransforms[2].opacity <= 0.01 ? 'hidden' : 'visible',
                      }}
                    >
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
                          <p className="text-[10px] text-slate-400">Cable Lateral Pulldown · 背部主项</p>
                        </div>

                        {/* 肌群受力配比条 */}
                        <div className="p-2 rounded-xl bg-white/5 border border-emerald-500/20 space-y-1">
                          <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                            <span className="text-emerald-300">背阔肌 (核心受力束) 82%</span>
                            <span>肱二 12%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-400 w-[82%]" />
                            <div className="h-full bg-teal-600 w-[12%]" />
                            <div className="h-full bg-slate-600 w-[6%]" />
                          </div>
                        </div>

                        {/* 组数记录 */}
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between p-1 rounded bg-black/30 text-slate-400 text-[10px]">
                            <span>Set 1: 55kg × 12 reps</span>
                            <span className="text-emerald-400">✓ 完成</span>
                          </div>
                          <div className="flex justify-between p-1 rounded bg-black/30 text-slate-400 text-[10px]">
                            <span>Set 2: 60kg × 10 reps</span>
                            <span className="text-emerald-400">✓ 完成</span>
                          </div>
                          <div className="flex justify-between p-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-[10px] font-bold">
                            <span>Set 3: 65kg × 8 reps</span>
                            <span className="text-emerald-400 animate-pulse">顶峰 2s</span>
                          </div>
                        </div>

                        {/* OHSA 提醒 */}
                        <div className="p-1.5 rounded-lg bg-amber-950/30 border border-amber-600/30 text-[9px] text-amber-200/90 leading-tight">
                          ⚠️ <span className="font-bold">OHSA:</span> 下沉肩胛、胸椎微挺，避免耸肩代偿
                        </div>
                      </div>

                      {/* 底部组间休息倒计时 */}
                      <div className="pt-2 border-t border-emerald-900/40 flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono text-[10px]">⏱️ 组间休息: 01:15</span>
                        <button className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[9px]">
                          跳过休息
                        </button>
                      </div>
                    </div>

                    {/* 手机屏幕高光反光层 (Glass Reflection) */}
                    <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent z-20" />

                    {/* 手机底部 Home Indicator 小横条 */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-1 bg-white/20 rounded-full z-30 pointer-events-none" />
                  </div>
                </div>

              </div>

            </div>

            {/* 底部导航提示器与一键切换 */}
            <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">0{activeIdx + 1} / 03</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{slidesData[activeIdx].name}</span>
              </div>

              {activeIdx < slidesData.length - 1 ? (
                <button
                  onClick={() => scrollToSlide(activeIdx + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all group"
                >
                  <span>向下滚动探索：{slidesData[activeIdx].nextSlideName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform animate-bounce" />
                </button>
              ) : (
                <button
                  onClick={() => scrollToSlide(0)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all group"
                >
                  <span>已阅览全部产品 · 返回顶部 FlappyFeed</span>
                  <ArrowUp className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}

              <div className="hidden sm:block text-slate-500 text-[11px]">
                滑动滚轮或上下轻扫，手机保持静止，内容平滑变幻
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 试验场 (The Playground / Bytegush Labs) */}
      {/* ========================================================================= */}
      <section id="playground" className="relative z-30 border-t border-white/10 bg-[#070913] py-20 sm:py-28 overflow-hidden">
        {/* 背景氛围柔光 */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
          
          {/* 试验场 Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-mono font-semibold mb-4">
                <FlaskConical className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                <span>BYTEGUSH LABS · 试验场</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                极客小品与试验场{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-400 font-extrabold">
                  The Playground
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                一些好玩、硬核、充满探索欲的原型探索与互动试验。告别繁复框架，在浏览器里探索端侧视觉 AI、实时状态机对战与极客交互。
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                云端服务在线运行
              </span>
            </div>
          </div>

          {/* 试验场双子星卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* 卡片 1: 干瞪眼扑克 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] transition-all duration-300">
              <div className="space-y-6">
                
                {/* 顶栏信息 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                      🃏
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                          干瞪眼扑克
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          试验场 · 对战小品
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="text-amber-400">poker.bytegush.com</span>
                        <span>·</span>
                        <span>轻量即开即玩</span>
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
                  极具对抗与局势逆转的经典地方扑克玩法。牌型压制，步步为营，单张也可截胡翻盘。无需安装下载任何臃肿客户端，网页秒开即玩。
                </p>

                {/* 核心亮点 */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400 font-bold">⚡</span>
                    <span>免下载网页秒开</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400 font-bold">🃏</span>
                    <span>经典地道干瞪眼规则</span>
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
                  备用通道: poker.meetlovely.space ↗
                </a>
              </div>
            </div>

            {/* 卡片 2: Motion 体感手势 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.12)] transition-all duration-300">
              <div className="space-y-6">
                
                {/* 顶栏信息 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                      🦾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          Motion 体感手势
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          试验场 · 视觉AI动捕
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
                    <span>免穿戴 · 普通摄像头即可</span>
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
                  <span>进入需授予浏览器摄像头访问权限，画面全在端侧内存分析，隐私绝对安全。</span>
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
                  备用通道: motion.meetlovely.space ↗
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>
      <footer className="relative z-40 border-t border-white/10 bg-[#060810] py-12 text-center text-xs text-slate-400">
        <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-200 font-semibold">BYTEGUSH STUDIO · 独立工坊</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            © {new Date().getFullYear()} Bytegush. All products crafted with passion.
          </div>
        </div>
      </footer>
    </div>
  );
}
