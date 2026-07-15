'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'

interface Therapist {
  nameAr: string
  nameEn: string
  specialtyAr: string
  specialtyEn: string
  years: number
  initial: string
}

const team: Therapist[] = [
  {
    nameAr: 'المعالج أحمد',
    nameEn: 'Ahmed',
    specialtyAr: 'المساج السويدي والزيوت العطرية',
    specialtyEn: 'Swedish & Aromatic Oil Massage',
    years: 8,
    initial: 'A',
  },
  {
    nameAr: 'المعالج يوسف',
    nameEn: 'Youssef',
    specialtyAr: 'مساج الأحجار الساخنة والشياتسو',
    specialtyEn: 'Hot Stone & Shiatsu',
    years: 6,
    initial: 'Y',
  },
  {
    nameAr: 'المعالج كريم',
    nameEn: 'Kareem',
    specialtyAr: 'الحمام المغربي والعناية بالبشرة',
    specialtyEn: 'Moroccan Bath & Skincare',
    years: 10,
    initial: 'K',
  },
  {
    nameAr: 'المعالج عمر',
    nameEn: 'Omar',
    specialtyAr: 'مساج أويلو الخاص',
    specialtyEn: 'Signature Oilo Massage',
    years: 7,
    initial: 'O',
  },
]

export default function Team() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'
  const sectionRef = useRef<HTMLDivElement>(null)

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

  return (
    <section id="team" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] top-1/2 start-0 -translate-y-1/2"
        style={{ background: 'rgba(201,169,110,0.04)', animationDelay: '1s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gold-gradient reveal ${isAr ? 'font-ar' : 'font-display'}`}>
            {t('team.title')}
          </h2>
          <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-1 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.3)' }}>
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {team.map((person, i) => (
            <div key={i} className="glass-card p-7 md:p-8 text-center reveal reveal-scale"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
                    border: '2px solid rgba(201,169,110,0.3)',
                  }} />
                <div className="relative w-full h-full flex items-center justify-center text-gold-gradient text-4xl font-bold font-display">
                  {person.initial}
                </div>
              </div>
              <h3 className={`text-lg font-bold text-white mb-2 ${isAr ? 'font-ar' : 'font-display text-xl'}`}>
                {isAr ? person.nameAr : person.nameEn}
              </h3>
              <p className={`text-sm mb-4 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                {isAr ? person.specialtyAr : person.specialtyEn}
              </p>
              <div className="flex items-center justify-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-2xl font-bold text-gold-gradient font-display">{person.years}+</span>
                <span className={`text-[11px] uppercase tracking-wider ${isAr ? 'font-ar' : 'font-body'}`}
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {t('team.years')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
