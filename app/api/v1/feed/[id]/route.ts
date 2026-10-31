import { NextRequest, NextResponse } from 'next/server';
import { getFeedItemById } from '@/app/lib/flappyService';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getFeedItemById(id);
    if (!item) {
      return NextResponse.json({ error: 'Feed item not found' }, { status: 404 });
    }
    return NextResponse.json(item, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
