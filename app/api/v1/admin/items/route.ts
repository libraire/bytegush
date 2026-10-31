import { NextRequest, NextResponse } from 'next/server';
import { upsertFeedItem } from '@/app/lib/flappyService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const item = await req.json();
    if (!item.id && !item.feed_id) {
      item.id = `feed_${Math.random().toString(36).substring(2, 10)}`;
    } else if (!item.id && item.feed_id) {
      item.id = item.feed_id;
    }

    const saved = await upsertFeedItem(item);
    return NextResponse.json(saved);
  } catch (err: any) {
    console.error('Error in /api/v1/admin/items:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save item' }, { status: 500 });
  }
}
