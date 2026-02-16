import { Article, PaginatedResponse } from "./types";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Articles - Bytegush',
    description: 'Read our latest articles and updates.',
}

async function getArticles() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/articles`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch articles');
    }

    return res.json() as Promise<PaginatedResponse<Article>>;
}

export default async function ArticlesPage() {
    const data = await getArticles();
    const articles = data.data;

    return (
        <div className="min-h-screen bg-[#fcfcfd] py-20 pb-40">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200 pb-10 mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Articles</h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Thoughts, updates, and insights from the team.
                    </p>
                </div>

                <div className="grid gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
                    {articles.map((article) => (
                        <div key={article.id} className="flex flex-col items-start">
                            {article.published_at && (
                                <div className="text-sm text-gray-500 mb-2">
                                    <time dateTime={article.published_at}>
                                        {format(new Date(article.published_at), 'MMMM d, yyyy')}
                                    </time>
                                </div>
                            )}
                            <Link href={`/articles/${article.slug}`} className="block group">
                                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {article.title}
                                </h2>
                                <p className="mt-3 text-lg text-gray-600 line-clamp-3">
                                    {article.summary}
                                </p>
                                <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:text-indigo-500">
                                    Read more
                                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {articles.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No articles found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
