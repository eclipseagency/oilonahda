import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Records an outbound / "exit" link click (WhatsApp, phone, email, location,
// social) so the admin can see how many visitors left to convert off-site.
// Called from AnalyticsListeners via navigator.sendBeacon on every such click.
// Fire-and-forget: always answers 204 quickly and never blocks the click.
// This is the standalone Al Nahda site, so every click is branch 'al-nahda'.

const TYPES = new Set(['whatsapp', 'phone', 'email', 'location', 'social'])

export async function POST(request: NextRequest) {
  try {
    // sendBeacon usually posts as text/plain, so read the raw body and parse.
    const raw = await request.text()
    const body = raw ? JSON.parse(raw) : {}

    const type = String(body.type || '')
    if (!TYPES.has(type)) return new Response(null, { status: 204 })

    const branch = 'al-nahda'
    const href = typeof body.href === 'string' ? body.href.slice(0, 500) : null
    const path = typeof body.path === 'string' ? body.path.slice(0, 300) : null

    await getSupabase().from('outbound_clicks').insert({ type, branch, href, path })
  } catch {
    // Never surface tracking errors to the client.
  }
  return new Response(null, { status: 204 })
}
