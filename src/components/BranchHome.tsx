'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { services, categories, groupServices, type ServiceCategory, type Service } from '@/lib/services'
import { images } from '@/lib/images'
import OpenNow from '@/components/OpenNow'
import Reviews from '@/components/Reviews'
import Gallery from '@/components/Gallery'
import FAQ, { getFaqJsonLd } from '@/components/FAQ'
import WhatToExpect from '@/components/WhatToExpect'
import GiftMembership from '@/components/GiftMembership'
import ContactSection from '@/components/ContactSection'
import OfferBanners from '@/components/OfferBanners'
import { OrnamentDivider } from '@/components/Monogram'
import { type BranchId } from '@/lib/branches'
import {
  nahdaServicesAsServices,
  nahdaServiceImages,
  nahdaAboutImage,
  nahdaCategoriesTabs,
  nahdaLocation,
} from '@/lib/nahdaBranchData'

// Branch-aware WhatsApp deep link (pass the branch's intl whatsapp digits).
const WA_GREETING = 'السلام عليكم، تواصلت من موقع أويلو سبا، أود الاستفسار عن الخدمات والحجز.'
function waLink(whatsapp: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(WA_GREETING)}`
}

// ═══════════════════════════════════════════
// BRANCH DATA CONTEXT
// Lets the design render the Al Nahda branch context.
// ═══════════════════════════════════════════
export interface BranchLocation {
  addressAr: string; addressEn: string; mapsLink: string
  geo?: { lat: number; lng: number }
  phone: string; whatsapp: string
  hoursDailyLabelAr: string; hoursDailyLabelEn: string; hoursDailyTime: string
  hoursFridayLabelAr: string; hoursFridayLabelEn: string; hoursFridayTime: string
}
export interface BranchCtx {
  services: Service[]
  categories: { key: ServiceCategory; nameAr: string; nameEn: string }[]
  serviceImages: Record<string, string>
  aboutImage: string
  showEid: boolean
  showPackages: boolean
  showGallery: boolean
  showExperience: boolean
  primaryBookingHref: string
  serviceHref: (key: string, nameAr: string, nameEn: string) => string
  location: BranchLocation | null
  branchName: { ar: string; en: string } | null
  // Optional per-branch copy overrides. When set, they replace the shared
  // i18n strings for this branch only (used to reposition /al-nahda toward
  // therapeutic/wellness framing for ad-policy compliance).
  heroBadge?: { ar: string; en: string }
  heroTagline?: { ar: string; en: string }
  heroSubtitle?: { ar: string; en: string }
  servicesSubtitle?: { ar: string; en: string }
}
export const BranchContext = createContext<BranchCtx | null>(null)
function defaultBranch(): BranchCtx {
  return {
    services,
    categories,
    serviceImages,
    aboutImage: images.about,
    showEid: false,
    showPackages: true,
    showGallery: true,
    showExperience: true,
    primaryBookingHref: '/booking',
    serviceHref: (key: string) => `/booking?service=${key}`,
    location: null,
    branchName: null,
  }
}
function useBranch(): BranchCtx {
  return useContext(BranchContext) ?? defaultBranch()
}

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
function Navbar() {
  const { locale, t, toggleLocale } = useI18n()
  const branch = useBranch()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { label: t('nav.home'), id: 'top' },
    { label: t('nav.services'), id: 'services', href: '/services' },
    { label: t('nav.offers'), id: 'offers', href: '/offers' },
    { label: t('gallery.title'), id: 'gallery', href: '/gallery' },
    { label: t('reviews.title'), id: 'reviews' },
    { label: t('faq.title'), id: 'faq' },
    { label: t('nav.blog'), id: 'blog', href: '/blog' },
    { label: t('nav.contact'), id: 'contact', href: '/contact' },
  ]

  return (
    <>
      {/* Spacer for fixed nav */}
      <div className="h-0" />

      <nav className="fixed top-4 inset-x-4 sm:inset-x-6 lg:inset-x-10 z-50">
        <div className={`mx-auto max-w-6xl transition-all duration-700 rounded-2xl ${scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : ''}`}
          style={{
            background: scrolled ? 'rgba(8,8,12,0.7)' : 'rgba(8,8,12,0.4)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            border: `1px solid ${scrolled ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)'}`,
          }}>

          <div className="px-5 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative group">
              <img src="/logo.png" alt="Oilo Spa"
                className="h-12 w-auto transition-all duration-300 group-hover:brightness-125" />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                'href' in l && l.href ? (
                  <Link key={l.id} href={l.href}
                    className={`relative px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 rounded-xl hover:bg-white/[0.06] group ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[#C9A96E]">
                      {l.label}
                    </span>
                  </Link>
                ) : (
                  <button key={l.id} onClick={() => go(l.id)}
                    className={`relative px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 rounded-xl hover:bg-white/[0.06] group ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[#C9A96E]">
                      {l.label}
                    </span>
                  </button>
                )
              ))}

              <button onClick={toggleLocale}
                className="text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-white/[0.06]"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {t('nav.lang')}
              </button>

              <Link href={branch.primaryBookingHref}
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
              <button onClick={() => setOpen(!open)}
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
          {/* Edge glow */}
          <div className={`absolute top-0 bottom-0 w-[2px] ${locale === 'ar' ? 'left-0' : 'right-0'}`}
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.15) 30%, rgba(201,169,110,0.15) 70%, transparent)' }} />

          <div className="space-y-2">
            {links.map((l, i) => (
              'href' in l && l.href ? (
                <Link key={l.id} href={l.href} onClick={() => setOpen(false)}
                  className={`block w-full text-start text-base font-semibold px-5 py-4 rounded-2xl text-white/70 hover:text-[#C9A96E] hover:bg-white/[0.03] transition-all duration-300 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                  style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}>
                  {l.label}
                </Link>
              ) : (
                <button key={l.id} onClick={() => go(l.id)}
                  className={`block w-full text-start text-base font-semibold px-5 py-4 rounded-2xl text-white/70 hover:text-[#C9A96E] hover:bg-white/[0.03] transition-all duration-300 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                  style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}>
                  {l.label}
                </button>
              )
            ))}
          </div>

          <div className="mt-10 px-2">
            <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.2), transparent)' }} />
            <Link href={branch.primaryBookingHref} onClick={() => setOpen(false)}
              className="btn-primary block text-center py-4 text-sm tracking-wider uppercase rounded-2xl">
              {t('nav.booking')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════
function Hero() {
  const { locale, t } = useI18n()
  const branch = useBranch()
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 200) }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed still. Composed symmetrically with the visual interest at the
          left and right edges and a pool of shadow through the middle, so it
          survives both a wide desktop crop and a tall phone crop with the
          centred headline still readable. */}
      <img
        src="/services/nahda-hero-still.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Heavy gradient overlay — cinematic */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(to top, rgba(6,6,8,1) 0%, rgba(6,6,8,0.82) 25%, rgba(6,6,8,0.62) 50%, rgba(6,6,8,0.58) 75%, rgba(6,6,8,0.72) 100%)
        `
      }} />

      {/* Decorative: Gold glow orb */}
      <div className="glow-orb w-[400px] h-[400px] -bottom-[200px] left-1/2 -translate-x-1/2"
        style={{ background: 'rgba(201,169,110,0.08)' }} />

      {/* Content */}
      <div className="relative z-10 w-full py-28 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          {/* Animated badges */}
          <div className={`mb-8 flex flex-wrap items-center justify-center gap-2 transition-all duration-1000 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="badge text-[10px] sm:text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
              {branch.heroBadge
                ? (locale === 'ar' ? branch.heroBadge.ar : branch.heroBadge.en)
                : branch.branchName
                  ? (locale === 'ar' ? `سبا واسترخاء فاخر بالرياض · ${branch.branchName.ar}` : `Premium Wellness Spa · ${branch.branchName.en}`)
                  : (locale === 'ar' ? 'سبا واسترخاء فاخر في الرياض' : 'Premium Wellness Spa in Riyadh')}
            </span>
            <OpenNow />
          </div>

          {/* Main heading — BIG */}
          <h1 className={`transition-all duration-[1.4s] delay-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <span className={`block font-bold text-gold-gradient ${locale === 'ar' ? 'font-ar text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.08]' : 'font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.12] tracking-tight'}`}
              style={{ textWrap: 'balance' }}>
              {branch.heroTagline ? (locale === 'ar' ? branch.heroTagline.ar : branch.heroTagline.en) : t('hero.tagline')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`mt-6 sm:mt-8 text-sm sm:text-base md:text-lg max-w-xl mx-auto transition-all duration-[1.4s] delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${locale === 'ar' ? 'font-display italic' : 'font-ar'}`}
            style={{ color: 'rgba(245,239,228,0.7)' }}>
            {branch.heroSubtitle ? (locale === 'ar' ? branch.heroSubtitle.ar : branch.heroSubtitle.en) : t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className={`mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 transition-all duration-[1.4s] delay-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href={branch.primaryBookingHref}
              className="btn-primary w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-4 text-xs sm:text-sm tracking-[0.12em] uppercase">
              {t('hero.cta')}
            </Link>
            <a href={`tel:${branch.location?.phone ?? '0556733851'}`}
              className={`group inline-flex items-center gap-2.5 text-xs sm:text-sm tracking-[0.14em] uppercase transition-colors duration-300 hover:text-[#C9A96E] ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
              style={{ color: 'rgba(245,239,228,0.72)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="border-b border-[#C9A96E]/0 group-hover:border-[#C9A96E]/60 pb-0.5 transition-colors">
                {t('hero.call')} <span dir="ltr">{branch.location?.phone ?? '0556733851'}</span>
              </span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block transition-all duration-1000 delay-[1.5s] ${show ? 'opacity-50' : 'opacity-0'}`}>
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-[#C9A96E] animate-float" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// SCROLL REVEAL HOOK
// ═══════════════════════════════════════════
function useRevealAll() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const children = el.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }) },
      { threshold: 0.1 }
    )
    children.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])
  return ref
}

