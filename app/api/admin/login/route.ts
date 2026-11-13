import { NextResponse, type NextRequest } from 'next/server';
import { createAdminSession } from '@/lib/admin-auth';

const DEFAULT_ADMIN_EMAIL = 'admin@restora.com';
const DEFAULT_ADMIN_PASSWORD = 'restora2026admin';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  const contentType = request.headers.get('content-type') || '';
  let email = '';
  let password = '';
  const isJson = contentType.includes('application/json');

  if (isJson) {
    try {
      const body = await request.json();
      email = String(body.email ?? '').trim().toLowerCase();
      password = String(body.password ?? '');
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
    }
  } else {
    const data = await request.formData();
    email = String(data.get('email') ?? '').trim().toLowerCase();
    password = String(data.get('password') ?? '');
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    if (isJson) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }
    const redirectUrl = new URL('/admin/login', request.url);
    redirectUrl.searchParams.set('error', 'Invalid email or password. Please try again.');
    return NextResponse.redirect(redirectUrl, 303);
  }

  await createAdminSession();

  if (isJson) {
    return NextResponse.json({ ok: true, redirect: '/admin' });
  }
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
