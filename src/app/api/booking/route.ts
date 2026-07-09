import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { nahdaServicesAsServices } from '@/lib/nahdaBranchData'
import { isPastDate, isPastSlot, riyadhTodayString } from '@/lib/datetime'
import { normalizeSaudiPhone, toIntlSaudi } from '@/lib/phone'
import { getClientIp } from '@/lib/auth'

// Map a referer hostname / utm_source to a friendly attribution label shown in
// /admin. Order matters — utm_source wins, then known social/search hosts,
// then the bare hostname, finally "Direct".
function deriveSource(utmSource: string | null, referer: string | null): string {
  if (utmSource && utmSource.trim()) return utmSource.trim().toLowerCase()
  if (!referer) return 'direct'
  let host = ''
  try {
    host = new URL(referer).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return 'direct'
  }
  if (host.endsWith('oilospa.com') || host.endsWith('oilo.sa')) return 'direct' // self-referral counts as direct
  if (host.includes('tiktok')) return 'tiktok'
  if (host.includes('instagram')) return 'instagram'
  if (host.includes('snapchat')) return 'snapchat'
  if (host.includes('facebook') || host.includes('fb.com')) return 'facebook'
  if (host.includes('twitter') || host === 'x.com' || host.endsWith('.x.com')) return 'x'
  if (host.includes('whatsapp')) return 'whatsapp'
  if (host.includes('google')) return 'google'
  if (host.includes('bing')) return 'bing'
  if (host.includes('youtube')) return 'youtube'
  if (host.includes('linkedin')) return 'linkedin'
  return host
}

const ipAttempts = new Map<string, { count: number; resetAt: number }>()
const IP_WINDOW_MS = 60 * 60 * 1000 // 1h
const IP_MAX = 10

function checkIpRate(ip: string): boolean {
  const now = Date.now()
  const e = ipAttempts.get(ip)
  if (!e || e.resetAt < now) {
    ipAttempts.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS })
    return true
  }
  e.count++
  return e.count <= IP_MAX
}

import { emailNewBooking } from '@/lib/email'
import { sendSnapConversion } from '@/lib/snapCapi'

async function notifyOwnerWhatsApp(payload: {
  name: string
  phone: string
  serviceAr: string
  date: string
  time: string
  bookingId: string
}) {
  const text = `حجز جديد — Oilo Spa\n\nرقم: ${payload.bookingId.slice(0, 8)}\nالاسم: ${payload.name}\nالجوال: ${payload.phone}\nالخدمة: ${payload.serviceAr}\nالتاريخ: ${payload.date}\nالوقت: ${payload.time}`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 3000)
  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: 'social-agent', to: '966556733851', text }),
      signal: ctrl.signal,
    })
  } catch {
    // best effort
  } finally {
    clearTimeout(t)
  }
}

