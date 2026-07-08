'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/track'

// Document-wide click listener for outbound WhatsApp + tel: links.
// Mounted once in the root layout so we don't have to instrument each
// individual <a> in the codebase.
export default function AnalyticsListeners() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      if (href.includes('wa.me') || href.startsWith('whatsapp:')) {
        trackEvent('whatsapp_click', { link_url: href })
      } else if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href })
      }
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])

  return null
}
