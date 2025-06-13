import { NextResponse } from 'next/server';
import { decodeToken } from './auth.js';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const user = token ? decodeToken(token) : null;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Protect user dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If user already authenticated, redirect /login away
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL(user.role === 'admin' ? '/admin' : '/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
}; 