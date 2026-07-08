'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function MoreOffers() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }) },
      { threshold: 0.1 }
    )
    el.querySelectorAll('.reveal').forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const cards = [
    {
      badge: t('offers.morning'),
      title: t('offers.morning.title'),
      text: t('offers.morning.text'),
    },
    {
      badge: t('offers.birthday'),
      title: t('offers.birthday.title'),
      text: t('offers.birthday.text'),
    },
  ]

  return (
    <section ref={sectionRef} className="relative pb-16 sm:pb-24 md:pb-36 bg-section-a overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
          {cards.map((c, i) => (
            <div key={i} className="relative glass-card p-7 md:p-8 reveal overflow-hidden"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%)' }} />
              <span className="badge mb-5 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                {c.badge}
              </span>
              <h3 className={`text-xl md:text-2xl font-bold text-white mb-3 relative z-10 ${isAr ? 'font-ar' : 'font-display'}`}>
                {c.title}
              </h3>
              <p className={`text-sm leading-[1.9] mb-6 relative z-10 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>
                {c.text}
              </p>
              <Link href="/booking"
                className="btn-ghost inline-flex items-center gap-2 text-[11px] tracking-wider uppercase px-5 py-2.5 relative z-10">
                {isAr ? 'احجز الآن' : 'Book Now'}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={isAr ? 'rotate-180' : ''}>
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
