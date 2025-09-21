import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define admin routes that require authentication
const adminRoutes = [
  '/admin',
  '/admin/projects',
  '/admin/skills', 
  '/admin/profile',
  '/admin/uploads',
  '/admin/career',
  '/admin/tags',
  '/admin/deploy'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (isAdminRoute && pathname !== '/admin/login') {
    // Check for authentication token in cookies
    const adminToken = request.cookies.get('admin_token')
    
    if (!adminToken) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // In a real application, you would validate the token here
    // For demo purposes, we'll just check if it exists and has the right format
    if (!adminToken.value.startsWith('demo_token_')) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Security headers
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    "font-src 'self' fonts.gstatic.com; " +
    "img-src 'self' data: blob:; " +
    "connect-src 'self';"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}