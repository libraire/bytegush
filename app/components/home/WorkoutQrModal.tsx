"use client";

import React, { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { X, QrCode, CheckCircle2, Smartphone } from 'lucide-react';

interface WorkoutQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutQrModal({ isOpen, onClose }: WorkoutQrModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-sm sm:max-w-md transform overflow-hidden rounded-3xl bg-[#0C141E]/95 p-6 sm:p-8 text-center align-middle shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-emerald-500/30 transition-all relative">
                {/* 顶部背景微光 */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-600/20 blur-[70px] pointer-events-none rounded-full" />

                {/* 右上角关闭按钮 */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 顶部徽章 */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>微信小程序 · 免安装即开即用</span>
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
                >
                  微信扫码体验「造己健身」
                </Dialog.Title>

                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  打开微信「扫一扫」，立即开启纯粹无干扰的力量训练手记
                </p>

                {/* 小程序码卡片展示 */}
                <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-inner flex flex-col items-center justify-center">
                  <div className="relative p-3 rounded-2xl bg-white shadow-2xl shadow-emerald-950/60 ring-4 ring-emerald-500/30">
                    <Image
                      src="/products/workout/qrcode.png"
                      alt="造己健身微信小程序码"
                      width={220}
                      height={220}
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                      priority
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>微信扫一扫 即可进入</span>
                  </p>
                </div>

                {/* 特性徽章 */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>纯净零广告</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>无推销打扰</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>离线秒开记</span>
                  </span>
                </div>

                {/* 底部按钮 */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
