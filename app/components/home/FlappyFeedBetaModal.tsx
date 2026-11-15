"use client";

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import {
  X,
  Mail,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Gift,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  app?: 'flappyfeed' | 'starjar';
}

export default function FlappyFeedBetaModal({
  isOpen,
  onClose,
  app = 'flappyfeed',
}: BetaModalProps) {
  const t = useTranslations('BetaModal');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isStarJar = app === 'starjar';
  const appKey = isStarJar ? 'starjar' : 'flappyfeed';

  const config = {
    appName: t(`${appKey}.appName`),
    badge: t('common.badge'),
    title: t(`${appKey}.title`),
    subtitle: t(`${appKey}.subtitle`),
    giftTitle: t('common.giftTitle'),
    giftDesc: t(`${appKey}.giftDesc`),
    appCode: isStarJar ? 'starjar-google-play-beta' : 'flappyfeed-google-play-beta',
    glowColor: isStarJar ? 'bg-amber-600/20' : 'bg-purple-600/20',
    borderColor: isStarJar ? 'border-amber-500/25' : 'border-purple-500/25',
    badgeClass: isStarJar
      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
      : 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    giftCardClass: isStarJar
      ? 'from-amber-950/60 via-yellow-900/40 to-amber-950/60 border-amber-500/30'
      : 'from-purple-950/60 via-violet-900/40 to-indigo-950/60 border-purple-500/30',
    giftIconClass: isStarJar
      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
      : 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    btnGradient: isStarJar
      ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
      : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-purple-600/30',
    highlightColor: isStarJar ? 'text-amber-300' : 'text-purple-300',
    inputFocus: isStarJar
      ? 'focus:border-amber-500 focus:ring-amber-500'
      : 'focus:border-purple-500 focus:ring-purple-500',
    apkUrl: 'https://flappy.bytegush.com/release/app-release.apk',
    apkLabel: t('common.apkButton'),
    apkBadgeClass: isStarJar
      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-200'
      : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-200',
    apkDesc: t(`${appKey}.apkDesc`),
  };

  const handleClose = () => {
    onClose();
    // 延迟重置表单状态，保持关闭动画流畅
    setTimeout(() => {
      setStatus('idle');
      setErrorMsg('');
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg(t('common.errors.invalidEmail'));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          app: config.appCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('common.errors.submitFailed'));
      }

      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || t('common.errors.networkError'));
      setStatus('error');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        {/* 深色半透明毛玻璃遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-3"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-3"
            >
              <Dialog.Panel className={`w-full max-w-lg transform overflow-hidden rounded-3xl bg-[#0C101F]/95 p-6 sm:p-8 text-left align-middle shadow-[0_25px_70px_rgba(0,0,0,0.85)] border ${config.borderColor} transition-all relative`}>

                {/* 顶部环境光晕 */}
                <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 ${config.glowColor} blur-[70px] pointer-events-none rounded-full`} />

                {/* 右上角关闭按钮 */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                  aria-label={t('common.close')}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 标题与徽章 */}
                <div className="text-center pt-1 pb-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${config.badgeClass}`}>
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{config.badge}</span>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
                  >
                    {config.title}
                  </Dialog.Title>

                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
                    {config.subtitle}
                  </p>
                </div>

                {/* 终身会员特权突出展示卡片 */}
                <div className={`mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r border shadow-inner ${config.giftCardClass}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${config.giftIconClass}`}>
                      <Gift className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold ${config.highlightColor}`}>
                        <span>{config.giftTitle}</span>
                      </div>
                      <p className="text-[12px] sm:text-xs text-slate-300 leading-relaxed">
                        {config.giftDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 成功状态反馈 */}
                {status === 'success' ? (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white">{t('common.successTitle')}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {t('common.successDesc', { email })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
                    >
                      {t('common.successBtn')}
                    </button>
                  </div>
                ) : (
                  /* 邮箱输入表单 */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label htmlFor="beta-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t('common.emailLabel')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="beta-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                          }}
                          placeholder={t('common.emailPlaceholder')}
                          required
                          className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${config.inputFocus}`}
                        />
                      </div>
                      {status === 'error' && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${config.btnGradient}`}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('common.submittingBtn')}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{t('common.submitBtn')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* 或者直接下载 APK 的小字文本框 */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-xs text-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <Download className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{t('common.altDownloadPrompt')}</span>
                      </div>
                      <a
                        href={config.apkUrl}
                        download={`${config.appName}.apk`}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${config.apkBadgeClass}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{config.apkLabel}</span>
                      </a>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{config.apkDesc}</span>
                    </p>
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
