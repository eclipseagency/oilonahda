'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import Monogram from './Monogram'

export default function GiftMembership() {
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
    el.querySelectorAll('.reveal, .reveal-scale').forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Visual gift card mockup */}
          <div className="relative reveal reveal-scale">
            {/* Card tilt perspective */}
            <div className="relative mx-auto aspect-[1.6/1] max-w-md rounded-3xl overflow-hidden transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1"
              style={{
                background: 'linear-gradient(135deg, #1a1611 0%, #0f0c08 50%, #1a1611 100%)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
                transform: 'perspective(1200px) rotateY(-4deg) rotateX(2deg)',
              }}>
              {/* Textured gold foil overlay */}
              <div className="absolute inset-0 opacity-40"
                style={{
                  background: `
                    radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.3), transparent 50%),
                    radial-gradient(ellipse at 20% 80%, rgba(168,136,63,0.2), transparent 50%)
                  `,
                }} />

              {/* Inner border */}
              <div className="absolute inset-3 rounded-2xl pointer-events-none"
                style={{ border: '1px solid rgba(201,169,110,0.2)' }} />

              {/* Content */}
              <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
                {/* Top row — logo and label */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Monogram size={36} strokeWidth={0.9} />
                    <div>
                      <p className="text-[9px] font-semibold tracking-[0.3em] uppercase" style={{ color: 'rgba(201,169,110,0.7)' }}>
                        {isAr ? 'بطاقة هدية' : 'Gift Card'}
                      </p>
                      <p className="text-lg font-bold font-display tracking-wide" style={{ color: '#F5EFE4' }}>
                        Oilo<span style={{ color: '#C9A96E' }}>.</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(245,239,228,0.3)' }}>
                      {isAr ? 'صالحة لمدة' : 'Valid for'}
                    </p>
                    <p className={`text-[11px] font-semibold ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.6)' }}>
                      {isAr ? '٣ أشهر' : '3 months'}
                    </p>
                  </div>
                </div>

                {/* Amount — embossed feel */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(201,169,110,0.5)' }}>
                    {isAr ? 'القيمة' : 'Amount'}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold font-display" dir="ltr"
                    style={{
                      background: 'linear-gradient(135deg, #F5EFE4 0%, #C9A96E 50%, #F5EFE4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    500 <span className="text-lg opacity-70 font-normal">SAR</span>
                  </p>
                </div>

                {/* Bottom row — serial code aesthetic */}
                <div className="flex items-end justify-between">
                  <p className="text-[10px] font-mono tracking-[0.2em]" style={{ color: 'rgba(245,239,228,0.25)' }} dir="ltr">
                    •••• •••• •••• 0042
                  </p>
                  <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(201,169,110,0.5)' }}>
                    oilospa.com
                  </p>
                </div>
              </div>
            </div>

            {/* Floating accent dots */}
            <div className="absolute -top-4 -end-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.25), transparent 70%)', filter: 'blur(30px)' }} />
            <div className="absolute -bottom-6 -start-6 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.18), transparent 70%)', filter: 'blur(40px)' }} />
          </div>

          {/* Copy side */}
          <div className="reveal">
            <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
              {t('gift.title')}
            </p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 heading-warm ${isAr ? 'font-ar' : 'font-display'}`}>
              {t('gift.subtitle')}
            </h2>
            <p className={`text-base md:text-lg leading-[2] mb-10 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.7)' }}>
              {isAr
                ? 'فاجئ من تحب بتجربة لا تُنسى. بطاقات هدايا بقيم مختلفة تُستبدل بأي خدمة أو باقة في أويلو.'
                : 'Surprise someone you care about with an unforgettable experience. Gift cards at different values, redeemable for any service or package at Oilo.'}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/gift" className="btn-primary px-10 py-4 text-sm tracking-[0.12em] uppercase inline-flex items-center gap-2">
                {t('gift.cta')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={isAr ? 'rotate-180' : ''}>
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/membership"
                className={`group inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase transition-colors duration-300 hover:text-[#C9A96E] ${isAr ? 'font-ar' : 'font-body'}`}
                style={{ color: 'rgba(245,239,228,0.6)' }}>
                <span className="border-b border-[#C9A96E]/0 group-hover:border-[#C9A96E]/60 pb-0.5 transition-colors">
                  {t('member.cta')}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={isAr ? 'rotate-180' : ''}>
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Membership strip — secondary */}
        <div className="mt-14 md:mt-20 pt-10 md:pt-16 reveal"
          style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-3 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                {t('member.title')}
              </p>
              <p className={`text-xl md:text-2xl font-bold heading-warm ${isAr ? 'font-ar' : 'font-display'}`}>
                {t('member.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-sm"
                style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>5</div>
              <div>
                <p className={`text-sm font-semibold text-warm ${isAr ? 'font-ar' : 'font-body'}`}>{t('member.bundle5')}</p>
                <p className={`text-xs mt-0.5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>{t('member.bundle5.save')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-sm"
                style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>10</div>
              <div>
                <p className={`text-sm font-semibold text-warm ${isAr ? 'font-ar' : 'font-body'}`}>{t('member.bundle10')}</p>
                <p className={`text-xs mt-0.5 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>{t('member.bundle10.save')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
