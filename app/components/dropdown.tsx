"use client";

import { Fragment, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export type NavItemDetail = {
  name: string;
  tagline?: string;
  href: string;
  emoji?: string;
  badge?: string;
  isExternal?: boolean;
};

type Props = {
  name: string;
  items: NavItemDetail[];
  active?: boolean;
  footerHref?: string;
  footerText?: string;
};

function getBadgeDotColor(title: string): string {
  switch (title) {
    case 'App':
      return 'bg-blue-400';
    case 'Mac App':
      return 'bg-indigo-400';
    case '小程序':
      return 'bg-emerald-400';
    case '网页':
      return 'bg-amber-400';
    case 'Chrome插件':
    case '插件':
      return 'bg-purple-400';
    case '试验场':
      return 'bg-fuchsia-400';
    default:
      return 'bg-slate-400';
  }
}

export default function NavDropDown({ name, items, active, footerHref, footerText }: Props) {
  // 将标签作为 section 进行清晰分割，去除单行上重复的 badge 胶囊
  const sections = useMemo(() => {
    const uniqueBadges = Array.from(new Set(items.map((i) => i.badge).filter(Boolean)));
    // 如果没有标签或全部属于同一标签，则作为单一列表展示，避免多余分割
    if (uniqueBadges.length <= 1) {
      return [{ title: '', items }];
    }

    const map = new Map<string, NavItemDetail[]>();
    for (const item of items) {
      const key = item.badge || '其他';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    }

    return Array.from(map.entries()).map(([title, sectionItems]) => ({
      title,
      items: sectionItems,
    }));
  }, [items]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={classNames(
            'inline-flex items-center gap-1 text-sm font-medium transition-colors py-1',
            active ? 'text-purple-400 font-semibold' : 'text-slate-300 hover:text-white'
          )}
        >
          <span>{name}</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95 -translate-y-1"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 -translate-y-1"
      >
        <Menu.Items className="absolute left-0 z-50 mt-2 w-80 sm:w-96 origin-top-left rounded-2xl bg-[#0E1324] p-2 shadow-2xl ring-1 ring-white/10 border border-white/10 focus:outline-none">
          <div className="flex flex-col space-y-1">
            {sections.map((section, sectionIdx) => {
              const showSectionHeader = Boolean(section.title);

              return (
                <div
                  key={section.title || sectionIdx}
                  className={classNames(
                    sectionIdx > 0 ? 'pt-2 mt-1 border-t border-white/10' : '',
                    'space-y-0.5'
                  )}
                >
                  {showSectionHeader && (
                    <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5 select-none">
                      <span className={classNames('w-1.5 h-1.5 rounded-full', getBadgeDotColor(section.title))} />
                      <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-slate-400">
                        {section.title}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-1">
                    {section.items.map((item) => {
                      const isExt = item.isExternal || item.href.startsWith('http');
                      const Component = isExt ? 'a' : Link;

                      return (
                        <Menu.Item key={item.name}>
                          {({ active: itemActive }) => (
                            <Component
                              href={item.href}
                              {...(isExt ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className={classNames(
                                itemActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5',
                                'group flex items-start gap-3 p-2 rounded-xl transition-all duration-150'
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-base flex-shrink-0 group-hover:bg-white/10 group-hover:shadow-sm transition-colors">
                                {item.emoji || '🚀'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                                    {item.name}
                                  </span>
                                  {/* 当没有分区时才保留单项 badge */}
                                  {!showSectionHeader && item.badge && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border bg-white/10 text-slate-300 border-white/10">
                                      {item.badge}
                                    </span>
                                  )}
                                  {isExt && (
                                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-400 opacity-70 ml-0.5" />
                                  )}
                                </div>
                                {item.tagline && (
                                  <p className="text-xs text-slate-400 truncate mt-0.5">
                                    {item.tagline}
                                  </p>
                                )}
                              </div>
                            </Component>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {footerHref && (
            <div className="mt-2 pt-2 border-t border-white/10 px-2 py-1">
              <Link
                href={footerHref}
                className="flex items-center justify-between text-xs font-semibold text-purple-400 hover:text-purple-300 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>{footerText || '查看所有产品与开发手记'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
