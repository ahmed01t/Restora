import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const cookieName = 'restora_admin_session';
const DEFAULT_SECRET = 'restora_modern_real_estate_admin_secret_key_2026_super_secure';

export function getAdminSecret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    return DEFAULT_SECRET;
  }
  return value;
}

function sign(payload: string) {
  return createHmac('sha256', getAdminSecret()).update(payload).digest('base64url');
}

export async function createAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000 })
  ).toString('base64url');
  const signature = sign(payload);
  const cookieStore = await cookies();
  cookieStore.set(cookieName, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    if (!token) return false;
    const [payload, signature, ...rest] = token.split('.');
    if (!payload || !signature || rest.length) return false;
    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}
