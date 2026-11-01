"use client";

import React from 'react';
import FloatingCapsuleNav from './FloatingCapsuleNav';
import ProductStorySection from './ProductStorySection';
import { FlappyFeedMockup, StarJarMockup, WorkoutMockup } from './DeviceMockups';
import { ShareReaderMockup } from './ExpandedMockups';

export default function ProductStoryShowcase() {
  return (
    <div className="relative w-full bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* 顶部悬浮毛玻璃胶囊导览 */}
      <FloatingCapsuleNav />

      {/* Chapter 01: FlappyFeed (左文右图) */}
      <ProductStorySection
        id="flappyfeed"
        align="left"
        badge={{
          emoji: '🕊️',
          text: 'TikTok 风格短流语料库 · 随时随地碎片化学英语',
        }}
        headlinePrefix="像刷短视频一样"
        headlineGradient="沉浸式刷英语"
        accentGradient="from-purple-400 via-violet-200 to-indigo-300"
        description="告别枯燥死板背单词。竖滑手势秒开即刷，原声音频与文本毫秒级精准对齐，点词即查，内置端侧零延迟 TTS 与上下文 AI 私教随时随地答疑解惑。"
        stats={[
          { label: '经典文学名篇', value: '1490+', hint: '持续扩展' },
          { label: '端侧零延迟 TTS', value: '0ms', hint: '原生合成' },
          { label: 'CEFR 全阶词表', value: 'A1~C2', hint: '难度自适应' },
        ]}
        primaryCta={{
          label: '免费下载 Android 安装包',
          href: 'https://flappy.bytegush.com/release/app-release.apk',
          isDownload: true,
        }}
        secondaryCta={{
          label: '🕊️ 探索详细落地页',
          href: '/products/flappyfeed',
        }}
        features={['支持 Android 8.0+', '纯净零广告干扰', '离线随播伴读', '本地优先隐私安全']}
        themeGlow="radial-gradient(circle at 65% 50%, rgba(139, 92, 246, 0.22) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)"
        deviceMockup={<FlappyFeedMockup />}
      />

      {/* Chapter 02: StarJar 星愿瓶 (右文左图 —— 视觉反转节奏) */}
      <ProductStorySection
        id="starjar"
        align="right"
        badge={{
          emoji: '⭐',
          text: '亲子微习惯打卡 · 激发内在自驱力的星愿魔法',
        }}
        headlinePrefix="把微小自律与微小坚持"
        headlineGradient="点亮为瓶中的璀璨星河"
        accentGradient="from-amber-300 via-yellow-100 to-amber-400"
        description="让成长看得见、摸得着。通过日常微习惯打卡积攒发光的物理碰撞星辰，兑换家庭心愿契约，灌溉专属微缩生态小星球。用治愈系正向反馈告别催促与说教焦虑。"
        stats={[
          { label: '物理拟真碰撞', value: '3D星愿', hint: '重力感应' },
          { label: '微缩生态灌溉', value: '小星球', hint: '动态繁茂' },
          { label: '双向正向激励', value: '心愿契约', hint: '家庭契约' },
        ]}
        primaryCta={{
          label: '🌟 探索 StarJar 星愿瓶',
          href: '/products/starjar',
        }}
        secondaryCta={{
          label: '💡 正向习惯机制与手记',
          href: '/products/starjar',
        }}
        features={['告别说教式养育', '自驱力正向循环', '治愈美学无广告', '本地优先数据不上传']}
        themeGlow="radial-gradient(circle at 35% 50%, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.06) 50%, transparent 75%)"
        deviceMockup={<StarJarMockup />}
      />

      {/* Chapter 03: 造己健身 (左文右图 —— 机能硬核) */}
      <ProductStorySection
        id="workout"
        align="left"
        badge={{
          emoji: '⚡',
          text: '硬核科学力量 · 纯粹无干扰的三维肌群解剖手记',
        }}
        headlinePrefix="解剖每一次受力发力"
        headlineGradient="重塑清晰受控的肌体力量"
        accentGradient="from-emerald-400 via-teal-200 to-cyan-300"
        description="拒绝臃肿社交推销与杂乱打卡。内置千组肌群解剖动作库、OHSA 动力链体态筛查、精准离心向心节奏与超量恢复监控，每一次训练都数据分明、硬核高效。"
        stats={[
          { label: '肌群受力动作', value: '1000+', hint: '解剖透视图' },
          { label: '动力链体态筛查', value: 'OHSA', hint: '功能性评估' },
          { label: '疲劳与恢复', value: '实时 RPE', hint: '科学负荷' },
        ]}
        primaryCta={{
          label: '🏋️‍♂️ 探索造己健身',
          href: '/products/workout',
        }}
        secondaryCta={{
          label: '🔬 动力链动作库与筛查',
          href: '/products/workout',
        }}
        features={['纯粹零广告骚扰', '拒绝私教课推销', '科学解剖受力导向', '离线秒开纯净日志']}
        themeGlow="radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.06) 50%, transparent 75%)"
        deviceMockup={<WorkoutMockup />}
      />

      {/* Chapter 04: ShareReader 原著双轨思辨阅读器 (右文左图 —— 学术科研深蓝) */}
      <ProductStorySection
        id="sharereader"
        align="right"
        badge={{
          emoji: '📖',
          text: '文献双轨思辨研读器 · 原著微观聚焦与思维树发散',
        }}
        headlinePrefix="以单份论文为宇宙"
        headlineGradient="微观聚焦 · 宏观双轨思辨"
        accentGradient="from-blue-400 via-sky-200 to-indigo-300"
        description="拒绝传统 AI 聊天窗口的线性遗忘与无根幻觉。原著文字公式划选即问，发散思维树分叉独立推演，物理坐标双向高亮反向穿梭。清晰区分原著佐证与外部引申，打造深科研工作台。"
        stats={[
          { label: '双向物理锚定', value: '100%', hint: '反向穿梭' },
          { label: '发散思维树', value: '无限分支', hint: '主线不乱' },
          { label: '本地离线支持', value: 'Ollama', hint: 'DeepSeek/API' },
        ]}
        primaryCta={{
          label: '📖 探索 ShareReader 研读器',
          href: 'https://github.com/drinking/sharereader',
          isExternal: true,
        }}
        secondaryCta={{
          label: '💡 查看双轨思辨设计哲学',
          href: '/articles',
        }}
        features={['原著内生 vs 外部引申透明标注', '公式与图表拖拽框选解析', '本地离线模型绝对隐私', '全屏沉浸与分栏比例无级调节']}
        themeGlow="radial-gradient(circle at 35% 50%, rgba(59, 130, 246, 0.22) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)"
        deviceMockup={<ShareReaderMockup />}
      />
    </div>
  );
}
