'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'

const icons = [
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5V19a2 2 0 002 2h14a2 2 0 002-2v-8.5M3 10.5L12 4l9 6.5M3 10.5h18" />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 5V3m8 2V3M4 11h16" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.5 8.5l2.1 2.1M5.6 18.4l2.1-2.1m8.5-8.5l2.1-2.1" />
    <circle cx="12" cy="12" r="4" />
  </svg>,
  <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a3 3 0 010 6h-1M4 8h14v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8zM8 2v3M12 2v3M16 2v3" />
  </svg>,
]

export default function WhatToExpect() {
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

  const steps = [
    { title: t('expect.step1.title'), text: t('expect.step1.text') },
    { title: t('expect.step2.title'), text: t('expect.step2.text') },
    { title: t('expect.step3.title'), text: t('expect.step3.text') },
    { title: t('expect.step4.title'), text: t('expect.step4.text') },
  ]

  return (
    <section id="what-to-expect" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-a overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] -bottom-[200px] start-1/3"
        style={{ background: 'rgba(201,169,110,0.05)' }} />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gold-gradient reveal ${isAr ? 'font-ar' : 'font-display'}`}>
            {t('expect.title')}
          </h2>
          <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.3)' }}>
            {t('expect.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {steps.map((step, i) => (
            <div key={i} className="relative glass-card p-7 md:p-8 reveal"
              style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Step number */}
              <div className="absolute top-6 end-6 text-5xl md:text-6xl font-bold opacity-[0.08] font-display"
                style={{ color: '#C9A96E' }}>
                0{i + 1}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)', color: '#C9A96E' }}>
                {icons[i]}
              </div>

              <h3 className={`text-base md:text-lg font-bold text-white mb-3 ${isAr ? 'font-ar' : 'font-display text-xl'}`}>
                {step.title}
              </h3>
              <p className={`text-sm leading-[1.9] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
