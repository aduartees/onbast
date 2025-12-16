import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sanity Studio usually requires looser CSP (unsafe-eval)
  const isStudio = request.nextUrl.pathname.startsWith('/studio')
  
  // Construct CSP
  // - script-src: We use 'unsafe-inline' and 'unsafe-eval' to ensure compatibility with Vercel Analytics and other scripts
  // - style-src: We keep 'unsafe-inline' as many UI libraries/Tailwind tools might need it
  
  let scriptSrc = `'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com`
  
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc} https://formsubmit.co;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io https://images.unsplash.com https://assets.aceternity.com https://i.pravatar.cc https://assets.vercel.com https://avatars.githubusercontent.com https://upload.wikimedia.org https://grainy-gradients.vercel.app https://formsubmit.co;
    font-src 'self' data:;
    connect-src 'self' https://*.sanity.io https://formsubmit.co https://vitals.vercel-insights.com;
    frame-src 'self' https://formsubmit.co;
    base-uri 'self';
    form-action 'self' https://formsubmit.co;
    upgrade-insecure-requests;
  `
  // Replace newlines with spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
  
  // Strict-Transport-Security (HSTS)
  // Forces browser to use HTTPS for the next 2 years, includes subdomains, and allows preloading.
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  
  // Other Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')

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
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
