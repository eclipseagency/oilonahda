'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/XAj26BEYUN9rBZp58'

const reviews = [
  {
    name: 'Omar A',
    text: 'مركز ممتاز جداً ونظيف ورايق وتحيه للاستاذ ابو وديع محترم واسلوبه في التعامل جدا راقي في الاستقبال',
    date: 'قبل أسبوع',
  },
  {
    name: 'عبدالله محمد',
    text: 'تجربه رائعه يشكرون عليها انصح فيه الطاقم مميز ويفهمون في المساج لدرجة عرف الآلام اللي فيني بدون ما اعلمه',
    date: 'قبل 3 أسابيع',
  },
  {
    name: 'سالم غامد',
    text: 'مركز ممتاز واشكر استاذ وليد على الحفاوة والاستقبال',
    date: 'قبل 3 أسابيع',
  },
  {
    name: 'طاهـر موسى الثقفي',
    text: 'تجرّبه جدا روعه جميع الطاقم فني في المساج وانصح الجميع الزياده له هادي الخدمه جدا روعه الموظفين جدا نظاف موظف اللي في الاستقبال الله يسعده ابو وديع انصح الجميع يروحون ل ابو وديع',
    date: 'قبل شهر',
  },
  {
    name: 'Mehnaz Bagam',
    text: 'مكان ممتاز وخدمه اكتر من رائعه بدايه من الاستقبال الي الاخصائي ونضافه فوق الممتاز انصحكوا تجربوا لا تترددوا',
    date: 'قبل شهر',
  },
]

function GoogleWordmark() {
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335']
  return (
    <span aria-label="Google Maps" className="inline-flex items-baseline font-sans font-medium tracking-[-0.04em]">
      {'Google'.split('').map((letter, i) => <span key={i} style={{ color: colors[i] }}>{letter}</span>)}
      <span className="ms-1.5 text-[13px] font-normal tracking-normal text-[#5f6368]">Maps</span>
    </span>
  )
}

function Stars({ size = 18 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  )
}

export default function Reviews() {
  const { locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.1 },
    )
    el.querySelectorAll('.reveal').forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const isAr = locale === 'ar'

  return (
    <section id="reviews" ref={sectionRef} className="bg-section-a py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col items-center justify-between gap-7 md:flex-row md:items-end">
          <div className={isAr ? 'text-center md:text-right' : 'text-center md:text-left'}>
            <h2 className={`text-3xl font-bold text-[#F5EFE4] sm:text-4xl md:text-5xl ${isAr ? 'font-ar' : 'font-display'}`}>
              {isAr ? 'آراء عملائنا على Google' : 'Our customers on Google'}
            </h2>
          </div>

          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-lg transition-transform hover:-translate-y-0.5"
            aria-label={isAr ? 'عرض تقييمات أويلو سبا على خرائط Google' : 'View Oilo Spa reviews on Google Maps'}>
            <div className="text-2xl"><GoogleWordmark /></div>
            <div className="h-10 w-px bg-[#e0e0e0]" />
            <div className="text-start" dir="ltr">
              <div className="flex items-center gap-2">
                <strong className="text-xl text-[#202124]">4.9</strong>
                <Stars size={16} />
              </div>
              <p className="mt-0.5 text-xs text-[#5f6368]">18 Google reviews</p>
            </div>
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {reviews.map((review, index) => (
            <article key={review.name}
              className="reveal flex min-h-[260px] flex-col rounded-xl border border-[#dadce0] bg-white p-5 text-[#202124] shadow-[0_1px_2px_rgba(60,64,67,0.18),0_1px_3px_1px_rgba(60,64,67,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-3" dir="ltr">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
                    style={{ background: ['#1a73e8', '#9334e6', '#00897b', '#d93025', '#f9ab00'][index] }}>
                    {review.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#202124]">{review.name}</p>
                    <p className="text-xs text-[#70757a]">Google review</p>
                  </div>
                </div>
                <span className="shrink-0 text-lg"><GoogleWordmark /></span>
              </div>

              <div className="mb-3 flex items-center gap-2" dir="rtl">
                <Stars size={16} />
                <span className="text-xs text-[#70757a]">{review.date}</span>
              </div>

              <p dir="rtl" lang="ar" className="font-ar flex-1 text-right text-sm leading-7 text-[#3c4043]">
                {review.text}
              </p>

              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
                className="mt-5 text-sm font-semibold text-[#1a73e8] hover:underline">
                {isAr ? 'عرض على Google' : 'View on Google'}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          {isAr ? 'المراجعات معروضة بنصها الأصلي من خرائط Google.' : 'Reviews are shown in their original wording from Google Maps.'}
        </p>
      </div>
    </section>
  )
}
