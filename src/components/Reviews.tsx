'use client'

import { useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

interface Review {
  nameAr: string
  nameEn: string
  textAr: string
  textEn: string
  rating: number
  dateAr: string
  dateEn: string
}

const reviews: Review[] = [
  {
    nameAr: 'عبدالعزيز',
    nameEn: 'Abdulaziz',
    textAr: 'أفضل سبا جربته في الرياض. الأجواء فاخرة والمعالج محترف جدًا. الحمام المغربي بزيت الأرجان كان مذهل — بشرتي حسيت فيها ناعمة لأيام.',
    textEn: 'The best spa I\'ve tried in Riyadh. Luxurious atmosphere and a very professional therapist. The argan oil Moroccan bath was amazing — my skin felt soft for days.',
    rating: 5,
    dateAr: 'قبل أسبوعين',
    dateEn: '2 weeks ago',
  },
  {
    nameAr: 'فهد',
    nameEn: 'Fahad',
    textAr: 'مساج الأحجار الساخنة خرافي. خرجت مرتاح مثل ما ما كنت مرتاح من زمان. الموقع سهل الوصول والمواقف متوفرة.',
    textEn: 'The hot stone massage was incredible. I left more relaxed than I\'ve felt in a long time. Easy to find with available parking.',
    rating: 5,
    dateAr: 'قبل شهر',
    dateEn: '1 month ago',
  },
  {
    nameAr: 'سلطان',
    nameEn: 'Sultan',
    textAr: 'جربت الباقة الملكية مع الشباب — تجربة كاملة من أول ما دخلنا. الخدمة فخمة، النظافة عالية، والأسعار معقولة للجودة.',
    textEn: 'Tried the Royal Package with friends — complete experience from the moment we walked in. Premium service, high cleanliness, fair prices for the quality.',
    rating: 5,
    dateAr: 'قبل ٣ أسابيع',
    dateEn: '3 weeks ago',
  },
  {
    nameAr: 'محمد',
    nameEn: 'Mohammed',
    textAr: 'مكان هادئ بعيد عن الزحمة. المعالج سألني عن احتياجاتي وضبط الضغط على كيفي. أنصح فيه لكل واحد يبي يرتاح بعد أسبوع طويل.',
    textEn: 'A calm place away from the noise. The therapist asked about my needs and adjusted the pressure to my preference. I recommend it for anyone wanting to unwind after a long week.',
    rating: 5,
    dateAr: 'قبل شهرين',
    dateEn: '2 months ago',
  },
  {
    nameAr: 'خالد',
    nameEn: 'Khalid',
    textAr: 'أجدد رحلتي الأسبوعية لأويلو. المساج السويدي اللي يقدمونه من أفضل ما جربت. الفريق محترم ومهني.',
    textEn: 'I make it my weekly ritual at Oilo. The Swedish massage they offer is among the best I\'ve had. The team is respectful and professional.',
    rating: 5,
    dateAr: 'قبل شهر',
    dateEn: '1 month ago',
  },
  {
    nameAr: 'ناصر',
    nameEn: 'Nasser',
    textAr: 'الحمام المغربي تجربة لا توصف. التقشير عميق والترطيب بزيت الأرجان خرافي. حجزت باقة ٥ جلسات وما ندمت.',
    textEn: 'The Moroccan bath is an indescribable experience. Deep exfoliation and argan oil moisturizing that\'s unreal. I booked a 5-session bundle and don\'t regret it.',
    rating: 5,
    dateAr: 'قبل شهرين',
    dateEn: '2 months ago',
  },
]

function Star({ filled = true, size = 14 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill={filled ? '#C9A96E' : 'none'} stroke="#C9A96E" strokeWidth="1">
      <path d="M7 1L8.854 4.757l4.146.602-3 2.924.708 4.124L7 10.45 3.292 12.407 4 8.283 1 5.359l4.146-.602L7 1z" strokeLinejoin="round" />
    </svg>
  )
}

export default function Reviews() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Hero quote is the first one
  const heroReview = reviews[0]
  const restReviews = reviews.slice(1)

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

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.7
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id="reviews" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-a overflow-hidden">
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          {/* Aggregate header — big social proof */}
          <div className="text-center mb-14 md:mb-20">
            <div className="inline-flex items-center gap-3 mb-6 reveal">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} />)}
              </div>
              <span className="text-2xl font-bold font-display" style={{ color: '#C9A96E' }} dir="ltr">4.9</span>
              <span className="h-4 w-px" style={{ background: 'rgba(201,169,110,0.3)' }} />
              <span className={`text-sm ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.55)' }}>
                {isAr ? '١٨٧ تقييم على جوجل' : '187 reviews on Google'}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 heading-warm reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-display'}`}>
              {t('reviews.title')}
            </h2>
            <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-2 max-w-xl mx-auto ${isAr ? 'font-ar' : 'font-body'}`}
              style={{ color: 'rgba(245,239,228,0.5)' }}>
              {t('reviews.subtitle')}
            </p>
          </div>

          {/* Hero pull-quote — editorial */}
          <div className="relative max-w-4xl mx-auto mb-14 md:mb-20 reveal reveal-scale">
            <div className="relative p-10 sm:p-14 md:p-20 rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.06), rgba(6,6,8,0.4))', border: '1px solid rgba(201,169,110,0.15)' }}>
              {/* Giant quote mark */}
              <span className="absolute top-4 start-8 text-[160px] md:text-[220px] leading-none font-display opacity-[0.08] select-none"
                style={{ color: '#C9A96E' }} aria-hidden="true">
                &ldquo;
              </span>
              <div className="relative z-10">
                <blockquote className={`text-xl sm:text-2xl md:text-[28px] leading-[1.7] md:leading-[1.65] font-medium mb-8 ${isAr ? 'font-ar' : 'font-display italic'}`}
                  style={{ color: 'rgba(245,239,228,0.92)' }}>
                  {isAr ? heroReview.textAr : heroReview.textEn}
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                    {(isAr ? heroReview.nameAr : heroReview.nameEn).charAt(0)}
                  </div>
                  <div>
                    <p className={`text-base font-semibold text-warm ${isAr ? 'font-ar' : 'font-display text-lg'}`}>
                      {isAr ? heroReview.nameAr : heroReview.nameEn}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: heroReview.rating }).map((_, i) => <Star key={i} size={11} />)}
                      </div>
                      <span className={`text-[11px] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.4)' }}>
                        · {isAr ? heroReview.dateAr : heroReview.dateEn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary reviews — minimal cards */}
          <div className="flex items-center justify-end mb-6 reveal">
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => scroll(isAr ? 'right' : 'left')}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/[0.04]"
                style={{ border: '1px solid rgba(245,239,228,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9L11 14" stroke="rgba(245,239,228,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => scroll(isAr ? 'left' : 'right')}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10"
                style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4L12 9L7 14" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-5 sm:px-6 lg:px-10 scroll-smooth reveal reveal-delay-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          {restReviews.map((r, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] sm:w-[340px] p-6 md:p-7 rounded-2xl snap-start"
              style={{ background: 'rgba(245,239,228,0.02)', border: '1px solid rgba(245,239,228,0.06)' }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, idx) => <Star key={idx} size={12} />)}
              </div>
              <p className={`text-sm md:text-[15px] leading-[1.9] mb-6 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.75)' }}>
                {isAr ? r.textAr : r.textEn}
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(245,239,228,0.06)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>
                  {(isAr ? r.nameAr : r.nameEn).charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-semibold text-warm ${isAr ? 'font-ar' : 'font-body'}`}>
                    {isAr ? r.nameAr : r.nameEn}
                  </p>
                  <p className={`text-[11px] ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.35)' }}>
                    {isAr ? r.dateAr : r.dateEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
