'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const navLinks = [
  { key: 'nav.home', href: '#' },
  { key: 'nav.services', href: '#services' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.location', href: '#location' },
]

export default function Navbar() {
  const { locale, t, toggleLocale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none' }}
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 flex items-center justify-between h-[72px]">
          <Link href="/" className="font-heading text-2xl font-semibold tracking-[0.25em] uppercase" style={{ color: '#C9A96E' }}>
            OILO
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className={`text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 text-neutral-400 hover:text-[#C9A96E] ${locale === 'en' ? 'font-body' : 'font-ar'}`}
              >
                {t(link.key)}
              </button>
            ))}
            <Link
              href="/booking"
              className="text-[13px] font-semibold tracking-[0.05em] uppercase px-6 py-2.5 rounded-sm transition-all duration-300 hover:-translate-y-px"
              style={{ background: '#C9A96E', color: '#1A1A1A' }}
            >
              {t('nav.booking')}
            </Link>
            <button
              onClick={toggleLocale}
              className="text-[13px] font-medium tracking-[0.1em] text-neutral-400 hover:text-[#C9A96E] transition-colors duration-300 border border-neutral-700 px-3 py-1.5 rounded-sm"
            >
              {t('nav.lang')}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleLocale} className="text-[13px] text-neutral-400 hover:text-[#C9A96E] border border-neutral-700 px-2.5 py-1 rounded-sm">
              {t('nav.lang')}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="relative w-8 h-8 flex flex-col items-center justify-center gap-[5px]" aria-label="Menu">
              <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 ${locale === 'ar' ? 'right-0' : 'left-0'} h-full w-[280px] backdrop-blur-xl transition-transform duration-500 ease-out ${mobileOpen ? 'translate-x-0' : locale === 'ar' ? 'translate-x-full' : '-translate-x-full'}`}
          style={{ background: 'rgba(26,26,26,0.97)' }}
        >
          <div className="pt-24 px-8 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button key={link.key} onClick={() => handleNavClick(link.href)} className={`text-start text-lg font-medium py-3 text-white hover:text-[#C9A96E] transition-colors border-b border-neutral-800 ${locale === 'en' ? 'font-body' : 'font-ar'}`}>
                {t(link.key)}
              </button>
            ))}
            <Link href="/booking" onClick={() => setMobileOpen(false)} className="mt-6 text-center font-semibold px-6 py-3.5 rounded-sm" style={{ background: '#C9A96E', color: '#1A1A1A' }}>
              {t('nav.booking')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
