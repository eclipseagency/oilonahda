'use client'

// Shared footer for the standalone pages. Mirrors the homepage footer but with
// route links only, and Al Nahda contact details.
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { branches } from '@/lib/branches'

const nahda = branches['al-nahda']
const CONTACT_EMAIL = 'oilonahda@gmail.com'
const waLink = `https://wa.me/${nahda.whatsapp}?text=${encodeURIComponent('السلام عليكم، تواصلت من موقع أويلو سبا فرع النهضة')}`

const primaryLinks: { key: string; href: string }[] = [
  { key: 'nav.services', href: '/services' },
  { key: 'nav.offers', href: '/offers' },
  { key: 'nav.blog', href: '/blog' },
  { key: 'nav.contact', href: '/contact' },
  { key: 'nav.booking', href: '/booking' },
]

const seoLinks: { href: string; ar: string; en: string }[] = [
  { href: '/services/massage-riyadh', ar: 'مساج رجال الرياض', en: "Men's Massage Riyadh" },
  { href: '/services/moroccan-bath-riyadh', ar: 'حمام مغربي الرياض', en: 'Moroccan Bath Riyadh' },
  { href: '/services/hijama-riyadh', ar: 'حجامة الرياض', en: 'Hijama Riyadh' },
  { href: '/services/manicure-pedicure-riyadh', ar: 'بديكير ومنكير الرياض', en: 'Mani & Pedi Riyadh' },
  { href: '/services/spa-riyadh', ar: 'سبا واسترخاء الرياض', en: 'Wellness Spa Riyadh' },
]

export default function SiteFooter() {
  const { locale, t } = useI18n()
  const isAr = locale === 'ar'

  return (
    <footer className="relative" style={{ background: '#080808', borderTop: '1px solid rgba(201,169,110,0.08)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-block mb-8 group">
            <img src="/logo.png" alt="Oilo Spa" className="h-14 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
          </Link>
          <p className={`text-[11px] font-bold tracking-[0.3em] uppercase mb-10 ${isAr ? 'font-ar' : ''}`} style={{ color: 'rgba(201,169,110,0.7)' }}>
            {isAr ? 'فرع النهضة · الرياض' : 'Al Nahda · Riyadh'}
          </p>

          {/* Primary nav */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
            {primaryLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-[12px] font-medium tracking-wider transition-all hover:text-[#C9A96E] px-3 py-1.5 rounded-xl hover:bg-white/[0.03] ${isAr ? 'font-ar' : 'font-body uppercase'}`}
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {t(l.key)}
              </Link>
            ))}
          </div>

          {/* SEO service links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-10 max-w-2xl">
            {seoLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-[11px] transition-all hover:text-[#C9A96E] ${isAr ? 'font-ar' : 'font-body'}`}
                style={{ color: 'rgba(255,255,255,0.28)' }}>
                {isAr ? l.ar : l.en}
              </Link>
            ))}
          </div>

          {/* Contact row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <a href={`tel:${nahda.phone}`} dir="ltr"
              className="flex items-center gap-2.5 text-sm font-medium transition-all hover:text-[#C9A96E] px-5 py-3 rounded-2xl hover:bg-white/[0.03]"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              <svg className="w-4 h-4 opacity-60 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {nahda.phone}
            </a>
            <span className="hidden sm:block w-px h-4" style={{ background: 'rgba(201,169,110,0.15)' }} />
            <a href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2.5 text-sm font-medium transition-all hover:text-[#C9A96E] px-5 py-3 rounded-2xl hover:bg-white/[0.03]"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: '"DM Sans", sans-serif' }}>
              <svg className="w-4 h-4 opacity-60 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4 mb-12">
            {[
              { href: 'https://www.instagram.com/oilo_sa/', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: 'https://x.com/Oilo_sa', label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { href: 'https://www.tiktok.com/@oilo_sa', label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.2v-3.46a4.85 4.85 0 01-3.77-1.48V6.69h3.77z' },
              { href: waLink, label: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.463 3.488A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/30"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="w-full max-w-sm h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent)' }} />
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>&copy; 2026 Oilo Spa. {t('footer.rights')}.</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
            {isAr ? 'تصميم وتطوير' : 'Designed & Built by'}{' '}
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
