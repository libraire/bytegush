import { Article, PaginatedResponse } from "./types";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from 'next'
import { Search, Heart, MessageCircle, Share2 } from 'lucide-react'
import LatestButton from "./LatestButton";
import ArticleEditButton from "./ArticleEditButton";

export const metadata: Metadata = {
    title: 'Articles - Bytegush',
    description: 'Read our latest articles and updates.',
}

async function getArticles() {
    const res = await fetch(`/api/v1/articles`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch articles');
    }

    return res.json() as Promise<PaginatedResponse<Article>>;
}

type GroupedArticles = {
    [key: string]: Article[];
};

export default async function ArticlesPage() {
    const data = await getArticles();
    const articles = data.data;

    // Group articles by Month Year
    const groupedArticles: GroupedArticles = {};
    articles.forEach(article => {
        if (!article.published_at) return;
        const date = new Date(article.published_at);
        const key = format(date, 'MMMM yyyy').toUpperCase();
        if (!groupedArticles[key]) {
            groupedArticles[key] = [];
        }
        groupedArticles[key].push(article);
    });

    const sections = Object.keys(groupedArticles).map(key => ({
        month: key,
        articles: groupedArticles[key]
    }));

    return (
        <div className="min-h-screen bg-white selection:bg-orange-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

                <div className="flex items-center justify-between border-b border-gray-100 mb-12">
                    <div className="flex space-x-8">
                        <LatestButton />
                    </div>
                </div>

                <div className="space-y-16">
                    {sections.map((section) => (
                        <div key={section.month}>
                            <h2 className="text-xs font-bold tracking-widest text-orange-600 mb-8">
                                {section.month}
                            </h2>
                            <div className="space-y-12">
                                {section.articles.map((article) => (
                                    <article key={article.id} className="group relative flex flex-col md:flex-row gap-8 items-start pb-12 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                                                    <Link href={`/articles/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-500 line-clamp-2 text-[17px] leading-relaxed font-sans">
                                                    {article.summary}
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-2 text-[13px] font-medium text-gray-400 uppercase tracking-wide">
                                                {article.published_at && (
                                                    <span>{format(new Date(article.published_at), 'MMM d, yyyy').toUpperCase()}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-6 pt-2">
                                                <button className="flex items-center space-x-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Heart className="h-4 w-4" />
                                                    <span className="text-sm">0</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span className="text-sm">0</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <ArticleEditButton articleUserId={article.user_id} slug={article.slug} />
                                            </div>
                                        </div>

                                        <div className="w-full md:w-40 flex-shrink-0">
                                            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 relative group-hover:opacity-90 transition-opacity">
                                                <img
                                                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60"
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ))}

                    {articles.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-sm font-semibold text-gray-900">No articles found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
