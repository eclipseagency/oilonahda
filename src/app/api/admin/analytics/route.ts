import { getSupabase } from '@/lib/supabase'
import { services } from '@/lib/services'
import { nahdaServicesAsServices } from '@/lib/nahdaBranchData'
import { requireAdmin, resolveBranch } from '@/lib/auth'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400_000).toISOString().slice(0, 10)

  const branch = resolveBranch(request, auth)
  const [bookingsRes, giftsRes, membershipsRes, clicksRes] = await Promise.all([
    supabase.from('bookings').select('service_key, status, date, time_slot, phone').eq('branch', branch).gte('date', ninetyDaysAgo),
    supabase.from('gift_requests').select('amount, status, created_at').eq('branch', branch).gte('created_at', ninetyDaysAgo),
    supabase.from('membership_requests').select('bundle, status, created_at').eq('branch', branch).gte('created_at', ninetyDaysAgo),
    supabase.from('outbound_clicks').select('type, created_at').eq('branch', branch).gte('created_at', ninetyDaysAgo),
  ])

  const bookings = bookingsRes.data || []
  const gifts = giftsRes.data || []
  const memberships = membershipsRes.data || []
  const clicks = clicksRes.data || []

  const serviceCatalog = [...services, ...nahdaServicesAsServices]
  const priceByKey = new Map(serviceCatalog.map(s => [s.key, s.price || 0]))
  const nameByKey = new Map(serviceCatalog.map(s => [s.key, { ar: s.nameAr, en: s.nameEn }]))

  // Revenue by service (completed + confirmed only)
  const revenueByService = new Map<string, { count: number; revenue: number }>()
  bookings.forEach(b => {
    if (b.status === 'confirmed' || b.status === 'completed') {
      const p = priceByKey.get(b.service_key) || 0
      const curr = revenueByService.get(b.service_key) || { count: 0, revenue: 0 }
      revenueByService.set(b.service_key, { count: curr.count + 1, revenue: curr.revenue + p })
    }
  })
  const topServices = Array.from(revenueByService.entries())
    .map(([key, v]) => ({
      key,
      name_ar: nameByKey.get(key)?.ar || key,
      name_en: nameByKey.get(key)?.en || key,
      count: v.count,
      revenue: v.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Bookings trend (last 30 days)
  const trendByDay: Record<string, { total: number; confirmed: number; revenue: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)
    trendByDay[d] = { total: 0, confirmed: 0, revenue: 0 }
  }
  bookings.forEach(b => {
    if (!b.date || b.date < thirtyDaysAgo || b.date > today) return
    const day = trendByDay[b.date]
    if (!day) return
    day.total += 1
    if (b.status === 'confirmed' || b.status === 'completed') {
      day.confirmed += 1
      day.revenue += priceByKey.get(b.service_key) || 0
    }
  })
  const trend = Object.entries(trendByDay).map(([date, v]) => ({ date, ...v }))

  // Status breakdown (last 90 days)
  const statusCounts: Record<string, number> = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  bookings.forEach(b => {
    const s = b.status || 'pending'
    if (s in statusCounts) statusCounts[s] += 1
  })

  // Busiest hour (last 90 days confirmed/completed)
  const hourCounts: Record<number, number> = {}
  bookings.forEach(b => {
    if (b.status !== 'confirmed' && b.status !== 'completed') return
    if (!b.time_slot) return
    const h = parseInt(b.time_slot.slice(0, 2))
    if (!isNaN(h)) hourCounts[h] = (hourCounts[h] || 0) + 1
  })
  const busiestHours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hourCounts[h] || 0 }))

  // Busiest day of week
  const dayCounts: Record<number, number> = {}
  bookings.forEach(b => {
    if (b.status !== 'confirmed' && b.status !== 'completed') return
    try {
      const dow = new Date(b.date + 'T00:00:00').getDay()
      dayCounts[dow] = (dayCounts[dow] || 0) + 1
    } catch {}
  })
  const busiestDays = Array.from({ length: 7 }, (_, d) => ({ day: d, count: dayCounts[d] || 0 }))

  // Lead conversion
  const giftStats = {
    total: gifts.length,
    pending: gifts.filter(g => g.status === 'pending').length,
    paid: gifts.filter(g => g.status === 'paid' || g.status === 'delivered').length,
    revenue: gifts.filter(g => g.status === 'paid' || g.status === 'delivered').reduce((s, g) => s + (g.amount || 0), 0),
  }
  const membershipStats = {
    total: memberships.length,
    pending: memberships.filter(m => m.status === 'pending').length,
    active: memberships.filter(m => m.status === 'active').length,
  }

  // Repeat customers (by phone)
  const phoneCounts: Record<string, number> = {}
  bookings.forEach(b => {
    if (b.phone) phoneCounts[b.phone] = (phoneCounts[b.phone] || 0) + 1
  })
  const uniqueCustomers = Object.keys(phoneCounts).length
  const repeatCustomers = Object.values(phoneCounts).filter(c => c >= 2).length

  // Outbound / exit-link clicks (WhatsApp, phone, email, location, social)
  const CLICK_TYPES = ['whatsapp', 'phone', 'email', 'location', 'social']
  const clicks30: Record<string, number> = {}
  const clicks90: Record<string, number> = {}
  CLICK_TYPES.forEach(t => { clicks30[t] = 0; clicks90[t] = 0 })
  clicks.forEach(c => {
    if (clicks90[c.type] === undefined) return
    clicks90[c.type] += 1
    if ((c.created_at || '').slice(0, 10) >= thirtyDaysAgo) clicks30[c.type] += 1
  })
  const outboundClicks = {
    total_30d: Object.values(clicks30).reduce((a, b) => a + b, 0),
    total_90d: Object.values(clicks90).reduce((a, b) => a + b, 0),
    by_type_30d: clicks30,
    by_type_90d: clicks90,
  }

  // Totals
  const totalRevenue = topServices.reduce((s, t) => s + t.revenue, 0)
  const totalConfirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length

  return Response.json({
    range: { from: ninetyDaysAgo, to: today },
    totals: {
      revenue: totalRevenue,
      bookings: bookings.length,
      confirmed: totalConfirmed,
      unique_customers: uniqueCustomers,
      repeat_customers: repeatCustomers,
    },
    top_services: topServices,
    trend,
    status_breakdown: statusCounts,
    busiest_hours: busiestHours,
    busiest_days: busiestDays,
    gift: giftStats,
    membership: membershipStats,
    outbound_clicks: outboundClicks,
  })
}
