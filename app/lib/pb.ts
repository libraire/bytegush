import PocketBase from 'pocketbase';

export function getPocketBase(): PocketBase {
  const url =
    typeof window === 'undefined'
      ? process.env.POCKETBASE_INTERNAL_URL || 'http://pocketbase:8090'
      : process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://api.bytegush.com';

  return new PocketBase(url);
}

let cachedAdminPb: PocketBase | null = null;
let lastAdminAuthTime = 0;

export async function getAdminPocketBase(): Promise<PocketBase> {
  const url = process.env.POCKETBASE_INTERNAL_URL || 'http://pocketbase:8090';
  if (!cachedAdminPb) {
    cachedAdminPb = new PocketBase(url);
  }

  const now = Date.now();
  if (!cachedAdminPb.authStore.isValid || now - lastAdminAuthTime > 3600 * 1000) {
    const email = process.env.PB_ADMIN_EMAIL || 'admin@bytegush.com';
    const password = process.env.PB_ADMIN_PASSWORD || 'flappy2026';
    try {
      await cachedAdminPb.collection('_superusers').authWithPassword(email, password);
      lastAdminAuthTime = now;
    } catch (err) {
      console.error('Failed to authenticate as superuser in PocketBase:', err);
    }
  }

  return cachedAdminPb;
}
