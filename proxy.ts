import { NextResponse, type NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_SECRET = 'restora_modern_real_estate_admin_secret_key_2026_super_secure';

function checkToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  try {
    const [payload, signature, ...rest] = token.split('.');
    if (!payload || !signature || rest.length) return false;
    const expected = Buffer.from(createHmac('sha256', secret).update(payload).digest('base64url'));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('restora_admin_session')?.value;
  const authenticated = checkToken(token);

  // Allow auth API endpoints
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  // Public admin pages (login & signup)
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    if (authenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!authenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
