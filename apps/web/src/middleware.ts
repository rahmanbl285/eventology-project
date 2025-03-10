import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const url = request.nextUrl.pathname
  const protectedPaths = ['/dashboard/', '/checkout', '/create-event'];

  if (protectedPaths.some(path => url.startsWith(path))) {
    if (!token) {
      const encodedUrl = encodeURIComponent(url);
      return NextResponse.redirect(new URL(`/login?redirect=${encodedUrl}`, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next()
}