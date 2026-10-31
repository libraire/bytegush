import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 302 Redirect to Cloudflare R2 global CDN release
  return NextResponse.redirect('https://flappy.bytegush.com/release/app-release.apk', 302);
}
