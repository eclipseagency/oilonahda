'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { membershipTiers, type MembershipKey } from '@/lib/memberships'
import { services, categories, type ServiceCategory } from '@/lib/services'

const fmt = (n: number) => n.toLocaleString('en-US')

export default function MembershipPage() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'

  const [bundle, setBundle] = useState<MembershipKey>('10')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const formRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }) },
      { threshold: 0.08 }
    )
    root.querySelectorAll('.reveal, .reveal-scale').forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const validatePhone = (v: string) => {
    setPhone(v)
    if (v && !/^05\d{0,8}$/.test(v)) {
      setPhoneError(isAr ? 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Must start with 05 and be 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const canSubmit = name.trim().length >= 2 && /^05\d{8}$/.test(phone)

  const selectTier = (key: MembershipKey) => {
    setBundle(key)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'membership', name: name.trim(), phone, bundle }),
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

  // Real services to showcase as "covered by your membership"
  const coveredCats: ServiceCategory[] = ['massage', 'bath', 'grooming']

  return (
    <main ref={pageRef} className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      <div className="glow-orb w-[560px] h-[560px] -top-[220px] start-1/4" style={{ background: 'rgba(201,169,110,0.05)' }} />

      {/* ── Hero ── */}
      <section className="relative z-10 pt-10 sm:pt-16 pb-6 text-center px-5">
        <Link href="/" className="inline-block mb-10 group">
          <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
        </Link>
        <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
          {isAr ? 'عضويات أويلو' : 'Oilo Memberships'}
        </p>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-[1.3] ${isAr ? 'font-ar' : 'font-display'}`}>
          <span className="text-gold-gradient">{isAr ? 'اجعل العناية جزءًا من روتينك' : 'Make self-care part of your routine'}</span>
        </h1>
        <p className={`text-base md:text-lg max-w-xl mx-auto leading-[2] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>
          {isAr
            ? 'باقات عضوية مرنة تمنحك جلساتك المفضلة بسعر أقل، مع مزايا حصرية وأولوية في الحجز طوال فترة العضوية.'
            : 'Flexible membership bundles that give you your favorite sessions for less, with exclusive perks and priority booking throughout your membership.'}
        </p>
      </section>

      {/* ── Benefits row ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 mt-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { ar: 'وفّر حتى ٢٠٪', en: 'Save up to 20%', subAr: 'على كل جلساتك وخدماتك', subEn: 'on every session and service',
              icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6' },
            { ar: 'أولوية في الحجز', en: 'Priority booking', subAr: 'مواعيد مرنة تناسب وقتك', subEn: 'flexible times that fit you',
              icon: 'M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z' },
            { ar: 'مزايا حصرية', en: 'Exclusive perks', subAr: 'جاكوزي وبطاقات هدايا ومفاجآت', subEn: 'jacuzzi, gift cards & surprises',
              icon: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z' },
          ].map((b, i) => (
            <div key={i} className="reveal text-center p-6 rounded-3xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-11 h-11 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={b.icon} />
                </svg>
              </div>
              <p className={`text-base font-bold text-warm mb-1 ${isAr ? 'font-ar' : 'font-display'}`}>{isAr ? b.ar : b.en}</p>
              <p className={`text-xs ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.4)' }}>{isAr ? b.subAr : b.subEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5">
        <h2 className={`text-center text-2xl sm:text-3xl font-bold heading-warm mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {isAr ? 'اختر عضويتك' : 'Choose your membership'}
        </h2>
        <p className={`text-center text-sm mb-12 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.4)' }}>
          {isAr ? 'كل عضوية تُستبدل بأي مساج أو حمام مغربي، مع خصم على باقي الخدمات' : 'Every membership is redeemable for any massage or Moroccan bath, with a discount on all other services'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {membershipTiers.map(tier => {
            const active = bundle === tier.key
            const perks = isAr ? tier.perksAr : tier.perksEn
            return (
              <div key={tier.key}
                className="reveal reveal-scale relative flex flex-col rounded-3xl p-7 sm:p-8 transition-all duration-300"
                style={{
                  background: tier.popular ? 'rgba(201,169,110,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${active ? 'rgba(201,169,110,0.5)' : tier.popular ? 'rgba(201,169,110,0.28)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: tier.popular ? '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.08)' : 'none',
                }}>
                {tier.popular && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase whitespace-nowrap"
                    style={{ background: '#C9A96E', color: '#060608' }}>
                    {isAr ? 'الأكثر اختيارًا' : 'Most popular'}
                  </span>
                )}

                <h3 className={`text-xl font-bold text-warm mb-2 ${isAr ? 'font-ar' : 'font-display'}`}>{isAr ? tier.nameAr : tier.nameEn}</h3>
                <p className={`text-xs leading-[1.8] mb-6 min-h-[2.5rem] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isAr ? tier.taglineAr : tier.taglineEn}
                </p>

                {/* Price */}
                <div className="mb-1 flex items-end gap-2" dir="ltr">
                  <span className="text-4xl font-bold font-display text-gold-gradient">{fmt(tier.price)}</span>
                  <span className="text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>SAR</span>
                </div>
                <div className={`flex items-center gap-2 mb-6 ${isAr ? 'font-ar' : 'font-body'}`}>
                  <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.28)' }} dir="ltr">{fmt(tier.originalPrice)} SAR</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.12)' }}>
                    {isAr ? `وفّر ${tier.discount}٪` : `Save ${tier.discount}%`}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {perks.map((p, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm leading-[1.7] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <svg className="mt-1 shrink-0" width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <p className={`text-[11px] mb-5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {isAr ? tier.validAr : tier.validEn}
                </p>

                <button onClick={() => selectTier(tier.key)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wider transition-all ${tier.popular ? 'btn-primary' : ''}`}
                  style={tier.popular ? undefined : { background: 'rgba(201,169,110,0.1)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.25)' }}>
                  {isAr ? 'اشترك الآن' : 'Subscribe now'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Services covered ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 mt-24">
        <h2 className={`text-center text-2xl sm:text-3xl font-bold heading-warm mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {isAr ? 'خدمات تستمتع بها مع عضويتك' : 'Services you enjoy with your membership'}
        </h2>
        <p className={`text-center text-sm mb-12 max-w-lg mx-auto ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.4)' }}>
          {isAr
            ? 'أعضاء أويلو يحصلون على خصم ١٠٪ إلى ٢٠٪ على كل هذه الخدمات والباقات حسب مستوى العضوية'
            : 'Oilo members get 10% to 20% off all these services and packages, depending on the membership tier'}
        </p>

        <div className="space-y-10">
          {coveredCats.map(catKey => {
            const cat = categories.find(c => c.key === catKey)!
            const items = services.filter(s => s.category === catKey)
            return (
              <div key={catKey} className="reveal">
                <h3 className={`text-sm font-semibold tracking-[0.16em] uppercase mb-5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                  {isAr ? cat.nameAr : cat.nameEn}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map(s => (
                    <div key={s.key} className="flex items-center justify-between gap-4 p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold text-warm truncate ${isAr ? 'font-ar' : 'font-body'}`}>{isAr ? s.nameAr : s.nameEn}</p>
                        {(isAr ? s.duration : s.durationEn) && (
                          <p className={`text-[11px] mt-0.5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>{isAr ? s.duration : s.durationEn}</p>
                        )}
                      </div>
                      {s.price != null && (
                        <span className="text-sm font-bold shrink-0" style={{ color: '#C9A96E' }} dir="ltr">{fmt(s.price)} <span className="text-[11px] font-normal opacity-60">SAR</span></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Lead form ── */}
      <section ref={formRef} className="relative z-10 max-w-xl mx-auto px-5 mt-24 pb-28 scroll-mt-8">
        <div className="rounded-3xl p-7 sm:p-10" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,169,110,0.15)' }}>
          {done ? (
            <div className="text-center py-8 animate-[fadeInUp_0.6s_ease-out]">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M8 18L15 25L28 11" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h2 className={`text-2xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>{t('member.form.success')}</h2>
              <Link href="/" className="btn-primary inline-block px-10 py-4 mt-6 text-sm tracking-wider uppercase">
                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          ) : (
            <>
              <h2 className={`text-2xl font-bold text-gold-gradient mb-2 text-center ${isAr ? 'font-ar' : 'font-display'}`}>
                {isAr ? 'سجّل اهتمامك بالعضوية' : 'Register your membership interest'}
              </h2>
              <p className={`text-sm text-center mb-8 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.4)' }}>
                {isAr ? 'اترك بياناتك وسنتواصل معك لإتمام الاشتراك' : 'Leave your details and we\'ll contact you to complete the subscription'}
              </p>

              <div className="space-y-6">
                {/* Tier selector */}
                <div>
                  <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {isAr ? 'العضوية المختارة' : 'Selected membership'}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {membershipTiers.map(tier => {
                      const active = bundle === tier.key
                      return (
                        <button key={tier.key} onClick={() => setBundle(tier.key)} type="button"
                          className="text-center p-3 rounded-2xl transition-all"
                          style={{
                            background: active ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.02)',
                            border: `1.5px solid ${active ? 'rgba(201,169,110,0.45)' : 'rgba(255,255,255,0.06)'}`,
                          }}>
                          <p className={`text-xs font-bold ${active ? 'text-warm' : ''} ${isAr ? 'font-ar' : 'font-display'}`} style={active ? undefined : { color: 'rgba(255,255,255,0.6)' }}>
                            {isAr ? tier.nameAr : tier.nameEn}
                          </p>
                          <p className="text-[11px] mt-1" dir="ltr" style={{ color: active ? '#C9A96E' : 'rgba(255,255,255,0.35)' }}>{fmt(tier.price)} SAR</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('member.form.name')}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('booking.name.placeholder')}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none transition-all"
                    style={{ direction: isAr ? 'rtl' : 'ltr' }} />
                </div>

                <div>
                  <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('member.form.phone')}</label>
                  <input type="tel" value={phone} onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="05XXXXXXXX" dir="ltr"
                    className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none transition-all ${phoneError ? 'border-red-500/30' : 'border-white/[0.06] focus:border-[#C9A96E]/40'}`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }} />
                  {phoneError && <p className="text-red-400/80 text-xs mt-2">{phoneError}</p>}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
                    <p className="text-red-400/90 text-sm text-center">{error}</p>
                  </div>
                )}

                <button onClick={submit} disabled={!canSubmit || submitting}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all ${canSubmit && !submitting ? 'btn-primary' : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'}`}>
                  {submitting ? t('booking.submitting') : t('member.form.submit')}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
