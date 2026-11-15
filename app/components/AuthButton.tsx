"use client";

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useCustomAuth } from '@/app/context/CustomAuthProvider';
import { Link } from '@/i18n/routing';
import {
  ChevronDown,
  LogOut,
  LogIn,
  Shield,
  Layers,
  PlusCircle,
  FileText,
  User as UserIcon,
} from 'lucide-react';

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminList = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'drinkingpan@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());
  return adminList.includes(email.trim().toLowerCase());
}

export default function AuthButton() {
  const t = useTranslations('Auth');
  const { user, isLoading, login, logout } = useCustomAuth();

  if (isLoading) {
    return (
      <div className="h-9 w-20 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => login()}
        className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-purple-500/40 shadow-sm hover:shadow-[0_0_15px_rgba(147,51,234,0.25)] transition-all active:scale-[0.98]"
      >
        <LogIn className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
        <span>{t('signIn')}</span>
      </button>
    );
  }

  const initial = (user.name?.[0] || user.email?.[0] || 'U').toUpperCase();
  const displayName = user.name || user.email.split('@')[0];
  const userIsAdmin = isAdmin(user.email);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-purple-500/40 shadow-sm transition-all focus:outline-none">
          {/* 头像徽标 */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-inner flex-shrink-0">
            {initial}
          </div>
          <span className="max-w-[100px] sm:max-w-[140px] truncate text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
            {displayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200 group-data-[headlessui-state=open]:rotate-180" />
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
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 sm:w-60 origin-top-right rounded-2xl bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-1.5 focus:outline-none divide-y divide-white/5">
          {/* 用户基础信息 */}
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {userIsAdmin && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-300">
                <Shield className="w-2.5 h-2.5" />
                <span>{t('admin')}</span>
              </div>
            )}
          </div>

          {/* 管理员工作台菜单 */}
          {userIsAdmin && (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-purple-400/80 font-bold">
                {t('adminDashboard')}
              </div>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/products/manage"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active ? 'bg-purple-500/15 text-purple-200' : 'text-slate-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t('manageProducts')}</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/products/create"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active ? 'bg-purple-500/15 text-purple-200' : 'text-slate-300'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t('addProduct')}</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/articles/create"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active ? 'bg-purple-500/15 text-purple-200' : 'text-slate-300'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t('writeArticle')}</span>
                  </Link>
                )}
              </Menu.Item>
            </div>
          )}

          {/* 退出登录 */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => logout()}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    active ? 'bg-rose-500/15 text-rose-300' : 'text-rose-400/90 hover:bg-rose-500/10'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('signOut')}</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
