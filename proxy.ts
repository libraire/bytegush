import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api, /hts/api)
  // - Admin route handler (/admin)
  // - Download route handlers (/download, /downloads)
  // - Next.js internals (/_next, /_vercel)
  // - Static files (containing a dot like favicon.ico, images, etc.)
  matcher: ['/((?!api|hts/api|admin|download|downloads|_next|_vercel|.*\\..*).*)'],
};
