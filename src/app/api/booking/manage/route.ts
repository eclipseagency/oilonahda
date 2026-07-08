import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { normalizeSaudiPhone, toIntlSaudi } from '@/lib/phone'
import { isPastDate, isPastSlot, riyadhTodayString, riyadhCurrentTimeMinutes, timeSlotToMinutes } from '@/lib/datetime'
import { nahdaServicesAsServices } from '@/lib/nahdaBranchData'
import { getClientIp } from '@/lib/auth'

const ipAttempts = new Map<string, { count: number; resetAt: number }>()
const IP_WINDOW_MS = 15 * 60 * 1000
const IP_MAX = 20

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

// Riyadh "now" minutes-since-epoch helper for the 2h cutoff
function bookingMinutesFromNow(date: string, time_slot: string): number {
  const today = riyadhTodayString()
  const slotMins = timeSlotToMinutes(time_slot)
  if (date === today) return slotMins - riyadhCurrentTimeMinutes()
  // approximate days delta in Riyadh — ok within seconds
  const [y1, m1, d1] = today.split('-').map(Number)
  const [y2, m2, d2] = date.split('-').map(Number)
  const days = Math.round(
    (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000
  )
  return days * 24 * 60 + slotMins - riyadhCurrentTimeMinutes()
}

async function findBookingByRef(reference: string, phone: string) {
  const supabase = getSupabase()
  const refPrefix = reference.toLowerCase()
  // Reference = first 8 chars of UUID. Match via prefix.
  const { data, error } = await supabase
    .from('bookings')
    .select('id, name, phone, service_key, date, time_slot, status, created_at, notes')
    .eq('phone', phone)
    .ilike('id', `${refPrefix}%`)
    .limit(1)
  if (error || !data || data.length === 0) return null
  return data[0]
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkIpRate(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const action = String(body.action || '').toLowerCase()
  const reference = String(body.reference || '').trim()
  const phoneRaw = String(body.phone || '').trim()

  if (!['lookup', 'cancel', 'reschedule'].includes(action)) {
    return Response.json({ error: 'Invalid action' }, { status: 400 })
  }
  if (!/^[0-9a-fA-F]{8}$/.test(reference)) {
    return Response.json({ error: 'Invalid reference' }, { status: 400 })
  }
  const phone = normalizeSaudiPhone(phoneRaw)
  if (!phone) {
    return Response.json({ error: 'Invalid Saudi phone number' }, { status: 400 })
  }

  const booking = await findBookingByRef(reference, phone)
  if (!booking) {
    return Response.json({ error: 'No booking found with that reference and phone' }, { status: 404 })
  }

  const service = nahdaServicesAsServices.find((item) => item.key === booking.service_key)
  const summary = {
    reference: booking.id.slice(0, 8).toUpperCase(),
    name: booking.name,
    phone: booking.phone,
    service_key: booking.service_key,
    serviceEn: service?.nameEn || booking.service_key,
    serviceAr: service?.nameAr || booking.service_key,
    date: booking.date,
    time_slot: booking.time_slot,
    status: booking.status,
    minutesUntil: bookingMinutesFromNow(booking.date, booking.time_slot),
  }

  if (action === 'lookup') {
    return Response.json({ success: true, booking: summary })
  }

  // Lock down: only modify pending/confirmed bookings, ≥ 2h before slot
  if (['cancelled', 'completed'].includes(booking.status)) {
    return Response.json({ error: `Booking already ${booking.status}` }, { status: 400 })
  }
  if (summary.minutesUntil < 120) {
    return Response.json({
      error: 'Bookings can only be modified at least 2 hours before the appointment. Please call us instead.',
    }, { status: 400 })
  }

  const supabase = getSupabase()

  if (action === 'cancel') {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', notes: appendNote(booking.notes, 'Cancelled by customer via /booking/manage') })
      .eq('id', booking.id)
    if (error) return Response.json({ error: 'Failed to cancel' }, { status: 500 })

    // Fire-and-forget WhatsApp to owner
    notifyOwnerCancel({
      reference: summary.reference,
      name: booking.name,
      phone: booking.phone,
      date: booking.date,
      time: booking.time_slot,
      serviceAr: summary.serviceAr,
    })
    notifyCustomerCancel({
      phoneIntl: toIntlSaudi(booking.phone),
      name: booking.name,
      reference: summary.reference,
    })
    return Response.json({ success: true, booking: { ...summary, status: 'cancelled' } })
  }

  if (action === 'reschedule') {
    const newDate = String(body.date || '').trim()
    const newTime = String(body.time_slot || '').trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) || !/^\d{2}:\d{2}$/.test(newTime)) {
      return Response.json({ error: 'Invalid new date or time' }, { status: 400 })
    }
    if (isPastDate(newDate) || isPastSlot(newDate, newTime)) {
      return Response.json({ error: 'New slot is in the past' }, { status: 400 })
    }
    if (newDate === booking.date && newTime === booking.time_slot) {
      return Response.json({ error: 'Same slot — nothing to change' }, { status: 400 })
    }

    // Capacity check (best-effort; race-condition safe enough for spa volume)
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('date', newDate)
      .eq('time_slot', newTime)
      .eq('branch', 'al-nahda')
      .neq('status', 'cancelled')
    if ((count ?? 0) >= 5) {
      return Response.json({ error: 'New slot is fully booked' }, { status: 409 })
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        date: newDate,
        time_slot: newTime,
        notes: appendNote(
          booking.notes,
          `Rescheduled by customer: ${booking.date} ${booking.time_slot} → ${newDate} ${newTime}`
        ),
      })
      .eq('id', booking.id)
    if (error) return Response.json({ error: 'Failed to reschedule' }, { status: 500 })

    notifyOwnerReschedule({
      reference: summary.reference,
      name: booking.name,
      phone: booking.phone,
      oldDate: booking.date,
      oldTime: booking.time_slot,
      newDate,
      newTime,
      serviceAr: summary.serviceAr,
    })
    notifyCustomerReschedule({
      phoneIntl: toIntlSaudi(booking.phone),
      name: booking.name,
      reference: summary.reference,
      newDate,
      newTime,
    })

    return Response.json({
      success: true,
      booking: { ...summary, date: newDate, time_slot: newTime },
    })
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 })
}

