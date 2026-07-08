'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { getServiceByKey } from '@/lib/services'

export default function Offers() {
  const { locale, t } = useI18n()
  const offer = getServiceByKey('massage-bath-offer')
  if (!offer) return null

  return (
    <section id="offers" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#0D0D0D' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: '#C9A96E' }} />
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 ${locale === 'ar' ? 'font-ar' : 'font-heading'}`} style={{ color: '#C9A96E' }}>
            {t('offers.title')}
          </h2>
          <p className={`text-sm tracking-wide ${locale === 'ar' ? 'font-heading italic' : 'font-ar'}`} style={{ color: '#666' }}>
            {t('offers.subtitle')}
          </p>
        </div>

        {/* Featured card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-sm p-10 md:p-14 text-center overflow-hidden" style={{ background: 'linear-gradient(145deg, #1f1f1f, #181818)', border: '1px solid rgba(201,169,110,0.3)' }}>
            {/* Gold glow */}
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,169,110,0.15) 0%, transparent 60%)' }} />
            {/* Top gold line */}
            <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, #C9A96E, transparent)' }} />
            {/* Bottom gold line */}
            <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)' }} />

            <div className="relative z-10">
              <div className="inline-block mb-6 px-4 py-1.5 rounded-sm" style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.05)' }}>
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#C9A96E' }}>
                  {locale === 'ar' ? 'عرض خاص' : 'Special Offer'}
                </span>
              </div>

              <h3 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${locale === 'ar' ? 'font-ar' : 'font-heading'}`}>
                {locale === 'ar' ? offer.nameAr : offer.nameEn}
              </h3>
              <p className={`text-sm mb-6 ${locale === 'ar' ? 'font-body' : 'font-ar'}`} style={{ color: '#666' }}>
                {locale === 'ar' ? offer.nameEn : offer.nameAr}
              </p>

              <p className={`text-base leading-[1.8] mb-10 max-w-lg mx-auto ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#999' }}>
                {locale === 'ar' ? offer.descriptionAr : offer.descriptionEn}
              </p>

              <Link
                href="/booking?service=massage-bath-offer"
                className="inline-block font-semibold text-sm tracking-[0.05em] px-12 py-4 rounded-sm transition-all duration-300 hover:-translate-y-px"
                style={{ background: '#C9A96E', color: '#1A1A1A' }}
              >
                {t('offers.book')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
