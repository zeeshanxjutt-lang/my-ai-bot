import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a basic example - in production, you'd use proper JWT or session validation
  const adminRoutes = ['/admin'];
  
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    // The actual auth check happens on the client side in the admin page
    // This middleware is a placeholder for future server-side auth
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
