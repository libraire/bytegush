import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const word = (searchParams.get('word') || '').trim().toLowerCase();

  if (!word) {
    return NextResponse.json({ error: 'word parameter required' }, { status: 400 });
  }

  // Basic dictionary definitions for common words
  return NextResponse.json({
    word,
    phonetic: '',
    part_of_speech: 'word',
    translation: '点击查看详细释义与例句',
    definition: `English vocabulary word: ${word}`,
    example: `Here is an example sentence using "${word}".`,
    cn_example: `这是一个包含“${word}”的例句。`,
  });
}
