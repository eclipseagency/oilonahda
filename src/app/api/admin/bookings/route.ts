import { getSupabase } from '@/lib/supabase'
import { requireAdmin, resolveBranch } from '@/lib/auth'
import { toIntlSaudi } from '@/lib/phone'

// Google review link for Oilo Spa. Override via env GOOGLE_REVIEW_URL on Vercel
// once we have the official Place ID (format: https://search.google.com/local/writereview?placeid=XXXX
// or https://g.page/r/<id>/review). Falls back to a Maps search prefilled with the brand name.
const REVIEW_URL = process.env.GOOGLE_REVIEW_URL
  || 'https://www.google.com/maps/search/?api=1&query=Oilo+Spa+%D8%A3%D9%88%D9%8A%D9%84%D9%88+%D8%B3%D8%A8%D8%A7+%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6'

async function sendReviewRequest(phone: string, customerName: string) {
  const intl = toIntlSaudi(phone)
  const text = `مرحباً ${customerName} 🌟\n\n` +
    `شكراً لزيارتك أويلو سبا. نتمنى أن تكون قد استمتعت بتجربتك.\n\n` +
    `إذا أعجبتك الخدمة، يسعدنا مشاركتنا تقييمك على خرائط جوجل — يأخذ أقل من دقيقة ويعني لنا الكثير:\n` +
    `${REVIEW_URL}\n\n` +
    `بانتظار عودتك قريباً.\n— أويلو سبا`
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 3000)
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: 'social-agent', to: intl, text }),
      signal: ctrl.signal,
    })
    clearTimeout(t)
  } catch {
    // Fire-and-forget — never block the API response on a wa-bridge failure.
  }
}

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const range = searchParams.get('range') // 'today' | 'upcoming' | 'all' | null
  const status = searchParams.get('status') || ''
  const branch = resolveBranch(request, auth)

  let query = getSupabase().from('bookings').select('*').eq('branch', branch)

  if (date) {
    query = query.eq('date', date).order('time_slot', { ascending: true })
  } else if (range === 'upcoming') {
    const today = new Date().toISOString().slice(0, 10)
    query = query.gte('date', today).order('date', { ascending: true }).order('time_slot', { ascending: true })
  } else {
    // default: recent 100
    query = query.order('date', { ascending: false }).order('time_slot', { ascending: false }).limit(100)
  }

  if (status) query = query.eq('status', status)

  const { data: bookings, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ bookings: bookings || [] })
}

export async function PUT(request: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  try {
    const { id, status, notes, branch: branchOverride } = await request.json()
    const branch = resolveBranch(request, auth, branchOverride)

    if (!id || !status) {
      return Response.json({ error: 'id and status required' }, { status: 400 })
    }

    const updateData: Record<string, string> = { status }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    // Read the prior booking so we can detect a "just-completed" transition and
    // avoid spamming the customer if the row is updated multiple times.
    const sb = getSupabase()
    const { data: prior } = await sb
      .from('bookings')
      .select('id, name, phone, status, review_requested_at')
      .eq('id', id)
      .eq('branch', branch)
      .single()

    const wasCompletedBefore = prior?.status === 'completed' || !!prior?.review_requested_at
    const justCompleted = status === 'completed' && !wasCompletedBefore

    if (justCompleted) {
      updateData.review_requested_at = new Date().toISOString()
    }

    const { error } = await sb.from('bookings').update(updateData).eq('id', id).eq('branch', branch)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (justCompleted && prior?.phone) {
      // Fire-and-forget WhatsApp invite to leave a Google Maps review.
      sendReviewRequest(prior.phone, prior.name || '').catch(() => {})
    }

    return Response.json({ success: true, review_sent: justCompleted })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
