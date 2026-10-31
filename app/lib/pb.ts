import PocketBase from 'pocketbase';

export function getPocketBase(): PocketBase {
  const url =
    typeof window === 'undefined'
      ? process.env.POCKETBASE_INTERNAL_URL || 'http://pocketbase:8090'
      : process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://api.bytegush.com';

  return new PocketBase(url);
}
