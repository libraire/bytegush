'use server'

import { revalidatePath } from 'next/cache'

export async function refreshArticles() {
    revalidatePath('/articles')
}
