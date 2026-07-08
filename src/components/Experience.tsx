'use client'

import { useI18n } from '@/lib/i18n'

const items = [
  { ar: 'زيوت طبيعية', en: 'Natural Oils', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80' },
  { ar: 'شموع عطرية', en: 'Aromatic Candles', img: 'https://images.unsplash.com/photo-1602607536791-2b0b66fac76a?w=600&q=80' },
  { ar: 'مناشف فاخرة', en: 'Luxury Towels', img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80' },
  { ar: 'أحجار دافئة', en: 'Hot Stones', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80' },
  { ar: 'أجواء مائية', en: 'Water Ambience', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
  { ar: 'مساج احترافي', en: 'Professional Massage', img: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80' },
]

export default function Experience() {
  const { locale, t } = useI18n()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: '#111111' }}>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: '#C9A96E' }} />
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-white ${locale === 'ar' ? 'font-ar' : 'font-heading'}`}>
            {t('experience.title')}
          </h2>
          <p className={`text-sm tracking-wide ${locale === 'ar' ? 'font-heading italic' : 'font-ar'}`} style={{ color: '#666' }}>
            {t('experience.subtitle')}
          </p>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-sm overflow-hidden cursor-pointer">
              <img
                src={item.img}
                alt={item.en}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }} />
              {/* Gold line on hover */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" style={{ background: '#C9A96E' }} />
              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                <p className={`text-sm md:text-base font-medium text-white mb-0.5 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}>
                  {locale === 'ar' ? item.ar : item.en}
                </p>
                <p className={`text-xs ${locale === 'ar' ? 'font-body' : 'font-ar'}`} style={{ color: '#999' }}>
                  {locale === 'ar' ? item.en : item.ar}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
