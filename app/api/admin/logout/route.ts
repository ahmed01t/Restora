import { NextResponse, type NextRequest } from 'next/server';
import { destroyAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}

export async function GET(request: NextRequest) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}
