'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function Hero() {
  const { locale, t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.7) 70%, rgba(13,13,13,1) 100%)' }} />

      {/* Olive tint */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,74,63,0.2) 0%, transparent 70%)' }} />

      {/* Content */}
      <div className={`relative z-10 text-center px-6 max-w-[900px] mx-auto transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo text */}
        <h2 className="font-heading text-[#C9A96E] text-base md:text-lg tracking-[0.5em] uppercase mb-8 font-medium">
          OILO SPA
        </h2>

        {/* Main tagline */}
        <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white ${locale === 'ar' ? 'font-ar' : 'font-heading'}`}>
          {t('hero.tagline')}
        </h1>

        {/* Subtitle in opposite language */}
        <p className={`text-base md:text-xl mb-12 ${locale === 'ar' ? 'font-heading italic text-neutral-400' : 'font-ar text-neutral-400'}`}>
          {t('hero.subtitle')}
        </p>

        {/* CTA */}
        <Link
          href="/booking"
          className="inline-block px-12 py-4 text-sm md:text-base font-semibold tracking-[0.05em] rounded-sm transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: '#C9A96E', color: '#1A1A1A' }}
        >
          {t('hero.cta')}
        </Link>

        {/* Scroll indicator */}
        <div className={`mt-16 flex flex-col items-center transition-all duration-1000 delay-700 ${visible ? 'opacity-50' : 'opacity-0'}`}>
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.4))' }} />
        </div>
      </div>
    </section>
  )
}
