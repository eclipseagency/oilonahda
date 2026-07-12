'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// Al Nahda ambience gallery. Real per-service Nahda shots (rooms, baths, oils,
// candles) double as atmosphere photography for the branch.
const PHOTOS: { src: string; alt: string }[] = [
  { src: '/services/nahda-hero.webp', alt: 'أجواء ومدخل أويلو سبا' },
  { src: '/services/nahda-hammam.webp', alt: 'غرفة الحمام المغربي' },
  { src: '/services/nahda-candles.webp', alt: 'أجواء هادئة بالشموع' },
  { src: '/services/nahda-bath-royal.webp', alt: 'الحمام المغربي الملكي' },
  { src: '/services/nahda-oil.webp', alt: 'زيوت طبيعية للمساج' },
  { src: '/services/nahda-stones.webp', alt: 'الأحجار الساخنة' },
  { src: '/services/nahda-swedish-massage.webp', alt: 'غرفة المساج' },
  { src: '/services/nahda-bath-vip.webp', alt: 'حمام VIP' },
  { src: '/services/nahda-aroma-oil-massage.webp', alt: 'مساج الزيوت العطرية' },
  { src: '/services/nahda-hot-stone-massage.webp', alt: 'مساج الأحجار الساخنة' },
  { src: '/services/nahda-care.webp', alt: 'زاوية العناية والاسترخاء' },
  { src: '/services/nahda-mix-massage.webp', alt: 'جلسة مساج متكاملة' },
]

export default function GalleryPage() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i === null ? null : (i + 1) % PHOTOS.length))
      if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length))
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <>
      <SiteNav />
      <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
        <div className="glow-orb w-[520px] h-[520px] -top-[220px] start-1/3" style={{ background: 'rgba(201,169,110,0.06)' }} />

        {/* Hero */}
        <section className="relative z-10 pt-36 pb-12 text-center px-5">
          <p className={`text-[11px] font-bold tracking-[0.35em] uppercase mb-5 ${isAr ? 'font-ar' : ''}`} style={{ color: '#C9A96E' }}>
            {isAr ? 'أويلو سبا' : 'Oilo Spa · Al Nahda'}
          </p>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-4 ${isAr ? 'font-ar' : 'font-display'}`}>
            {t('gallery.title')}
          </h1>
          <p className={`text-sm sm:text-base max-w-xl mx-auto leading-loose ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
            {isAr
              ? 'جولة داخل الفرع: غرف المساج، الحمام المغربي، والزوايا الهادئة الفاخرة في بيئة نظيفة ومريحة.'
              : 'Inside Al Nahda: massage rooms, the Moroccan bath, and calm, refined corners in a clean, comfortable space.'}
          </p>
        </section>

        {/* Gallery grid */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {PHOTOS.map((img, i) => {
              const isLarge = i === 0 || i === 5
              return (
                <button
                  key={img.src}
                  onClick={() => setLightbox(i)}
                  aria-label={img.alt}
                  className={`group relative overflow-hidden rounded-2xl md:rounded-3xl ${isLarge ? 'md:row-span-2' : ''}`}
                >
                  <div className={`relative w-full ${isLarge ? 'aspect-[3/4] md:aspect-[3/5]' : 'aspect-square'}`}>
                    <img src={img.src} alt={img.alt} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(6,6,8,0.35))' }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(6,6,8,0.7)', border: '1px solid rgba(201,169,110,0.4)', backdropFilter: 'blur(12px)' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6.5 1v4.5M6.5 10.5V15M1 6.5h4.5M10.5 6.5H15" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="6.5" cy="6.5" r="5" stroke="#C9A96E" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <p className={`mb-5 text-sm ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
              {isAr ? 'عاش الأجواء بنفسك — احجز جلستك.' : 'Experience it yourself — book your session at Al Nahda.'}
            </p>
            <Link href="/booking" className="btn-primary inline-block px-10 py-4 text-sm tracking-wider">
              {isAr ? 'احجز الآن' : 'Book Now'}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setLightbox(null)}
          style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-6 end-6 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }} aria-label="إغلاق">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)) }}
            className="absolute start-4 sm:start-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }} aria-label="السابق">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={isAr ? 'M7 4L12 9L7 14' : 'M11 4L6 9L11 14'} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null ? null : (i + 1) % PHOTOS.length)) }}
            className="absolute end-4 sm:end-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }} aria-label="التالي">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={isAr ? 'M11 4L6 9L11 14' : 'M7 4L12 9L7 14'} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img src={PHOTOS[lightbox].src} alt={PHOTOS[lightbox].alt} onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]" />
        </div>
      )}
    </>
  )
}
