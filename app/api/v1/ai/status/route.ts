import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    provider: 'deepseek',
    configured: true,
    masked_api_key: 'sk-c502***0ffb06',
    model: 'deepseek-chat',
    endpoint: 'https://api.deepseek.com',
  });
}
