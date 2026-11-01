"use client";

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  Info,
  X,
  CornerDownLeft,
} from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'products' | 'labs' | 'articles' | 'pages';
  categoryLabel: string;
  emoji?: string;
  href: string;
  isExternal?: boolean;
  keywords?: string[];
}

const SEARCH_DATABASE: SearchItem[] = [
  // Bytegush 原创精选产品
  {
    id: 'flappyfeed',
    title: 'FlappyFeed',
    description: 'AI 英语流媒体精读，随时随地刷真实外媒磨耳朵，智能词汇提取',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '🕊️',
    href: '/products/flappyfeed',
    keywords: ['flappy', 'feed', '英语', '听力', '新闻', '流媒体', 'ai', '阅读'],
  },
  {
    id: 'howtosay',
    title: 'HowToSay',
    description: '地道英语表达与语境检索工具，解决中式英语 Chinglish 痛点',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '🗣️',
    href: '/products/howtosay',
    keywords: ['howtosay', '英语', '翻译', '口语', '地道', '搭配', '写作'],
  },
  {
    id: 'starjar',
    title: 'StarJar 星愿瓶',
    description: '多任务愿望沉淀与成就反馈，可视化星愿瓶任务清单与打卡体系',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '⭐',
    href: '/products/starjar',
    keywords: ['starjar', '星星', '愿望', '打卡', '习惯', '任务', '清单', '成就'],
  },
  {
    id: 'ai-player',
    title: 'AI Player 播客',
    description: '沉浸式 AI 原声双语播客播放器，音画实时律动与逐句高亮',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '🎧',
    href: '/products/player',
    keywords: ['player', '播客', '音频', '双语', '播放器', 'ai', '可视化'],
  },
  {
    id: 'woop',
    title: 'Woop 目标达成',
    description: '结构化心流达成助手，运用心理比对与执行意向破除拖延',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '🎯',
    href: '/products/woop',
    keywords: ['woop', '目标', '效率', '心理学', '习惯', '执行意图'],
  },
  {
    id: 'workout',
    title: 'Workout 极简训练',
    description: '极简离线体能训练与进阶记录，专注于自身动作与数据复盘',
    category: 'products',
    categoryLabel: '精选产品',
    emoji: '💪',
    href: '/products/workout',
    keywords: ['workout', '健身', '训练', '运动', '极简', '离线'],
  },
  {
    id: 'sharereader',
    title: 'ShareReader 论文共读讨论',
    description: '文献协作研读空间。和同行一起读论文、围绕论文原著边注讨论，AI 智能辅助分析',
    category: 'products',
    categoryLabel: '开发中产品',
    emoji: '📖',
    href: '#',
    keywords: ['sharereader', '论文', 'pdf', '学术', '文献', '科研', '伴读', '大模型', '阅读'],
  },

  // Bytegush 试验场 (Labs)
  {
    id: 'lab-visualizer',
    title: '音频可视化试验场',
    description: 'Web Audio API 实时音频频谱与 3D 粒子律动渲染试验',
    category: 'labs',
    categoryLabel: '试验场 (Labs)',
    emoji: '🧪',
    href: '/products/player',
    keywords: ['visualizer', '音频', '可视化', '试验', '频谱'],
  },
  {
    id: 'lab-wordgame',
    title: '互动单词矩阵游戏',
    description: '在趣味连词消除中强化地道语境记忆与思维敏捷度',
    category: 'labs',
    categoryLabel: '试验场 (Labs)',
    emoji: '🧩',
    href: '/products/howtosay',
    keywords: ['wordgame', '单词', '游戏', '互动', '记忆'],
  },
  {
    id: 'lab-newsstream',
    title: '英语新闻流试读',
    description: '体验轻量流媒体新闻卡片滚动与即时划词解析',
    category: 'labs',
    categoryLabel: '试验场 (Labs)',
    emoji: '📰',
    href: '/products/flappyfeed',
    keywords: ['news', '新闻流', '试读', '卡片'],
  },

  // 专栏与页面
  {
    id: 'articles',
    title: '专栏文章与评测',
    description: '精选工具深度评测、场景化工作流实操教程与独立创造者手记',
    category: 'articles',
    categoryLabel: '专栏文章',
    emoji: '📝',
    href: '/articles',
    keywords: ['articles', '专栏', '文章', '教程', '博客', '深度评测', '工作流'],
  },
  {
    id: 'about',
    title: '关于 Bytegush',
    description: '了解 Bytegush 独立工作室的设计理念、数字产品愿景与团队',
    category: 'pages',
    categoryLabel: '关于与更多',
    emoji: '💡',
    href: '/about',
    keywords: ['about', '关于', '工作室', '理念', '团队', 'contact'],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 过滤搜索结果
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return SEARCH_DATABASE;
    }
    return SEARCH_DATABASE.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords;
    });
  }, [query]);

  // 当搜索条件改变时重置选中的项
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // 重置表单
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 跳转到选中项
  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.isExternal) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.href);
    }
  };

  // 键盘快捷键导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
          <div className="flex min-h-full items-start justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95 -translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 -translate-y-2"
            >
              <Dialog.Panel
                onKeyDown={handleKeyDown}
                className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0B0F19] text-left align-middle shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10 transition-all flex flex-col divide-y divide-white/5"
              >
                {/* 搜索输入头部 */}
                <div className="relative flex items-center px-4 py-3.5 sm:px-6">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索产品、试验场、专栏文章或功能... (支持拼音与关键词)"
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors mr-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white/5 border border-white/10 rounded">
                    ESC
                  </kbd>
                </div>

                {/* 搜索结果列表 */}
                <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
                  {filteredItems.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      <p>未找到与 &quot;{query}&quot; 相关的产品或文章</p>
                      <p className="text-xs text-slate-500 mt-1">试试搜索：Flappy、HowToSay、StarJar、Woop 或 专栏</p>
                    </div>
                  ) : (
                    filteredItems.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                              : 'text-slate-300 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <span className="text-xl flex-shrink-0">{item.emoji || '🚀'}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold truncate ${isSelected ? 'text-purple-200' : 'text-white'}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 flex-shrink-0">
                                  {item.categoryLabel}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md">
                                <span>跳转</span>
                                <CornerDownLeft className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* 底部快捷键提示 */}
                <div className="px-4 py-2.5 bg-black/40 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300">↑</kbd>{' '}
                      <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300">↓</kbd> 切换选项
                    </span>
                    <span>
                      <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300">↵</kbd> 跳转
                    </span>
                  </div>
                  <div>
                    <span>
                      <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300">ESC</kbd> 关闭
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
