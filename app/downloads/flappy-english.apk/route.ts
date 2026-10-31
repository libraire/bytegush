import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.redirect('https://flappy.bytegush.com/release/app-release.apk', 302);
}
