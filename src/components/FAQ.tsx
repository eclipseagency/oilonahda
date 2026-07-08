'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'

export default function FAQ() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const sectionRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(0)

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

  const items = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
  ]

  return (
    <section id="faq" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-a overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] top-1/4 end-0"
        style={{ background: 'rgba(201,169,110,0.04)' }} />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gold-gradient reveal ${isAr ? 'font-ar' : 'font-display'}`}>
            {t('faq.title')}
          </h2>
          <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.3)' }}>
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3 reveal reveal-delay-2">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? 'rgba(201,169,110,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isOpen ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-start transition-colors hover:bg-white/[0.02]"
                >
                  <span className={`text-sm sm:text-base font-semibold ${isAr ? 'font-ar' : 'font-body'}`}
                    style={{ color: isOpen ? '#C9A96E' : 'rgba(255,255,255,0.85)' }}>
                    {item.q}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isOpen ? '300px' : '0',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className={`px-5 sm:px-7 pb-6 text-sm sm:text-[15px] leading-[2] ${isAr ? 'font-ar' : 'font-body'}`}
                    style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function getFaqJsonLd(lang: 'ar' | 'en' = 'ar') {
  const qa = {
    ar: [
      ['ما الذي يميّز أجواء أويلو سبا؟', 'بيئة هادئة ونظيفة ومريحة، فريق من المعالجين المحترفين المؤهلين، وأدوات معقمة في كل جلسة لتجربة استرخاء آمنة ومريحة.'],
      ['هل أحتاج إلى حجز مسبق؟', 'نوصي بالحجز المسبق لضمان الموعد الذي يناسبك، خصوصًا في عطلة نهاية الأسبوع. الحجز متاح عبر الموقع أو واتساب أو الهاتف.'],
      ['ما الذي أحضره معي؟', 'لا تحتاج إحضار أي شيء. نوفر روب ومناشف ومنتجات العناية. فقط احضر بنفس قابلة للاسترخاء.'],
      ['هل يمكنني اختيار المعالج؟', 'جميع معالجينا محترفون مؤهلون ومدربون. يمكنك طلب معالج محدد إذا كان متاحًا وقت الحجز.'],
      ['ما هي سياسة الإلغاء؟', 'يمكن إلغاء أو تعديل الحجز قبل الموعد بـ ٤ ساعات على الأقل دون أي رسوم.'],
      ['هل تقدمون بطاقات هدايا؟', 'نعم، بطاقات الهدايا متاحة لجميع خدماتنا وباقاتنا. هدية مثالية للمناسبات.'],
      ['هل يوجد مواقف سيارات؟', 'نعم، يتوفر موقف سيارات مجاني للعملاء في موقعنا بحي النهضة.'],
      ['كم مدة الجلسة عادة؟', 'جلسات المساج ٤٠-٦٠ دقيقة، والحمام المغربي حوالي ٦٠ دقيقة، والباقات المتكاملة ٢-٣ ساعات.'],
    ],
    en: [
      ['What makes Oilo Spa special?', 'A calm, clean and comfortable environment, a team of qualified professional therapists, and sterilized tools for every session for a safe and relaxing experience.'],
      ['Do I need to book in advance?', 'We recommend booking in advance to secure your preferred time, especially on weekends. You can book via the website, WhatsApp, or phone.'],
      ['What should I bring?', 'You don\'t need to bring anything. We provide a robe, towels, and care products. Just arrive in comfortable clothes.'],
      ['Can I choose my therapist?', 'All our therapists are qualified and trained professionals. You can request a specific therapist if available at booking time.'],
      ['What is the cancellation policy?', 'You can cancel or reschedule up to 4 hours before your appointment at no charge.'],
      ['Do you offer gift cards?', 'Yes, gift cards are available for all our services and packages, the perfect gift for any occasion.'],
      ['Is parking available?', 'Yes, free customer parking is available at our Al Nahda location.'],
      ['How long is a typical session?', 'Massage sessions are 40–60 minutes, Moroccan bath about 60 minutes, and full packages are 2–3 hours.'],
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa[lang].map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}
