"use client";

import { Disclosure } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Sparkles, ExternalLink } from 'lucide-react';
import NavDropDown from './dropdown';
import AuthButton from './AuthButton';
import LanguageSwitcher from './LanguageSwitcher';
import { Link, usePathname } from '@/i18n/routing';

const originalsNavItems = [
  {
    name: 'FlappyFeed',
    tagline: '像刷短视频一样上下滑动沉浸式刷英语',
    href: '/products/flappyfeed',
    emoji: '🕊️',
    badge: 'App',
    isExternal: false,
  },
  {
    name: 'StarJar 星愿瓶',
    tagline: '把微小坚持点亮为星河的亲子正向激励习惯神器',
    href: '/products/starjar',
    emoji: '⭐',
    badge: 'App',
    isExternal: false,
  },
  {
    name: 'Bona',
    tagline: '重塑心流的高审美数字工作台',
    href: '/products/bona',
    emoji: '✨',
    badge: 'Mac App',
    isExternal: false,
  },
  {
    name: '造己健身',
    tagline: '纯粹无干扰的三维肌群解剖与动力链科学训练手记',
    href: '/products/workout',
    emoji: '⚡',
    badge: '小程序',
    isExternal: false,
  },
  {
    name: 'Woop',
    tagline: '面向开发者的瑞士军刀效率工具箱',
    href: '/products/woop',
    emoji: '🛠️',
    badge: '网页',
    isExternal: false,
  },
  {
    name: 'HowToSay',
    tagline: '单词连击闯关 · 猜词与语调训练',
    href: '/products/howtosay',
    emoji: '🔥',
    badge: '网页',
    isExternal: false,
  },
  {
    name: 'AI Player',
    tagline: '结合 AI 实时伴学的双语智能播放器',
    href: '/products/player',
    emoji: '▶️',
    badge: '网页',
    isExternal: false,
  },
  {
    name: 'Focus AI',
    tagline: 'Gemini 与网页无缝集成的侧边栏扩展',
    href: 'https://chromewebstore.google.com/detail/focus-ai-enhancing-your-g/pfpneagkphfohdecjjcpkgjgmdkbhbea',
    emoji: '🧩',
    badge: 'Chrome插件',
    isExternal: true,
  },
];

const playgroundNavItems = [
  {
    name: '干瞪眼扑克',
    tagline: '极具对抗与戏剧性的经典扑克对战游戏',
    href: 'https://poker.bytegush.com',
    emoji: '🃏',
    badge: '试验场',
    isExternal: true,
  },
  {
    name: 'Motion 体感手势',
    tagline: '端侧视觉 AI 与摄像头姿态捕捉互动',
    href: 'https://motion.bytegush.com',
    emoji: '🦾',
    badge: '试验场',
    isExternal: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isArticlesActive = pathname?.startsWith('/articles');
  const isAboutActive = pathname === '/about';
  const isOriginalsActive = pathname?.startsWith('/product');

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080B14]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center group">
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-white leading-none group-hover:text-purple-300 transition-colors">
                    Bytegush
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
                    Indie Studio
                  </span>
                </div>
              </Link>
              <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
                <span className="px-3 py-1.5 text-sm font-medium text-slate-300 cursor-pointer">
                  产品列表 ▾
                </span>
                <span className="px-3 py-1.5 text-sm font-medium text-slate-300 cursor-pointer">
                  🧪 试验场 ▾
                </span>
                <Link
                  href="/articles"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white"
                >
                  专栏
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Disclosure
      as="nav"
      className="fixed top-0 left-0 right-0 z-50 bg-[#080B14]/85 backdrop-blur-md border-b border-white/10 transition-all shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
    >
      {({ open }) => (
        <>
          <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex h-16 items-center justify-between">
              {/* 左侧：Brand 与主要导航项 */}
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center group">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-tight text-white leading-none group-hover:text-purple-300 transition-colors">
                      Bytegush
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
                      Indie Studio
                    </span>
                  </div>
                </Link>

                {/* 桌面端导航 */}
                <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
                  <div className="px-1">
                    <NavDropDown
                      name="产品列表"
                      items={originalsNavItems}
                      active={isOriginalsActive}
                    />
                  </div>

                  <div className="px-1">
                    <NavDropDown
                      name="🧪 试验场"
                      items={playgroundNavItems}
                      footerHref="/#playground"
                      footerText="探索 Bytegush 试验场"
                    />
                  </div>

                  <Link
                    href="/articles"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isArticlesActive
                        ? 'text-purple-400 font-semibold bg-white/10 border border-purple-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    专栏
                  </Link>
                </div>
              </div>

              {/* 右侧：语言切换器与鉴权按钮 */}
              <div className="flex items-center gap-2.5">
                <LanguageSwitcher />
                <AuthButton />

                {/* 移动端菜单切换按钮 */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none">
                    <span className="sr-only">打开主菜单</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* 移动端抽屉面板 */}
          <Disclosure.Panel className="md:hidden border-b border-white/10 bg-[#0D1222]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-1">
              <Link
                href="/articles"
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-purple-300 transition-colors"
              >
                📝 专栏
              </Link>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <span>🧪</span>
                <span>Bytegush 试验场 (Labs)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {playgroundNavItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{item.emoji}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-fuchsia-400 opacity-70 ml-1 flex-shrink-0" />
                  </a>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Bytegush 产品列表
              </div>
              <div className="space-y-3">
                {Array.from(new Set(originalsNavItems.map((i) => i.badge))).map((badge) => {
                  const sectionItems = originalsNavItems.filter((i) => i.badge === badge);
                  return (
                    <div key={badge} className="space-y-1.5">
                      <div className="text-[11px] font-mono font-semibold text-slate-400 px-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{badge}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sectionItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            target={item.isExternal ? '_blank' : undefined}
                            rel={item.isExternal ? 'noopener noreferrer' : undefined}
                            className="flex items-center justify-between p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span>{item.emoji}</span>
                              <span className="truncate">{item.name}</span>
                            </div>
                            {item.isExternal && (
                              <ExternalLink className="w-3 h-3 text-slate-400 opacity-70 ml-1 flex-shrink-0" />
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
