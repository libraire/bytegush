import React from 'react';
import type { Metadata } from 'next';
import PipelineStudio from './components/PipelineStudio';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Woop - 面向开发者的瑞士军刀级效率工具箱 | Bytegush Studio',
  description:
    'Woop 是专为全栈与独立开发者打造的轻量级纯前端数据清洗与格式转换工作台。支持类似 Unix 管道流的链式组合执行（Base64、JSON、驼峰下划线互转、SQL 建表转 TypeScript/Java 实体、行去重排序）。100% 浏览器本地安全运行，代码与隐私绝不上云。',
  keywords: [
    'Woop',
    '开发者工具箱',
    '数据转换流水线',
    'SQL转TypeScript',
    'HTTP Headers转JSON',
    'Base64编解码',
    'Bytegush',
    '出海独立开发',
  ],
};

export default function WoopPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ===================== 顶部微背景光斑 ===================== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* ===================== HERO 区块 ===================== */}
      <header className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-3">
        {/* 主标题 */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          面向开发者的
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            瑞士军刀级效率工具箱
          </span>
        </h1>

        {/* 副标题 */}
        <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
          基于 Unix 管道流串联你的数据工序，100% 浏览器本地纯前端运行，安全极速。
        </p>
      </header>

      {/* ===================== 核心交互工作台 (Live Pipeline Studio) ===================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <PipelineStudio />
      </section>
    </div>
  );
}
