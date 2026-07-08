'use client'

import { useI18n } from '@/lib/i18n'

export default function About() {
  const { locale, t } = useI18n()

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#111111' }}>
      {/* Subtle olive accent */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,74,63,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Accent line */}
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: '#C9A96E' }} />

          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${locale === 'ar' ? 'font-ar' : 'font-heading'}`} style={{ color: '#C9A96E' }}>
            {t('about.title')}
          </h2>

          <p className={`text-sm md:text-base mb-10 tracking-wide ${locale === 'ar' ? 'font-heading italic' : 'font-ar'}`} style={{ color: '#888' }}>
            {t('about.subtitle')}
          </p>

          <p className={`text-base md:text-lg leading-[1.9] ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#bbb' }}>
            {t('about.text')}
          </p>

          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="w-8 h-px" style={{ background: '#333' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(201,169,110,0.4)' }} />
            <div className="w-8 h-px" style={{ background: '#333' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
