"use client";

import { Fragment } from 'react';
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

export default function NavDropDown({ name, items, active, footerHref, footerText }: Props) {
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
          <div className="grid grid-cols-1 gap-1">
            {items.map((item) => {
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
                        'group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150'
                      )}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-white/10 group-hover:shadow-sm transition-colors">
                        {item.emoji || '🚀'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span
                              className={classNames(
                                'px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border',
                                item.badge === 'App'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : item.badge === '小程序'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : item.badge === '网页'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : item.badge === '插件'
                                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                  : item.badge === '试验场'
                                  ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
                                  : 'bg-white/10 text-slate-300 border-white/10'
                              )}
                            >
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
