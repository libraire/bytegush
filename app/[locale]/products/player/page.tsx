import React from 'react';
import type { Metadata } from 'next';
import AIPlayerStudio from './components/AIPlayerStudio';

export const metadata: Metadata = {
  title: 'AI Player - 双语智能伴学播放器 | Bytegush',
  description:
    '智能音视频与双语字幕伴学播放器，毫秒级逐句对齐、悬浮即播，内置 DeepSeek AI 私教，实时语法剖析、中英精译与地道表达伴读。',
  keywords: ['AI Player', '双语播放器', 'SRT 字幕', 'DeepSeek', '英语学习', '视频伴学'],
};

export default function AIPlayerPage() {
  return (
    <main className="w-full min-h-screen bg-[#070A12] pt-16">
      <AIPlayerStudio />
    </main>
  );
}
