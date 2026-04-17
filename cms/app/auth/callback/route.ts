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

      console.log('[CALLBACK] Success! Redirecting to:', `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    } catch (err) {
      console.error('[CALLBACK] Exception caught:', err)
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  console.log('[CALLBACK] No code provided, redirecting to error')
  return NextResponse.redirect(`${origin}/auth/error`)
}
