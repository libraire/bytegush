import { NextResponse } from 'next/server';
import { getFeedStats } from '@/app/lib/flappyService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getFeedStats();
    return NextResponse.json(stats, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
