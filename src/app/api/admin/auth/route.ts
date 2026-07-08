import {
  signSession,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  checkLoginRate,
  getClientIp,
  type AdminBranch,
} from '@/lib/auth'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rate = checkLoginRate(ip)
  if (!rate.ok) {
    return Response.json(
      { error: `Too many attempts. Retry in ${rate.retryAfterSec}s` },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    )
  }

  let body: { username?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { username, password } = body

  // This branch build authenticates against Al Nahda credentials.
  // Trim env values — credentials set via `vercel env add` from a pipe can
  // carry a trailing newline, which would break the exact comparison.
  const envTrim = (v?: string) => (typeof v === 'string' ? v.trim() : v)
  const accounts: { branch: AdminBranch; user?: string; pass?: string }[] = [
    {
      branch: 'al-nahda',
      user: envTrim(process.env.ADMIN_NAHDA_USERNAME || process.env.ADMIN_USERNAME),
      pass: envTrim(process.env.ADMIN_NAHDA_PASSWORD || process.env.ADMIN_PASSWORD),
    },
  ]

  if (!accounts[0].user || !accounts[0].pass) {
    return Response.json({ error: 'Admin auth not configured' }, { status: 500 })
  }

  if (!username || !password) {
    return Response.json({ error: 'Username and password required' }, { status: 400 })
  }

  let matched: AdminBranch | null = null
  for (const a of accounts) {
    if (a.user && a.pass && timingSafeEqual(username, a.user) && timingSafeEqual(password, a.pass)) {
      matched = a.branch
      break
    }
  }
  if (!matched) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signSession(username, matched)
  await setSessionCookie(token)
  return Response.json({ success: true, username, branch: matched })
}

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ authed: false }, { status: 401 })
  return Response.json({ authed: true, username: session.username, branch: session.branch })
}

export async function DELETE() {
  await clearSessionCookie()
  return Response.json({ success: true })
}
