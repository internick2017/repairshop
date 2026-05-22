import { NextResponse } from 'next/server'
import crypto from 'crypto'

const DEMO_EMAIL = 'demo@repairshop.com'
const DEMO_PASSWORD = 'Demo@1234'
const CONNECTION_ID = 'conn_01981ffad05500c459878e276a344b80'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 29,
}

function b64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function decodeJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
}

function parseCookies(headers: Headers): string[] {
  return (headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0])
}

function cookieHeader(jar: string[]) {
  return jar.join('; ')
}

function mergeCookieJar(jar: string[], incoming: string[]): string[] {
  const map = new Map<string, string>()
  for (const c of [...jar, ...incoming]) {
    const [k] = c.split('=')
    map.set(k.trim(), c.trim())
  }
  return Array.from(map.values())
}

function extractHiddenFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const re = /<input[^>]+type=["']hidden["'][^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const nameM = m[0].match(/name=["']([^"']+)["']/)
    const valM = m[0].match(/value=["']([^"']*?)["']/)
    if (nameM) fields[nameM[1]] = valM?.[1] ?? ''
  }
  return fields
}

function extractFormAction(html: string, fallback: string, domain: string): string {
  const m = html.match(/<form[^>]+action=["']([^"']+)["']/)
  if (!m) return fallback
  const a = m[1]
  return a.startsWith('http') ? a : `https://${domain}${a}`
}

async function followRedirects(
  url: string,
  jar: string[],
  domain: string,
  limit = 8
): Promise<{ finalUrl: string; html: string; jar: string[] }> {
  let current = url
  for (let i = 0; i < limit; i++) {
    const res = await fetch(current, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0', Cookie: cookieHeader(jar) },
    })
    jar = mergeCookieJar(jar, parseCookies(res.headers))
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location') ?? ''
      current = loc.startsWith('http') ? loc : `https://${domain}${loc}`
    } else {
      return { finalUrl: res.url || current, html: await res.text(), jar }
    }
  }
  return { finalUrl: current, html: '', jar }
}

export async function GET(request: Request) {
  const domain = process.env.KINDE_DOMAIN
  const clientId = process.env.KINDE_CLIENT_ID
  const clientSecret = process.env.KINDE_CLIENT_SECRET

  if (!domain || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/demo', request.url))
  }

  const origin = new URL(request.url).origin
  // This redirect_uri must be added to Kinde → Applications → Allowed callback URLs
  const redirectUri = `${origin}/api/demo-login`

  // ── Handle callback from Kinde (step 2 of the flow) ──────────────────────────
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const storedVerifier = request.headers.get('cookie')
    ?.split(';').find((c) => c.trim().startsWith('_dv='))
    ?.split('=')?.[1]
  const storedState = request.headers.get('cookie')
    ?.split(';').find((c) => c.trim().startsWith('_ds='))
    ?.split('=')?.[1]

  if (code && returnedState && storedVerifier && returnedState === storedState) {
    const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        code_verifier: storedVerifier,
      }),
    })

    if (!tokenRes.ok) {
      console.error('[demo-login] token exchange failed', await tokenRes.text())
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

    const res = NextResponse.redirect(new URL('/dashboard', origin))
    res.cookies.set('access_token', access_token, COOKIE_OPTS)
    res.cookies.set('id_token', id_token, COOKIE_OPTS)
    res.cookies.set('refresh_token', refresh_token, COOKIE_OPTS)
    res.cookies.set('user', JSON.stringify(user), COOKIE_OPTS)
    res.cookies.set('access_token_payload', JSON.stringify(accessPayload), COOKIE_OPTS)
    res.cookies.set('id_token_payload', JSON.stringify(idPayload), COOKIE_OPTS)
    // Clear PKCE temp cookies
    res.cookies.set('_dv', '', { maxAge: 0, path: '/' })
    res.cookies.set('_ds', '', { maxAge: 0, path: '/' })
    return res
  }

  // ── Step 1: Initiate the OAuth flow + server-side form submission ─────────────
  const verifier = b64url(crypto.randomBytes(32))
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest())
  const state = b64url(crypto.randomBytes(16))

  const authUrl =
    `https://${domain}/oauth2/auth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email offline_access',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      connection_id: CONNECTION_ID,
      login_hint: DEMO_EMAIL,
    })

  try {
    let jar: string[] = []

    // Follow Kinde's redirect chain to the login form
    const { finalUrl, html, jar: jar2 } = await followRedirects(authUrl, jar, domain)
    jar = jar2

    const formUrl = extractFormAction(html, finalUrl, domain)
    const hidden = extractHiddenFields(html)

    // Build form body — Kinde uses 'p_email' and 'p_password' or 'email'/'password'
    // We include both variants so it works regardless of Kinde version
    const body = new URLSearchParams({
      ...hidden,
      p_email: DEMO_EMAIL,
      email: DEMO_EMAIL,
      p_password: DEMO_PASSWORD,
      password: DEMO_PASSWORD,
    })

    // Submit the form and follow the redirect chain
    let authCode: string | null = null
    let nextUrl: string | null = formUrl

    const submitRes = await fetch(formUrl, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader(jar),
        Referer: finalUrl,
        'User-Agent': 'Mozilla/5.0',
      },
      body: body.toString(),
    })

    jar = mergeCookieJar(jar, parseCookies(submitRes.headers))
    nextUrl = submitRes.headers.get('location')

    // Follow the post-submit redirect chain looking for ?code=
    let hops = 0
    while (nextUrl && hops < 10) {
      const full = nextUrl.startsWith('http') ? nextUrl : `https://${domain}${nextUrl}`
      const parsed = new URL(full)

      if (parsed.searchParams.has('code')) {
        authCode = parsed.searchParams.get('code')
        break
      }

      // If it's redirecting back to our own route — it's the callback
      if (full.includes('/api/demo-login') && parsed.searchParams.has('code')) {
        authCode = parsed.searchParams.get('code')
        break
      }

      const hop = await fetch(full, {
        redirect: 'manual',
        headers: { Cookie: cookieHeader(jar), 'User-Agent': 'Mozilla/5.0' },
      })
      jar = mergeCookieJar(jar, parseCookies(hop.headers))
      nextUrl = hop.headers.get('location')
      hops++
    }

    if (authCode) {
      // Exchange immediately — skip the browser redirect entirely
      const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          code_verifier: verifier,
        }),
      })

      if (tokenRes.ok) {
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

        const res = NextResponse.redirect(new URL('/dashboard', origin))
        res.cookies.set('access_token', access_token, COOKIE_OPTS)
        res.cookies.set('id_token', id_token, COOKIE_OPTS)
        res.cookies.set('refresh_token', refresh_token, COOKIE_OPTS)
        res.cookies.set('user', JSON.stringify(user), COOKIE_OPTS)
        res.cookies.set('access_token_payload', JSON.stringify(accessPayload), COOKIE_OPTS)
        res.cookies.set('id_token_payload', JSON.stringify(idPayload), COOKIE_OPTS)
        return res
      }
    }
  } catch (err) {
    console.error('[demo-login] form simulation failed:', err)
  }

  // ── Fallback: let Kinde handle the redirect back to us ───────────────────────
  // Store PKCE verifier + state in short-lived cookies, then redirect user to Kinde
  // Kinde will call back /api/demo-login?code=...&state=... and we handle it above
  const res = NextResponse.redirect(authUrl)
  res.cookies.set('_dv', verifier, { ...COOKIE_OPTS, maxAge: 300 })
  res.cookies.set('_ds', state, { ...COOKIE_OPTS, maxAge: 300 })
  return res
}
