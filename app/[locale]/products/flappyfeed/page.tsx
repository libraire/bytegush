import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';
import {
  Download,
  ExternalLink,
  Sparkles,
  Volume2,
  Star,
  CheckCircle2,
  Bot,
  BookOpen,
  Headphones,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Flame,
  Zap,
  Globe2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlappyFeed - 像刷短视频一样沉浸式刷英语 | 官方落地页',
  description:
    'FlappyFeed 是一款 TikTok 风格的沉浸式短语流英语学习应用。上下滑动即刷，AI 原声伴读，逐句高亮，点词即查，上下文 AI 私教随时解惑。提供 Android APK 免费下载与网页版 Demo。',
  keywords: [
    'FlappyFeed',
    '英语学习',
    'TikTok学英语',
    'Whisper音频对齐',
    '英语原著伴读',
    'Bytegush',
  ],
};

const features = [
  {
    icon: '📱',
    title: 'TikTok 风格竖滑刷学',
    description:
      '像刷短视频一样上下滑动切播，无需翻找繁琐章节。开箱即刷，自动播放，随时随地享受沉浸式英语母语语流。',
    tag: '极简手势',
  },
  {
    icon: '🎧',
    title: '毫秒级逐句高亮与切播',
    description:
      'Whisper 深度对齐音频与文本，播到哪句光晕跟随到哪句。点击文章中任意句子即可瞬间切播该句，随心复读。',
    tag: '声画同步',
  },
  {
    icon: '📚',
    title: '1490+ 文学名篇海量语料',
    description:
      '内置世界经典名著精华、地道日常口语与职场沟通。严格划分 A1~C2 难易度，从基础会话到深度哲思皆可掌控。',
    tag: '分级语料',
  },
  {
    icon: '🤖',
    title: '上下文感知 AI 伴学私教',
    description:
      '一键主谓宾结构拆解、初中词汇降级改写、地道替换表达与深度信达雅翻译。随时对任意长难句向 AI 发问答疑。',
    tag: '智能解析',
  },
  {
    icon: '🔍',
    title: '单击点词即查与生词本',
    description:
      '不中断阅读节奏，轻点任意单词即弹出音标、释义与发音。支持一键加入生词本，科学艾宾浩斯复习巩固。',
    tag: '零干扰查词',
  },
  {
    icon: '⚡',
    title: '端侧零延迟与多口音自由换',
    description:
      '接入端侧原生语音引擎，0 延迟、0 流量损耗，断网也能畅听。支持美音 / 英音随心切换与 0.8x~1.25x 自由变速。',
    tag: '离线优先',
  },
];

const corpusList = [
  { emoji: '🍸', title: 'The Great Gatsby', cn: '了不起的盖茨比', author: 'F. Scott Fitzgerald', level: 'B2 进阶' },
  { emoji: '👑', title: 'Pride and Prejudice', cn: '傲慢与偏见', author: 'Jane Austen', level: 'C1 高阶' },
  { emoji: '⛵', title: 'The Old Man and the Sea', cn: '老人与海', author: 'Ernest Hemingway', level: 'B1 中级' },
  { emoji: '👁️', title: '1984', cn: '一九八四', author: 'George Orwell', level: 'B2 进阶' },
  { emoji: '☕', title: 'Daily English Conversations', cn: '地道日常口语会话', author: 'Living English', level: 'A2 基础' },
  { emoji: '🎤', title: 'Historic Speeches & Talks', cn: '传世演讲与时代回响', author: 'Various Orators', level: 'C2 精通' },
];

