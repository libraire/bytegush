'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="relative z-40 border-t border-white/10 bg-[#060810] py-10 sm:py-12 text-xs text-slate-400">
      <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 左侧：工作室标识与状态点 */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-200 font-semibold tracking-wide">
            {t('brandTagline')}
          </span>
        </div>

        {/* 中间：版权声明 */}
        <div className="text-slate-500 font-mono text-[11px] text-center">
          {t('copyright', { year: new Date().getFullYear() })}
        </div>

        {/* 右侧：国际化语言选择 (向上展开，完整语言显示) */}
        <div className="flex items-center">
          <LanguageSwitcher direction="up" variant="full" />
        </div>
      </div>
    </footer>
  );
}
