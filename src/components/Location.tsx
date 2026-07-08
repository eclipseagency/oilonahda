'use client'

import { useI18n } from '@/lib/i18n'

const MAPS_LINK = 'https://www.google.com/maps/search/6664+Prince+Saud+bin+Muhammad+bin+Muqrin+Road+Al+Rabie+Riyadh'
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5!2d46.6536!3d24.7906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ3JzI2LjIiTiA0NsKwMzknMTMuMCJF!5e0!3m2!1sen!2ssa!4v1700000000000'

export default function Location() {
  const { locale, t } = useI18n()

  return (
    <section id="location" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#111111' }}>
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: '#C9A96E' }} />
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 ${locale === 'ar' ? 'font-ar' : 'font-heading'}`} style={{ color: '#C9A96E' }}>
            {t('location.title')}
          </h2>
          <p className={`text-sm tracking-wide ${locale === 'ar' ? 'font-heading italic' : 'font-ar'}`} style={{ color: '#666' }}>
            {t('location.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Map */}
          <div className="relative rounded-sm overflow-hidden aspect-[4/3]" style={{ border: '1px solid #333' }}>
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Oilo Spa Location"
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'grayscale(1) brightness(0.4) contrast(1.2)' }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className={`text-sm font-semibold mb-3 tracking-[0.1em] uppercase ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                {locale === 'ar' ? 'العنوان' : 'Address'}
              </h3>
              <p className={`text-base leading-[1.8] mb-4 ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#bbb' }}>
                {t('location.address')}
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-sm transition-all duration-300 hover:!bg-[#C9A96E] hover:!text-[#1A1A1A]"
                style={{ color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
              >
                {t('location.view')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Hours */}
            <div>
              <h3 className={`text-sm font-semibold mb-4 tracking-[0.1em] uppercase ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                {t('hours.title')}
              </h3>
              <div className="rounded-sm overflow-hidden" style={{ background: 'linear-gradient(145deg, #1f1f1f, #181818)', border: '1px solid #333' }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(51,51,51,0.5)' }}>
                  <span className={`text-sm font-medium text-white ${locale === 'ar' ? 'font-ar' : 'font-body'}`}>{t('hours.daily')}</span>
                  <span className={`text-sm ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#999' }}>{t('hours.daily.time')}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className={`text-sm font-medium text-white ${locale === 'ar' ? 'font-ar' : 'font-body'}`}>{t('hours.friday')}</span>
                  <span className={`text-sm ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#999' }}>{t('hours.friday.time')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
