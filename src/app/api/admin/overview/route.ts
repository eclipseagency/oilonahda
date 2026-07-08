import { getSupabase } from '@/lib/supabase'
import { requireAdmin, resolveBranch } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)
  const branch = resolveBranch(request, auth)

  // Run all counts in parallel (scoped to this admin's branch)
  const [
    bookingsToday,
    bookingsPending,
    bookingsUpcoming,
    giftPending,
    giftAll,
    membershipPending,
    membershipAll,
    contactNew,
    contactAll,
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('branch', branch).eq('date', today),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('branch', branch).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('branch', branch).gte('date', today).neq('status', 'cancelled'),
    supabase.from('gift_requests').select('*', { count: 'exact', head: true }).eq('branch', branch).eq('status', 'pending'),
    supabase.from('gift_requests').select('*', { count: 'exact', head: true }).eq('branch', branch),
    supabase.from('membership_requests').select('*', { count: 'exact', head: true }).eq('branch', branch).eq('status', 'pending'),
    supabase.from('membership_requests').select('*', { count: 'exact', head: true }).eq('branch', branch),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('branch', branch).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('branch', branch),
  ])

  return Response.json({
    bookings: {
      today: bookingsToday.count || 0,
      pending: bookingsPending.count || 0,
      upcoming: bookingsUpcoming.count || 0,
    },
    gift: {
      pending: giftPending.count || 0,
      total: giftAll.count || 0,
    },
    membership: {
      pending: membershipPending.count || 0,
      total: membershipAll.count || 0,
    },
    contact: {
      new: contactNew.count || 0,
      total: contactAll.count || 0,
    },
  })
}
