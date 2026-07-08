'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

function getRiyadhOpen() {
  const nowUtc = new Date()
  const riyadh = new Date(nowUtc.getTime() + (3 * 60 - nowUtc.getTimezoneOffset()) * 60000)
  const day = riyadh.getUTCDay()
  const hour = riyadh.getUTCHours()
  const minutes = riyadh.getUTCMinutes()
  const time = hour + minutes / 60

  // day: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const close = 4 // 4:00 AM next day
  const openHour = day === 5 ? 13.5 : 10 // Friday 1:30 PM, all other days 10:00 AM

  const isOpen = time >= openHour || time < close
  const closesAt = '4:00 AM'

  return { isOpen, closesAt }
}

export default function OpenNow({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n()
  const [state, setState] = useState<{ isOpen: boolean; closesAt: string } | null>(null)

  useEffect(() => {
    const update = () => setState(getRiyadhOpen())
    const first = window.setTimeout(update, 0)
    const i = window.setInterval(update, 60000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(i)
    }
  }, [])

  if (!state) return null

  const dotColor = state.isOpen ? '#22c55e' : '#888'
  const label = state.isOpen ? t('hero.open') : t('hero.closed')

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase ${locale === 'ar' ? 'font-ar' : 'font-body'} ${className}`}
      style={{
        background: 'rgba(6,6,8,0.6)',
        border: `1px solid ${state.isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
        color: state.isOpen ? '#22c55e' : 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: dotColor, boxShadow: state.isOpen ? '0 0 8px rgba(34,197,94,0.6)' : 'none' }}
      />
      {label}
      {state.isOpen && (
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
          · {t('hero.closes')} {state.closesAt}
        </span>
      )}
    </span>
  )
}
