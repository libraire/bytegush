"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useCustomAuth } from '@/app/context/CustomAuthProvider';

function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
  return admins.includes(email);
}

const availablePlatforms = ['Web', 'Mac', 'Windows', 'iOS', 'Android', 'Chrome'];
const availableCategories = [
  { id: 'ai', label: 'AI 智能' },
  { id: 'dev', label: '独立开发与部署' },
  { id: 'productivity', label: '效率与知识库' },
  { id: 'learning', label: '语言与阅读' },
  { id: 'design', label: '设计与 UI' },
];

export default function CreateProductPage() {
  const router = useRouter();
  const { user, isLoading } = useCustomAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    verdict: '',
    emoji: '🚀',
    website_url: '',
    github_url: '',
    category_slug: 'dev',
    is_original: false,
    is_featured: false,
    pricing_type: 'Freemium',
    rating: 9.2,
    badge: '',
    platforms: ['Web'],
    highlights: [''],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const handleHighlightChange = (index: number, value: string) => {
    setFormData((prev) => {
      const list = [...prev.highlights];
      list[index] = value;
      return { ...prev, highlights: list };
    });
  };

  const addHighlight = () => {
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedHighlights = formData.highlights.filter((h) => h.trim().length > 0);
      const payload = {
        ...formData,
        highlights: cleanedHighlights,
        rating: Number(formData.rating),
      };

      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '创建产品失败');
      }

      router.push(`/products/${formData.slug || ''}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || '请求发生错误');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        正在验证权限...
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">需要管理员权限</h2>
        <p className="text-sm text-gray-500 mb-6">
          仅系统管理员（{process.env.NEXT_PUBLIC_ADMIN_EMAILS}）可添加和编辑产品。
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/products/manage"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回产品管理</span>
          </Link>
          <span className="text-xs font-medium text-gray-400">
            Bytegush Product CMS
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              添加新软件产品与评测
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              录入软件基础信息、Bytegush 评测观点、支持平台与实战亮点。
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基础信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  软件图标 / Emoji
                </label>
                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  placeholder="如：🚀、🧠、✨"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  软件名称 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="如：Cursor、Woop、Raycast"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                  >
                    生成 Slug
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  URL 路径 (Slug) *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="如：cursor、woop"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  所属分类 *
                </label>
                <select
                  name="category_slug"
                  value={formData.category_slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 一句话定位 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                一句话定位 / Tagline *
              </label>
              <input
                type="text"
                name="tagline"
                required
                value={formData.tagline}
                onChange={handleChange}
                placeholder="例如：从底层重新设计的人工智能原生代码编辑器"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* 核心评测结论 (Verdict) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Bytegush 评测结论与推荐理由 (Verdict) *
              </label>
              <textarea
                name="verdict"
                required
                rows={3}
                value={formData.verdict}
                onChange={handleChange}
                placeholder="说明为什么推荐该工具、解决的核心痛点、适用人群..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* 详细介绍 (选填) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                详细介绍 / 使用背景 (可选)
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="详细背景介绍、技术特色或上手说明..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* 链接地址 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  官网链接 (Website URL) *
                </label>
                <input
                  type="url"
                  name="website_url"
                  required
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  GitHub 仓库 (可选)
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* 平台与收费模式 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  支持平台 (多选)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePlatforms.map((p) => {
                    const active = formData.platforms.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handlePlatformToggle(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  收费模式
                </label>
                <select
                  name="pricing_type"
                  value={formData.pricing_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="Free">完全免费 (Free)</option>
                  <option value="Freemium">免费增值 (Freemium)</option>
                  <option value="Open Source">开源 (Open Source)</option>
                  <option value="Paid">商业付费 (Paid)</option>
                </select>
              </div>
            </div>

            {/* 评分与勋章 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  评测评分 (0 ~ 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  特色勋章 (可选)
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="如：装机必备、年度最佳、自研旗舰"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* 属性勾选 */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_original"
                  checked={formData.is_original}
                  onChange={handleChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>💎 标记为 Bytegush 自研产品</span>
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>🌟 首页重点精选推荐</span>
              </label>
            </div>

            {/* 核心亮点列表 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  核心功能与亮点列表 (Bullet Points)
                </label>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加亮点</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.highlights.map((h, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      placeholder={`亮点 ${idx + 1}，如：全代码库语义感知检索`}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                href="/products/manage"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
              >
                {loading ? '正在保存...' : '确认发布产品'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
