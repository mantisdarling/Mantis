import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/messages', '/appointments', '/admin', '/profile', '/book', '/checkout', '/session'];
  const isProtected = protectedPaths.some((path) => pathname.includes(path));

  if (isProtected) {
    const token =
      request.cookies.get('jwt')?.value ||
      request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      const segments = pathname.split('/');
      const locale = routing.locales.includes(segments[1] as any) ? segments[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'dev-secret-please-change-in-production',
      );
      await jwtVerify(token, secret);
    } catch {
      const segments = pathname.split('/');
      const locale = routing.locales.includes(segments[1] as any) ? segments[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return intlMiddleware(request);
}
