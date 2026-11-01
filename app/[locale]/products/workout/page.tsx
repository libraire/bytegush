import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Activity,
  ShieldAlert,
  Timer,
  BarChart3,
  Flame,
  ArrowRight,
  ExternalLink,
  Download,
  Crosshair,
  Lock
} from 'lucide-react';

export const metadata: Metadata = {
  title: '造己健身 (Workout) - 硬核科学力量与三维肌群动力链手记 | 官方落地页',
  description:
    '拒绝臃肿社交推销与杂乱打卡。内置千组肌群解剖动作库、OHSA 动力链体态筛查、精准离心向心节奏与超量恢复监控，每一次训练都数据分明、硬核高效。',
  keywords: [
    '造己健身',
    'Workout',
    '肌群解剖',
    '力量训练记录',
    'OHSA体态筛查',
    'RPE超量恢复',
    'Bytegush',
  ],
};

const pillars = [
  {
    icon: '🔬',
    title: '三维肌群动力链受力解剖',
    description:
      '每一动作详细拆解主动肌（Target）、协同肌（Synergist）与稳定肌群的受力分配比例，受力发力明明白白。',
    tag: '解剖学导向',
  },
  {
    icon: '🛡️',
    title: 'OHSA 动力链体态代偿预警',
    description:
      '动作前高亮提示常见受损代偿点（如肩胛未下沉、胸椎塌陷、骨盆前倾），在加重之前先建立安全的动力链力线。',
    tag: '运动防护',
  },
  {
    icon: '⏱️',
    title: '离心/向心节拍节奏器',
    description:
      '支持 3-1-1-0 动作离心控制节奏提示，通过声效震动引导完成充分的离心拉伸与顶峰收缩，最大化肌肥大机械张力。',
    tag: '张力控制',
  },
  {
    icon: '📈',
    title: '实时 RPE 与超量恢复监控',
    description:
      '根据自觉竭尽度（RPE）与组间心率恢复动态调整下组推荐重量与休息时间，告别过度训练与神经系统疲劳。',
    tag: '科学渐进',
  },
  {
    icon: '⚡',
    title: '单手盲打极简力量日志',
    description:
      '训练中分秒必争。大字号单手数字键盘，秒输重量与次数，自动估算单次极限（1RM）、每组吨位与周期负荷走向。',
    tag: '极简无干扰',
  },
  {
    icon: '🔒',
    title: 'Local-First 离线纯粹无广告',
    description:
      '拒绝社交朋友圈推销、拒绝卖课弹窗与蛋白粉广告。全量数据保存在本地设备，支持一键无损导出 CSV 与 JSON。',
    tag: '纯粹自由',
  },
];

const trainingSplits = [
  {
    category: '胸背超集 (Chest & Back)',
    mainMoves: '高位绳索下拉 · 哑铃卧推 · 双杠臂屈伸',
    accent: 'text-emerald-400',
    anatomy: '背阔肌 82% · 肱二 12% · 胸大肌下束 6%',
    focus: '肩胛骨后缩下沉，强化背部展开宽度',
  },
  {
    category: '下肢动力链 (Squat & Chain)',
    mainMoves: '传统杠铃深蹲 · 罗马尼亚硬拉 (RDL) · 箭步蹲',
    accent: 'text-teal-400',
    anatomy: '股四头肌 65% · 臀大肌 25% · 腘绳肌 10%',
    focus: '屈髋先于屈膝，维持足弓三点稳定着力',
  },
  {
    category: '肩臂与稳定肌群 (Shoulders & Arms)',
    mainMoves: '阿诺德推举 · 侧平举 · 绳索下压',
    accent: 'text-cyan-400',
    anatomy: '三角肌中束 78% · 冈上肌 14% · 肱三头 8%',
    focus: '肩胛骨微前引，斜方肌零代偿下压',
  },
];

const faqs = [
  {
    q: '造己健身适合初学者，还是只适合高阶健美力量选手？',
    a: '两者皆适合。初学者可以通过内置的千组动作受力解剖与 OHSA 体态预警，从第一天起掌握正确力线，远离代偿受伤；进阶选手则可利用 RPE 自觉竭尽监控、1RM 进阶曲线与离心节奏器突破平台期。',
  },
  {
    q: '为什么坚持“去社交化、零广告”？',
    a: '许多健身 App 充斥着网红打卡、社区刷屏、私教推销和各种补剂广告，严重破坏训练时的专注心流。造己健身定位为纯粹硬核的“训练手记”，器械在前，专注由你。',
  },
  {
    q: '训练数据能备份并导出吗？',
    a: '可以。我们坚守 Local-First 原则，数据归用户所有。随时支持一键导出标准 CSV 与 JSON 数据，可无缝配合 Excel、Notion 或飞书进行长期训练周期复盘。',
  },
  {
    q: '会支持 Apple Watch / 手环实时心率联动吗？',
    a: '正在规划中。未来将接入 HealthKit 组间心率回落检测，当心率恢复至基准阈值时自动提醒进入下一组。',
  },
];

