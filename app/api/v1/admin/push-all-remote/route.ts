import { NextRequest, NextResponse } from 'next/server';
import { upsertFeedItem } from '@/app/lib/flappyService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected an array of items' }, { status: 400 });
    }

    let count = 0;
    for (const item of items) {
      if (item.id || item.feed_id) {
        await upsertFeedItem(item);
        count++;
      }
    }

    return NextResponse.json({
      status: 'ok',
      message: `Successfully synced ${count} items to PocketBase.`,
      count,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to sync' }, { status: 500 });
  }
}
