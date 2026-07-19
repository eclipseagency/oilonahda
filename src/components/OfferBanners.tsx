'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { services } from '@/lib/services'

// Banner artwork is deliberately text-free so every word here is real DOM:
// it stays translatable, selectable, indexable, and never needs re-rendering
// when a price changes. Key must match the Service.key it illustrates.
const ART: Record<string, string> = {
  'royal-package': '/offers/offer-royal-package.webp',
  'vip-package': '/offers/offer-vip-package.webp',
  'offer-massage-pedi': '/offers/offer-massage-pedi.webp',
  'foot-crack-care': '/offers/offer-foot-crack-care.webp',
}

// Display order, highest-value first — the packages carry the real discounts
// (Royal saves 310 SAR, VIP saves 360) so they lead. Anything with art but no
// entry here falls to the end in data order.
const ORDER = ['royal-package', 'vip-package', 'offer-massage-pedi', 'foot-crack-care']

export default function OfferBanners() {
  const { locale } = useI18n()
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

  const rank = (key: string) => {
    const at = ORDER.indexOf(key)
    return at === -1 ? ORDER.length : at
  }
  const offers = services
    .filter(s => s.category === 'offer' && ART[s.key])
    .sort((a, b) => rank(a.key) - rank(b.key))
  if (offers.length === 0) return null

  return (
    <section ref={sectionRef} className="relative pb-16 sm:pb-24 md:pb-32 bg-section-a overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 md:gap-6">
          {offers.map((offer, i) => {
            const name = isAr ? offer.nameAr : offer.nameEn
            const desc = isAr ? offer.descriptionAr : offer.descriptionEn

            // Only claim a discount when the data actually backs one.
            const saved =
              offer.originalPrice != null && offer.price != null && offer.originalPrice > offer.price
                ? Math.round((1 - offer.price / offer.originalPrice) * 100)
                : null

            return (
              <Link
                key={offer.key}
                href={`/booking?service=${offer.key}`}
                className="group relative block overflow-hidden rounded-2xl reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Artwork. Subject sits on the left, so the text column takes the right. */}
                <img
                  src={ART[offer.key]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                />

                {/* Scrim. The generated art varies from dark to cream on the text
                    side, so this guarantees contrast rather than trusting the image. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to left, rgba(6,6,8,0.93) 0%, rgba(6,6,8,0.86) 32%, rgba(6,6,8,0.55) 58%, rgba(6,6,8,0.18) 100%)',
                  }}
                />

                {/* The artwork always keeps its subject on the physical left, so the
                    copy must sit on the physical right in BOTH languages. Logical
                    properties (justify-end / text-start) flip under RTL and would
                    drop the text straight onto the subject, so pin the row to LTR
                    and let the inner panel carry the real reading direction. */}
                <div
                  className="relative flex min-h-[290px] items-center px-6 py-10 sm:min-h-[320px] sm:px-10 md:min-h-[300px] md:px-14"
                  style={{ direction: 'ltr', justifyContent: 'flex-end' }}
                >
                  <div
                    dir={isAr ? 'rtl' : 'ltr'}
                    className={`w-full text-center md:w-[56%] ${isAr ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <span className="badge mb-4 text-[10px] sm:text-[11px]">
                      {saved != null
                        ? (isAr ? `وفّر ${saved}%` : `Save ${saved}%`)
                        : (isAr ? 'عرض خاص' : 'Special Offer')}
                    </span>

                    <h3
                      className={`font-bold text-gold-gradient ${isAr ? 'font-ar text-2xl leading-[1.2] sm:text-3xl md:text-4xl' : 'font-display text-2xl leading-[1.15] tracking-tight sm:text-3xl md:text-4xl'}`}
                      style={{ textWrap: 'balance' }}
                    >
                      {name}
                    </h3>

                    <p
                      className={`mt-3 text-xs leading-relaxed sm:text-sm ${isAr ? 'font-ar' : 'font-body'}`}
                      style={{ color: 'rgba(245,239,228,0.72)' }}
                    >
                      {desc}
                    </p>

                    <div className={`mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 ${isAr ? 'md:justify-end' : 'md:justify-start'}`}>
                      {offer.price != null && (
                        <span className="flex items-baseline gap-1.5">
                          <span className={`text-2xl font-bold text-[#C9A96E] sm:text-3xl ${isAr ? 'font-ar' : 'font-display'}`}>
                            {offer.price}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(245,239,228,0.6)' }}>
                            {isAr ? 'ريال' : 'SAR'}
                          </span>
                          {offer.originalPrice != null && offer.originalPrice > offer.price && (
                            <span
                              className="text-sm line-through"
                              style={{ color: 'rgba(245,239,228,0.45)' }}
                            >
                              {offer.originalPrice}
                            </span>
                          )}
                        </span>
                      )}

                      {offer.bundleCount != null && offer.bundlePrice != null && (
                        <span className="text-[11px] sm:text-xs" style={{ color: 'rgba(245,239,228,0.6)' }}>
                          {isAr
                            ? `أو ${offer.bundleCount} جلسات بـ ${offer.bundlePrice} ريال`
                            : `or ${offer.bundleCount} sessions for ${offer.bundlePrice} SAR`}
                        </span>
                      )}

                      <span className="btn-primary px-8 py-3 text-[11px] uppercase tracking-[0.12em] sm:text-xs">
                        {isAr ? 'احجز هذا العرض' : 'Book this offer'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