async function notifyCustomerWhatsApp(payload: {
  phoneIntl: string
  name: string
  serviceAr: string
  date: string
  time: string
  bookingId: string
}) {
  const text =
    `أهلاً ${payload.name} 🌿\n` +
    `تم استلام حجزك في Oilo Spa.\n\n` +
    `رقم الحجز: ${payload.bookingId.slice(0, 8)}\n` +
    `الخدمة: ${payload.serviceAr}\n` +
    `التاريخ: ${payload.date}\n` +
    `الوقت: ${payload.time}\n\n` +
    `سنتواصل معك للتأكيد. للاستفسار: 0556733851`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 3000)
  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: 'social-agent', to: payload.phoneIntl, text }),
      signal: ctrl.signal,
    })
  } catch {} finally {
    clearTimeout(t)
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkIpRate(ip)) {
    return Response.json({ error: 'Too many requests. Try again in an hour.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    name, phone: phoneRaw, service_key, date, time_slot, consent, website,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content, referer,
  } = body as {
    name?: string
    phone?: string
    service_key?: string
    date?: string
    time_slot?: string
    consent?: boolean
    website?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    referer?: string
  }

  // Cap any user-supplied attribution string at 500 chars to keep abuse out of
  // the column. Empty / non-string values become null.
  const cap = (v: unknown): string | null => {
    if (typeof v !== 'string') return null
    const s = v.trim()
    if (!s) return null
    return s.slice(0, 500)
  }

  // Honeypot
  if (website && String(website).trim().length > 0) {
    return Response.json({ success: true, booking_id: 'ok' })
  }

  if (!name || !phoneRaw || !service_key || !date || !time_slot) {
    return Response.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    return Response.json({ error: 'Invalid name' }, { status: 400 })
  }

  const phone = normalizeSaudiPhone(phoneRaw)
  if (!phone) {
    return Response.json({ error: 'Invalid Saudi phone number' }, { status: 400 })
  }

  const branch = 'al-nahda' as const

  // Validate the service against the Al Nahda catalog.
  const service = nahdaServicesAsServices.find(s => s.key === service_key)
  if (!service) {
    return Response.json({ error: 'Invalid service' }, { status: 400 })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Invalid date format' }, { status: 400 })
  }
  if (isPastDate(date)) {
    return Response.json({ error: 'Cannot book past dates' }, { status: 400 })
  }

  if (!/^\d{2}:\d{2}$/.test(time_slot)) {
    return Response.json({ error: 'Invalid time slot format' }, { status: 400 })
  }
  if (isPastSlot(date, time_slot)) {
    return Response.json({ error: 'This slot has passed' }, { status: 400 })
  }

  if (consent !== true) {
    return Response.json({ error: 'Consent required' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Per-phone daily limit (3/day)
  const today = riyadhTodayString()
  const { count: phoneToday } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone)
    .eq('branch', branch)
    .eq('date', today)
    .neq('status', 'cancelled')
  if ((phoneToday ?? 0) >= 3) {
    return Response.json({ error: 'Daily booking limit reached for this number' }, { status: 429 })
  }

  // Atomic capacity check + insert
  const { data, error } = await supabase.rpc('book_slot', {
    p_name: name.trim(),
    p_phone: phone,
    p_service_key: service_key,
    p_date: date,
    p_time_slot: time_slot,
    p_consent: !!consent,
  })

  if (error) {
    if (error.message?.includes('SLOT_FULL')) {
      return Response.json({ error: 'This time slot is fully booked' }, { status: 409 })
    }
    if (error.message?.includes('DUPLICATE_BOOKING')) {
      return Response.json({ error: 'You already have a booking at this time' }, { status: 409 })
    }
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  const bookingId = (Array.isArray(data) && data[0]?.id) || data?.id
  if (!bookingId) {
    return Response.json({ error: 'Booking failed' }, { status: 500 })
  }

  // Stamp attribution on the new row. The RPC owns capacity-safe insert and
  // can't be widened easily, so we fill metadata in a follow-up update — a
  // tiny window where the row exists without source is acceptable here.
  const utmSrc = cap(utm_source)
  const ref = cap(referer)
  const userAgent = cap(request.headers.get('user-agent'))
  const sourceLabel = deriveSource(utmSrc, ref)
  await supabase
    .from('bookings')
    .update({
      branch,
      source: sourceLabel,
      utm_source: utmSrc,
      utm_medium: cap(utm_medium),
      utm_campaign: cap(utm_campaign),
      utm_term: cap(utm_term),
      utm_content: cap(utm_content),
      referer: ref,
      ip,
      user_agent: userAgent,
    })
    .eq('id', bookingId)

  // Snapchat Conversions API — server-side SIGN_UP with a hashed phone, so the
  // booking attributes to Snap ads even when an ad-blocker strips the browser
  // pixel. Deduplicated against the browser pixel by event_id = bookingId.
  // Awaited (with its own 3s timeout) because Vercel kills background work after
  // the response returns; a no-op until the Snap env vars are set.
  await sendSnapConversion({
    eventName: 'SIGN_UP',
    eventId: bookingId,
    eventSourceUrl: ref || 'https://www.oilospa.com/booking',
    phoneE164NoPlus: toIntlSaudi(phone), // "9665XXXXXXXX"
    clientIp: ip,
    userAgent: userAgent || undefined,
    scCookie1: request.cookies.get('_scid')?.value,
    contentIds: [service_key],
    contentCategory: [branch],
  })

  // Fire-and-forget notifications (don't await)
  notifyOwnerWhatsApp({
    name: name.trim(),
    phone,
    serviceAr: service.nameAr,
    date,
    time: time_slot,
    bookingId,
  })
  notifyCustomerWhatsApp({
    phoneIntl: toIntlSaudi(phone),
    name: name.trim(),
    serviceAr: service.nameAr,
    date,
    time: time_slot,
    bookingId,
  })
  await emailNewBooking({
    reference: bookingId.slice(0, 8).toUpperCase(),
    name: name.trim(),
    phone,
    serviceEn: service.nameEn,
    serviceAr: service.nameAr,
    date,
    time: time_slot,
    price: service.price,
    branchEn: 'Al Nahda',
    branchAr: 'فرع النهضة',
  })

  return Response.json({
    success: true,
    booking_id: bookingId,
    reference: bookingId.slice(0, 8).toUpperCase(),
  })
}
