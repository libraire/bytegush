"use client";

import React from 'react';
import Link from 'next/link';
import { Workflow, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { WorkflowStack } from '../../types/home';

interface WorkflowSectionProps {
  workflows: WorkflowStack[];
}

export default function WorkflowSection({ workflows }: WorkflowSectionProps) {
  return (
    <section className="mb-20 sm:mb-28" id="workflows">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-700 bg-paper-100 border border-paper-200 px-2.5 py-1 rounded-md shadow-tactile mb-2.5">
            <Workflow className="w-3.5 h-3.5 text-ink-600" />
            <span>BLUEPRINTS · 场景工作流配方</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ink-900 tracking-tight">
            实战场景化工作流配方
          </h2>
          <p className="text-ink-600 text-xs sm:text-sm mt-1.5 max-w-xl font-sans">
            单一工具难以发挥极致效果。我们将克制软件串联成轻盈、顺手的组合拳，助你快速进入心流。
          </p>
        </div>

        <Link
          href="/articles"
          className="inline-flex items-center text-xs font-mono font-semibold text-ink-700 hover:text-ink-900 transition-colors group"
        >
          <span>查看全部工作流教案</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {workflows.map((stack) => {
          return (
            <div
              key={stack.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-paper-200 shadow-tactile hover:shadow-tactile-hover hover:border-paper-300 transition-all duration-200"
            >
              <div>
                {/* 适用对象 */}
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-ink-600 bg-paper-100 border border-paper-200 mb-3">
                  面向：{stack.targetAudience}
                </span>

                {/* 标题与概述 */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-ink-900 mb-2">
                  {stack.title}
                </h3>
                <p className="text-xs text-ink-600 leading-relaxed mb-6 font-sans">
                  {stack.summary}
                </p>

                {/* 工具链流转卡片 */}
                <div className="space-y-2 mb-6">
                  {stack.tools.map((tool, idx) => (
                    <div
                      key={tool.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-paper-50 border border-paper-200 hover:border-paper-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-white text-[10px] font-mono font-bold text-ink-400 border border-paper-200 shadow-tactile">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-ink-900 flex items-center gap-1">
                          {tool.name}
                          {tool.isOriginal && (
                            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                              自研
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-ink-500">{tool.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 底部教程入口 */}
              <div className="pt-4 border-t border-paper-200/80 flex items-center justify-between">
                <span className="text-xs font-mono text-ink-400">完整装配配置</span>
                <Link
                  href={stack.guideSlug || '/articles'}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-ink-800 hover:text-amber-800"
                >
                  <span>查看实战蓝图</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