export default function WorkoutLandingPage() {
  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 顶部背景星云光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[650px] h-[650px] rounded-full bg-emerald-600/12 blur-[150px]" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-600/8 blur-[140px]" />
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* 左侧：核心文案与转化 CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>硬核科学力量 · 纯粹无干扰的三维肌群解剖手记</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14]">
              解剖每一次受力发力
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                重塑清晰受控的肌体力量
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              拒绝臃肿社交推销与杂乱打卡。内置千组肌群解剖动作库、OHSA 动力链体态筛查、精准离心向心节奏与超量恢复监控，每一次训练都数据分明、硬核高效。
            </p>

            {/* 核心亮点数据徽章 */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-[#0E1724]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-emerald-400 text-sm sm:text-base">1000+</span>
                <span className="text-slate-400">肌群受力解剖动作</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E1724]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-teal-300 text-sm sm:text-base">OHSA</span>
                <span className="text-slate-400">动力链体态筛查</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E1724]/80 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <span className="font-bold text-cyan-400 text-sm sm:text-base">实时 RPE</span>
                <span className="text-slate-400">疲劳与超量恢复</span>
              </div>
            </div>

            {/* 操作 CTA 按钮 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#download"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Dumbbell className="w-5 h-5" />
                <span>🏋️‍♂️ 探索造己健身 (Workout)</span>
              </a>

              <Link
                href="/articles"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>🔬 查看动力链解剖与筛查专栏</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* 特性打勾提示 */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>纯净无广告</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>拒绝私教推销</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>科学解剖与动力学导向</span>
              </span>
            </div>
          </div>

          {/* 右侧：高度逼真设备交互 Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] sm:w-[320px] aspect-[9/18.5] bg-[#0A0E17] rounded-[48px] p-3 border-4 border-[#153026] shadow-2xl shadow-emerald-950/80 select-none">
              
              {/* 顶部灵动岛 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>

              {/* 屏幕内容 */}
              <div className="w-full h-full bg-[#0C141C] rounded-[36px] overflow-hidden flex flex-col justify-between p-4 relative pt-10 text-slate-100 border border-[#162D24]">
                
                {/* 顶部训练栏 */}
                <div className="flex justify-between items-center text-xs pb-3 border-b border-emerald-900/40">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Dumbbell className="w-4 h-4" />
                    <span>今日胸背力量超集</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full text-emerald-300 text-[10px] font-mono">
                    <span>第 4 / 6 组</span>
                  </div>
                </div>

                {/* 动作与动力链解剖 */}
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

                  {/* 肌群受力配比条 */}
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

                  {/* 组数记录 */}
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

                  {/* OHSA 提醒 */}
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
          </div>

        </div>
      </section>

      {/* ===================== 六大硬核特性 (PILLARS) ===================== */}
      <section className="py-20 bg-[#0A121C]/70 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
              Engineering Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              六大硬核工程设计，让每一次受力发力分毫毕现
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              抛弃花哨无用的社区社交打卡，还原你与器械之间纯粹受控的物理对话。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#0E1826]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
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

      {/* ===================== 经典动力链与解剖动作库 (SPLITS) ===================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
            Kinetic Chain Library
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            1000+ 肌群受力解剖动作与防护指引
          </h3>
          <p className="text-slate-400 text-sm">
            精准界定主动肌孤立度，规避常见关节代偿，让肌肥大与力量增长更高效
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingSplits.map((split, idx) => (
            <div
              key={idx}
              className="bg-[#0D1624]/80 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 relative space-y-3"
            >
              <h4 className={`font-bold text-lg ${split.accent}`}>{split.category}</h4>
              <div className="text-xs text-slate-300 font-mono bg-white/5 p-2 rounded-lg">
                {split.mainMoves}
              </div>
              <div className="text-xs text-slate-400 pt-1">
                <span className="text-slate-300 font-semibold">受力配比: </span>
                {split.anatomy}
              </div>
              <div className="text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">力线要点: </span>
                {split.focus}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 常见问题解答 (FAQ) ===================== */}
      <section className="py-20 bg-[#070D16]/80 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">常见训练与功能疑问解答</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0E1826]/70 rounded-2xl p-6 border border-white/10 space-y-2"
              >
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <span className="text-emerald-400 font-mono">Q{idx + 1}.</span>
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
          <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#10241E] to-teal-950/80 border border-emerald-500/40 p-8 sm:p-12 text-center shadow-2xl shadow-emerald-950/50 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>纯粹力量 · 还原清晰受控的肌体对话</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              开启你的硬核力量手记
            </h3>

            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              告别臃肿推销，在每一次受控离心与爆发向心中，雕刻真实力量。
            </p>

            <div className="pt-2 flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl ring-4 ring-emerald-500/30">
                <Image
                  src="/products/workout/qrcode.png"
                  alt="造己健身微信小程序码"
                  width={200}
                  height={200}
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-xs text-emerald-300 font-medium">微信「扫一扫」· 免安装直接开启训练</p>
            </div>

            <div className="pt-4 text-xs text-slate-400">
              Bytegush Studio 独立出品 · 永久纯净无广告与私教课程推销
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
