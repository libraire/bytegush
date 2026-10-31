import { NextResponse } from 'next/server';
import { db, ensureDbInitialized } from '../../../lib/db';
import { getPocketBase } from '../../../lib/pb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const app = (body.app || 'bytegush').slice(0, 100);
    const content = (body.body || '').trim().slice(0, 5000);
    const email = (body.email || '').trim().slice(0, 200);

    if (!content) {
      return NextResponse.json({ success: false, error: 'Feedback body is required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // 1. 尝试同步写入 PocketBase (供 Admin 后台可视化查看)
    try {
      const pb = getPocketBase();
      await pb.collection('feedbacks').create({
        app,
        body: content,
        email: email || null,
        ip,
      }, { requestKey: null });
    } catch {
      // PocketBase 离线或表未初始化时降级写入本地 SQLite
    }

    // 2. 写入本地 SQLite 双备份
    try {
      await ensureDbInitialized();
      await db.execute({
        sql: 'INSERT INTO feedbacks (app, body, email, ip) VALUES (?, ?, ?, ?)',
        args: [app, content, email || null, ip],
      });
    } catch (e) {
      console.warn('SQLite feedback backup error:', e);
    }

    return NextResponse.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err: any) {
    console.error('Feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record feedback' }, { status: 500 });
  }
}
