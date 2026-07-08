import nodemailer from 'nodemailer'

const NOTIFY_TO = ['info@oilo.sa']
// New-booking reminders go to the shared inboxes too — both addresses receive
// bookings from the Al Nahda branch.
const BOOKING_NOTIFY_TO = ['info@oilo.sa', 'oilo.spa.sa@gmail.com', 'oilonahda@gmail.com']
const FROM = process.env.SMTP_FROM || 'Oilo Spa Booking <info@oilo.sa>'
const REPLY_TO = 'info@oilo.sa'

let transporter: nodemailer.Transporter | null = null
function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST || 'mail.privateemail.com'
  const port = Number(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    console.error('[email] SMTP_USER or SMTP_PASS not set:', {
      SMTP_HOST: host,
      SMTP_PORT: port,
      SMTP_USER: user ? '✓' : '✗ MISSING',
      SMTP_PASS: pass ? '✓' : '✗ MISSING',
    })
    return null
  }
  console.log('[email] Creating SMTP transport:', { host, port, user })
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  })
  return transporter
}

const GOLD = '#C9A96E'
const INK = '#0a0a0d'
const CREAM = '#F5EFE4'

function escape(s: string) {
  return s.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))
}

function row(label: string, value?: string | number | null) {
  if (value === undefined || value === null || value === '') return ''
  return `<tr>
    <td style="padding:12px 16px;background:#faf8f4;color:#7a7a7a;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid #efeae0;width:38%;vertical-align:top">${escape(label)}</td>
    <td style="padding:12px 16px;color:#1a1a1a;font-size:14px;border-bottom:1px solid #efeae0;line-height:1.6">${escape(String(value))}</td>
  </tr>`
}

function pill(text: string, color = GOLD) {
  return `<span style="display:inline-block;padding:4px 12px;background:${color};color:${INK};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;border-radius:999px">${escape(text)}</span>`
}

function bookingHero(date: string, time: string, ref: string) {
  return `<table style="width:100%;background:linear-gradient(135deg,${INK} 0%,#1a1a20 100%);border-radius:12px;margin:12px 0 22px" cellpadding="0" cellspacing="0">
    <tr><td style="padding:24px;text-align:center">
      <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,239,228,0.5);margin-bottom:8px">Reference</div>
      <div style="font-size:22px;font-weight:700;color:${GOLD};font-family:'Courier New',monospace;letter-spacing:0.1em;margin-bottom:18px">${escape(ref)}</div>
      <table style="width:100%" cellpadding="0" cellspacing="0"><tr>
        <td style="text-align:center;width:50%;padding:0 8px">
          <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,239,228,0.4);margin-bottom:6px">Date</div>
          <div style="font-size:16px;font-weight:600;color:${CREAM}">${escape(date)}</div>
        </td>
        <td style="text-align:center;width:50%;padding:0 8px;border-left:1px solid rgba(245,239,228,0.1)">
          <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,239,228,0.4);margin-bottom:6px">Time</div>
          <div style="font-size:16px;font-weight:600;color:${CREAM}">${escape(time)}</div>
        </td>
      </tr></table>
    </td></tr>
  </table>`
}

