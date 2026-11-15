'use client';

import React, { useEffect } from 'react';
import { Sparkles, Lock, X, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onReplay: () => void;
}

export default function LoginGateModal({
  isOpen,
  onClose,
  onLogin,
  onReplay,
}: Props) {
  const t = useTranslations('FlappyFeed');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#121626] border border-purple-500/40 shadow-2xl shadow-purple-950/80 p-6 sm:p-8 text-slate-100 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 顶部图标与标题 */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
            <Lock className="w-7 h-7 text-purple-100" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('freeTrialBadge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t('loginRequiredTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {t('loginRequiredDesc')}
            </p>
          </div>
        </div>

        {/* 特权权益列表 */}
        <div className="space-y-2.5 bg-white/5 rounded-2xl p-4 border border-white/5 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{t('loginBenefit1')}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span>{t('loginBenefit2')}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <span>{t('loginBenefit3')}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
            <span>{t('loginBenefit4')}</span>
          </div>
        </div>

        {/* 操作按钮组 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onLogin();
            }}
            className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-98"
          >
            <span>{t('loginNowBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onReplay();
            }}
            className="py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>{t('replayFreeBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
