import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect dashboard routes
  if (
    pathname.startsWith('/patient') ||
    pathname.startsWith('/doctor') ||
    pathname.startsWith('/admin')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    // Role-based protection
    if (pathname.startsWith('/doctor') && token.role !== 'doctor' && token.role !== 'radiologist') {
      return NextResponse.redirect(new URL('/patient', req.url));
    }
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/patient', req.url));
    }
  }

  // Redirect logged-in users away from login
  if (pathname === '/auth/login' && token) {
    if (token.role === 'doctor' || token.role === 'radiologist') {
      return NextResponse.redirect(new URL('/doctor', req.url));
    }
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/patient', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*', '/auth/login'],
};
