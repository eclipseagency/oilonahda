'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'

export default function ContactSection({ whatsapp = '966556733851' }: { whatsapp?: string }) {
  const { locale } = useI18n()
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent('السلام عليكم، تواصلت من موقع أويلو سبا، أود الاستفسار عن الخدمات والحجز.')}`
  const isAr = locale === 'ar'
  const sectionRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }) },
      { threshold: 0.1 }
    )
    el.querySelectorAll('.reveal, .reveal-scale').forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const validatePhone = (v: string) => {
    setPhone(v)
    if (v && !/^05\d{0,8}$/.test(v)) {
      setPhoneError(isAr ? 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Must start with 05, 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const canSubmit = name.trim().length >= 2 && /^05\d{8}$/.test(phone) && message.trim().length >= 5

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone, message: message.trim() }),
      })
      const data = await res.json()
      if (data.success) { setDone(true); setName(''); setPhone(''); setMessage('') }
      else setError(data.error || (isAr ? 'حدث خطأ' : 'An error occurred'))
    } catch {
      setError(isAr ? 'حدث خطأ في الاتصال' : 'Connection error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 bg-section-b overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] top-1/2 start-1/4 -translate-y-1/2"
        style={{ background: 'rgba(201,169,110,0.05)' }} />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-14">
          <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-4 reveal ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
            {isAr ? 'تواصل معنا' : 'Get in Touch'}
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 heading-warm reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-display'}`}>
            {isAr ? 'اكتب لنا، نرد بسرعة' : 'Write to us, we respond fast'}
          </h2>
          <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-2 max-w-xl mx-auto ${isAr ? 'font-ar' : 'font-body'}`}
            style={{ color: 'rgba(245,239,228,0.55)' }}>
            {isAr
              ? 'سؤال، حجز مجموعة، أو أي استفسار — راسلنا هنا أو عبر الواتساب'
              : 'Question, group booking, or any inquiry — message us here or on WhatsApp'}
          </p>
        </div>

        <div className="reveal reveal-scale relative rounded-3xl overflow-hidden gradient-border"
          style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.04), rgba(6,6,8,0.6))' }}>
          <div className="relative z-10 p-6 sm:p-10">
            {done ? (
              <div className="text-center py-8 animate-[fadeInUp_0.6s_ease-out]">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                    <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
                      <path d="M8 18L15 25L28 11" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h3 className={`text-xl font-bold text-gold-gradient mb-2 ${isAr ? 'font-ar' : 'font-display'}`}>
                  {isAr ? 'تم استلام رسالتك' : 'Message Received'}
                </h3>
                <p className={`text-sm ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
                  {isAr ? 'سنتواصل معك قريبًا' : "We'll be in touch soon"}
                </p>
                <button onClick={() => setDone(false)}
                  className={`mt-6 inline-flex items-center gap-1.5 text-xs tracking-wider uppercase hover:text-[#C9A96E] transition-colors ${isAr ? 'font-ar' : 'font-body'}`}
                  style={{ color: 'rgba(245,239,228,0.5)' }}>
                  {isAr ? 'إرسال رسالة أخرى' : 'Send another'} →
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider mb-2 ${isAr ? 'font-ar' : 'font-body'}`}
                      style={{ color: 'rgba(245,239,228,0.4)' }}>
                      {isAr ? 'الاسم' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'اسمك' : 'Your name'}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all text-sm"
                      style={{ direction: isAr ? 'rtl' : 'ltr' }}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider mb-2 ${isAr ? 'font-ar' : 'font-body'}`}
                      style={{ color: 'rgba(245,239,228,0.4)' }}>
                      {isAr ? 'الجوال' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="05XXXXXXXX"
                      dir="ltr"
                      className={`w-full bg-white/[0.02] border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none transition-all text-sm ${phoneError ? 'border-red-500/30' : 'border-white/[0.06] focus:border-[#C9A96E]/40'}`}
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    />
                    {phoneError && <p className="text-red-400/80 text-xs mt-1">{phoneError}</p>}
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-2 ${isAr ? 'font-ar' : 'font-body'}`}
                    style={{ color: 'rgba(245,239,228,0.4)' }}>
                    {isAr ? 'رسالتك' : 'Message'}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'}
                    rows={4}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all resize-none text-sm"
                    style={{ direction: isAr ? 'rtl' : 'ltr' }}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
                    <p className="text-red-400/90 text-xs text-center">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-xs tracking-[0.12em] uppercase transition-all ${canSubmit && !submitting ? 'btn-primary' : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'}`}
                  >
                    {submitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Message')}
                  </button>
                  <a href={waHref} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs tracking-[0.1em] uppercase transition-all hover:bg-emerald-500/15 ${isAr ? 'font-ar' : 'font-body'}`}
                    style={{ border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                    <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor">
                      <path d="M16.004 2.003c-7.732 0-14.001 6.268-14.001 14 0 2.468.655 4.876 1.898 6.989L2 30l7.188-1.884A13.94 13.94 0 0016.004 30c7.732 0 14-6.268 14-13.997 0-7.732-6.268-14-14-14z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
