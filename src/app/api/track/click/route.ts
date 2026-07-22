import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Records an outbound / "exit" link click (WhatsApp, phone, email, location,
// social, other) so the admin can see how many visitors left to convert off-site.
// Called from AnalyticsListeners via navigator.sendBeacon on every such click.
// Fire-and-forget from the browser, but the response still reflects whether the
// database accepted the event so production checks and logs can catch failures.
// This is the standalone Al Nahda site, so every click is branch 'al-nahda'.

const TYPES = new Set(['whatsapp', 'phone', 'email', 'location', 'social', 'other'])

export async function POST(request: NextRequest) {
  try {
    // sendBeacon usually posts as text/plain, so read the raw body and parse.
    const raw = await request.text()
    const body = raw ? JSON.parse(raw) : {}

    const type = String(body.type || '')
    if (!TYPES.has(type)) return Response.json({ error: 'Invalid click type' }, { status: 400 })

    const branch = 'al-nahda'
    const href = typeof body.href === 'string' ? body.href.slice(0, 500) : null
    const path = typeof body.path === 'string' ? body.path.slice(0, 300) : null

    const { error } = await getSupabase().from('outbound_clicks').insert({ type, branch, href, path })
    if (error) throw error
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to record outbound click', error)
    return Response.json({ error: 'Unable to record click' }, { status: 503 })
  }
}
