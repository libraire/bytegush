"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Article } from '../../types';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [articleId, setArticleId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        published_at: '',
        is_active: true,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                // Use relative path for client-side fetch to leverage Next.js proxy
                const res = await fetch(`/api/v1/articles/${slug}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch article');
                }
                const article: Article = await res.json();

                setArticleId(article.id);
                setFormData({
                    title: article.title,
                    slug: article.slug,
                    summary: article.summary || '',
                    content: article.content,
                    published_at: article.published_at ? format(new Date(article.published_at), "yyyy-MM-dd'T'HH:mm") : '',
                    is_active: article.is_active,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!articleId) return;

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/v1/articles/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update article');
            }

            // Check if slug changed
            if (formData.slug !== slug) {
                router.push(`/articles/${formData.slug}`);
            } else {
                router.push(`/articles/${slug}`);
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch('/api/v1/articles/upload/image', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error('Upload failed');

            const { url } = await res.json();

            setFormData(prev => ({
                ...prev,
                content: prev.content + `\n![Image](${url})\n`
            }));
        } catch (error) {
            console.error(error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading article...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] py-10 pb-40">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Edit Article
                    </h1>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                    {/* Editor Column */}
                    <div className="flex flex-col h-full overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        id="slug"
                                        required
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">Published At</label>
                                    <input
                                        type="datetime-local"
                                        name="published_at"
                                        id="published_at"
                                        value={formData.published_at}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                                <textarea
                                    name="summary"
                                    id="summary"
                                    rows={3}
                                    value={formData.summary}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 bg-white"
                                />
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (Markdown)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-500 ${uploading ? 'opacity-50' : ''}`}
                                        >
                                            {uploading ? 'Uploading...' : 'Insert Image'}
                                        </label>
                                    </div>
                                </div>
                                <textarea
                                    name="content"
                                    id="content"
                                    required
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border font-mono resize-none text-gray-900 bg-white"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Active / Published
                                    </label>
                                </div>

                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="mr-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Article'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Preview Column */}
                    <div className="flex flex-col h-full overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
                        <div className="prose prose-lg prose-indigo max-w-none">
                            <h1 className="mb-0 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {formData.title || 'Untitled Article'}
                            </h1>

                            <div className="text-sm text-gray-500 mt-4 mb-8">
                                {formData.published_at ? (
                                    <time dateTime={formData.published_at}>
                                        {format(new Date(formData.published_at), 'MMMM d, yyyy')}
                                    </time>
                                ) : (
                                    <span className="italic">Draft</span>
                                )}
                            </div>

                            {formData.summary && (
                                <div className="text-xl text-gray-600 leading-relaxed mb-8 not-prose border-l-4 border-indigo-500 pl-4 py-1">
                                    {formData.summary}
                                </div>
                            )}

                            <div className="mt-8">
                                {formData.content ? (
                                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                                ) : (
                                    <p className="text-gray-400 italic">Start writing to see the preview...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