function shell(opts: { tag: string; tagColor?: string; title: string; intro: string; bodyHtml: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(opts.title)}</title></head>
<body style="margin:0;padding:32px 16px;background:#f3efe8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(10,10,13,0.08)" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,${GOLD} 0%,#dbb97a 100%);padding:28px 32px;text-align:center">
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;color:${INK};letter-spacing:0.16em">OILO<span style="color:#fff">.</span></div>
      <div style="font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:${INK};opacity:0.65;margin-top:4px">Spa &middot; Riyadh</div>
    </td></tr>
    <tr><td style="padding:28px 32px 8px">${pill(opts.tag, opts.tagColor)}</td></tr>
    <tr><td style="padding:14px 32px 8px">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:${INK};line-height:1.3">${escape(opts.title)}</h1>
      <p style="margin:10px 0 0;font-size:14px;color:#5a5a5a;line-height:1.7">${escape(opts.intro)}</p>
    </td></tr>
    <tr><td style="padding:0 32px 28px">${opts.bodyHtml}</td></tr>
    <tr><td style="background:#faf8f4;padding:18px 32px;text-align:center;font-size:12px;color:#9a9a9a;border-top:1px solid #efeae0">
      Sent from oilo.sa &middot; ${escape(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh', dateStyle: 'medium', timeStyle: 'short' }))} Riyadh<br>
      <span style="font-size:11px">Reply to this email to reach <a href="mailto:${REPLY_TO}" style="color:${GOLD};text-decoration:none">${REPLY_TO}</a></span>
    </td></tr>
  </table>
</body></html>`
}

function detailsTable(rows: Record<string, string | number | undefined | null>) {
  const html = Object.entries(rows).map(([k, v]) => row(k, v)).join('')
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #efeae0;border-radius:10px;overflow:hidden;margin-top:6px" cellpadding="0" cellspacing="0">${html}</table>`
}

async function send(subject: string, html: string, to: string[] = NOTIFY_TO) {
  const t = getTransporter()
  if (!t) {
    console.error('[email] No SMTP transporter — email skipped. Set SMTP_USER and SMTP_PASS env vars.')
    return
  }
  try {
    // Verify connection first
    await t.verify()
    console.log('[email] SMTP connection verified, sending...')
    const info = await t.sendMail({
      from: FROM,
      to: to.join(', '),
      replyTo: REPLY_TO,
      subject,
      html,
    })
    console.log('[email] ✓ sent:', info.messageId, 'to:', to.join(', '), 'response:', info.response)
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.message}\n${(err as NodeJS.ErrnoException).code || ''}` : String(err)
    console.error('[email] ✗ FAILED:', msg)
    transporter = null
  }
}

// ─── Templates ──────────────────────────────────────

export async function emailNewBooking(p: {
  reference: string
  name: string
  phone: string
  serviceEn: string
  serviceAr: string
  date: string
  time: string
  price?: number | null
  branchEn?: string
  branchAr?: string
}) {
  const branchLabel = p.branchEn
    ? `${p.branchEn}${p.branchAr ? ` (${p.branchAr})` : ''}`
    : undefined
  const body = `
    ${bookingHero(p.date, p.time, p.reference)}
    ${detailsTable({
      'Branch': branchLabel,
      'Customer': p.name,
      'Phone': p.phone,
      'Service': `${p.serviceEn} (${p.serviceAr})`,
      'Price': p.price ? `${p.price} SAR` : '—',
    })}
    <table style="width:100%;margin-top:18px" cellpadding="0" cellspacing="0"><tr>
      <td style="padding:14px;background:#faf8f4;border-radius:8px;text-align:center;font-size:13px;color:#5a5a5a;line-height:1.6">
        Tap below to message the customer on WhatsApp:<br>
        <a href="https://wa.me/${p.phone.replace(/^0/, '966')}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600">Open WhatsApp</a>
      </td>
    </tr></table>`
  const branchTag = p.branchEn ? ` · ${p.branchEn}` : ''
  await send(`[Oilo] New Booking${branchTag} · ${p.date} ${p.time} · ${p.name}`,
    shell({ tag: 'New Booking', title: `New booking from ${p.name}`,
      intro: `A new booking has just been confirmed on oilo.sa${branchLabel ? ` for the ${p.branchEn} branch` : ''}. Please review the details below and prepare for the appointment.`,
      bodyHtml: body }),
    BOOKING_NOTIFY_TO)
}

export async function emailGiftRequest(p: {
  sender: string
  senderPhone: string
  recipient: string
  amount: number
  message?: string
}) {
  const body = `
    <table style="width:100%;background:linear-gradient(135deg,${INK} 0%,#1a1a20 100%);border-radius:12px;margin:12px 0 22px" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px;text-align:center">
        <div style="font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(245,239,228,0.5);margin-bottom:10px">Gift Card Value</div>
        <div style="font-size:36px;font-weight:700;color:${GOLD};font-family:'Cormorant Garamond',Georgia,serif">${p.amount} <span style="font-size:14px;font-weight:400;color:${CREAM};opacity:0.6">SAR</span></div>
      </td></tr>
    </table>
    ${detailsTable({
      'Sender': p.sender,
      'Sender Phone': p.senderPhone,
      'Recipient': p.recipient,
      'Personal Message': p.message?.trim() || '—',
    })}`
  await send(`[Oilo] Gift Card Request · ${p.amount} SAR · from ${p.sender}`,
    shell({ tag: 'Gift Card', tagColor: '#dbb97a', title: `Gift card request from ${p.sender}`,
      intro: `${p.sender} would like to send a gift card to ${p.recipient}. Please contact the sender to confirm payment and delivery.`,
      bodyHtml: body }))
}

export async function emailMembershipRequest(p: {
  name: string
  phone: string
  bundle: '5' | '10' | '20'
}) {
  const body = `
    <table style="width:100%;background:linear-gradient(135deg,${INK} 0%,#1a1a20 100%);border-radius:12px;margin:12px 0 22px" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px;text-align:center">
        <div style="font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(245,239,228,0.5);margin-bottom:10px">Membership Bundle</div>
        <div style="font-size:36px;font-weight:700;color:${GOLD};font-family:'Cormorant Garamond',Georgia,serif">${p.bundle} <span style="font-size:14px;font-weight:400;color:${CREAM};opacity:0.6">sessions</span></div>
        <div style="font-size:12px;color:rgba(245,239,228,0.5);margin-top:8px">Valid for 3 months</div>
      </td></tr>
    </table>
    ${detailsTable({ 'Customer': p.name, 'Phone': p.phone, 'Bundle': `${p.bundle}-session pack` })}`
  await send(`[Oilo] Membership Request · ${p.bundle}-session · ${p.name}`,
    shell({ tag: 'Membership', tagColor: '#b39058', title: `Membership request from ${p.name}`,
      intro: `${p.name} is interested in the ${p.bundle}-session membership bundle. Reach out to confirm pricing, payment and onboarding.`,
      bodyHtml: body }))
}

export async function emailContactMessage(p: {
  name: string
  phone?: string
  email?: string
  subject?: string
  message: string
}) {
  const body = `
    ${detailsTable({
      'Name': p.name,
      'Phone': p.phone || '—',
      'Email': p.email || '—',
      'Subject': p.subject?.trim() || '—',
    })}
    <div style="margin-top:18px;padding:18px 20px;background:#faf8f4;border-left:3px solid ${GOLD};border-radius:6px;font-size:14px;color:#1a1a1a;line-height:1.8;white-space:pre-wrap">${escape(p.message)}</div>`
  await send(`[Oilo] Contact: ${p.subject?.trim() || 'New message'} · from ${p.name}`,
    shell({ tag: 'Contact Form', tagColor: '#a08454', title: p.subject?.trim() || `Message from ${p.name}`,
      intro: `A new message arrived through the contact form on oilo.sa.`,
      bodyHtml: body }))
}
