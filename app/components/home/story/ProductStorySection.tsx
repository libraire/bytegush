"use client";

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, ExternalLink, ArrowRight } from 'lucide-react';

export interface StatItem {
  label: string;
  value: string;
  hint?: string;
}

export interface CtaConfig {
  label: string;
  href: string;
  isDownload?: boolean;
  isExternal?: boolean;
}

interface ProductStorySectionProps {
  id: string;
  align: 'left' | 'right';
  badge: {
    emoji: string;
    text: string;
  };
  headlinePrefix: string;
  headlineGradient: string;
  accentGradient: string;
  description: string;
  stats: StatItem[];
  primaryCta: CtaConfig;
  secondaryCta?: CtaConfig;
  features: string[];
  themeGlow: string;
  deviceMockup: React.ReactNode;
}

export default function ProductStorySection({
  id,
  align,
  badge,
  headlinePrefix,
  headlineGradient,
  accentGradient,
  description,
  stats,
  primaryCta,
  secondaryCta,
  features,
  themeGlow,
  deviceMockup,
}: ProductStorySectionProps) {
  const isLeft = align === 'left';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative min-h-[92vh] py-24 sm:py-32 lg:py-40 flex items-center justify-center overflow-hidden border-b border-white/[0.04] last:border-b-0"
    >
      {/* 背景动态流光氛围 */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isVisible ? 'opacity-50 scale-100' : 'opacity-20 scale-95'
        }`}
        style={{
          background: themeGlow,
        }}
      />

      {/* 核心内容容器 */}
      <div
        className={`relative z-10 max-w-[1560px] 2xl:max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-6'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* ===================== 文案与转化组 ===================== */}
          <div
            className={`flex flex-col space-y-6 sm:space-y-8 text-center lg:text-left ${
              isLeft ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'
            }`}
          >
            {/* 大号 Apple 风格渐变标题 */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.12]">
              <span className="text-white">{headlinePrefix}</span>
              <br />
              <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                {headlineGradient}
              </span>
            </h2>

            {/* 核心深度阐释文案 */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {description}
            </p>

            {/* 三列关键指标卡 */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl mx-auto lg:mx-0 pt-2">
              {stats.map((st, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm text-center lg:text-left transition-colors hover:border-white/20"
                >
                  <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-mono">
                    {st.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
                    {st.label}
                  </div>
                  {st.hint && (
                    <div className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">
                      {st.hint}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 行动转化 CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href={primaryCta.href}
                target={primaryCta.isExternal || primaryCta.isDownload ? '_blank' : undefined}
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(255,255,255,0.18)] hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {primaryCta.isDownload && <Download className="w-4 h-4 text-slate-900" />}
                <span>{primaryCta.label}</span>
                {!primaryCta.isDownload && <ArrowRight className="w-4 h-4 text-slate-900" />}
              </a>

              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  target={secondaryCta.isExternal ? '_blank' : undefined}
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{secondaryCta.label}</span>
                  {secondaryCta.isExternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </a>
              )}
            </div>

            {/* 特性打勾提示 */}
            <div className="flex text-xs text-slate-400 flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2">
              {features.map((feature, fIdx) => (
                <span key={fIdx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{feature}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ===================== 高保真硬件设备展示 ===================== */}
          <div
            className={`flex justify-center items-center transition-transform duration-700 ease-out ${
              isVisible ? 'scale-100 translate-y-0' : 'scale-98 translate-y-4'
            } ${isLeft ? 'lg:col-span-5 lg:order-2' : 'lg:col-span-5 lg:order-1'}`}
          >
            {deviceMockup}
          </div>

        </div>
      </div>
    </section>
  );
}
