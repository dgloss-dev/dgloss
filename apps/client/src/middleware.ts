import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutePrefixes = ['/profile', '/settings', '/admin'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
  // const isAdminHubRoute = adminHubRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  // TODO: Implement isAdminHubRoute
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
