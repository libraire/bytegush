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
    <div className="w-full h-[calc(100vh-64px)] bg-[#05070E] overflow-hidden flex justify-center">
      <AIPlayerStudio />
    </div>
  );
}
