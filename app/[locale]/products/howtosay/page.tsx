import React from 'react';
import type { Metadata } from 'next';
import WordGameStudio from './components/WordGameStudio';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HowToSay' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: [
      'HowToSay',
      'Word Streak Challenge',
      'Vocabulary Guessing',
      'CEFR English Vocabulary',
      'Bytegush',
    ],
  };
}

export default async function HowToSayPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'HowToSay' });

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 顶部环境光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 头部 Hero 区域 */}
      <header className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          {t('heroPrefix')}{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
            {t('heroHighlight')}
          </span>
        </h1>
      </header>

      {/* 核心猜词连击工作台 */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <WordGameStudio />
      </section>
    </div>
  );
}
