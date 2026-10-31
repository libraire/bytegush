import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Heart,
  Orbit,
  Gift,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Smile,
  Compass,
  Download,
  BookOpen
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'StarJar 星愿瓶 - 亲子微习惯打卡与内在自驱力魔法 | 官方落地页',
  description:
    '让成长看得见、摸得着。通过日常微习惯打卡积攒发光的物理碰撞星辰，兑换家庭心愿契约，灌溉专属微缩生态小星球。用治愈系正向反馈告别催促与焦虑。',
  keywords: [
    'StarJar',
    '星愿瓶',
    '亲子习惯养成',
    '自驱力培养',
    '微习惯打卡',
    '小王子生态瓶',
    'Bytegush',
  ],
};

const pillars = [
  {
    icon: '🪐',
    title: '3D 拟真物理碰撞星愿瓶',
    description:
      '每完成一项微习惯，一颗发光星辰跃入瓶中。采用真实刚体碰撞物理引擎，轻晃设备即可倾听星辰清脆悦耳的碰撞声。',
    tag: '物理引擎',
  },
  {
    icon: '🌱',
    title: '微缩生态星球成长灌溉',
    description:
      '自律不再是枯燥的数字打勾。持续积攒星愿将灌溉属于孩子的小星球，见证绿植蔓延、溪流汇聚与微缩生态的生机繁茂。',
    tag: '具象反馈',
  },
  {
    icon: '🎯',
    title: '家庭心愿双向契约机制',
    description:
      '孩子自主设定心愿奖品（如乐高积木、天文馆之行），家长设定兑换额度。平等透明的契约协商，彻底告别催促与情绪内耗。',
    tag: '平等契约',
  },
  {
    icon: '⏳',
    title: '微阻力原子习惯设计',
    description:
      '遵循《微习惯》科学法则，支持将大目标拆解为“早起自主整理书桌”、“自主阅读 15 分钟”等低门槛微动作，轻松启动心流。',
    tag: '认知科学',
  },
  {
    icon: '🎨',
    title: '治愈系手绘宇宙美学',
    description:
      '专为家庭与儿童打造的宁静星空美学，拒绝喧闹的花哨特效，全站零商业广告，保护孩子的视力与专注力。',
    tag: '纯净无广告',
  },
  {
    icon: '🔒',
    title: '本地优先与家庭数据私有',
    description:
      '成长记忆弥足珍贵。数据完全保存在设备本地，支持端对端离线备份与家庭局域网多端同步，隐私安全无忧。',
    tag: 'Local-First',
  },
];

const habitLoopSteps = [
  {
    step: '01',
    title: '心愿契约共定',
    desc: '孩子与父母共同商定一个心仪心愿（如“乐高探索号航天飞机”），量化所需星愿数量，建立信任契约。',
    emoji: '📝',
  },
  {
    step: '02',
    title: '日常微动作打卡',
    desc: '早起整理桌面、自主完成阅读，轻点打卡，璀璨星辰落入物理星愿瓶，给予即时视听正向多巴胺反馈。',
    emoji: '⭐',
  },
  {
    step: '03',
    title: '小星球生态繁茂',
    desc: '随着星愿积攒，小王子微缩生态星球解锁新植物与微风天气，让孩子亲眼看见“坚持所带来的美好改变”。',
    emoji: '🌿',
  },
  {
    step: '04',
    title: '兑现高光时刻',
    desc: '满瓶星辰兑现心愿契约，收获内在自豪感与自驱力正向循环，自然而然建立下一阶段的自律新契约。',
    emoji: '🎉',
  },
];

const faqs = [
  {
    q: '为什么用星愿瓶比传统的纸质积分表或打勾本更有效？',
    a: '传统纸面打勾容易流于形式且反馈延迟。StarJar 结合了即时多巴胺回路与具体化隐喻：发光的物理碰撞星辰与小星球生态的生机盎然，让抽象的“坚持”具象化为摸得着、看得见的成长奇迹。',
  },
  {
    q: '这会不会导致孩子“为了得到星星才做事情”？',
    a: 'StarJar 在契约设计中强调“内在目标连接”与“微缩生态灌溉”。孩子关注的不仅是数字，更是自己的小星球从荒漠到郁郁葱葱的创造过程，从而在微习惯中体悟自律本身的充实与成就。',
  },
  {
    q: '支持多孩家庭或多个心愿并行吗？',
    a: '支持。你可以为每个孩子创建专属的小星球与星愿瓶，并设置分类任务池（自主生活、学术阅读、运动体能、家庭协作）。',
  },
  {
    q: '支持哪些操作系统与设备？',
    a: '目前提供 Android 离线原生安装包与 Web PWA 全端支持，iOS 原生客户端正在 TestFlight 完善中，所有设备数据均支持无缝同步。',
  },
];

