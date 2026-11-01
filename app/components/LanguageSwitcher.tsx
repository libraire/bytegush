'use client';

import React, { useTransition, Fragment } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '简体中文', short: '中' },
  { code: 'ja', label: '日本語', short: '日' },
] as const;

interface LanguageSwitcherProps {
  direction?: 'up' | 'down';
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LanguageSwitcher({
  direction = 'up',
  variant = 'compact',
  className = '',
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (nextLocale: 'en' | 'zh' | 'ja') => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];
  const isUp = direction === 'up';

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all focus:outline-none"
        title="Switch Language / 切换语言 / 言語切替"
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono text-[11px] font-semibold">
          {variant === 'full' ? currentLang.label : currentLang.short}
        </span>
        {isUp ? (
          <ChevronUp className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom={`transform opacity-0 scale-95 ${isUp ? 'translate-y-1' : '-translate-y-1'}`}
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo={`transform opacity-0 scale-95 ${isUp ? 'translate-y-1' : '-translate-y-1'}`}
      >
        <Menu.Items
          className={`absolute right-0 ${
            isUp ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
          } w-36 rounded-xl bg-[#0D1222]/95 border border-white/10 p-1 shadow-2xl backdrop-blur-xl focus:outline-none z-50`}
        >
          {languages.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => handleSelect(lang.code as any)}
                    disabled={isPending}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-purple-500/15 text-purple-300 font-semibold'
                        : active
                        ? 'bg-white/10 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
