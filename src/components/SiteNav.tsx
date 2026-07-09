'use client'

// Shared top navigation for the standalone pages (services, offers, contact,
// booking). Matches the homepage nav visually, but every item is a real route
// so it works from any page. The homepage keeps its own section-scroll nav.
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const NAV_LINKS: { key: string; href: string }[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.offers', href: '/offers' },
  { key: 'gallery.title', href: '/gallery' },
  { key: 'nav.blog', href: '/blog' },
  { key: 'nav.contact', href: '/contact' },
]

export default function SiteNav() {
  const { t, locale, toggleLocale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className="fixed top-4 inset-x-4 sm:inset-x-6 lg:inset-x-10 z-50">
        <div className={`mx-auto max-w-6xl transition-all duration-700 rounded-2xl ${scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : ''}`}
          style={{
            background: scrolled ? 'rgba(8,8,12,0.7)' : 'rgba(8,8,12,0.4)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            border: `1px solid ${scrolled ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)'}`,
          }}>
          <div className="px-5 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/" className="relative group">
              <img src="/logo.png" alt="Oilo Spa" className="h-12 w-auto transition-all duration-300 group-hover:brightness-125" />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className={`relative px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 rounded-xl hover:bg-white/[0.06] group ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#C9A96E]">
                    {t(l.key)}
                  </span>
                </Link>
              ))}

              <button onClick={toggleLocale}
                className="text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-white/[0.06]"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {t('nav.lang')}
              </button>

              <Link href="/booking"
                className="btn-primary text-[11px] tracking-[0.1em] uppercase px-6 py-2.5 ms-2">
                {t('nav.booking')}
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={toggleLocale}
                className="text-[11px] px-3 py-1.5 rounded-xl"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t('nav.lang')}
              </button>
              <button onClick={() => setOpen(!open)} aria-label="Menu"
                className="w-9 h-9 flex flex-col justify-center items-center gap-[5px] rounded-xl hover:bg-white/[0.06] transition-colors">
                <span className={`block w-[18px] h-[1.5px] rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[3.3px] bg-[#C9A96E]' : 'bg-white/70'}`} />
                <span className={`block w-[18px] h-[1.5px] rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[3.3px] bg-[#C9A96E]' : 'bg-white/70'}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-400 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 ${locale === 'ar' ? 'right-0' : 'left-0'} w-[300px] h-full pt-28 px-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}
          style={{ background: 'linear-gradient(180deg, rgba(6,6,8,0.98), rgba(10,10,14,0.98))' }}>
          <div className={`absolute top-0 bottom-0 w-[2px] ${locale === 'ar' ? 'left-0' : 'right-0'}`}
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.15) 30%, rgba(201,169,110,0.15) 70%, transparent)' }} />
          <div className="space-y-2">
            {NAV_LINKS.map((l, i) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`block w-full text-start text-base font-semibold px-5 py-4 rounded-2xl text-white/70 hover:text-[#C9A96E] hover:bg-white/[0.03] transition-all duration-300 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}>
                {t(l.key)}
              </Link>
            ))}
          </div>
          <div className="mt-10 px-2">
            <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.2), transparent)' }} />
            <Link href="/booking" onClick={() => setOpen(false)}
              className="btn-primary block text-center py-4 text-sm tracking-wider uppercase rounded-2xl">
              {t('nav.booking')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
