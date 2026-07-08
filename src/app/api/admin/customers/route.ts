import { getSupabase } from '@/lib/supabase'
import { services } from '@/lib/services'
import { nahdaServicesAsServices } from '@/lib/nahdaBranchData'
import { requireAdmin, resolveBranch } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const supabase = getSupabase()
  const branch = resolveBranch(request, auth)

  const [bookingsRes, giftsRes, membershipsRes] = await Promise.all([
    supabase.from('bookings').select('name, phone, service_key, date, status, created_at').eq('branch', branch),
    supabase.from('gift_requests').select('sender_name, sender_phone, amount, status, created_at').eq('branch', branch),
    supabase.from('membership_requests').select('name, phone, bundle, status, created_at').eq('branch', branch),
  ])

  const bookings = bookingsRes.data || []
  const gifts = giftsRes.data || []
  const memberships = membershipsRes.data || []

  const priceByKey = new Map([...services, ...nahdaServicesAsServices].map(s => [s.key, s.price || 0]))

  interface Customer {
    phone: string
    names: Set<string>
    bookings: number
    bookings_confirmed: number
    bookings_revenue: number
    gifts: number
    gifts_revenue: number
    memberships: number
    last_activity: string
    first_activity: string
  }

  const byPhone = new Map<string, Customer>()

  const touch = (phone: string, name: string, when: string): Customer => {
    if (!byPhone.has(phone)) {
      byPhone.set(phone, {
        phone,
        names: new Set(),
        bookings: 0,
        bookings_confirmed: 0,
        bookings_revenue: 0,
        gifts: 0,
        gifts_revenue: 0,
        memberships: 0,
        last_activity: when,
        first_activity: when,
      })
    }
    const c = byPhone.get(phone)!
    if (name) c.names.add(name.trim())
    if (when > c.last_activity) c.last_activity = when
    if (when < c.first_activity) c.first_activity = when
    return c
  }

  bookings.forEach(b => {
    if (!b.phone) return
    const c = touch(b.phone, b.name || '', b.created_at || b.date)
    c.bookings += 1
    if (b.status === 'confirmed' || b.status === 'completed') {
      c.bookings_confirmed += 1
      c.bookings_revenue += priceByKey.get(b.service_key) || 0
    }
  })

  gifts.forEach(g => {
    if (!g.sender_phone) return
    const c = touch(g.sender_phone, g.sender_name || '', g.created_at)
    c.gifts += 1
    if (g.status === 'paid' || g.status === 'delivered') {
      c.gifts_revenue += g.amount || 0
    }
  })

  memberships.forEach(m => {
    if (!m.phone) return
    const c = touch(m.phone, m.name || '', m.created_at)
    c.memberships += 1
  })

  const customers = Array.from(byPhone.values()).map(c => {
    const total = c.bookings_revenue + c.gifts_revenue
    const touchpoints = c.bookings + c.gifts + c.memberships
    const isVip = total >= 1000 || c.bookings_confirmed >= 5
    return {
      phone: c.phone,
      name: Array.from(c.names)[0] || 'Unknown',
      all_names: Array.from(c.names),
      bookings: c.bookings,
      bookings_confirmed: c.bookings_confirmed,
      bookings_revenue: c.bookings_revenue,
      gifts: c.gifts,
      gifts_revenue: c.gifts_revenue,
      memberships: c.memberships,
      total_revenue: total,
      touchpoints,
      last_activity: c.last_activity,
      first_activity: c.first_activity,
      is_vip: isVip,
    }
  })

  customers.sort((a, b) => b.total_revenue - a.total_revenue || b.touchpoints - a.touchpoints)

  return Response.json({
    count: customers.length,
    vip_count: customers.filter(c => c.is_vip).length,
    customers,
  })
}
