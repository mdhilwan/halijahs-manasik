import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('[CALLBACK] Received callback request:', {
    code: code ? 'present' : 'missing',
    origin,
    next,
    fullUrl: request.url,
    env: process.env.NODE_ENV
  })

  if (code) {
    try {
      const supabase = await createClient()
      console.log('[CALLBACK] Exchanging code for session...')
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.log('[CALLBACK] Error exchanging code:', error)
        return NextResponse.redirect(`${origin}/auth/error`)
      }

      let redirectTo = `${origin}${next}`

      // Workaround: If in production and origin is localhost:8080, replace with production URL
      if (process.env.NODE_ENV === 'production' && redirectTo.includes('https://localhost:8080')) {
        const productionUrl = process.env.NEXT_PUBLIC_BASE_URL
        console.log('[CALLBACK] Replacing localhost:8080 with production URL:', productionUrl)
        redirectTo = redirectTo.replace('https://localhost:8080', productionUrl)
      }

      console.log('[CALLBACK] Success! Redirecting to:', redirectTo)
      return NextResponse.redirect(redirectTo)
    } catch (err) {
      console.error('[CALLBACK] Exception caught:', err)
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  console.log('[CALLBACK] No code provided, redirecting to error')
  return NextResponse.redirect(`${origin}/auth/error`)
}
