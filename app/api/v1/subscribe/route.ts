import { NextResponse } from 'next/server';
import { db, ensureDbInitialized } from '../../../lib/db';
import { getPocketBase } from '../../../lib/pb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase().slice(0, 200);
    const app = (body.app || 'bytegush').slice(0, 50);

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // 1. 尝试同步写入 PocketBase
    try {
      const pb = getPocketBase();
      await pb.collection('subscribers').create({
        email,
        app,
        status: 'active',
      }, { requestKey: null });
    } catch {
      // 降级保护
    }

    // 2. 写入本地 SQLite 双备份
    try {
      await ensureDbInitialized();
      await db.execute({
        sql: 'INSERT OR IGNORE INTO subscribers (email, app) VALUES (?, ?)',
        args: [email, app],
      });
    } catch (e) {
      console.warn('SQLite subscribe backup error:', e);
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record subscription' }, { status: 500 });
  }
}
