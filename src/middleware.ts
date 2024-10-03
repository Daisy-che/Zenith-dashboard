import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';

export function middleware(req: Request) {
  const isLoggedIn = getCookie('isLoggedIn', { req });

  if (isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next(); 
}


export const config = {
  matcher: ['/'],
};
