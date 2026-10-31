'use client'

import { useCustomAuth } from "@/app/context/CustomAuthProvider";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface ArticleEditButtonProps {
    articleUserId?: number;
    slug: string;
}

export default function ArticleEditButton({ articleUserId, slug }: ArticleEditButtonProps) {
    const { user } = useCustomAuth();

    if (!user || !articleUserId || user.id !== articleUserId) {
        return null;
    }

    return (
        <Link
            href={`/articles/${slug}/edit`}
            className="flex items-center space-x-1.5 text-gray-400 hover:text-indigo-600 transition-colors ml-4"
            title="Edit Article"
        >
            <Pencil className="h-4 w-4" />
            <span className="text-sm">Edit</span>
        </Link>
    );
}
