"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  KeyRound,
  Send,
} from 'lucide-react';
import { useCustomAuth, AuthModalMode } from '@/app/context/CustomAuthProvider';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    loginWithPassword,
    signupWithPassword,
    sendEmailOTP,
    loginWithOTP,
  } = useCustomAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP 状态
  const [otpCode, setOtpCode] = useState('');
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const isOTP = authModalMode === 'otp';
  const isLogin = authModalMode === 'login';
  const isRegister = authModalMode === 'register';

  // 验证码倒计时定时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCooldown > 0) {
      timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setName('');
    setOtpCode('');
    setOtpId(null);
    setOtpCooldown(0);
    setIsSendingOtp(false);
    setError(null);
    setSuccessMsg(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const switchMode = (mode: AuthModalMode) => {
    setError(null);
    setSuccessMsg(null);
    setAuthModalMode(mode);
  };

  // 发送邮箱验证码
  const handleSendOTP = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('请输入正确的电子邮箱地址');
      return;
    }
    setError(null);
    setIsSendingOtp(true);
    try {
      const id = await sendEmailOTP(cleanEmail);
      setOtpId(id);
      setOtpCooldown(60);
      setSuccessMsg(`验证码已发送至 ${cleanEmail}，5分钟内有效`);
    } catch (err: any) {
      console.error('OTP Send error:', err);
      let msg = '验证码发送失败，请确认发信服务已开启或重试';
      if (err?.message?.includes('Failed to deliver')) {
        msg = '邮件服务暂时无法发送，请检查 Resend SMTP 配置';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 提交验证码登录
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('请输入邮箱地址');
      return;
    }
    if (!otpId) {
      setError('请先获取邮箱验证码');
      return;
    }
    if (!otpCode || otpCode.trim().length < 6) {
      setError('请输入完整的 6 位验证码');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithOTP(otpId, otpCode.trim());
      setSuccessMsg('登录成功！');
      setTimeout(() => {
        handleClose();
      }, 400);
    } catch (err: any) {
      console.error('OTP Verify error:', err);
      let msg = '验证码错误或已过期，请重新获取';
      if (err?.message && !err.message.includes('Failed to authenticate')) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 密码方式登录或注册
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('请输入邮箱地址');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    if (isRegister) {
      if (password.length < 8) {
        setError('密码长度需至少 8 位');
        return;
      }
      if (password !== passwordConfirm) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await loginWithPassword(cleanEmail, password);
        setSuccessMsg('登录成功！');
        setTimeout(() => {
          handleClose();
        }, 300);
      } else {
        await signupWithPassword(cleanEmail, password, name.trim());
        setSuccessMsg('注册成功，已为您自动登录！');
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = '操作失败，请重试';
      if (err?.data?.data) {
        const details = err.data.data;
        if (details.email) msg = `邮箱问题: ${details.email.message}`;
        else if (details.password) msg = `密码问题: ${details.password.message}`;
        else if (details.passwordConfirm) msg = `确认密码: ${details.passwordConfirm.message}`;
      } else if (err?.message) {
        if (err.message.includes('Failed to authenticate')) {
          msg = '邮箱或密码错误，请核对后再试';
        } else if (err.message.includes('already exists')) {
          msg = '该邮箱已被注册，请直接登录';
        } else {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isAuthModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0B0F19] p-6 sm:p-8 text-left align-middle shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 transition-all relative">
                {/* 顶部右上角关闭按钮 */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 顶部标题与 Logo */}
                <div className="text-center pb-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600/30 to-indigo-500/20 border border-violet-500/30 mb-3 shadow-inner">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <Dialog.Title as="h3" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {isOTP
                      ? '验证码免密登录'
                      : isLogin
                      ? '欢迎回到 Bytegush'
                      : '创建 Bytegush 账号'}
                  </Dialog.Title>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {isOTP
                      ? '输入邮箱获取 6 位验证码，未注册邮箱将自动建号'
                      : isLogin
                      ? '使用已有密码登录以同步多端数据'
                      : '注册加入独立创造者生态'}
                  </p>
                </div>

                {/* 主 Tab 切换：验证码免密登录 vs 密码模式 */}
                <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => switchMode('otp')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      isOTP
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>验证码免密</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      !isOTP
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>密码登录</span>
                  </button>
                </div>

                {/* 错误提示 */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 成功提示 */}
                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* ======================= 表单 1: 验证码免密登录 ======================= */}
                {isOTP ? (
                  <form onSubmit={handleOTPSubmit} className="space-y-4">
                    {/* 邮箱输入 + 发送验证码按钮 */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        电子邮箱
                      </label>
                      <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={isSendingOtp || otpCooldown > 0}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-purple-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
                        >
                          {isSendingOtp ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                          <span>
                            {otpCooldown > 0 ? `${otpCooldown}s 后重发` : '获取验证码'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 6 位验证码输入 */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        6 位邮箱验证码
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="例如: 123456"
                          className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-base tracking-[0.3em] font-mono placeholder:tracking-normal placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-center font-bold"
                        />
                      </div>
                    </div>

                    {/* 登录按钮 */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>正在验证登录...</span>
                          </>
                        ) : (
                          <span>验证并登录</span>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ======================= 表单 2: 密码登录 / 注册 ======================= */
                  <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                    {/* 子切换：密码登录 vs 免费注册 */}
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                      <span className="text-slate-400">
                        {isLogin ? '密码直接登录' : '创建新账号'}
                      </span>
                      <button
                        type="button"
                        onClick={() => switchMode(isLogin ? 'register' : 'login')}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        {isLogin ? '没有账号？免费注册' : '已有账号？返回登录'}
                      </button>
                    </div>

                    {/* 注册专属：昵称 */}
                    {isRegister && (
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          昵称 / 姓名 (选填)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例如: Alex"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* 邮箱 */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">电子邮箱</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* 密码 */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        密码 {isRegister && <span className="text-slate-500">(至少 8 位)</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* 注册专属：确认密码 */}
                    {isRegister && (
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">确认密码</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* 提交按钮 */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isLogin ? '正在验证并登录...' : '正在创建账户...'}</span>
                          </>
                        ) : (
                          <span>{isLogin ? '立即登录' : '立即注册'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* 底部引导 */}
                <div className="mt-5 text-center text-xs text-slate-400">
                  <span>ByteGush 独立创造者生态</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
