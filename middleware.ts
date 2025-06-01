import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Get the pathname of the request (e.g. /, /admin)
  const path = request.nextUrl.pathname

  // If it's an admin path and user is not logged in,
  // redirect to the sign-in page
  if (path.startsWith('/admin') && !token) {
    return NextResponse.redirect(
      new URL('/auth/signin', request.url)
    )
  }
  
  // If it's the sign-in page but user is already logged in,
  // redirect to admin
  if (path === '/auth/signin' && token) {
    return NextResponse.redirect(
      new URL('/admin', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/signin']
}
