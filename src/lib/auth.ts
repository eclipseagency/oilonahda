import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'oilo_admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET missing or too short (min 32 chars)')
  }
  return new TextEncoder().encode(secret)
}

export type AdminBranch = 'al-nahda'

export interface AdminSession {
  username: string
  branch: AdminBranch
  iat: number
  exp: number
}

export async function signSession(username: string, branch: AdminBranch): Promise<string> {
  return await new SignJWT({ username, branch })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.username !== 'string') return null
    const branch: AdminBranch = 'al-nahda'
    return { ...(payload as Record<string, unknown>), branch } as unknown as AdminSession
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

export async function requireAdmin(): Promise<AdminSession | Response> {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}

const VALID_BRANCHES: AdminBranch[] = ['al-nahda']

function isAdminBranch(v: unknown): v is AdminBranch {
  return typeof v === 'string' && (VALID_BRANCHES as string[]).includes(v)
}

/**
 * Resolve the branch a request should operate on. The session is the only auth
 * gate; the *viewed* branch is allowed to float so an admin can switch branches
 * from the dashboard without re-logging-in. Reads the hint from the `?branch=`
 * query param (GET) or an explicit `branchOverride` value (mutations pass the
 * `branch` field from their parsed body). Falls back to the session branch when
 * absent or invalid.
 */
export function resolveBranch(req: Request, session: AdminSession, branchOverride?: unknown): AdminBranch {
  if (isAdminBranch(branchOverride)) return branchOverride
  try {
    const param = new URL(req.url).searchParams.get('branch')
    if (isAdminBranch(param)) return param
  } catch {
    // Malformed URL — fall through to the session branch.
  }
  return session.branch
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5

export function checkLoginRate(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { ok: true }
  }
  entry.count++
  if (entry.count > RATE_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { ok: true }
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}
