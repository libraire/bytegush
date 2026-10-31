import React from 'react';
import type { Metadata } from 'next';
import WordGameStudio from './components/WordGameStudio';

export const metadata: Metadata = {
  title: 'HowToSay - 连击猜单词挑战 · 极简背词游戏 | Bytegush Studio',
  description:
    '看你能连续猜中多少个单词！HowToSay 连击猜词挑战，采用英文解释（英英释义）沉浸式猜词，沿用经典打字交互一个字母一个字母精准敲击输入，基于国际 CEFR (A1~C2) 难度自适应晋升，挑战连击极限。',
  keywords: [
    'HowToSay',
    '猜单词游戏',
    '连击背单词',
    '英文解释猜词',
    '英英释义',
    'CEFR词汇分级',
    '英语词汇积累',
    'Bytegush',
  ],
};

export default function HowToSayPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 顶部环境光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 头部 Hero 区域 */}
      <header className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          看你能连续猜中
          <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
            多少个单词？
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
