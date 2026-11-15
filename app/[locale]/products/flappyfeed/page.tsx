import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  Download,
  Sparkles,
  Volume2,
  Star,
  CheckCircle2,
  Bot,
  ArrowRight,
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FlappyLanding' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: [
      'FlappyFeed',
      '英语学习',
      'TikTok学英语',
      'Whisper音频对齐',
      '英语原著伴读',
      'Bytegush',
    ],
  };
}

const corpusList = [
  { emoji: '🍸', title: 'The Great Gatsby', cn: '了不起的盖茨比', en: 'The Great Gatsby', ja: '華麗なるギャツビー', author: 'F. Scott Fitzgerald', level: 'B2 进阶' },
  { emoji: '👑', title: 'Pride and Prejudice', cn: '傲慢与偏见', en: 'Pride and Prejudice', ja: '高慢と偏見', author: 'Jane Austen', level: 'C1 高阶' },
  { emoji: '⛵', title: 'The Old Man and the Sea', cn: '老人与海', en: 'The Old Man and the Sea', ja: '老人と海', author: 'Ernest Hemingway', level: 'B1 中级' },
  { emoji: '👁️', title: '1984', cn: '一九八四', en: 'Nineteen Eighty-Four', ja: '1984年', author: 'George Orwell', level: 'B2 进阶' },
  { emoji: '☕', title: 'Daily English Conversations', cn: '地道日常口语会话', en: 'Daily English Conversations', ja: '日常英会話ダイアログ', author: 'Living English', level: 'A2 基础' },
  { emoji: '🎤', title: 'Historic Speeches & Talks', cn: '传世演讲与时代回响', en: 'Historic Speeches & Talks', ja: '歴史的名演説アーカイブ', author: 'Various Orators', level: 'C2 精通' },
];

