// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('sid')?.value;

  // No token and not on the login page → redirect.
  if (!token && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Proceed in all other cases
  return NextResponse.next();
}

// exclude
export const config = {
  // exclude Next.js assets and the login page itself
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};