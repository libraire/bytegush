'use client'

import { useTransition } from 'react'
import { refreshArticles } from './actions'
import { useRouter } from 'next/navigation'

export default function LatestButton() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleRefresh = () => {
        startTransition(async () => {
            await refreshArticles()
            // Router refresh might be needed to see updates immediately if standard revalidatePath behavior doesn't auto-update current view in some versions,
            // but usually Server Action response handles it.
            // However, explicit router.refresh() ensures client-side cache is also updated if needed.
        })
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={isPending}
            className={`pb-4 text-sm font-medium transition-colors relative ${isPending ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:text-gray-700'}`}
        >
            Latest
            {isPending ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 animate-pulse" />
            ) : (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
        </button>
    )
}
