import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { emailGiftRequest, emailMembershipRequest } from '@/lib/email'

interface LeadPayload {
  type: 'gift' | 'membership'
  name?: string
  phone?: string
  recipient?: string
  amount?: number
  message?: string
  bundle?: '5' | '10' | '20'
}

export async function POST(request: NextRequest) {
  let body: LeadPayload
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { type, name, phone } = body

  if (!type || !['gift', 'membership'].includes(type)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return Response.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (!phone || !/^05\d{8}$/.test(phone)) {
    return Response.json({ error: 'Invalid phone' }, { status: 400 })
  }

  const supabase = getSupabase()
  let text = ''

  if (type === 'gift') {
    const { recipient, amount, message } = body
    if (!recipient || recipient.trim().length < 2) {
      return Response.json({ error: 'Invalid recipient' }, { status: 400 })
    }
    if (!amount || amount < 50 || amount > 10000) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 })
    }
    const { error } = await supabase
      .from('gift_requests')
      .insert({
        sender_name: name.trim(),
        sender_phone: phone,
        recipient_name: recipient.trim(),
        amount,
        message: (message || '').trim() || null,
        branch: 'al-nahda',
      })
    if (error) {
      return Response.json({ error: 'Failed to save request' }, { status: 500 })
    }
    text = `طلب بطاقة هدية — Oilo Spa\n\nالمرسل: ${name.trim()}\nالجوال: ${phone}\nالمستلم: ${recipient.trim()}\nالقيمة: ${amount} ر.س\nالرسالة: ${(message || '').trim() || '-'}`
  } else {
    const { bundle } = body
    if (!bundle || !['5', '10', '20'].includes(bundle)) {
      return Response.json({ error: 'Invalid bundle' }, { status: 400 })
    }
    const { error } = await supabase
      .from('membership_requests')
      .insert({
        name: name.trim(),
        phone,
        bundle,
        branch: 'al-nahda',
      })
    if (error) {
      return Response.json({ error: 'Failed to save request' }, { status: 500 })
    }
    text = `طلب عضوية - Oilo Spa\n\nالاسم: ${name.trim()}\nالجوال: ${phone}\nالباقة: ${bundle} جلسات`
  }

  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: 'social-agent',
        to: '966556733851',
        text,
      }),
    })
  } catch {
    // non-blocking
  }

  if (type === 'gift') {
    await emailGiftRequest({
      sender: name.trim(),
      senderPhone: phone,
      recipient: (body.recipient || '').trim(),
      amount: body.amount!,
      message: body.message,
    })
  } else {
    await emailMembershipRequest({
      name: name.trim(),
      phone,
      bundle: body.bundle as '5' | '10' | '20',
    })
  }

  return Response.json({ success: true })
}
