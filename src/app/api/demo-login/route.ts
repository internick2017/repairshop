import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { init as kindeInit, Users } from '@kinde/management-api-js'

const DEMO_EMAIL = 'demo@repairshop.com'
const DEMO_PASSWORD = 'Demo@1234'

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

function mergeCookieJar(jar: string[], incoming: string[]): string[] {
  const map = new Map<string, string>()
  for (const c of [...jar, ...incoming]) {
    const eq = c.indexOf('=')
    const k = c.slice(0, eq).trim()
    map.set(k, c.trim())
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

async function setDemoPassword(domain: string, clientId: string, clientSecret: string): Promise<void> {
  const userId = process.env.KINDE_DEMO_USER_ID
  if (!userId) return

  const kindeDomain = domain.startsWith('http') ? domain : `https://${domain}`
  await kindeInit({ kindeDomain, clientId, clientSecret })

  const hashed_password = await bcrypt.hash(DEMO_PASSWORD, 10)
  await Users.setUserPassword({
    userId,
    requestBody: { hashed_password, hashing_method: 'bcrypt', is_temporary_password: false },
  })
}

export async function GET(request: Request) {
  const domain = process.env.KINDE_DOMAIN
  const clientId = process.env.KINDE_CLIENT_ID
  const clientSecret = process.env.KINDE_CLIENT_SECRET
  const mgmtClientId = process.env.KINDE_MANAGEMENT_CLIENT_ID
  const mgmtClientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET

  if (!domain || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/demo', request.url))
  }

  const origin = new URL(request.url).origin
  // ⚠️ Add this exact URL to Kinde → Applications → Allowed callback URLs
  const redirectUri = `${origin}/api/demo-login`

  // ── Callback: Kinde redirected back with ?code= ────────────────────────────
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const cookies = request.headers.get('cookie') ?? ''
  const storedVerifier = cookies.split(';').find((c) => c.trim().startsWith('_dv='))?.split('=')?.[1]
  const storedState = cookies.split(';').find((c) => c.trim().startsWith('_ds='))?.split('=')?.[1]

  if (code && returnedState && storedVerifier && returnedState === storedState) {
    return exchangeAndLogin(code, storedVerifier, redirectUri, domain, clientId, clientSecret, origin, request)
  }

  // ── Step 1: Set demo user password via Management API ─────────────────────
  if (mgmtClientId && mgmtClientSecret && process.env.KINDE_DEMO_USER_ID) {
    try {
      await setDemoPassword(domain, mgmtClientId, mgmtClientSecret)
    } catch (err) {
      console.error('[demo-login] setUserPassword failed:', err)
      // Non-fatal — continue with form simulation anyway
    }
  }

  // ── Step 2: Generate PKCE + build auth URL ─────────────────────────────────
  const verifier = b64url(crypto.randomBytes(32))
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest())
  const state = b64url(crypto.randomBytes(16))

  const authUrl =
    `https://${domain}/oauth2/auth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      login_hint: DEMO_EMAIL,
    })

  // ── Step 3: Server-side form simulation (multi-step) ──────────────────────
  // Kinde's login is a 2-step flow: email screen first, then password screen.
  // We submit each step in sequence, following redirects between them, until
  // we either land on the OAuth callback with ?code= or run out of steps.
  try {
    let jar: string[] = []

    // 3a. Follow Kinde's redirect chain until we reach the first login form.
    let currentUrl = authUrl
    let formHtml = ''
    let formUrl = ''

    for (let i = 0; i < 6; i++) {
      const res = await fetch(currentUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': 'Mozilla/5.0', Cookie: jar.join('; ') },
      })
      jar = mergeCookieJar(jar, parseCookies(res.headers))

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location') ?? ''
        currentUrl = loc.startsWith('http') ? loc : `https://${domain}${loc}`
        if (currentUrl.includes('/api/demo-login') && new URL(currentUrl).searchParams.has('code')) {
          const authCode = new URL(currentUrl).searchParams.get('code')!
          return exchangeAndLogin(authCode, verifier, redirectUri, domain, clientId, clientSecret, origin, request)
        }
      } else {
        formHtml = await res.text()
        formUrl = res.url || currentUrl
        break
      }
    }

    if (!formHtml) throw new Error('Could not reach login form')

    // 3b. Iterate through form steps: detect which fields are present (email
    //     and/or password), POST them, follow redirects, repeat with the next
    //     form HTML if we land on another page instead of the OAuth callback.
    for (let step = 0; step < 4; step++) {
      const actionUrl = extractFormAction(formHtml, formUrl, domain)
      const hidden = extractHiddenFields(formHtml)

      const body = new URLSearchParams({ ...hidden })
      if (/name=["'](p_)?email["']/i.test(formHtml)) {
        body.set('p_email', DEMO_EMAIL)
        body.set('email', DEMO_EMAIL)
      }
      if (/name=["'](p_)?password["']/i.test(formHtml)) {
        body.set('p_password', DEMO_PASSWORD)
        body.set('password', DEMO_PASSWORD)
      }

      const submitRes = await fetch(actionUrl, {
        method: 'POST',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: jar.join('; '),
          Referer: formUrl,
          'User-Agent': 'Mozilla/5.0',
        },
        body: body.toString(),
      })
      jar = mergeCookieJar(jar, parseCookies(submitRes.headers))

      // Follow redirects after the POST until we hit code= or an HTML page.
      let nextUrl: string | null = submitRes.headers.get('location')
      let landedHtml = ''
      let landedUrl = ''

      for (let hop = 0; hop < 10 && nextUrl; hop++) {
        const full = nextUrl.startsWith('http') ? nextUrl : `https://${domain}${nextUrl}`
        const parsed = new URL(full)
        if (parsed.searchParams.has('code')) {
          const authCode = parsed.searchParams.get('code')!
          return exchangeAndLogin(authCode, verifier, redirectUri, domain, clientId, clientSecret, origin, request)
        }
        const hopRes = await fetch(full, {
          redirect: 'manual',
          headers: { Cookie: jar.join('; '), 'User-Agent': 'Mozilla/5.0' },
        })
        jar = mergeCookieJar(jar, parseCookies(hopRes.headers))
        const loc = hopRes.headers.get('location')
        if (loc) {
          nextUrl = loc
        } else {
          landedHtml = await hopRes.text()
          landedUrl = hopRes.url || full
          break
        }
      }

      if (!landedHtml) throw new Error('Form step ended without next page or code')
      formHtml = landedHtml
      formUrl = landedUrl
    }
  } catch (err) {
    console.error('[demo-login] form simulation failed:', err)
  }

  // ── Fallback: redirect user to Kinde UI, catch the callback ──────────────
  const res = NextResponse.redirect(authUrl)
  res.cookies.set('_dv', verifier, { ...COOKIE_OPTS, maxAge: 300 })
  res.cookies.set('_ds', state, { ...COOKIE_OPTS, maxAge: 300 })
  return res
}

async function exchangeAndLogin(
  code: string,
  verifier: string,
  redirectUri: string,
  domain: string,
  clientId: string,
  clientSecret: string,
  origin: string,
  request: Request
): Promise<NextResponse> {
  const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: verifier,
    }),
  })

  if (!tokenRes.ok) {
    console.error('[demo-login] token exchange failed:', await tokenRes.text())
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

  const response = NextResponse.redirect(new URL('/dashboard', origin))
  response.cookies.set('access_token', access_token, COOKIE_OPTS)
  response.cookies.set('id_token', id_token, COOKIE_OPTS)
  if (refresh_token) response.cookies.set('refresh_token', refresh_token, COOKIE_OPTS)
  response.cookies.set('user', JSON.stringify(user), COOKIE_OPTS)
  response.cookies.set('access_token_payload', JSON.stringify(accessPayload), COOKIE_OPTS)
  response.cookies.set('id_token_payload', JSON.stringify(idPayload), COOKIE_OPTS)
  response.cookies.set('_dv', '', { maxAge: 0, path: '/' })
  response.cookies.set('_ds', '', { maxAge: 0, path: '/' })
  return response
}
