'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { services, categories, type ServiceCategory } from '@/lib/services'

type FilterCategory = ServiceCategory | 'all'

const allCategories: { key: FilterCategory; ar: string; en: string }[] = [
  { key: 'all', ar: 'الكل', en: 'All' },
  ...categories.map((c) => ({ key: c.key as FilterCategory, ar: c.nameAr, en: c.nameEn })),
]

export default function Services() {
  const { locale, t } = useI18n()
  const [active, setActive] = useState<FilterCategory>('all')
  const [animating, setAnimating] = useState(false)

  const filtered = active === 'all' ? services : services.filter((s) => s.category === active)

  const handleFilter = (key: FilterCategory) => {
    if (key === active) return
    setAnimating(true)
    setTimeout(() => { setActive(key); setAnimating(false) }, 200)
  }

  return (
    <section id="services" className="relative py-24 lg:py-32" style={{ background: '#0D0D0D' }}>
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: '#C9A96E' }} />
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 ${locale === 'ar' ? 'font-ar' : 'font-heading'}`} style={{ color: '#C9A96E' }}>
            {t('services.title')}
          </h2>
          <p className={`text-sm tracking-wide ${locale === 'ar' ? 'font-heading italic' : 'font-ar'}`} style={{ color: '#666' }}>
            {t('services.subtitle')}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2 justify-start md:justify-center">
          {allCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleFilter(cat.key)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-300 shrink-0 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
              style={{
                background: active === cat.key ? '#C9A96E' : '#1A1A1A',
                color: active === cat.key ? '#1A1A1A' : '#999',
                border: active === cat.key ? '1px solid #C9A96E' : '1px solid #333',
              }}
            >
              {locale === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          {filtered.map((service) => (
            <div
              key={service.key}
              className="group relative rounded-sm p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #1f1f1f, #181818)', border: '1px solid rgba(201,169,110,0.1)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.3)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.1)' }}
            >
              {/* Gold top line on hover */}
              <div className="absolute top-0 inset-x-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" style={{ background: '#C9A96E' }} />

              {/* Duration badge */}
              {service.duration && (
                <div className="inline-block mb-4 px-3 py-1 rounded-sm text-xs font-medium tracking-wide" style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E' }}>
                  {locale === 'ar' ? service.duration : service.durationEn || service.duration}
                </div>
              )}

              {/* Name */}
              <h3 className={`text-lg font-bold mb-1 text-white ${locale === 'ar' ? 'font-ar' : 'font-heading text-xl'}`}>
                {locale === 'ar' ? service.nameAr : service.nameEn}
              </h3>
              <p className={`text-xs mb-4 ${locale === 'ar' ? 'font-body' : 'font-ar'}`} style={{ color: '#666' }}>
                {locale === 'ar' ? service.nameEn : service.nameAr}
              </p>

              {/* Description */}
              <p className={`text-sm leading-[1.8] mb-6 ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#999' }}>
                {locale === 'ar' ? service.descriptionAr : service.descriptionEn}
              </p>

              {/* Includes for packages */}
              {service.includes && (
                <div className="mb-6">
                  <p className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: '#C9A96E' }}>
                    {t('services.includes')}
                  </p>
                  <ul className="space-y-1.5">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#999' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
                        <span className={locale === 'ar' ? 'font-ar' : 'font-body'}>
                          {locale === 'ar' ? item.ar : item.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Book button */}
              <Link
                href={`/booking?service=${service.key}`}
                className="inline-block text-sm font-semibold tracking-[0.05em] px-6 py-2.5 rounded-sm transition-all duration-300 hover:!bg-[#C9A96E] hover:!text-[#1A1A1A]"
                style={{ color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
              >
                {t('services.book')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
