'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { branches } from '@/lib/branches'

const nahda = branches['al-nahda']
const CONTACT_EMAIL = 'oilonahda@gmail.com'
const WA_GREETING = 'السلام عليكم، تواصلت من موقع أويلو سبا فرع النهضة، أود الاستفسار عن الخدمات والحجز.'
const waHref = `https://wa.me/${nahda.whatsapp}?text=${encodeURIComponent(WA_GREETING)}`
const mapEmbed = nahda.geo
  ? `https://maps.google.com/maps?q=${nahda.geo.lat},${nahda.geo.lng}&z=15&output=embed`
  : ''

export default function ContactPage() {
  const { locale } = useI18n()
  const isAr = locale === 'ar'
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const validatePhone = (v: string) => {
    setPhone(v)
    if (v && !/^05\d{0,8}$/.test(v)) {
      setPhoneError(isAr ? 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Must start with 05 and be 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const canSubmit =
    name.trim().length >= 2 &&
    message.trim().length >= 5 &&
    (phone.length === 0 || /^05\d{8}$/.test(phone)) &&
    (phone.length > 0 || email.trim().length > 0)

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone || undefined,
          email: email.trim() || undefined,
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else setError(data.error || (isAr ? 'حدث خطأ' : 'An error occurred'))
    } catch {
      setError(isAr ? 'حدث خطأ في الاتصال' : 'Connection error')
    } finally {
      setSubmitting(false)
    }
  }

  const hoursRows = [
    {
      day: isAr ? nahda.hours.dailyAr : nahda.hours.dailyEn,
      time: isAr ? nahda.hours.dailyTime : '10 AM – 6 AM',
    },
    {
      day: isAr ? nahda.hours.fridayAr : nahda.hours.fridayEn,
      time: isAr ? nahda.hours.fridayTime : '4 PM – 6 AM',
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      <div className="glow-orb w-[500px] h-[500px] -top-[200px] start-1/4"
        style={{ background: 'rgba(201,169,110,0.05)' }} />
      <div className="glow-orb w-[360px] h-[360px] bottom-[8%] end-0"
        style={{ background: 'rgba(201,169,110,0.04)', animationDelay: '3s' }} />

      {/* Header */}
      <div className="relative z-10 pt-10 sm:pt-16 pb-8 text-center px-4">
        <Link href="/" className="inline-block mb-10 group">
          <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
        </Link>
        <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#C9A96E] mb-4">
          {isAr ? 'أويلو سبا · فرع النهضة' : 'Oilo Spa · Al Nahda'}
        </p>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {isAr ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <p className={`text-sm max-w-md mx-auto ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
          {isAr
            ? 'حجز، استفسار، أو مناسبة خاصة — راسلنا أو كلّمنا مباشرة على واتساب.'
            : 'Bookings, questions, or a special occasion — message us or reach us directly on WhatsApp.'}
        </p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 pb-28">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 items-start">

          {/* ─── Message form ─── */}
          <section className="glass-card rounded-3xl p-6 sm:p-8 !transform-none !shadow-none"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {done ? (
              <div className="text-center py-12 animate-[fadeInUp_0.6s_ease-out]">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path d="M8 18L15 25L28 11" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h2 className={`text-2xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
                  {isAr ? 'تم استلام رسالتك' : 'Message Received'}
                </h2>
                <p className={`text-sm mb-8 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.6)' }}>
                  {isAr ? 'سنرد عليك في أقرب وقت. للاستعجال كلّمنا على واتساب.' : 'We\'ll reply shortly. For anything urgent, message us on WhatsApp.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={waHref} target="_blank" rel="noopener noreferrer"
                    className="btn-primary inline-block px-8 py-3.5 text-sm tracking-wider">
                    {isAr ? 'فتح واتساب' : 'Open WhatsApp'}
                  </a>
                  <Link href="/" className="inline-block px-8 py-3.5 text-sm tracking-wider rounded-2xl border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/[0.08] transition-colors">
                    {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className={`text-lg font-bold mb-6 ${isAr ? 'font-ar' : 'font-display'}`} style={{ color: '#F5EFE4' }}>
                  {isAr ? 'اترك لنا رسالة' : 'Send us a message'}
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm mb-2.5 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
                      {isAr ? 'الاسم' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'اسمك الكامل' : 'Your full name'}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                      style={{ direction: isAr ? 'rtl' : 'ltr' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2.5 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
                        {isAr ? 'الجوال' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="05XXXXXXXX"
                        dir="ltr"
                        className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none transition-all ${phoneError ? 'border-red-500/30' : 'border-white/[0.06] focus:border-[#C9A96E]/40'}`}
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      />
                      {phoneError && <p className="text-red-400/80 text-xs mt-2">{phoneError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-2.5 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
                        {isAr ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        dir="ltr"
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2.5 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
                      {isAr ? 'الموضوع' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={isAr ? 'موضوع رسالتك (اختياري)' : 'Subject (optional)'}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                      style={{ direction: isAr ? 'rtl' : 'ltr' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2.5 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
                      {isAr ? 'رسالتك' : 'Your Message'}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                      rows={5}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all resize-none"
                      style={{ direction: isAr ? 'rtl' : 'ltr' }}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
                      <p className="text-red-400/90 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                    className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all ${canSubmit && !submitting ? 'btn-primary' : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'}`}
                  >
                    {submitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Message')}
                  </button>
                </div>
              </>
            )}
          </section>

          {/* ─── Location & direct contact ─── */}
          <aside className="space-y-6">
            {/* WhatsApp — primary channel */}
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)' }}>
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A96E, #dbb97a)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#060608">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.86 9.86 0 004.76 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7C17.17 3.03 14.68 2 12.04 2zm0 18.02h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-white font-semibold text-sm">{isAr ? 'واتساب النهضة' : 'WhatsApp Al Nahda'}</span>
                <span className="block text-[#C9A96E] text-sm font-bold" dir="ltr" style={{ fontFamily: '"DM Sans", sans-serif' }}>0556733851</span>
              </span>
              <svg className={`w-5 h-5 text-[#C9A96E] transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Location card: map + address + hours */}
            <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {mapEmbed && (
                <div className="relative h-52 w-full">
                  <iframe
                    src={mapEmbed}
                    title={isAr ? 'موقع أويلو سبا فرع النهضة' : 'Oilo Spa Al Nahda location'}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0, filter: 'brightness(0.9) contrast(1.05)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-10" style={{ background: 'linear-gradient(to bottom, rgba(6,6,8,0.85), transparent)' }} />
                </div>
              )}
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A96E] mb-1">{isAr ? 'العنوان' : 'Address'}</p>
                    <p className={`text-sm leading-relaxed ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.7)' }}>
                      {isAr ? nahda.addressAr : nahda.addressEn}
                    </p>
                    <a href={nahda.mapsLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#C9A96E] hover:opacity-80 transition-opacity">
                      {isAr ? 'الاتجاهات على الخرائط' : 'Get directions'}
                      <svg className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </a>
                  </div>
                </div>

                <div className="h-px" style={{ background: 'rgba(245,239,228,0.06)' }} />

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A96E] mb-2">{isAr ? 'ساعات العمل' : 'Hours'}</p>
                    <div className="space-y-1.5">
                      {hoursRows.map((r) => (
                        <div key={r.day} className="flex items-center justify-between gap-4 text-sm">
                          <span className={isAr ? 'font-ar' : 'font-body'} style={{ color: 'rgba(245,239,228,0.7)' }}>{r.day}</span>
                          <span dir="ltr" style={{ color: 'rgba(245,239,228,0.55)', fontFamily: isAr ? undefined : '"DM Sans", sans-serif' }}>{r.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call + email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={`tel:${nahda.phone}`} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors hover:bg-white/[0.04]"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,239,228,0.75)' }} dir="ltr">
                <svg className="w-4 h-4 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                0556733851
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors hover:bg-white/[0.04]"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,239,228,0.75)' }}>
                <svg className="w-4 h-4 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="truncate" style={{ fontFamily: '"DM Sans", sans-serif' }}>{isAr ? 'راسلنا بالبريد' : 'Email us'}</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
