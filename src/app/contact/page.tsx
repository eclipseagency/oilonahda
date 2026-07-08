'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

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

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      <div className="glow-orb w-[500px] h-[500px] -top-[200px] start-1/4"
        style={{ background: 'rgba(201,169,110,0.05)' }} />

      <div className="relative z-10 pt-10 sm:pt-16 pb-8 text-center px-4">
        <Link href="/" className="inline-block mb-10 group">
          <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
        </Link>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {isAr ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <p className={`text-sm max-w-md mx-auto ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
          {isAr ? 'نسعد بخدمتك — اتركنا رسالة وسنرد عليك قريبًا' : 'We\'d love to hear from you — leave a message and we\'ll respond shortly'}
        </p>
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-5 pb-28">
        {done ? (
          <div className="text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
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
              {isAr ? 'سنتواصل معك قريبًا' : 'We\'ll be in touch soon'}
            </p>
            <Link href="/" className="btn-primary inline-block px-10 py-4 text-sm tracking-wider uppercase">
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
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
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
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
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
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
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
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
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(245,239,228,0.5)' }}>
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

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6" style={{ borderTop: '1px solid rgba(245,239,228,0.05)' }}>
              <a href="tel:0556733851" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#C9A96E]" style={{ color: 'rgba(245,239,228,0.6)' }} dir="ltr">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                0556733851
              </a>
              <a href="mailto:info@oilo.sa" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#C9A96E]" style={{ color: 'rgba(245,239,228,0.6)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@oilo.sa
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
