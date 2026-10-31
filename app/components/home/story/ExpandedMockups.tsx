"use client";

import React from 'react';
import { Sparkles, Terminal, FileText, Cpu, ShieldCheck, Flame, GitBranch, ArrowRight, Play } from 'lucide-react';

export function ShareReaderMockup() {
  return (
    <div className="relative group/sr w-full max-w-[480px] lg:max-w-[540px] mx-auto select-none">
      {/* 底部扩散式深蓝环境光晕 */}
      <div className="absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl opacity-40 bg-blue-500/25 group-hover/sr:opacity-60 transition-opacity duration-700 pointer-events-none" />

      {/* 桌面科研工作台外壳 */}
      <div className="relative aspect-[16/11.5] bg-[#0B0F19] rounded-[28px] sm:rounded-[32px] p-2 sm:p-2.5 border-[2.5px] border-blue-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#070A12]/80">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] font-mono text-slate-400">
              ShareReader · Attention_Is_All_You_Need.pdf
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono bg-blue-950/80 border border-blue-800/60 text-blue-300 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>本地 Ollama / DeepSeek</span>
          </div>
        </div>

        {/* 双轨工作台主体：左侧文献微观，右侧发散思维 */}
        <div className="flex-1 grid grid-cols-12 gap-2 p-2.5 sm:p-3 overflow-hidden text-xs">
          
          {/* 左侧 7 列：PDF 文献研读区 */}
          <div className="col-span-7 bg-[#05070D] rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-1 border-b border-white/5">
                <span>Section 3.2 · P.4</span>
                <span className="text-blue-400">缩放 125%</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed font-serif">
                An attention function can be described as mapping a query and a set of key-value pairs to an output...
              </p>

              {/* 划选高亮与浮动气泡 */}
              <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-400/40 text-[10px] text-blue-200">
                <div className="font-mono text-[9px] text-blue-300 font-bold mb-0.5">
                  [公式框选: Scaled Dot-Product]
                </div>
                <div className="font-serif italic text-slate-300">
                  Attention(Q, K, V) = softmax(QK^T / √d_k)V
                </div>
              </div>

              {/* 划选专属操作胶囊 */}
              <div className="flex items-center gap-1 pt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-600/40 border border-blue-400/50 text-[9px] text-blue-200 flex items-center gap-0.5">
                  🎯 聚焦研读
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-600/40 border border-purple-400/50 text-[9px] text-purple-200 flex items-center gap-0.5">
                  🌿 发散追问
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-600/40 border border-amber-400/50 text-[9px] text-amber-200 flex items-center gap-0.5">
                  📝 原著边注
                </span>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-white/5">
              <span>物理坐标双向反向锚定</span>
              <span className="text-emerald-400">坐标就绪</span>
            </div>
          </div>

          {/* 右侧 5 列：双轨思辨与思维树 */}
          <div className="col-span-5 bg-[#070A14] rounded-xl p-2.5 border border-blue-900/30 flex flex-col justify-between space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] text-blue-300 font-bold">
                <GitBranch className="w-3 h-3 text-blue-400" />
                <span>发散思维树 (第2分支)</span>
              </div>

              {/* 原著内生论点卡片 */}
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-blue-500/30 text-[9px] space-y-0.5">
                <div className="flex items-center justify-between text-blue-400 font-mono">
                  <span>[原著佐证]</span>
                  <span className="underline cursor-pointer">P.4: 点积防饱和</span>
                </div>
                <div className="text-slate-300 leading-tight">
                  √d_k 因子有效避免大维度点积落入 Softmax 梯度极小区。
                </div>
              </div>

              {/* 外部引申分支卡片 */}
              <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[9px] space-y-0.5">
                <div className="flex items-center justify-between text-purple-300 font-mono">
                  <span>[外部引申]</span>
                  <span>FlashAttention-2</span>
                </div>
                <div className="text-slate-400 leading-tight">
                  Tiling 分块计算减少 SRAM 与 HBM 数据搬运。
                </div>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-[9px] text-blue-300 text-center font-mono">
              💡 点击任意论据芯片穿梭至原著
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function PokerMockup() {
  return (
    <div className="relative group/poker w-full max-w-[480px] lg:max-w-[540px] mx-auto select-none">
      {/* 底部扩散式琥珀金环境光晕 */}
      <div className="absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl opacity-40 bg-amber-500/25 group-hover/poker:opacity-60 transition-opacity duration-700 pointer-events-none" />

      {/* 牌局桌面外壳 */}
      <div className="relative aspect-[16/11.5] bg-[#0E1017] rounded-[28px] sm:rounded-[32px] p-2 sm:p-2.5 border-[2.5px] border-amber-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between">
        
        {/* 顶部对局状态 */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-900/30 bg-[#0A0D15]/80">
          <div className="flex items-center gap-2">
            <span className="text-sm">🃏</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              干瞪眼对局 · 房间 #8921
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="text-amber-400">上家余牌: 2 张</span>
            <span>·</span>
            <span className="text-emerald-400">下家余牌: 4 张</span>
          </div>
        </div>

        {/* 中间桌面：对手牌型与当前轮次牌 */}
        <div className="my-auto flex flex-col items-center justify-center space-y-2 py-2">
          <div className="text-[10px] font-mono text-slate-400">
            桌面上牌 (上家打出 3 张 8)：
          </div>
          
          {/* 当前桌面出牌 */}
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-slate-300 flex flex-col justify-between text-xs">
              <span>8</span>
              <span className="text-red-600 text-right">♥️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-slate-300 flex flex-col justify-between text-xs">
              <span>8</span>
              <span className="text-slate-900 text-right">♠️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-slate-300 flex flex-col justify-between text-xs">
              <span>8</span>
              <span className="text-red-600 text-right">♦️</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-amber-400 font-semibold animate-pulse">
            💥 轮到你出牌：需出 3 张 9 或 炸弹！
          </div>
        </div>

        {/* 底部玩家手牌与操作按钮 */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* 手牌排列 */}
          <div className="flex items-center -space-x-2">
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-amber-400 -translate-y-2 flex flex-col justify-between text-xs">
              <span>9</span>
              <span className="text-slate-900 text-right">♣️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-amber-400 -translate-y-2 flex flex-col justify-between text-xs">
              <span>9</span>
              <span className="text-red-600 text-right">♦️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-amber-400 -translate-y-2 flex flex-col justify-between text-xs">
              <span>9</span>
              <span className="text-slate-900 text-right">♠️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-slate-300 flex flex-col justify-between text-xs">
              <span>J</span>
              <span className="text-red-600 text-right">♥️</span>
            </div>
            <div className="w-9 h-13 rounded-lg bg-white text-slate-950 font-bold p-1 shadow-md border border-slate-300 flex flex-col justify-between text-xs">
              <span>2</span>
              <span className="text-slate-900 text-right">♠️</span>
            </div>
          </div>

          {/* 出牌行动按钮 */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-transform flex items-center gap-1">
              <span>🃏 截胡出牌 (3张9)</span>
            </button>
            <button className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-colors">
              干瞪眼过
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export function MotionMockup() {
  return (
    <div className="relative group/motion w-full max-w-[480px] lg:max-w-[540px] mx-auto select-none">
      {/* 底部扩散式霓虹青环境光晕 */}
      <div className="absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl opacity-40 bg-cyan-500/25 group-hover/motion:opacity-60 transition-opacity duration-700 pointer-events-none" />

      {/* 摄像头动捕取景框外壳 */}
      <div className="relative aspect-[16/11.5] bg-[#080E17] rounded-[28px] sm:rounded-[32px] p-2 sm:p-2.5 border-[2.5px] border-cyan-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between">
        
        {/* 顶部摄像头与端侧推理状态 */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-900/40 bg-[#040810]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold text-cyan-300 font-mono">
              端侧 60FPS 实时骨骼姿态推断
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>0 Bytes 图像上传 · 端侧安全</span>
          </div>
        </div>

        {/* 取景画面：拟真骨骼连线 */}
        <div className="relative my-auto flex-1 rounded-xl bg-gradient-to-b from-[#091524] to-[#040812] border border-cyan-500/20 m-1 flex items-center justify-center overflow-hidden">
          {/* 背景瞄准网格与雷达同心圆 */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          {/* 实时骨骼关节点拟真模拟 */}
          <div className="relative w-40 h-44 flex flex-col items-center justify-between">
            {/* 头部关节点 */}
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-cyan-400/20 flex items-center justify-center text-[10px] text-cyan-200">
              👤
            </div>
            {/* 肩膀与手臂连线 */}
            <div className="w-32 h-1 bg-cyan-400/80 rounded relative">
              <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-cyan-300 animate-pulse" />
              <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400" />
              <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-cyan-300 animate-pulse" />
            </div>
            {/* 脊柱线 */}
            <div className="w-1 h-16 bg-cyan-400/60 rounded" />
            {/* 胯部连线 */}
            <div className="w-24 h-1 bg-cyan-400/80 rounded relative">
              <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-cyan-400" />
              <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-cyan-400" />
            </div>
          </div>

          {/* 浮动识别气泡 */}
          <div className="absolute top-3 left-3 bg-[#0B1726]/90 border border-cyan-400/40 rounded-xl p-2 text-xs text-cyan-200 space-y-0.5 shadow-lg">
            <div className="font-bold flex items-center gap-1 text-[11px]">
              <span>✌️</span> 剪刀手手势识别 (置信度 99.4%)
            </div>
            <div className="text-[9px] text-cyan-400/80 font-mono">
              动作触发: 翻转手牌 / 攻击指令生效
            </div>
          </div>
        </div>

        {/* 底部帧率与延迟指标 */}
        <div className="px-3 py-1.5 border-t border-cyan-900/40 bg-[#040810]/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">17 骨骼关节点</span>
            <span>·</span>
            <span>端侧推理延迟 16ms</span>
          </div>
          <div className="text-cyan-300 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> WebGPU 加速
          </div>
        </div>

      </div>
    </div>
  );
}
