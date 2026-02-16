"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export default function CreateArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        published_at: '',
        is_active: true,
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create article');
            }

            router.push('/articles');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] py-10 pb-40">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create Article
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
                                    onBlur={generateSlug}
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
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
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
                                        disabled={loading}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Article'}
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
