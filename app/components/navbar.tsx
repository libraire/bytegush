"use client";

import { Disclosure } from '@headlessui/react';
import { useState, useEffect, useMemo } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Sparkles, ExternalLink, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import NavDropDown from './dropdown';
import AuthButton from './AuthButton';
import LanguageSwitcher from './LanguageSwitcher';
import SearchModal from './search/SearchModal';
import { Link, usePathname } from '@/i18n/routing';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const originalsNavItems = useMemo(() => [
    {
      name: t('items.flappyfeed.name'),
      tagline: t('items.flappyfeed.tagline'),
      href: '/products/flappyfeed',
      emoji: '🕊️',
      badge: t('badges.app'),
      isExternal: false,
    },
    {
      name: t('items.starjar.name'),
      tagline: t('items.starjar.tagline'),
      href: '/products/starjar',
      emoji: '⭐',
      badge: t('badges.app'),
      isExternal: false,
    },
    {
      name: t('items.sharereader.name'),
      tagline: t('items.sharereader.tagline'),
      href: 'https://github.com/drinking/sharereader',
      emoji: '📖',
      badge: t('badges.inDevelopment'),
      isExternal: true,
    },
    {
      name: t('items.bona.name'),
      tagline: t('items.bona.tagline'),
      href: '/products/bona',
      emoji: '✨',
      badge: t('badges.macApp'),
      isExternal: false,
    },
    {
      name: t('items.workout.name'),
      tagline: t('items.workout.tagline'),
      href: '/products/workout',
      emoji: '⚡',
      badge: t('badges.miniProgram'),
      isExternal: false,
    },
    {
      name: t('items.woop.name'),
      tagline: t('items.woop.tagline'),
      href: '/products/woop',
      emoji: '🛠️',
      badge: t('badges.web'),
      isExternal: false,
    },
    {
      name: t('items.howtosay.name'),
      tagline: t('items.howtosay.tagline'),
      href: '/products/howtosay',
      emoji: '🔥',
      badge: t('badges.web'),
      isExternal: false,
    },
    {
      name: t('items.player.name'),
      tagline: t('items.player.tagline'),
      href: '/products/player',
      emoji: '▶️',
      badge: t('badges.web'),
      isExternal: false,
    },
    {
      name: t('items.focusAi.name'),
      tagline: t('items.focusAi.tagline'),
      href: 'https://chromewebstore.google.com/detail/focus-ai-enhancing-your-g/pfpneagkphfohdecjjcpkgjgmdkbhbea',
      emoji: '🧩',
      badge: t('badges.extension'),
      isExternal: true,
    },
  ], [t]);

  const playgroundNavItems = useMemo(() => [
    {
      name: t('items.poker.name'),
      tagline: t('items.poker.tagline'),
      href: 'https://poker.bytegush.com',
      emoji: '🃏',
      badge: t('badges.labs'),
      isExternal: true,
    },
    {
      name: t('items.motion.name'),
      tagline: t('items.motion.tagline'),
      href: 'https://motion.bytegush.com',
      emoji: '🦾',
      badge: t('badges.labs'),
      isExternal: true,
    },
  ], [t]);

  const isArticlesActive = pathname?.startsWith('/articles');
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
                  {t('products')}
                </span>
                <span className="px-3 py-1.5 text-sm font-medium text-slate-300 cursor-pointer">
                  {t('labs')}
                </span>
                <Link
                  href="/articles"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white"
                >
                  {t('articles')}
                </Link>
                <div className="p-2 text-slate-400">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
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
                        name={t('products')}
                        items={originalsNavItems}
                        active={isOriginalsActive}
                      />
                    </div>

                    <div className="px-1">
                      <NavDropDown
                        name={t('labs')}
                        items={playgroundNavItems}
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
                      {t('articles')}
                    </Link>

                    {/* 桌面端快捷搜索按钮（简约图标） */}
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title={t('searchShortcut')}
                      aria-label={t('search')}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 右侧：鉴权按钮与移动端菜单 */}
                <div className="flex items-center gap-2">
                  {/* 移动端快捷搜索图标 */}
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="flex md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={t('searchShortcut')}
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <AuthButton />

                  {/* 移动端菜单切换按钮 */}
                  <div className="flex md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none">
                      <span className="sr-only">Toggle Main Menu</span>
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
              {/* 移动端快速搜索入口 */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-purple-400" />
                    <span>{t('searchPlaceholder')}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-400">
                    ⌘K
                  </kbd>
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                <Link
                  href="/articles"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-purple-300 transition-colors"
                >
                  📝 {t('articles')}
                </Link>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                  <span>🧪</span>
                  <span>{t('labsTitle')}</span>
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
                  {t('productListTitle')}
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

                {/* 移动端抽屉底部：语言切换 */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>{t('languageLabel')}</span>
                  <LanguageSwitcher direction="up" variant="full" />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 全局 Command + K 搜索弹窗 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
