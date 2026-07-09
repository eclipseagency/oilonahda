'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

const amounts = [250, 500, 750, 1000, 1500, 2000]

export default function GiftPage() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const [amount, setAmount] = useState<number>(500)
  const [sender, setSender] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [recipient, setRecipient] = useState('')
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
    sender.trim().length >= 2 &&
    /^05\d{8}$/.test(phone) &&
    amount > 0 &&
    recipient.trim().length >= 2

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gift',
          name: sender.trim(),
          phone,
          recipient: recipient.trim(),
          amount,
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
    <>
    <SiteNav />
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      <div className="glow-orb w-[500px] h-[500px] -top-[200px] start-1/4"
        style={{ background: 'rgba(201,169,110,0.05)' }} />
      <div className="glow-orb w-[300px] h-[300px] bottom-[20%] end-0"
        style={{ background: 'rgba(201,169,110,0.04)', animationDelay: '4s' }} />

      <div className="relative z-10 pt-28 sm:pt-32 pb-8 text-center px-4">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {t('gift.form.title')}
        </h1>
        <p className={`text-sm max-w-md mx-auto ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
          {t('gift.form.subtitle')}
        </p>
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-5 pb-28">
        {done ? (
          <div className="text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-[#C9A96E]/20" />
              <div className="absolute inset-0 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M8 18L15 25L28 11" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
              {t('gift.success')}
            </h2>
            <Link href="/" className="btn-primary inline-block px-10 py-4 mt-8 text-sm tracking-wider uppercase">
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Amount */}
            <div>
              <label className="block text-sm mb-4 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('gift.amount')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map(a => (
                  <button key={a} onClick={() => setAmount(a)}
                    className="py-4 rounded-2xl text-sm font-bold tracking-wider transition-all duration-300"
                    style={{
                      background: amount === a ? 'linear-gradient(135deg, #C9A96E, #dbb97a)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${amount === a ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.05)'}`,
                      color: amount === a ? '#060608' : 'rgba(255,255,255,0.7)',
                    }}>
                    <span dir="ltr">{a} <span className="text-xs font-normal opacity-70">{t('services.sar')}</span></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('gift.recipient')}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={t('gift.recipient.placeholder')}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              />
            </div>

            {/* Sender */}
            <div>
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('gift.sender')}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={t('gift.sender.placeholder')}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('booking.phone')}
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

            {/* Message */}
            <div>
              <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('gift.message')}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('gift.message.placeholder')}
                rows={3}
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
              {submitting ? t('booking.submitting') : t('gift.submit')}
            </button>
          </div>
        )}
      </div>
    </main>
    <SiteFooter />
    </>
  )
}
