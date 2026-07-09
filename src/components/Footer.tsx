'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function Footer() {
  const { locale, t } = useI18n()

  const handleNav = (href: string) => {
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative" style={{ background: '#0D0D0D', borderTop: '1px solid #222' }}>
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-3xl font-semibold tracking-[0.3em] uppercase" style={{ color: '#C9A96E' }}>
            OILO
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10">
          {[
            { key: 'nav.home', href: '#' },
            { key: 'nav.services', href: '#services' },
            { key: 'nav.about', href: '#about' },
            { key: 'nav.location', href: '#location' },
          ].map((link) => (
            <button key={link.key} onClick={() => handleNav(link.href)} className={`text-[13px] font-medium tracking-[0.1em] transition-colors duration-300 hover:text-[#C9A96E] ${locale === 'en' ? 'font-body uppercase' : 'font-ar'}`} style={{ color: '#999' }}>
              {t(link.key)}
            </button>
          ))}
          <Link href="/booking" className={`text-[13px] font-medium tracking-[0.1em] transition-colors duration-300 hover:text-[#C9A96E] ${locale === 'en' ? 'font-body uppercase' : 'font-ar'}`} style={{ color: '#999' }}>
            {t('nav.booking')}
          </Link>
        </div>

        <div className="w-16 h-px mx-auto mb-10" style={{ background: '#333' }} />

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10 text-[12px]" style={{ color: '#777' }}>
          <Link href="/services/massage-riyadh" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'مساج' : 'Massage'}
          </Link>
          <Link href="/services/moroccan-bath-riyadh" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'حمام مغربي' : 'Moroccan Bath'}
          </Link>
          <Link href="/services/hijama-riyadh" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'حجامة' : 'Hijama'}
          </Link>
          <Link href="/services/manicure-pedicure-riyadh" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'بديكير ومنكير' : 'Mani & Pedi'}
          </Link>
          <Link href="/services/spa-riyadh" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'باقات السبا' : 'Spa Packages'}
          </Link>
          <Link href="/services" className={`hover:text-[#C9A96E] transition-colors ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
            {locale === 'ar' ? 'كل الخدمات' : 'All Services'}
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-sm" style={{ color: '#999' }}>
          <a href="tel:0556733851" className="flex items-center gap-2 hover:text-[#C9A96E] transition-colors" dir="ltr">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-body">0556733851</span>
          </a>
          <span className="hidden sm:block w-px h-3" style={{ background: '#333' }} />
          <a href="mailto:oilonahda@gmail.com" className="flex items-center gap-2 hover:text-[#C9A96E] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="font-body text-sm">oilonahda@gmail.com</span>
          </a>
        </div>

        <p className={`text-center text-xs ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: '#555' }}>
          &copy; 2026 Oilo Spa. {t('footer.rights')}.
        </p>
      </div>
    </footer>
  )
}