export default async function FlappyFeedLandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FlappyLanding' });

  const features = t.raw('features') as Array<{
    icon: string;
    title: string;
    description: string;
    tag: string;
  }>;

  const faqs = t.raw('faqs') as Array<{
    q: string;
    a: string;
  }>;

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* 顶部背景星云光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* 左侧：核心文案与转化 CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-300 text-xs font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>{t('heroTag')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14]">
              {t('heroTitle1')}
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-200 to-indigo-300 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('heroDesc')}
            </p>

            {/* 核心亮点数据徽章 */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-amber-400 text-sm sm:text-base">{t('stat1Value')}</span>
                <span className="text-slate-400">{t('stat1Label')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-purple-400 text-sm sm:text-base">{t('stat2Value')}</span>
                <span className="text-slate-400">{t('stat2Label')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-emerald-400 text-sm sm:text-base">{t('stat3Value')}</span>
                <span className="text-slate-400">{t('stat3Label')}</span>
              </div>
            </div>

            {/* 操作 CTA 按钮：突出正式 Web 版体验与 Android 下载 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/products/flappyfeed/play"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <span>🕊️ {t('tryWebVersion')}</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </Link>

              <a
                href="https://flappy.bytegush.com/release/app-release.apk"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-base flex items-center justify-center gap-2 transition-all shadow-md hover:border-purple-400/50 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 text-slate-300" />
                <span>{t('downloadApk')}</span>
              </a>
            </div>

            {/* 特性打勾提示 */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('badgeAndroid')}</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('badgeAdFree')}</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('badgeOffline')}</span>
              </span>
            </div>
          </div>

          {/* 右侧：高度逼真设备交互 Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] sm:w-[320px] aspect-[9/18.5] bg-[#0F0F17] rounded-[48px] p-3 border-4 border-[#2E2A48] shadow-2xl shadow-purple-950/80 select-none">
              
              {/* 顶部微孔 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>

              {/* 屏幕内真实 UI 模拟 */}
              <div className="w-full h-full bg-[#0F0F17] rounded-[36px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 border border-[#26263A]">
                
                {/* 顶部应用栏 */}
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
                    <span>{t('mockupBadge')}</span>
                  </div>
                </div>

                {/* 核心短语流 */}
                <div className="my-auto space-y-3">
                  <div className="text-xs text-amber-400/90 font-semibold tracking-wider uppercase">
                    📖 The Great Gatsby
                  </div>

                  <p className="text-slate-400 leading-relaxed text-xs">
                    In my younger and more vulnerable years my father gave me some advice that I’ve
                    been turning over in my mind ever since.
                  </p>

                  {/* 正在随播高亮句子 */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/90 via-[#1A182C] to-[#161622] border border-purple-500/50 shadow-lg shadow-purple-500/10 space-y-1.5">
                    <div className="flex items-start gap-2 text-purple-200 font-semibold text-xs leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping mt-1 flex-shrink-0" />
                      <span>
                        “Whenever you feel like criticizing any one,” he told me, “just remember that
                        all the people in this world haven&apos;t had the advantages that you&apos;ve had.”
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1.5 border-t border-[#26263A]">
                      {locale === 'zh'
                        ? '“每逢你想要批评任何人的时候，”他对我说，“你要记住，这个世界上所有人并非都具备你拥有的优势。”'
                        : locale === 'ja'
                        ? '「誰かを批判したくなったときはいつも、この世の誰もが恵まれた境遇にいるわけではないことを思い出すんだ」'
                        : '“Whenever you feel like criticizing someone, just remember that not everyone has had the advantages you have had.”'}
                    </div>
                  </div>

                  {/* 点词即查交互浮层 */}
                  <div className="bg-[#1E1B30]/95 border border-purple-400/50 rounded-lg p-2.5 shadow-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-300 text-xs">criticizing</span>
                      <span className="text-[10px] text-slate-400 font-mono">/ˈkrɪtɪsaɪzɪŋ/</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {locale === 'zh' ? 'v. 批评；指责；挑剔' : locale === 'ja' ? 'v. 批判する、非難する' : 'v. indicate faults in a disapproving way'}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/50 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Audio
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Vocab
                      </span>
                    </div>
                  </div>
                </div>

                {/* 底部播放与 AI 伴学 */}
                <div className="space-y-2 pt-3 border-t border-[#26263A]">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-purple-300">
                      <span>🇺🇸</span> {t('mockupAccent')}
                    </span>
                    <span className="bg-purple-950/70 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                      <Bot className="w-3 h-3" /> {t('mockupAiTutor')}
                    </span>
                  </div>
                  <Link
                    href="/products/flappyfeed/play"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <span>🕊️ {t('tryWebVersion')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="text-center text-[10px] text-slate-500">
                    {t('mockupSwipeHint')}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================== 六大核心优势 (FEATURES) ===================== */}
      <section className="py-20 bg-[#0C101F]/70 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-purple-400 font-mono font-bold">
              {t('featuresHeader')}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t('featuresTitle')}
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="bg-[#10162B]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {f.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 经典文学语料库 (CORPUS) ===================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-purple-400 font-mono font-bold">
              {t('corpusHeader')}
            </h2>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {t('corpusTitle')}
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              {t('corpusSubtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/products/flappyfeed/play"
              className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>🕊️ {t('tryWebVersion')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {corpusList.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0F1424]/80 p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-colors flex items-start gap-4"
            >
              <div className="text-3xl p-2.5 rounded-xl bg-white/5 border border-white/10">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-900/50">
                    {item.level}
                  </span>
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  {locale === 'zh' ? item.cn : locale === 'ja' ? item.ja : item.en}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">{item.author}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 常见问题解答 (FAQ) ===================== */}
      <section className="py-20 bg-[#0A0D1A]/80 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-purple-400 font-mono font-bold">
              {t('faqsHeader')}
            </h2>
            <h3 className="text-3xl font-extrabold text-white">{t('faqsTitle')}</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#10162B]/70 rounded-2xl p-6 border border-white/10 space-y-2"
              >
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <span className="text-purple-400 font-mono">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 底部下载与行动转化为 BANNER ===================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#181630] to-indigo-950/80 border border-purple-500/40 p-8 sm:p-12 text-center shadow-2xl shadow-purple-950/50 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('bannerTag')}</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('bannerTitle')}
            </h3>

            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t('bannerDesc')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products/flappyfeed/play"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <span>🕊️ {t('bannerWebBtn')}</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </Link>

              <a
                href="https://flappy.bytegush.com/release/app-release.apk"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-base flex items-center justify-center gap-2 transition-all shadow-md hover:border-purple-400/50 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 text-slate-300" />
                <span>{t('bannerApkBtn')}</span>
              </a>
            </div>

            <div className="pt-4 text-xs text-slate-400">
              {t('bannerFooter')}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
