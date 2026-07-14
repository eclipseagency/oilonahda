import { NextRequest, NextResponse } from 'next/server'

const ARABIC_BOOKING_PATHS = new Set(['/النهضة/حجز', '/ar/النهضة/حجز'])
const ARABIC_BRANCH_PATHS = new Set(['/النهضة', '/ar/النهضة'])

export function middleware(request: NextRequest) {
  const pathname = decodeURIComponent(request.nextUrl.pathname)

  if (ARABIC_BOOKING_PATHS.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/booking'
    return NextResponse.redirect(url, 308)
  }

  if (ARABIC_BRANCH_PATHS.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-192.png|apple-touch-icon.png).*)'],
}