// ═══════════════════════════════════════════
// SECTION HEADER — big, bold, gradient
// ═══════════════════════════════════════════
function SectionHeader({ title, subtitle, locale, gold = false, eyebrow }: { title: string; subtitle: string; locale: string; gold?: boolean; eyebrow?: string }) {
  return (
    <div className="text-center mb-10 sm:mb-16 md:mb-20">
      <div className="reveal mb-6">
        <OrnamentDivider className="justify-center" />
      </div>
      {eyebrow && (
        <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-4 reveal ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
          style={{ color: '#C9A96E' }}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-bold mb-5 reveal reveal-delay-1 ${gold ? 'text-gold-gradient' : 'heading-warm'} ${locale === 'ar' ? 'font-ar text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight'}`} style={{ textWrap: 'balance' }}>
        {title}
      </h2>
      <p className={`text-sm sm:text-base md:text-[17px] tracking-wider reveal reveal-delay-2 max-w-xl mx-auto ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
        style={{ color: 'rgba(245,239,228,0.5)' }}>
        {subtitle}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════
// (About section removed per request)

// ═══════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════
const serviceImages: Record<string, string> = {
  'oilo-massage': images.oiloMassage,
  'swedish-60': images.swedish,
  'hot-stone': images.hotStone,
  'thai-60': images.thai,
  'shiatsu': images.shiatsu,
  'royal-bath': images.royalBath,
  'dead-sea-bath': images.deadSeaBath,
  'classic-bath': images.classicBath,
  'mani-pedi': images.maniPedi,
  'pedi': '/services/nahda-pedi.webp',
  'facial': images.facial,
  'jacuzzi': images.jacuzzi,
  'royal-package': images.candles,
  'vip-package': images.royalBath,
  'swedish-40': images.swedish,
  'thai-40': images.thai,
  'offer-massage-pedi': images.maniPedi,
  'foot-crack-care': '/services/nahda-foot-crack-care.webp',
}

// Branch context used by the single-page hub.
function nahdaCtx(): BranchCtx {
  return {
    services: nahdaServicesAsServices, categories: nahdaCategoriesTabs,
    serviceImages: nahdaServiceImages, aboutImage: nahdaAboutImage,
    showEid: false, showPackages: false, showGallery: false, showExperience: false,
    primaryBookingHref: '/booking',
    serviceHref: (key: string) => `/booking?service=${key}`,
    location: { ...nahdaLocation },
    branchName: { ar: 'Oilo Spa', en: 'Oilo Spa' },
    heroBadge: { ar: 'سبا واسترخاء فاخر بالرياض · فرع النهضة', en: 'Premium Wellness Spa · Al Nahda' },
    heroTagline: { ar: 'استرخاء وعافية باحترافية في الرياض', en: 'Professional Relaxation & Wellness in Riyadh' },
    heroSubtitle: { ar: 'جلسات مساج واسترخاء وحمام مغربي وعناية، على يد معالجين محترفين مؤهلين في بيئة راقية ونظيفة.', en: 'Massage, Moroccan bath and grooming by qualified professional therapists in a refined, hygienic setting.' },
    servicesSubtitle: { ar: 'جلسات استرخاء وعناية احترافية', en: 'Professional relaxation & wellness treatments' },
  }
}
export const BRANCH_CTX: Record<BranchId, () => BranchCtx> = {
  'al-nahda': nahdaCtx,
}

function ServiceCard({ variants, locale, t }: { variants: Service[]; locale: 'ar' | 'en'; t: (k: string) => string }) {
  const branch = useBranch()
  const [activeIdx, setActiveIdx] = useState(0)
  const s = variants[activeIdx]
  const img = branch.serviceImages[s.key] || images.massage
  const hasVariants = variants.length > 1
  const bookHref = branch.serviceHref(s.key, s.nameAr, s.nameEn)

  return (
    <div className="glass-card group relative overflow-hidden block">
      <Link href={bookHref} className="block">
        <div className="relative h-52 sm:h-56 overflow-hidden rounded-t-[23px]">
          <img src={img} alt={locale === 'ar' ? s.nameAr : s.nameEn} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(6,6,8,1) 0%, rgba(6,6,8,0.4) 50%, rgba(0,0,0,0.1) 100%)'
          }} />
          <div className="absolute bottom-0 inset-x-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
          {!hasVariants && s.duration && (
            <div className="absolute top-4 start-4">
              <span className="badge backdrop-blur-xl" style={{ background: 'rgba(6,6,8,0.5)' }}>
                {locale === 'ar' ? s.duration : s.durationEn || s.duration}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 md:p-7">
        <h3 className={`text-lg font-bold mb-4 text-warm ${locale === 'ar' ? 'font-ar' : 'font-display text-xl'}`}>
          {hasVariants && s.variantGroupNameAr
            ? (locale === 'ar' ? s.variantGroupNameAr : s.variantGroupNameEn)
            : (locale === 'ar' ? s.nameAr : s.nameEn)}
        </h3>
        <p className={`text-sm leading-[1.9] mb-6 ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.6)' }}>
          {locale === 'ar' ? s.descriptionAr : s.descriptionEn}
        </p>

        {hasVariants && (
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: '#C9A96E' }}>
              {s.variantGroup
                ? (locale === 'ar' ? 'اختر النوع' : 'Choose Type')
                : (locale === 'ar' ? 'اختر المدة' : 'Choose Duration')}
            </p>
            <div className="inline-flex gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {variants.map((v, i) => (
                <button key={v.key} type="button" onClick={() => setActiveIdx(i)}
                  className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-300 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                  style={{
                    background: i === activeIdx ? 'linear-gradient(135deg, #C9A96E, #dbb97a)' : 'transparent',
                    color: i === activeIdx ? '#060608' : 'rgba(255,255,255,0.55)',
                  }}>
                  {locale === 'ar'
                    ? (v.variantLabelAr ?? v.duration)
                    : (v.variantLabelEn ?? v.durationEn ?? v.duration)}
                </button>
              ))}
            </div>
          </div>
        )}

        {s.includes && (
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: '#C9A96E' }}>{t('services.includes')}</p>
            <ul className="space-y-2">
              {s.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(245,239,228,0.55)' }}>
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
                  {locale === 'ar' ? item.ar : item.en}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4" style={{ borderTop: '1px solid rgba(245,239,228,0.08)' }}>
          {s.price != null && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(245,239,228,0.4)' }}>
                {t('services.from')}
              </span>
              <span className="text-xl font-bold font-display inline-flex items-baseline gap-2" dir="ltr" style={{ color: '#C9A96E' }}>
                {s.originalPrice != null && (
                  <span className="text-sm font-normal line-through" style={{ color: 'rgba(245,239,228,0.4)' }}>
                    {s.originalPrice}
                  </span>
                )}
                {s.price} <span className="text-xs font-normal" style={{ color: 'rgba(245,239,228,0.5)' }}>{t('services.sar')}</span>
              </span>
            </div>
          )}
          <Link href={bookHref}
            className="text-xs tracking-[0.1em] uppercase transition-all duration-300 hover:text-[#C9A96E] inline-flex items-center gap-1.5"
            style={{ color: 'rgba(245,239,228,0.65)' }}>
            {t('services.book')}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={locale === 'ar' ? 'rotate-180' : ''}>
              <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Services() {
  const { locale, t } = useI18n()
  const sectionRef = useRevealAll()
  type Filter = ServiceCategory | 'all'
  const [active, setActive] = useState<Filter>('all')
  const [fading, setFading] = useState(false)
  const branch = useBranch()
  const tabs: { key: Filter; ar: string; en: string }[] = [
    { key: 'all', ar: 'الكل', en: 'All' },
    ...branch.categories.map(c => ({ key: c.key as Filter, ar: c.nameAr, en: c.nameEn })),
  ]
  const filtered = active === 'all' ? branch.services : branch.services.filter(s => s.category === active)
  const grouped: Service[][] = groupServices(filtered)
  const switchTab = (k: Filter) => {
    if (k === active) return
    setFading(true)
    setTimeout(() => { setActive(k); setFading(false) }, 250)
  }

  return (
    <section id="services" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-a bg-mesh">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeader title={t('services.title')} subtitle={branch.servicesSubtitle ? (locale === 'ar' ? branch.servicesSubtitle.ar : branch.servicesSubtitle.en) : t('services.subtitle')} locale={locale} />

        {/* Tabs — glass pill bar */}
        <div className="flex gap-2 mb-14 md:mb-20 overflow-x-auto pb-2 justify-start md:justify-center reveal reveal-delay-2">
          <div className="inline-flex gap-1.5 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => switchTab(tab.key)}
                className={`whitespace-nowrap px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-400 shrink-0 rounded-xl ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                style={{
                  background: active === tab.key ? 'linear-gradient(135deg, #C9A96E, #dbb97a)' : 'transparent',
                  color: active === tab.key ? '#060608' : 'rgba(255,255,255,0.4)',
                  boxShadow: active === tab.key ? '0 4px 24px rgba(201,169,110,0.3)' : 'none',
                }}>
                {locale === 'ar' ? tab.ar : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 transition-all duration-400 ${fading ? 'opacity-0 scale-[0.96]' : 'opacity-100 scale-100'}`}>
          {grouped.map(group => (
            <ServiceCard key={group[0].nameEn} variants={group} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// PACKAGES — featured Royal + VIP
// ═══════════════════════════════════════════
function Packages() {
  const { locale, t } = useI18n()
  const sectionRef = useRevealAll()
  const isAr = locale === 'ar'
  const branch = useBranch()
  const packages = branch.services.filter(s => s.category === 'package')
  if (packages.length === 0) return null
  const sar = t('services.sar')

  return (
    <section id="packages" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b overflow-hidden">
      <div className="glow-orb w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(201,169,110,0.05)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeader
          title={isAr ? 'باقاتنا الفاخرة' : 'Our Signature Packages'}
          subtitle={isAr ? 'تجربة متكاملة من المساج والحمام والعناية بسعر باقة' : 'A complete journey of massage, bath, and care at a package price'}
          locale={locale}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
          {packages.map((p, idx) => {
            const isRoyal = p.key === 'royal-package' || p.key === 'pkg-royal'
            const img = branch.serviceImages[p.key]
            const savings = p.originalPrice && p.price ? p.originalPrice - p.price : 0
            return (
              <div key={p.key}
                className={`reveal reveal-delay-${idx + 2} relative rounded-3xl overflow-hidden gradient-border group`}
                style={{ background: 'rgba(10,10,13,0.6)' }}>
                {/* Image header */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={img} alt={isAr ? p.nameAr : p.nameEn} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.4) 50%, rgba(6,6,8,0.15) 100%)'
                  }} />
                  {/* Tier badge */}
                  <div className="absolute top-5 start-5">
                    <span className="badge !bg-black/40 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                      {isRoyal
                        ? (isAr ? 'الأفخم' : 'Most Premium')
                        : (isAr ? 'الأكثر طلبًا' : 'Most Popular')}
                    </span>
                  </div>
                  {/* Savings ribbon */}
                  {savings > 0 && (
                    <div className="absolute top-5 end-5">
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase" dir="ltr"
                        style={{ background: 'rgba(201,169,110,0.95)', color: '#0a0a0d' }}>
                        {isAr ? `وفر ${savings} ${sar}` : `Save ${savings} ${sar}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-7 sm:p-9 md:p-10">
                  <h3 className={`text-2xl md:text-3xl font-bold text-white mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
                    {isAr ? p.nameAr : p.nameEn}
                  </h3>
                  <p className={`text-sm md:text-[15px] leading-[1.9] mb-7 ${isAr ? 'font-ar' : 'font-body'}`}
                    style={{ color: 'rgba(245,239,228,0.6)' }}>
                    {isAr ? p.descriptionAr : p.descriptionEn}
                  </p>

                  {/* Includes */}
                  {p.includes && (
                    <div className="mb-8">
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
                        {t('services.includes')}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                        {p.includes.map((item, i) => (
                          <li key={i} className={`flex items-start gap-2.5 text-sm ${isAr ? 'font-ar' : 'font-body'}`}
                            style={{ color: 'rgba(245,239,228,0.7)' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-[3px] shrink-0">
                              <path d="M3 7.5L5.5 10L11 4" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{isAr ? item.ar : item.en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-4 pt-6"
                    style={{ borderTop: '1px solid rgba(245,239,228,0.08)' }}>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(245,239,228,0.4)' }}>
                        {isAr ? 'سعر الباقة' : 'Package Price'}
                      </span>
                      <span className="text-2xl md:text-3xl font-bold font-display inline-flex items-baseline gap-2.5" dir="ltr"
                        style={{ color: '#C9A96E' }}>
                        {p.originalPrice && (
                          <span className="text-base font-normal line-through" style={{ color: 'rgba(245,239,228,0.4)' }}>
                            {p.originalPrice}
                          </span>
                        )}
                        {p.price} <span className="text-xs font-normal" style={{ color: 'rgba(245,239,228,0.5)' }}>{sar}</span>
                      </span>
                    </div>
                    <Link href={branch.serviceHref(p.key, p.nameAr, p.nameEn)}
                      className="btn-primary px-6 py-3.5 text-[11px] tracking-[0.1em] uppercase whitespace-nowrap">
                      {isAr ? 'احجز الباقة' : 'Book Package'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════
function Experience() {
  const { locale, t } = useI18n()
  const sectionRef = useRevealAll()
  const scrollRef = useRef<HTMLDivElement>(null)
  const items = [
    { ar: 'زيوت طبيعية', en: 'Natural Oils', img: images.oils },
    { ar: 'شموع عطرية', en: 'Aromatic Candles', img: images.candles },
    { ar: 'أجواء فاخرة', en: 'Luxury Interior', img: images.interior },
    { ar: 'أحجار ساخنة', en: 'Hot Stones', img: images.stones },
    { ar: 'جلسات استرخاء', en: 'Relaxation Sessions', img: images.therapy },
    { ar: 'مساج احترافي', en: 'Professional Massage', img: images.massage },
  ]

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] top-1/2 start-0 -translate-y-1/2"
        style={{ background: 'rgba(201,169,110,0.04)', animationDelay: '2s' }} />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          {/* Header with nav arrows */}
          <div className="flex items-end justify-between mb-14 md:mb-20">
            <div>
              <p className={`text-[11px] font-semibold tracking-[0.28em] uppercase mb-4 reveal ${locale === 'ar' ? 'font-ar' : 'font-body'}`}
                style={{ color: '#C9A96E' }}>
                {locale === 'ar' ? 'التجربة' : 'The Experience'}
              </p>
              <h2 className={`font-bold mb-4 reveal reveal-delay-1 heading-warm ${locale === 'ar' ? 'font-ar text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight'}`} style={{ textWrap: 'balance' }}>
                {t('experience.title')}
              </h2>
              <p className={`text-sm sm:text-base tracking-wider reveal reveal-delay-2 ${locale === 'ar' ? 'font-body' : 'font-body'}`} style={{ color: 'rgba(245,239,228,0.5)' }}>
                {t('experience.subtitle')}
              </p>
            </div>
            {/* Arrow buttons */}
            <div className="hidden md:flex items-center gap-3 reveal reveal-delay-2">
              <button onClick={() => scroll(locale === 'ar' ? 'right' : 'left')}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.06]"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9L11 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => scroll(locale === 'ar' ? 'left' : 'right')}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
                style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4L12 9L7 14" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        <div ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-5 sm:px-6 lg:px-10 scroll-smooth reveal reveal-delay-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          {items.map((item, i) => (
            <div key={i} className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] aspect-[3/4] overflow-hidden rounded-3xl cursor-pointer snap-start">
              <img src={item.img} alt={item.en} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.2) 45%, rgba(0,0,0,0.05) 100%)'
              }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'radial-gradient(ellipse at center bottom, rgba(201,169,110,0.1), transparent 70%)'
              }} />
              <div className="absolute inset-0 rounded-3xl border border-white/[0.04] group-hover:border-[rgba(201,169,110,0.2)] transition-colors duration-500" />
              {/* Number */}
              <div className="absolute top-5 start-5">
                <span className="text-gold-gradient text-4xl font-display font-bold opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                  0{i + 1}
                </span>
              </div>
              {/* Text */}
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-7 transform transition-transform duration-500 group-hover:translate-y-[-6px]">
                <p className={`text-lg md:text-xl font-bold text-white mb-1 ${locale === 'ar' ? 'font-ar' : 'font-body'}`}>
                  {locale === 'ar' ? item.ar : item.en}
                </p>
                <p className={`text-sm transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${locale === 'ar' ? 'font-body' : 'font-ar'}`} style={{ color: '#C9A96E' }}>
                  {locale === 'ar' ? item.en : item.ar}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// LOCATION + HOURS
// ═══════════════════════════════════════════
function Location() {
  const { locale, t } = useI18n()
  const sectionRef = useRevealAll()
  const branch = useBranch()
  const loc = branch.location
  const mapsLink = loc?.mapsLink ?? 'https://maps.app.goo.gl/KBZRUChFREDnamw67'
  const phone = loc?.phone ?? '0556733851'
  const whatsapp = loc?.whatsapp ?? '966556733851'
  const waText = encodeURIComponent(locale === 'ar'
    ? 'السلام عليكم، تواصلت من موقع أويلو سبا، أود الاستفسار عن الخدمات والحجز.'
    : 'Hello, I\'m reaching out from the Oilo Spa website and would like to ask about services and booking.')
  const address = loc ? (locale === 'ar' ? loc.addressAr : loc.addressEn) : t('location.address')
  const dailyLabel = loc ? (locale === 'ar' ? loc.hoursDailyLabelAr : loc.hoursDailyLabelEn) : t('hours.daily')
  const dailyTime = loc ? loc.hoursDailyTime : t('hours.daily.time')
  const fridayLabel = loc ? (locale === 'ar' ? loc.hoursFridayLabelAr : loc.hoursFridayLabelEn) : t('hours.friday')
  const fridayTime = loc ? loc.hoursFridayTime : t('hours.friday.time')

  return (
    <section id="location" ref={sectionRef} className="relative py-16 sm:py-24 md:py-36 lg:py-44 bg-section-b">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeader title={t('location.title')} subtitle={t('location.subtitle') || ''} locale={locale} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Map */}
          <a href={mapsLink} target="_blank" rel="noopener noreferrer"
            className="reveal reveal-delay-2 relative block aspect-[4/3] overflow-hidden rounded-3xl group cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {loc?.geo ? (
              <iframe
                src={`https://maps.google.com/maps?q=${loc.geo.lat},${loc.geo.lng}&z=16&hl=${locale === 'ar' ? 'ar' : 'en'}&output=embed`}
                width="100%" height="100%" allowFullScreen loading="lazy"
                title={branch.branchName ? (locale === 'ar' ? `أويلو سبا · ${branch.branchName.ar}` : `Oilo Spa · ${branch.branchName.en}`) : 'Oilo Spa'}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: 'grayscale(1) brightness(0.55) contrast(1.15)' }} />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.10), #0a0a0d 75%)' }}>
                <svg className="w-10 h-10" fill="none" stroke="#C9A96E" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              <span className="btn-primary text-xs tracking-wider uppercase px-6 py-3">
                {locale === 'ar' ? 'افتح الخريطة' : 'Open Map'}
              </span>
            </div>
          </a>

          {/* Info */}
          <div className="flex flex-col justify-center gap-8 lg:gap-10 reveal reveal-delay-3">
            <div>
              <span className="badge mb-5">
                {locale === 'ar' ? 'العنوان' : 'Address'}
              </span>
              <p className={`text-base md:text-lg leading-[2] mb-6 ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>
                {address}
              </p>
              <a href={mapsLink}
                target="_blank" rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 text-xs tracking-wider uppercase px-6 py-3">
                {t('location.view')}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div>
              <span className="badge mb-5">
                {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`tel:${phone}`}
                  className="btn-ghost inline-flex items-center justify-center gap-2 text-xs tracking-wider uppercase px-6 py-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span dir="ltr">{phone}</span>
                </a>
                <a href={`https://wa.me/${whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center justify-center gap-2 text-xs tracking-wider uppercase px-6 py-3">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
                </a>
              </div>
            </div>

            <div>
              <span className="badge mb-5">
                {t('hours.title')}
              </span>
              <div className="glass-card rounded-2xl overflow-hidden !transform-none !shadow-none">
                <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-sm font-semibold text-white">{dailyLabel}</span>
                  <span className="text-sm font-medium" style={{ color: '#C9A96E' }}>{dailyTime}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <span className="text-sm font-semibold text-white">{fridayLabel}</span>
                  <span className="text-sm font-medium" style={{ color: '#C9A96E' }}>{fridayTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer() {
  const { locale, t } = useI18n()
  const branch = useBranch()
  return (
    <footer className="relative bg-section-a">
      <div className="section-divider" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-block mb-10 group">
            <img src="/logo.png" alt="Oilo Spa" className="h-16 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
          </Link>

          {/* Footer nav */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
            <Link href="/blog" className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${locale === 'ar' ? 'font-ar' : 'font-body uppercase'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('nav.blog')}
            </Link>
            <Link href={branch.primaryBookingHref} className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${locale === 'ar' ? 'font-ar' : 'font-body uppercase'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('nav.booking')}
            </Link>
            <Link href="/contact" className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${locale === 'ar' ? 'font-ar' : 'font-body uppercase'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
            </Link>
            <Link href="/gift" className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${locale === 'ar' ? 'font-ar' : 'font-body uppercase'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('gift.title')}
            </Link>
            <Link href="/membership" className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${locale === 'ar' ? 'font-ar' : 'font-body uppercase'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t('member.title')}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-10 max-w-2xl">
            <Link href="/services/massage-riyadh" className={`text-[11px] transition-all hover:text-[#C9A96E] ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.25)' }}>
              {locale === 'ar' ? 'مساج رجال الرياض' : 'Men\'s Massage Riyadh'}
            </Link>
            <Link href="/services/moroccan-bath-riyadh" className={`text-[11px] transition-all hover:text-[#C9A96E] ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.25)' }}>
              {locale === 'ar' ? 'حمام مغربي الرياض' : 'Moroccan Bath Riyadh'}
            </Link>
            <Link href="/services/manicure-pedicure-riyadh" className={`text-[11px] transition-all hover:text-[#C9A96E] ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.25)' }}>
              {locale === 'ar' ? 'بديكير ومنكير الرياض' : 'Mani & Pedi Riyadh'}
            </Link>
            <Link href="/services/spa-riyadh" className={`text-[11px] transition-all hover:text-[#C9A96E] ${locale === 'ar' ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.25)' }}>
              {locale === 'ar' ? 'سبا واسترخاء الرياض' : 'Wellness Spa Riyadh'}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <a href={`tel:${branch.location?.phone ?? '0556733851'}`}
              className="flex items-center gap-2.5 text-sm font-medium transition-all hover:text-[#C9A96E] px-5 py-3 rounded-2xl hover:bg-white/[0.03]"
              style={{ color: 'rgba(255,255,255,0.4)' }} dir="ltr">
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {branch.location?.phone ?? '0556733851'}
            </a>
            <span className="hidden sm:block w-px h-4" style={{ background: 'rgba(201,169,110,0.15)' }} />
            <a href="mailto:oilonahda@gmail.com"
              className="flex items-center gap-2.5 text-sm font-medium transition-all hover:text-[#C9A96E] px-5 py-3 rounded-2xl hover:bg-white/[0.03]"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              oilonahda@gmail.com
            </a>
          </div>

          {/* Social media */}
          <div className="flex items-center gap-4 mb-14">
            <a href="https://www.instagram.com/oilo_sa/" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://x.com/Oilo_sa" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@oilo_sa" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.2v-3.46a4.85 4.85 0 01-3.77-1.48V6.69h3.77z"/>
              </svg>
            </a>
            <a href={waLink(branch.location?.whatsapp ?? '966556733851')} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          <div className="w-full max-w-sm h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent)' }} />

          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>&copy; 2026 Oilo Spa. {t('footer.rights')}.</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
            {locale === 'ar' ? 'تصميم وتطوير' : 'Designed & Built by'}{' '}
            <a href="https://eclipseagency.net" target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-[#C9A96E]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Eclipse Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════
// WHATSAPP FLOATING BUTTON
// ═══════════════════════════════════════════
function WhatsAppButton() {
  const branch = useBranch()

  // Pinned with the PHYSICAL `right`, not the logical `end`: under RTL — which
  // is the default locale here — `end` resolves to the left edge, which is why
  // this sat on the wrong side. Desktop only: on mobile the sticky bottom bar
  // already carries its own WhatsApp button and the two would overlap.
  return (
    <a
      href={waLink(branch.location?.whatsapp ?? '966556733851')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-5 z-40 hidden md:flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_6px_30px_rgba(37,211,102,0.5)] md:bottom-8 md:right-8"
      style={{ background: '#25D366' }}
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white">
        <path d="M16.004 2.003c-7.732 0-14.001 6.268-14.001 14 0 2.468.655 4.876 1.898 6.989L2 30l7.188-1.884A13.94 13.94 0 0016.004 30c7.732 0 14-6.268 14-13.997 0-7.732-6.268-14-14-14zm0 25.594a11.58 11.58 0 01-5.905-1.617l-.424-.252-4.392 1.152 1.173-4.287-.276-.44a11.56 11.56 0 01-1.778-6.15c0-6.408 5.214-11.622 11.622-11.622 6.408 0 11.622 5.214 11.622 11.622-.02 6.408-5.234 11.594-11.642 11.594zm6.372-8.696c-.348-.176-2.068-1.02-2.388-1.136-.32-.116-.552-.176-.784.176s-.9 1.136-1.104 1.372c-.204.232-.404.264-.752.088-.348-.176-1.468-.54-2.796-1.724-1.032-.92-1.728-2.056-1.932-2.404-.204-.348-.02-.536.152-.708.156-.156.348-.404.52-.608.176-.204.232-.348.348-.58.116-.232.06-.436-.028-.608-.088-.176-.784-1.892-1.076-2.588-.284-.68-.572-.588-.784-.6-.204-.008-.436-.012-.668-.012s-.608.088-.928.436c-.32.348-1.22 1.192-1.22 2.908s1.248 3.376 1.424 3.608c.176.232 2.46 3.752 5.96 5.264.832.36 1.484.576 1.992.736.836.264 1.596.228 2.2.14.672-.1 2.068-.844 2.36-1.66.292-.816.292-1.516.204-1.66-.088-.148-.32-.232-.668-.408z"/>
      </svg>
    </a>
  )
}

// ═══════════════════════════════════════════
// STICKY MOBILE CTA
// ═══════════════════════════════════════════
function StickyCTA() {
  const { t } = useI18n()
  const branch = useBranch()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className={`fixed bottom-4 inset-x-4 z-30 md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="flex items-center gap-2">
        <Link href={branch.primaryBookingHref}
          className="btn-primary flex-1 text-center py-4 text-sm tracking-wider uppercase rounded-2xl shadow-[0_10px_40px_rgba(201,169,110,0.3)]">
          {t('hero.cta')}
        </Link>
        <a
          href={waLink(branch.location?.whatsapp ?? '966556733851')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(37,211,102,0.3)]"
          style={{ background: '#25D366' }}>
          <svg viewBox="0 0 32 32" className="w-6 h-6" fill="white">
            <path d="M16.004 2.003c-7.732 0-14.001 6.268-14.001 14 0 2.468.655 4.876 1.898 6.989L2 30l7.188-1.884A13.94 13.94 0 0016.004 30c7.732 0 14-6.268 14-13.997 0-7.732-6.268-14-14-14zm0 25.594a11.58 11.58 0 01-5.905-1.617l-.424-.252-4.392 1.152 1.173-4.287-.276-.44a11.56 11.56 0 01-1.778-6.15c0-6.408 5.214-11.622 11.622-11.622 6.408 0 11.622 5.214 11.622 11.622-.02 6.408-5.234 11.594-11.642 11.594z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// PAGE — standalone Al Nahda branch page.
// ═══════════════════════════════════════════
export default function BranchHome() {
  const branch = useBranch()
  return (
    <div className="noise">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd('ar')) }} />
      <Navbar />
      <main>
        <Hero />
        <OfferBanners />
        <Services />
        {branch.showPackages && <Packages />}
        {branch.showGallery && <Gallery />}
        {branch.showExperience && <Experience />}
        <WhatToExpect />
        <Reviews />
        <GiftMembership />
        <FAQ />
        <ContactSection whatsapp={branch.location?.whatsapp ?? '966556733851'} />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyCTA />
    </div>
  )
}