export default function StarJarLandingPage() {
  return (
    <div className="min-h-screen bg-[#090C16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 顶部背景星云光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[650px] h-[650px] rounded-full bg-amber-500/12 blur-[150px]" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-yellow-500/8 blur-[140px]" />
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* 左侧：核心文案与转化 CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>亲子正向激励习惯神器 · 告别催促与焦虑</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14]">
              把每次自律与微小坚持
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                点亮为瓶中的璀璨星河
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              让成长看得见、摸得着。通过日常微习惯打卡积攒发光的物理碰撞星辰，兑换家庭心愿契约，灌溉专属微缩生态小星球。用治愈系正向反馈告别催促与内耗。
            </p>

            {/* 核心亮点数据徽章 */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-[#141824]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-amber-400 text-sm sm:text-base">3D 物理拟真</span>
                <span className="text-slate-400">重力碰撞星愿瓶</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141824]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-yellow-300 text-sm sm:text-base">微缩生态</span>
                <span className="text-slate-400">灌溉小星球</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141824]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-amber-400 text-sm sm:text-base">双向正向</span>
                <span className="text-slate-400">心愿家庭契约</span>
              </div>
            </div>

            {/* 操作 CTA 按钮 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#download"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                <span>🌟 开启星愿瓶体验 (StarJar)</span>
              </a>

              <Link
                href="/articles"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>💡 阅读习惯心理学与机制手记</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* 特性打勾提示 */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>告别催促与说教式养育</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>自驱力正向多巴胺循环</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>治愈美学无任何商业广告</span>
              </span>
            </div>
          </div>

          {/* 右侧：高度逼真设备交互 Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] sm:w-[320px] aspect-[9/18.5] bg-[#0A0D18] rounded-[48px] p-3 border-4 border-[#3D2C1B] shadow-2xl shadow-amber-950/80 select-none">
              
              {/* 顶部灵动岛 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>

              {/* 屏幕内容 */}
              <div className="w-full h-full bg-[#0E1324] rounded-[36px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 border border-[#2E2419]">
                
                {/* 顶部生态栏 */}
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

                {/* 核心微缩生态与习惯项 */}
                <div className="my-auto space-y-3 text-center">
                  <div className="relative mx-auto w-32 h-32 rounded-2xl bg-gradient-to-b from-amber-500/10 to-indigo-950/40 border border-amber-500/30 flex items-center justify-center p-2 shadow-inner">
                    <Image
                      src="/products/starjar/terrarium.png"
                      alt="StarJar 微缩生态"
                      width={120}
                      height={120}
                      className="object-contain drop-shadow-[0_10px_20px_rgba(245,158,11,0.25)] animate-pulse"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold">
                      Lv.3 繁茂
                    </div>
                  </div>

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

                  {/* 心愿契约进度条 */}
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

                {/* 底部提示 */}
                <div className="pt-2 border-t border-amber-900/30 text-center text-[10px] text-amber-300/80">
                  ✨ 轻触星愿瓶倾听星辰清脆回响
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================== 六大激励体系 (PILLARS) ===================== */}
      <section className="py-20 bg-[#0E1324]/70 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold">
              Core Foundations
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              六大自驱力体系，把催促化作孩子的主动探索
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              告别“不催不动”的养育内耗，用认知心理学与治愈微缩生态让孩子爱上微小坚持。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#131A30]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {p.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 习惯心流四大阶段 (HABIT LOOP) ===================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold">
            The Positive Habit Loop
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            如何用四步构建牢不可破的正向回路？
          </h3>
          <p className="text-slate-400 text-sm">
            契约共定 → 动作打卡 → 生态反哺 → 愿望兑现，形成自驱飞轮
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {habitLoopSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#11172A]/80 p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-amber-400/30 font-mono">
                  {step.step}
                </span>
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <h4 className="font-bold text-lg text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 常见问题解答 (FAQ) ===================== */}
      <section className="py-20 bg-[#0B0F1E]/80 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">常见问题与养育疑问解答</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#12182B]/70 rounded-2xl p-6 border border-white/10 space-y-2"
              >
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <span className="text-amber-400 font-mono">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 底部下载与行动转化为 BANNER ===================== */}
      <section id="download" className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#211B15] to-orange-950/80 border border-amber-500/40 p-8 sm:p-12 text-center shadow-2xl shadow-amber-950/50 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>让成长具象化 · 告别催促养育</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              点亮瓶中第一颗璀璨星辰
            </h3>

            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              与孩子订立第一份心愿契约，灌溉属于他的微缩生态星球。
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#download"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>免费体验 StarJar 星愿瓶</span>
              </a>

              <Link
                href="/articles"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>💡 阅读评测专栏深度手记</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            <div className="pt-4 text-xs text-slate-400">
              Bytegush Studio 独立出品 · 永久纯净无广告与付费弹窗
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
