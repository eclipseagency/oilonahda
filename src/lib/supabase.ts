import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Server-only service-role key bypasses RLS. Every caller of getSupabase()
    // runs server-side (API routes + cron), never in the browser, so this key
    // is never bundled to clients. It is NOT NEXT_PUBLIC_, so even an accidental
    // client import gets undefined (throws) rather than leaking the key.
    // Falls back to the anon key only when the service-role key is absent
    // (e.g. local dev before it is configured).
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return _supabase
}

export interface Booking {
  id?: string
  name: string
  phone: string
  service_key: string
  date: string
  time_slot: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at?: string
  notes?: string
  // Attribution — populated by /api/booking right after the slot RPC.
  // All optional; historical rows stay null.
  source?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  referer?: string | null
  ip?: string | null
  user_agent?: string | null
}
