import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        return NextResponse.redirect(`${origin}/auth/error`)
      }

      let redirectTo = `${origin}${next}`

      // Workaround: If in production and origin is localhost:8080, replace with production URL
      if (process.env.NODE_ENV === 'production' && redirectTo.includes('https://localhost:8080')) {
        const productionUrl = process.env.NEXT_PUBLIC_BASE_URL
        redirectTo = redirectTo.replace('https://localhost:8080', productionUrl)
      }

      return NextResponse.redirect(redirectTo)
    } catch (err) {
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