function appendNote(existing: string | null | undefined, line: string): string {
  const stamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh' })
  const newLine = `[${stamp}] ${line}`
  return existing ? `${existing}\n${newLine}` : newLine
}

async function postWa(to: string, text: string) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 3000)
  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: 'social-agent', to, text }),
      signal: ctrl.signal,
    })
  } catch {} finally { clearTimeout(t) }
}

function notifyOwnerCancel(p: { reference: string; name: string; phone: string; date: string; time: string; serviceAr: string }) {
  postWa('966556733851',
    `❌ إلغاء حجز — Oilo Spa\n\nرقم: ${p.reference}\nالاسم: ${p.name}\nالجوال: ${p.phone}\nالخدمة: ${p.serviceAr}\nالتاريخ: ${p.date}\nالوقت: ${p.time}`)
}
function notifyCustomerCancel(p: { phoneIntl: string; name: string; reference: string }) {
  postWa(p.phoneIntl,
    `أهلاً ${p.name},\nتم إلغاء حجزك في Oilo Spa.\nرقم الحجز: ${p.reference}\n\nنتمنى رؤيتك قريبًا. للحجز مجددًا: https://oilo.sa/booking`)
}
function notifyOwnerReschedule(p: { reference: string; name: string; phone: string; oldDate: string; oldTime: string; newDate: string; newTime: string; serviceAr: string }) {
  postWa('966556733851',
    `🔄 تعديل حجز — Oilo Spa\n\nرقم: ${p.reference}\nالاسم: ${p.name}\nالجوال: ${p.phone}\nالخدمة: ${p.serviceAr}\nمن: ${p.oldDate} ${p.oldTime}\nإلى: ${p.newDate} ${p.newTime}`)
}
function notifyCustomerReschedule(p: { phoneIntl: string; name: string; reference: string; newDate: string; newTime: string }) {
  postWa(p.phoneIntl,
    `أهلاً ${p.name},\nتم تعديل موعد حجزك.\nرقم: ${p.reference}\nالموعد الجديد: ${p.newDate} ${p.newTime}\n\nنراك قريبًا في Oilo Spa.`)
}
