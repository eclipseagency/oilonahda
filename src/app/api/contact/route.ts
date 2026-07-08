import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { emailContactMessage } from '@/lib/email'

export async function POST(request: NextRequest) {
  let body: {
    name?: string
    phone?: string
    email?: string
    subject?: string
    message?: string
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { name, phone, email, subject, message } = body

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return Response.json({ error: 'Message is required' }, { status: 400 })
  }
  if (!phone && !email) {
    return Response.json({ error: 'Phone or email required' }, { status: 400 })
  }
  if (phone && !/^05\d{8}$/.test(phone)) {
    return Response.json({ error: 'Invalid phone' }, { status: 400 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await getSupabase()
    .from('contact_messages')
    .insert({
      name: name.trim(),
      phone: phone || null,
      email: (email || '').trim() || null,
      subject: (subject || '').trim() || null,
      message: message.trim(),
      branch: 'al-nahda',
    })

  if (error) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }

  try {
    await fetch('https://eclipse-whatsapp-bridge.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: 'social-agent',
        to: '966556733851',
        text: `رسالة جديدة — Oilo Spa\n\nالاسم: ${name.trim()}\n${phone ? `الجوال: ${phone}\n` : ''}${email ? `البريد: ${email}\n` : ''}${subject ? `الموضوع: ${subject}\n` : ''}\n${message.trim()}`,
      }),
    })
  } catch {}

  await emailContactMessage({
    name: name.trim(),
    phone,
    email,
    subject,
    message: message.trim(),
  })

  return Response.json({ success: true })
}
