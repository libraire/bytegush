import { Article } from "../types";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getArticle(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/articles/${slug}`, {
        next: { revalidate: 3600 },
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error('Failed to fetch article');
    }

    return res.json() as Promise<Article>;
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug
    const article = await getArticle(slug)

    if (!article) {
        return {
            title: 'Article Not Found',
        }
    }

    return {
        title: `${article.title} - Bytegush`,
        description: article.summary,
    }
}

export default async function ArticlePage({ params }: Props) {
    const slug = (await params).slug
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-[#fcfcfd] py-20 pb-40">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-10 text-center">
                    <div className="text-sm text-gray-500 mb-4">
                        {article.published_at && (
                            <time dateTime={article.published_at}>
                                {format(new Date(article.published_at), 'MMMM d, yyyy')}
                            </time>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                        {article.title}
                    </h1>
                    {article.summary && (
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            {article.summary}
                        </p>
                    )}
                </header>

                <div className="prose prose-lg prose-indigo mx-auto text-gray-700">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}
