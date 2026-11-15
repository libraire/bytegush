import PocketBase from 'pocketbase';

let clientPb: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (typeof window !== 'undefined') {
    if (!clientPb) {
      const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://api.bytegush.com';
      clientPb = new PocketBase(url);
    }
    return clientPb;
  }

  // Server-side:
  // In Docker environment, POCKETBASE_INTERNAL_URL is set (e.g. 'http://pocketbase:8090')
  // In local development or standalone without Docker, fall back to NEXT_PUBLIC_POCKETBASE_URL or 'https://api.bytegush.com'
  const url =
    process.env.POCKETBASE_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    'https://api.bytegush.com';
  return new PocketBase(url);
}

let cachedAdminPb: PocketBase | null = null;
let lastAdminAuthTime = 0;

export async function getAdminPocketBase(): Promise<PocketBase> {
  const url =
    process.env.POCKETBASE_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    'https://api.bytegush.com';
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
      console.warn('PocketBase admin auth warning:', (err as any)?.message || err);
    }
  }

  return cachedAdminPb;
}
