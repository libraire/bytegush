import React from 'react';
import type { Metadata } from 'next';
import FlappyFeedPlayer from '../components/FlappyFeedPlayer';

export const metadata: Metadata = {
  title: 'FlappyFeed Web - 沉浸式英语听读伴学 | 在线精读 | Bytegush',
  description:
    '自然文本流英文随听随读。端侧原声与 TTS 伴读，逐句高亮同步，点词即查，单句复读磨耳朵，上下文 AI 伴学私教随时答疑。',
  keywords: [
    'FlappyFeed',
    '英语学习',
    '英语外刊精读',
    '文本流朗读',
    '点词即查',
    'AI英语私教',
    'Bytegush',
  ],
};

export default function FlappyFeedPlayPage() {
  return (
    <div className="w-full h-[calc(100dvh-64px)] bg-[#080B14] text-slate-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <FlappyFeedPlayer />
    </div>
  );
}
