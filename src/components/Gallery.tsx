'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { images } from '@/lib/images'

const gallery = [
  { src: images.interior, alt: 'Interior' },
  { src: images.therapy, alt: 'Therapy Room' },
  { src: images.oils, alt: 'Natural Oils' },
  { src: images.candles, alt: 'Ambience' },
  { src: images.stones, alt: 'Hot Stones' },
  { src: images.massage, alt: 'Massage Table' },
  { src: images.royalBath, alt: 'Royal Bath Room' },
  { src: images.jacuzzi, alt: 'Jacuzzi Area' },
  { src: images.about, alt: 'Lounge' },
]

export default function Gallery() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

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

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i === null ? null : (i + 1) % gallery.length))
      if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? null : (i - 1 + gallery.length) % gallery.length))
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
      <section id="gallery" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b overflow-hidden">
        <div className="glow-orb w-[400px] h-[400px] -top-[100px] start-0"
          style={{ background: 'rgba(201,169,110,0.04)' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-10 sm:mb-16 md:mb-20">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gold-gradient reveal ${isAr ? 'font-ar' : 'font-display'}`}>
              {t('gallery.title')}
            </h2>
            <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.3)' }}>
              {t('gallery.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((img, i) => {
              const isLarge = i === 0 || i === 4
              return (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`group relative overflow-hidden rounded-2xl md:rounded-3xl reveal reveal-scale ${isLarge ? 'md:row-span-2 md:col-span-1' : ''}`}
                  style={{ transitionDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <div className={`relative w-full ${isLarge ? 'aspect-[3/4] md:aspect-[3/5]' : 'aspect-square'}`}>
                    <img src={img.src} alt={img.alt} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(6,6,8,0.3))' }} />
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
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setLightbox(null)}
          style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-6 end-6 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null ? null : (i - 1 + gallery.length) % gallery.length)) }}
            className="absolute start-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={isAr ? 'M7 4L12 9L7 14' : 'M11 4L6 9L11 14'} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null ? null : (i + 1) % gallery.length)) }}
            className="absolute end-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={isAr ? 'M11 4L6 9L11 14' : 'M7 4L12 9L7 14'} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lightbox].src} alt={gallery[lightbox].alt}
              className="w-full max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </>
  )
}
