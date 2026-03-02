import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Serve Vite SPA (public/index.html) for all non-API, non-asset routes.
 * API routes (/api/*) and static assets (/assets/*) are handled by Next/static.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/')) return NextResponse.next();
  if (pathname.startsWith('/assets/')) return NextResponse.next();
  // Static files (e.g. favicon, other public files)
  if (pathname.includes('.')) return NextResponse.next();

  return NextResponse.rewrite(new URL('/index.html', request.url));
}

export const config = {
  matcher: ['/((?!_next/|favicon\\.ico).*)'],
};
