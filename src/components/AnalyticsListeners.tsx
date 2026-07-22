'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/track'

// Document-wide click listener for outbound / "exit" links, mounted once in the
// root layout so we don't have to instrument each <a> in the codebase.
// - fires the existing gtag events for WhatsApp + phone (GA4/Ads), and
// - persists every exit click (WhatsApp, phone, email, location, social/sites) to the
//   DB via /api/track/click so the admin can count off-site conversions.
// This is the standalone Al Nahda site, so every click is branch 'al-nahda'.

type ClickType = 'whatsapp' | 'phone' | 'email' | 'location' | 'social'

function classify(href: string): ClickType | null {
  if (!href) return null
  if (href.includes('wa.me') || href.startsWith('whatsapp:')) return 'whatsapp'
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('mailto:')) return 'email'
  if (/(?:maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl|google\.[a-z.]+\/maps)/i.test(href)) return 'location'
  if (/(?:instagram\.com|x\.com|twitter\.com|tiktok\.com|snapchat\.com|facebook\.com|fb\.com)/i.test(href)) return 'social'
  try {
    const url = new URL(href, window.location.href)
    // Keep generic website exits in the existing `social` database bucket. The
    // production table constrains types to these five stable categories.
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== window.location.origin) return 'social'
  } catch {
    return null
  }
  return null
}

export default function AnalyticsListeners() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      const type = classify(href)
      if (!type) return

      // GA4 / Ads — unchanged behaviour for WhatsApp + phone.
      if (type === 'whatsapp') trackEvent('whatsapp_click', { link_url: href })
      else if (type === 'phone') trackEvent('phone_click', { link_url: href })

      // Persist to the DB so /admin can report exit-link clicks. sendBeacon
      // survives the page navigating away to the app (tel: / wa.me / maps).
      try {
        const payload = JSON.stringify({ type, href, path: window.location.pathname, branch: 'al-nahda' })
        const queued = navigator.sendBeacon?.('/api/track/click', payload) ?? false
        if (!queued) {
          fetch('/api/track/click', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } })
        }
      } catch {
        /* never block the click on tracking */
      }
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])

  return null
}
