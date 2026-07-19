'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { services } from '@/lib/services'

export default function AnnouncementTicker() {
  const { locale } = useI18n()
  const isAr = locale === 'ar'

  const offers = services.filter(s => s.category === 'offer')
  if (offers.length === 0) return null

  const items = offers.map(o => {
    const name = isAr ? o.nameAr : o.nameEn
    return o.price != null
      ? `${name} — ${o.price} ${isAr ? 'ريال' : 'SAR'}`
      : name
  })

  // Two identical strips scroll past and the track translates by exactly -50%,
  // so the clone lands where the original started and the loop is seamless.
  // Each strip repeats the offers enough times to overflow a wide viewport —
  // with only a couple of short offers a single pass leaves visible gaps.
  const REPEATS = 4
  const filled = Array.from({ length: REPEATS }, () => items).flat()

  // Only the first strip is exposed to assistive tech; the clone is decorative.
  const strip = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-10 px-5"
      aria-hidden={hidden || undefined}
    >
      {filled.map((text, i) => (
        <span key={i} className={`flex items-center gap-10 whitespace-nowrap ${isAr ? 'font-ar' : 'font-body'}`}>
          <span className="text-[11px] tracking-[0.06em]" style={{ color: 'rgba(245,239,228,0.82)' }}>
            {text}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#C9A96E]/50" />
        </span>
      ))}
    </div>
  )

  return (
    <Link
      href="/booking"
      dir={isAr ? 'rtl' : 'ltr'}
      className="group relative flex h-9 items-center overflow-hidden border-b border-white/5"
      style={{ background: 'linear-gradient(90deg, #0d0d10 0%, #14120f 50%, #0d0d10 100%)' }}
    >
      <div className="ticker-track flex min-w-full items-center group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
        {strip(false)}
        {strip(true)}
      </div>
    </Link>
  )
}
