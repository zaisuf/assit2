import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = [
        '/login', 
        '/signup', 
        '/verify-otp', 
        '/', 
        '/price'
    ].includes(path) || 
    path.endsWith('.mp4') || 
    path.startsWith('/_next/') || 
    path.startsWith('/static/') ||
    path.startsWith('/videos/') ||
    path.startsWith('/public/') ||
    path.startsWith('/backgraund/') || // Allow all /backgraund/* images
    path.startsWith('/images/') ||     // Allow all /images/* if you have images there
    path.startsWith('/modal logo/') || // Allow all /modal logo/*
    path.startsWith('/favicon.ico') || // Allow favicon
    path.endsWith('.jpg') ||           // Allow all .jpg images
    path.endsWith('.jpeg') ||          // Allow all .jpeg images
    path.endsWith('.png') ||           // Allow all .png images
    path.endsWith('.svg') ||           // Allow all .svg images
    path.endsWith('.webp') ||          // Allow all .webp images
    path.includes('Assistlore.mp4') ||
    path.includes('hand1.mp4') ||
    path.includes('hella.mp4') ||
    path.includes('pisa.mp4');

    // All paths under (authenticated) group require authentication
    const isProtectedPath = !isPublicPath;

    const token = request.cookies.get('token')?.value;
    const isAuthenticated = !!token;

    // Debug header to help with troubleshooting
    const response = NextResponse.next();
    response.headers.set('x-debug-auth', isAuthenticated ? 'yes' : 'no');

    // Redirect authenticated users trying to access login/signup pages to dashboard
    if (isPublicPath && isAuthenticated && (path === '/login' || path === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login
    if (isProtectedPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Handle HTTPS redirect in production
    if (
        process.env.NODE_ENV === 'production' &&
        !request.headers.get('x-forwarded-proto')?.includes('https')
    ) {
        return NextResponse.redirect(
            `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
            301
        );
    }

    // Default: allow request to proceed
    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};
