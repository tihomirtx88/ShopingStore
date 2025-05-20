import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about',
  '/sign-in(.*)', 
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

   console.log('Middleware path:', req.nextUrl.pathname);
  console.log('Is public route:', isPublicRoute(req));
  console.log('UserId:', userId);

  if (!isPublicRoute(req) && !userId) {
    console.log('🔐 Redirecting to /sign-in');
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
