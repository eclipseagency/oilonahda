import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isPastDate, isPastSlot, riyadhTodayString } from '@/lib/datetime'

type BranchId = 'al-nahda'

// Al Nahda: Sat-Thu 10:00 to 06:00 (next day), Fri 16:00 to 06:00.
function generateSlots(isFriday: boolean): string[] {
  const slots: string[] = []
  const push = (h: number, m: number) =>
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)

  const startHour = isFriday ? 16 : 10
  for (let h = startHour; h < 24; h++) { push(h, 0); push(h, 30) }
  for (let h = 0; h <= 5; h++) { push(h, 0); push(h, 30) }
  return slots
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  const branch: BranchId = 'al-nahda'

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 })
  }

  if (isPastDate(date)) {
    return Response.json({ error: 'Cannot fetch slots for past dates' }, { status: 400 })
  }

  // Use Riyadh weekday for Friday detection
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    weekday: 'short',
  }).format(new Date(date + 'T12:00:00Z'))
  const isFriday = weekday === 'Fri'

  const allSlots = generateSlots(isFriday)
  const todayStr = riyadhTodayString()

  // Availability is counted per branch so a booking at one branch never blocks a
  // slot at the other. NOTE: the authoritative capacity check is the `book_slot`
  // Postgres RPC, which still enforces a *global* 5/slot. To make enforcement
  // per-branch too, apply the change in docs/book-slot-branch-migration.md.
  // Until then the only edge case is a slot showing as available here while the
  // RPC rejects it at submit (combined bookings ≥ 5) — it never overbooks.
  const { data: bookings, error } = await getSupabase()
    .from('bookings')
    .select('time_slot')
    .eq('date', date)
    .eq('branch', branch)
    .neq('status', 'cancelled')

  if (error) {
    return Response.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }

  const bookingCounts: Record<string, number> = {}
  for (const b of bookings || []) {
    bookingCounts[b.time_slot] = (bookingCounts[b.time_slot] || 0) + 1
  }

  const slots = allSlots.map((time) => {
    const booked = bookingCounts[time] || 0
    const past = date === todayStr && isPastSlot(date, time)
    return {
      time,
      available: booked < 5 && !past,
      booked,
      past,
    }
  })

  return Response.json({ slots })
}