const faqs = [
  {
    q: '需要连接外部网络或科学上网才能用吗？',
    a: '不需要。FlappyFeed 内置端侧原生高保真 TTS 语音引擎与离线文学语料库，下载安装后在飞行模式或地下铁无信号环境下均可秒开畅听畅刷。',
  },
  {
    q: 'AI 私教功能是如何运作的？',
    a: '客户端内置了轻量化语法结构解析引擎，能够即时进行主谓宾拆解与 A2 级词汇口语降级。若需要更发散的随问随答，亦支持在设置中配置你自己的 OpenAI / Gemini API Key。',
  },
  {
    q: 'iOS 用户有办法体验吗？',
    a: '有！我们提供了完整的沉浸式在线版本（可在本页点击“体验Web版”），在 iPhone 的 Safari 浏览器中点击“添加到主屏幕”即可获得原生级全屏 PWA 体验。iOS 原生客户端也正在 TestFlight 适配中。',
  },
  {
    q: '里面会有开屏广告、弹窗或诱导付费吗？',
    a: '绝对没有。FlappyFeed 是 Bytegush 独立工坊出品的纯净工具，承诺绝无开屏广告、绝无弹窗干扰、绝无隐私数据倒卖，专注于提供小而美的纯粹学习体验。',
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FlappyFeedLandingPage({ params }: Props) {
  const { locale } = await params;
  const webVersionLabel = locale === 'ja' ? 'Web版を体験' : locale === 'en' ? 'Try Web Version' : '体验Web版';

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14]">
              像刷短视频一样
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-200 to-indigo-300 bg-clip-text text-transparent">
                沉浸式刷英语
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              告别枯燥死板的背单词。竖滑手势秒开即刷，原声音频与文本毫秒级精准对齐，点词即查，上下文 AI 私教随时随地答疑解惑。
            </p>

            {/* 核心亮点数据徽章 */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-amber-400 text-sm sm:text-base">1490+</span>
                <span className="text-slate-400">经典文学名篇</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-purple-400 text-sm sm:text-base">0ms</span>
                <span className="text-slate-400">端侧零延迟 TTS</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121829]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-emerald-400 text-sm sm:text-base">A1~C2</span>
                <span className="text-slate-400">全层级难度过滤</span>
              </div>
            </div>

            {/* 操作 CTA 按钮 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="https://flappy.bytegush.com/release/app-release.apk"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>免费下载 Android 安装包 (APK)</span>
              </a>

              <Link
                href="/products/flappyfeed/play"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-900/50 via-purple-800/50 to-indigo-900/50 hover:from-purple-800/70 hover:to-indigo-800/70 text-purple-100 font-bold text-xs sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/50 hover:shadow-purple-600/30 transform hover:-translate-y-0.5"
              >
                <span>🕊️ {webVersionLabel}</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </Link>
            </div>

            {/* 特性打勾提示 */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>支持 Android 8.0+</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>纯净零广告</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>离线随播伴读</span>
              </span>
            </div>
          </div>

          {/* 右侧：高度逼真设备交互 Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] sm:w-[320px] aspect-[9/18.5] bg-[#0F0F17] rounded-[48px] p-3 border-4 border-[#2E2A48] shadow-2xl shadow-purple-950/80 select-none">
              
              {/* 顶部灵动岛 */}
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
                    <span>中级 B1-B2</span>
                  </div>
                </div>

                {/* 核心短语流 */}
                <div className="my-auto space-y-3">
                  <div className="text-xs text-amber-400/90 font-semibold tracking-wider uppercase">
                    📖 The Great Gatsby · 经典文学
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
                      “每逢你想要批评任何人的时候，”他对我说，“你要记住，这个世界上所有人并非都具备你拥有的优势。”
                    </div>
                  </div>

                  {/* 点词即查交互浮层 */}
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

                {/* 底部播放与 AI 伴学 */}
                <div className="space-y-2 pt-3 border-t border-[#26263A]">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-purple-300">
                      <span>🇺🇸</span> 美音 1.0x
                    </span>
                    <span className="bg-purple-950/70 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                      <Bot className="w-3 h-3" /> AI 伴学解惑
                    </span>
                  </div>
                  <Link
                    href="/products/flappyfeed/play"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <span>🕊️ {webVersionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="text-center text-[10px] text-slate-500">
                    👆 竖滑切换下一篇短篇 · 支持点词即查
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
              Core Innovations
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              六大设计亮点，重新定义碎片化刷英语
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              以认知科学与第二语言习得规律为导向，打造极简、高效、无痛的母语输入流。
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
              Curated Literary Corpus
            </h2>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              1490+ 精选文学大家名著与经典语料
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              收录菲茨杰拉德、简·奥斯汀、海明威、乔治·奥威尔等传世作家的经典原著，沉浸于文学与地道思辨之美。
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded-lg text-xs font-medium">
              中英双语毫秒对齐
            </span>
            <span className="px-3 py-1 bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded-lg text-xs font-medium">
              母语级原声伴读
            </span>
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
                <div className="text-xs text-purple-300 mt-1">{item.cn}</div>
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
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">常见问题与解答</h3>
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
              <span>纯净免费 · 开启你的碎片化输入流</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              准备好告别死板背单词了吗？
            </h3>

            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              只需一次点击，即可在手机或浏览器中随时随地开启世界文学与母语语流伴读。
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://flappy.bytegush.com/release/app-release.apk"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>免费下载 Android APK (v1.0.0)</span>
              </a>

              <Link
                href="/products/flappyfeed/play"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-purple-500/50 bg-purple-950/50 hover:bg-purple-900/70 text-purple-200 font-bold text-xs sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/40 transform hover:-translate-y-0.5"
              >
                <span>🕊️ {webVersionLabel}</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </Link>
            </div>

            <div className="pt-4 text-xs text-slate-400">
              Bytegush Studio 独立出品 · 永久纯净无商业广告
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
