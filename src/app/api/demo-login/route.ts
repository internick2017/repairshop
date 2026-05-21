import { NextResponse } from 'next/server'

const DEMO_EMAIL = 'demo@repairshop.com'
const DEMO_PASSWORD = 'Demo@1234'

function decodeJwt(token: string): Record<string, unknown> {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64').toString())
}

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 29, // 29 days, matches Kinde SDK
}

export async function GET(request: Request) {
  const domain = process.env.KINDE_DOMAIN
  const clientId = process.env.KINDE_CLIENT_ID
  const clientSecret = process.env.KINDE_CLIENT_SECRET

  if (!domain || !clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Kinde env vars' }, { status: 500 })
  }

  // ROPC grant — exchanges email+password directly for tokens server-side
  const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      username: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid profile email offline_access',
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('[demo-login] ROPC failed:', err)
    // Fall back to redirect to the /demo read-only page
    return NextResponse.redirect(new URL('/demo', request.url))
  }

  const { access_token, id_token, refresh_token } = await tokenRes.json()

  const accessPayload = decodeJwt(access_token)
  const idPayload = decodeJwt(id_token)

  const user = {
    id: idPayload.sub,
    email: idPayload.email,
    given_name: idPayload.given_name,
    family_name: idPayload.family_name,
    picture: idPayload.picture ?? null,
  }

  // Set the same cookies Kinde's callback handler sets
  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL('/dashboard', origin))

  response.cookies.set('access_token', access_token, COOKIE_OPTS)
  response.cookies.set('id_token', id_token, COOKIE_OPTS)
  response.cookies.set('refresh_token', refresh_token, COOKIE_OPTS)
  response.cookies.set('user', JSON.stringify(user), COOKIE_OPTS)
  response.cookies.set('access_token_payload', JSON.stringify(accessPayload), COOKIE_OPTS)
  response.cookies.set('id_token_payload', JSON.stringify(idPayload), COOKIE_OPTS)

  return response
}
