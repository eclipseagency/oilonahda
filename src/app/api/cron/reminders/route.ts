import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { nahdaServicesAsServices } from '@/lib/nahdaBranchData'
import { toIntlSaudi } from '@/lib/phone'

// Vercel Cron hits this every 15 minutes.
// Sends 24h-before and 2h-before reminders for upcoming bookings.
// Idempotent: tracks reminded_24h / reminded_2h flags on the booking row.

export const dynamic = 'force-dynamic'

const TZ = 'Asia/Riyadh'

function riyadhNowMs(): number {
  // ms-since-epoch is TZ-independent; only formatting differs. We compare slot UTC instants.
  return Date.now()
}

function slotInstantUtcMs(date: string, slot: string): number {
  // date = YYYY-MM-DD, slot = HH:MM, treated as Riyadh local time (UTC+3, no DST)
  const [y, m, d] = date.split('-').map(Number)
  const [h, mm] = slot.split(':').map(Number)
  return Date.UTC(y, m - 1, d, h - 3, mm)
}

function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET
  if (!secret) return true // allow if not configured (dev)
  const auth = req.headers.get('authorization') || ''
  return auth === `Bearer ${secret}`
}

async function sendWa(to: string, text: string) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 4000)
  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: 'social-agent', to, text }),
      signal: ctrl.signal,
    })
  } catch {} finally { clearTimeout(t) }
}

interface BookingRow {
  id: string
  name: string
  phone: string
  service_key: string
  date: string
  time_slot: string
  status: string
  reminded_24h: boolean | null
  reminded_2h: boolean | null
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const now = riyadhNowMs()
  // Look 25h ahead so we never miss the 24h window even with clock skew
  const horizon = new Date(now + 25 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const todayStr = new Date(now).toISOString().slice(0, 10)

  const { data: rows, error } = await supabase
    .from('bookings')
    .select('id, name, phone, service_key, date, time_slot, status, reminded_24h, reminded_2h')
    .in('status', ['pending', 'confirmed'])
    .gte('date', todayStr)
    .lte('date', horizon)
    .limit(200)

  if (error) {
    return Response.json({ error: 'Failed to fetch bookings', detail: error.message }, { status: 500 })
  }

  const sent: { ref: string; type: '24h' | '2h' }[] = []

  for (const b of (rows as BookingRow[]) || []) {
    const slotMs = slotInstantUtcMs(b.date, b.time_slot)
    const minutesUntil = (slotMs - now) / 60000
    const ref = b.id.slice(0, 8).toUpperCase()
    const service = nahdaServicesAsServices.find((item) => item.key === b.service_key)
    const serviceAr = service?.nameAr || b.service_key
    const phoneIntl = toIntlSaudi(b.phone)

    // 24h reminder: between 22h and 25h before slot, only once
    if (!b.reminded_24h && minutesUntil > 22 * 60 && minutesUntil <= 25 * 60) {
      const text =
        `تذكير من Oilo Spa 🌿\n\n` +
        `أهلاً ${b.name},\nموعد جلستك غدًا.\n\n` +
        `رقم الحجز: ${ref}\n` +
        `الخدمة: ${serviceAr}\n` +
        `التاريخ: ${b.date}\n` +
        `الوقت: ${b.time_slot}\n\n` +
        `للتعديل أو الإلغاء: https://www.oilospa.com/booking/manage?ref=${ref}\n` +
        `للاستفسار: 0556733851`
      await sendWa(phoneIntl, text)
      await supabase.from('bookings').update({ reminded_24h: true }).eq('id', b.id)
      sent.push({ ref, type: '24h' })
      continue
    }

    // 2h reminder: between 90 and 130 min before slot, only once
    if (!b.reminded_2h && minutesUntil > 90 && minutesUntil <= 130) {
      const text =
        `تذكير: موعدك بعد ساعتين 🌿\n\n` +
        `${b.name}, نراك في Oilo Spa.\n` +
        `الخدمة: ${serviceAr}\n` +
        `الوقت: ${b.time_slot}\n` +
        `العنوان: شارع سلمان الفارسي، حي النهضة، الرياض\n\n` +
        `رقم الحجز: ${ref}`
      await sendWa(phoneIntl, text)
      await supabase.from('bookings').update({ reminded_2h: true }).eq('id', b.id)
      sent.push({ ref, type: '2h' })
    }
  }

  return Response.json({ ok: true, scanned: rows?.length || 0, sent, tz: TZ })
}
