import { NextRequest, NextResponse } from 'next/server';
import { queryFeedStream } from '@/app/lib/flappyService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isProParam = searchParams.get('is_pro');
    const hasAudioParam = searchParams.get('has_audio');
    const limitParam = searchParams.get('limit');
    const shuffleParam = searchParams.get('shuffle');

    const is_pro = isProParam !== null ? isProParam.toLowerCase() === 'true' : null;
    const has_audio = hasAudioParam !== null ? hasAudioParam.toLowerCase() === 'true' : null;
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    const shuffle = shuffleParam !== null ? shuffleParam.toLowerCase() === 'true' : true;

    const items = await queryFeedStream({
      difficulty,
      category,
      search,
      is_pro,
      has_audio,
      limit,
      shuffle,
    });

    return NextResponse.json(items, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error fetching feed stream:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed', message: error?.message },
      { status: 500 }
    );
  }
}
