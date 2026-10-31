import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      app_name: 'FlappyFeed',
      app_id: 'com.bytegush.flappyfeed',
      version: '1.2.0',
      version_code: 120,
      release_date: '2026-10-16',
      download_url: 'https://flappy.bytegush.com/release/app-release.apk',
      file_size_mb: 258.1,
      min_android_version: 'Android 8.0 (API 26)',
      features: [
        'TikTok 风格沉浸式短语流',
        '毫秒级字幕与点读生词高亮',
        'PocketBase 云端轻量极速数据同步',
        'DeepSeek 官方大模型 AI 英语伴学私教',
      ],
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
