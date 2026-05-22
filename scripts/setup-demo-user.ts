/**
 * One-time setup for the demo user.
 *
 * Kinde's Management API can only mark an email identity as verified at user
 * creation time (is_verified). It cannot verify an existing user's email.
 * So this script deletes the current demo user and recreates it with a
 * pre-verified email, which lets the one-click demo login skip Kinde's
 * "verify your email" step.
 *
 * Run: yarn demo:setup
 * Then copy the printed KINDE_DEMO_USER_ID into Vercel env vars.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { init, Users } from '@kinde/management-api-js'
import bcrypt from 'bcryptjs'

const DEMO_EMAIL = 'demo@repairshop.com'
const DEMO_PASSWORD = 'Demo@1234'

async function main() {
  const rawDomain = process.env.KINDE_DOMAIN
  const clientId = process.env.KINDE_MANAGEMENT_CLIENT_ID
  const clientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET

  if (!rawDomain || !clientId || !clientSecret) {
    throw new Error(
      'Faltan variables en .env.local: KINDE_DOMAIN, KINDE_MANAGEMENT_CLIENT_ID, KINDE_MANAGEMENT_CLIENT_SECRET'
    )
  }

  const kindeDomain = rawDomain.startsWith('http') ? rawDomain : `https://${rawDomain}`
  await init({ kindeDomain, clientId, clientSecret })

  // 1. Delete any existing demo user — an email identity must be unique.
  const existing = await Users.getUsers({ email: DEMO_EMAIL })
  for (const u of existing.users ?? []) {
    if (u.id) {
      console.log(`Borrando usuario existente: ${u.id} (${u.email})`)
      await Users.deleteUser({ id: u.id, isDeleteProfile: true })
    }
  }

  // 2. Create a fresh user with a pre-verified email identity.
  const created = await Users.createUser({
    requestBody: {
      profile: { given_name: 'Demo', family_name: 'User' },
      identities: [
        { type: 'email', is_verified: true, details: { email: DEMO_EMAIL } } as never,
      ],
    },
  })

  const userId = created.id
  if (!userId) throw new Error('createUser no devolvio un id de usuario')
  console.log(`Usuario creado con email verificado: ${userId}`)

  // 3. Set the password (bcrypt-hashed, permanent).
  const hashed_password = await bcrypt.hash(DEMO_PASSWORD, 10)
  await Users.setUserPassword({
    userId,
    requestBody: {
      hashed_password,
      hashing_method: 'bcrypt',
      is_temporary_password: false,
    },
  })
  console.log('Contrasena seteada correctamente.')

  console.log('\n=======================================================')
  console.log(' LISTO. Actualiza esta variable en Vercel y vuelve a deployar:')
  console.log(`   KINDE_DEMO_USER_ID=${userId}`)
  console.log('=======================================================')
  process.exit(0)
}

main().catch((err) => {
  console.error('Error en setup-demo-user:', err)
  process.exit(1)
})
