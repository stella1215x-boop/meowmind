import { NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['ko', 'en', 'ja']
const DEFAULT_LOCALE    = 'ko'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip API routes, static files, Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/cat/') ||
    pathname.includes('.') ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next()
  }

  // Detect locale from URL segment (/en, /ja)
  const segments  = pathname.split('/').filter(Boolean)
  const urlLocale = SUPPORTED_LOCALES.includes(segments[0]) ? segments[0] : null

  // Detect from cookie
  const cookieLocale = request.cookies.get('MEOW_LOCALE')?.value
  const validCookie  = SUPPORTED_LOCALES.includes(cookieLocale) ? cookieLocale : null

  // Detect from Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? ''
  let headerLocale = DEFAULT_LOCALE
  if (acceptLang.includes('ja')) headerLocale = 'ja'
  else if (acceptLang.includes('en')) headerLocale = 'en'

  const detectedLocale = urlLocale ?? validCookie ?? headerLocale ?? DEFAULT_LOCALE

  // Build modified request headers so server components can read x-locale
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', detectedLocale)

  // If the URL contains a locale prefix (/en, /ja), rewrite to the real path
  // e.g. /en/history → /history  (browser keeps /en/history, app serves /history)
  if (urlLocale) {
    const stripped = '/' + segments.slice(1).join('/')
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = stripped || '/'

    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    })
    response.cookies.set('MEOW_LOCALE', detectedLocale, { path: '/', maxAge: 31536000 })
    return response
  }

  // No locale prefix — just pass through with the locale header
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.cookies.set('MEOW_LOCALE', detectedLocale, { path: '/', maxAge: 31536000 })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
