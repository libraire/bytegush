"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPocketBase } from '@/app/lib/pb';
import AuthModal from '@/app/components/auth/AuthModal';

export interface User {
  id: string | number;
  name?: string;
  email: string;
  avatar?: string;
  isPro?: boolean;
  expire?: string;
}

export type AuthModalMode = 'otp' | 'login' | 'register';

export interface CustomAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (redirectUrl?: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  loginWithPassword: (identity: string, password: string) => Promise<void>;
  signupWithPassword: (email: string, password: string, name?: string) => Promise<void>;
  sendEmailOTP: (email: string) => Promise<string>;
  loginWithOTP: (otpId: string, code: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
}

const CustomAuthContext = createContext<CustomAuthContextType | undefined>(undefined);

export function CustomAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('otp');

  const openAuthModal = (mode: AuthModalMode = 'otp') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 快捷 login 方法：打开登录弹窗，保持与各页面 onClick={() => login()} 的完全兼容
  const login = (_redirectUrl?: string) => {
    openAuthModal('otp');
  };

  // 发送邮箱验证码 (OTP)
  const sendEmailOTP = async (email: string): Promise<string> => {
    const pb = getPocketBase();
    const cleanEmail = email.trim().toLowerCase();

    // 为支持新用户免注册一键登录，若该邮箱尚未注册，先静默创建占位记录
    try {
      const placeholderPassword = 'Bg!' + Math.random().toString(36).slice(-8) + 'X8#';
      await pb.collection('users').create({
        email: cleanEmail,
        password: placeholderPassword,
        passwordConfirm: placeholderPassword,
        name: cleanEmail.split('@')[0],
      });
    } catch {
      // 若已存在或创建异常，直接继续发送 OTP
    }

    const res = await pb.collection('users').requestOTP(cleanEmail);
    return res.otpId;
  };

  // 验证邮箱验证码 (OTP) 并完成登录
  const loginWithOTP = async (otpId: string, code: string) => {
    const pb = getPocketBase();
    const authData = await pb.collection('users').authWithOTP(otpId, code.trim());
    if (authData && authData.record) {
      setUser({
        id: authData.record.id,
        name: authData.record.name || authData.record.email?.split('@')[0],
        email: authData.record.email,
        avatar: authData.record.avatar,
      });
    }
  };

  // 通过 PocketBase 进行邮箱+密码登录
  const loginWithPassword = async (identity: string, password: string) => {
    const pb = getPocketBase();
    const authData = await pb.collection('users').authWithPassword(identity, password);
    if (authData && authData.record) {
      setUser({
        id: authData.record.id,
        name: authData.record.name || authData.record.email?.split('@')[0],
        email: authData.record.email,
        avatar: authData.record.avatar,
      });
    }
  };

  // 通过 PocketBase 进行新用户注册并自动登录
  const signupWithPassword = async (email: string, password: string, name?: string) => {
    const pb = getPocketBase();
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name: name || '',
    });
    await loginWithPassword(email, password);
  };

  // 登出
  const logout = () => {
    try {
      const pb = getPocketBase();
      pb.authStore.clear();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 手动刷新鉴权状态
  const refreshAuth = async () => {
    setIsLoading(true);
    try {
      const pb = getPocketBase();
      if (pb.authStore.isValid) {
        const refreshed = await pb.collection('users').authRefresh();
        if (refreshed && refreshed.record) {
          setUser({
            id: refreshed.record.id,
            name: refreshed.record.name || refreshed.record.email?.split('@')[0],
            email: refreshed.record.email,
            avatar: refreshed.record.avatar,
          });
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化鉴权状态与多标签页监听
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const pb = getPocketBase();

      const syncFromAuthStore = () => {
        if (pb.authStore.isValid && pb.authStore.record) {
          const rec = pb.authStore.record;
          setUser({
            id: rec.id,
            name: rec.name || rec.email?.split('@')[0],
            email: rec.email,
            avatar: rec.avatar,
          });
        } else {
          setUser(null);
        }
      };

      // 1. 同步本地现有状态
      syncFromAuthStore();
      setIsLoading(false);

      // 2. 如果存在已有 Token，在后台异步验证并刷新有效性
      if (pb.authStore.isValid) {
        pb.collection('users')
          .authRefresh()
          .then((refreshed) => {
            if (refreshed && refreshed.record) {
              setUser({
                id: refreshed.record.id,
                name: refreshed.record.name || refreshed.record.email?.split('@')[0],
                email: refreshed.record.email,
                avatar: refreshed.record.avatar,
              });
            }
          })
          .catch(() => {
            // Token 过期或失效
            pb.authStore.clear();
            setUser(null);
          });
      }

      // 3. 订阅 authStore 变更事件（跨标签页或登录/登出时自动响应）
      unsubscribe = pb.authStore.onChange((token, model) => {
        if (token && model) {
          setUser({
            id: model.id,
            name: model.name || model.email?.split('@')[0],
            email: model.email,
            avatar: model.avatar,
          });
        } else {
          setUser(null);
        }
      });
    } catch (err) {
      console.error('PocketBase auth init error:', err);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value: CustomAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
    loginWithPassword,
    signupWithPassword,
    sendEmailOTP,
    loginWithOTP,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
  };

  return (
    <CustomAuthContext.Provider value={value}>
      {children}
      {/* 全局挂载登录/注册弹窗 */}
      <AuthModal />
    </CustomAuthContext.Provider>
  );
}

export function useCustomAuth() {
  const context = useContext(CustomAuthContext);
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within CustomAuthProvider');
  }
  return context;
}
