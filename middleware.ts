// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClientServer } from '@/lib/supabase/server'

const ADMIN_EMAILS = [
  'admin@example.com',
  'admin@hiringplatform.com',
  'superadmin@hiringplatform.com'
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  try {
    const supabase = createClientServer()
    const { data: { session } } = await supabase.auth.getSession()

    // Redirect root path berdasarkan auth status
    if (request.nextUrl.pathname === '/') {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      const userEmail = session.user.email
      if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return NextResponse.redirect(new URL('/admin/jobs', request.url))
      } else {
        return NextResponse.redirect(new URL('/jobs', request.url))
      }
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      const userEmail = session.user.email
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Protect jobs routes (require authentication)
    if (request.nextUrl.pathname.startsWith('/jobs') && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users away from auth pages
    if (session && 
        (request.nextUrl.pathname === '/login' || 
         request.nextUrl.pathname === '/signup')) {
      
      const userEmail = session.user.email
      if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return NextResponse.redirect(new URL('/admin/jobs', request.url))
      } else {
        return NextResponse.redirect(new URL('/jobs', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: ['/', '/admin/:path*', '/login', '/signup', '/jobs/:path*'],
}