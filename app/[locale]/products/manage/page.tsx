"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ExternalLink,
  Star,
  Trash2,
  Eye,
  Search,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useCustomAuth } from '@/app/context/CustomAuthProvider';
import { curatedProducts } from '@/app/data/homeData';
import { ProductItem } from '@/app/types/home';

function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
  return admins.includes(email);
}

export default function ProductManagePage() {
  const { user, isLoading: authLoading } = useCustomAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/products');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: ProductItem[] = json.data.map((item: any) => ({
            id: item.slug || String(item.id),
            name: item.name,
            tagline: item.tagline,
            description: item.description,
            verdict: item.verdict,
            category: item.category_slug || 'dev',
            categoryLabel: item.category?.name || item.category_slug,
            emoji: item.emoji || '🚀',
            websiteUrl: item.website_url,
            githubUrl: item.github_url,
            platforms: item.platforms || ['Web'],
            pricing: item.pricing_type || 'Freemium',
            rating: item.rating || 9.0,
            badge: item.badge,
            isOriginal: !!item.is_original,
            highlights: item.highlights || [],
          }));
          setProducts(mapped);
          return;
        }
      }
    } catch (e) {
      // API 未连接时使用静态数据
    }

    // Fallback 到默认的精选数据
    setProducts(curatedProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除软件产品 “${name}” 吗？`)) return;

    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('删除失败，可能没有权限或服务器发生错误');
      }
    } catch (e) {
      // 如果后端没通，本地状态临时移除
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.verdict.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (authLoading) {
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
          仅系统管理员（{process.env.NEXT_PUBLIC_ADMIN_EMAILS}）可管理产品库。
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* 顶部标题栏与添加按钮 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-gray-700 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回前台</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              软件库与评测管理后台
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              管理推荐入口的所有软件、评测结论、分类与自研产品状态。
            </p>
          </div>

          <Link
            href="/products/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>添加新软件</span>
          </Link>
        </div>

        {/* 筛选与搜索栏 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 mb-6 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索软件名称、定位或推荐观点..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white focus:outline-none"
            >
              <option value="all">所有分类</option>
              <option value="ai">AI 智能</option>
              <option value="dev">独立开发</option>
              <option value="productivity">效率笔记</option>
              <option value="learning">语言阅读</option>
              <option value="design">设计 UI</option>
            </select>
          </div>
        </div>

        {/* 产品表格 */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/70 text-left text-sm">
              <thead className="bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">软件产品</th>
                  <th className="px-3 py-3.5">分类</th>
                  <th className="px-3 py-3.5">平台与收费</th>
                  <th className="px-3 py-3.5">评测评分</th>
                  <th className="px-3 py-3.5">属性</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* 名称与定位 */}
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                          {item.emoji || '🚀'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {item.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 分类 */}
                    <td className="px-3 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {item.categoryLabel || item.category}
                    </td>

                    {/* 平台与收费 */}
                    <td className="px-3 py-4 text-xs whitespace-nowrap">
                      <span className="text-gray-600">{item.platforms.join(', ')}</span>
                      <span className="mx-1 text-gray-300">·</span>
                      <span className="font-semibold text-emerald-600">
                        {item.pricing}
                      </span>
                    </td>

                    {/* 评分 */}
                    <td className="px-3 py-4 text-xs font-bold text-amber-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating || '9.0'}</span>
                      </div>
                    </td>

                    {/* 属性 */}
                    <td className="px-3 py-4 text-xs whitespace-nowrap">
                      {item.isOriginal ? (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          💎 自研旗舰
                        </span>
                      ) : (
                        <span className="text-gray-400">精选推荐</span>
                      )}
                    </td>

                    {/* 操作 */}
                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${item.id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="查看落地页"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="访问官网"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除产品"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>当前显示 {filtered.length} 款软件产品</span>
            <span>管理模式：启用</span>
          </div>
        </div>
      </div>
    </div>
  );
}
