'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { type ServiceCategory, type Service } from '@/lib/services'
import { nahdaServicesAsServices, nahdaCategoriesTabs, nahdaServiceImages } from '@/lib/nahdaBranchData'
import { branches } from '@/lib/branches'
import { trackEvent } from '@/lib/track'

// ─── Types ───
interface TimeSlot {
  time: string
  available: boolean
  booked: number
}

// ─── Step Indicator ───
function StepIndicator({ current, total }: { current: number; total: number }) {
  const { locale } = useI18n()
  const steps = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12 md:mb-16">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2 sm:gap-3">
          <div
            className={`
              w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm font-bold
              transition-all duration-500
              ${step === current
                ? 'text-[#060608] shadow-[0_0_30px_rgba(201,169,110,0.35)]'
                : step < current
                  ? 'bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/25'
                  : 'bg-white/[0.02] text-white/20 border border-white/[0.05]'
              }
            `}
            style={step === current ? { background: 'linear-gradient(135deg, #C9A96E, #dbb97a)' } : {}}
          >
            {step < current ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ fontFamily: locale === 'ar' ? '"IBM Plex Sans Arabic", sans-serif' : '"DM Sans", sans-serif' }}>
                {step}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`
                w-8 sm:w-16 h-[2px] rounded-full transition-all duration-500
                ${step < current ? 'bg-[#C9A96E]/25' : 'bg-white/[0.04]'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Calendar ───
function Calendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string | null
  onSelectDate: (date: string) => void
}) {
  const { locale } = useI18n()
  const [viewDate, setViewDate] = useState(() => new Date())
  const isAr = locale === 'ar'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const monthNames = isAr
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = isAr
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1)
    const nowMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    if (prev >= nowMonth) setViewDate(prev)
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const canGoPrev = () => {
    const prev = new Date(year, month - 1, 1)
    const nowMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return prev >= nowMonth
  }

  const formatDate = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="max-w-md mx-auto">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
            ${canGoPrev()
              ? 'text-white/70 hover:text-[#C9A96E] hover:bg-white/[0.04]'
              : 'text-[#333] cursor-not-allowed'
            }`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d={isAr ? 'M7 4L12 9L7 14' : 'M11 4L6 9L11 14'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span
          className="text-white text-lg font-semibold tracking-wide"
          style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic", sans-serif' : '"Cormorant Garamond", serif' }}
        >
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:text-[#C9A96E] hover:bg-white/[0.04] transition-all duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d={isAr ? 'M11 4L6 9L11 14' : 'M7 4L12 9L7 14'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] text-[#555] font-medium py-2"
            style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic", sans-serif' : '"DM Sans", sans-serif' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />

          const cellDate = new Date(year, month, day)
          cellDate.setHours(0, 0, 0, 0)
          const isPast = cellDate < today
          const dateStr = formatDate(cellDate)
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === formatDate(today)

          return (
            <button
              key={dateStr}
              disabled={isPast}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative h-11 flex items-center justify-center text-sm rounded-xl font-medium
                transition-all duration-300
                ${isPast
                  ? 'text-white/10 cursor-not-allowed'
                  : isSelected
                    ? 'text-[#060608] font-bold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
                    : 'text-white/60 hover:bg-white/[0.04] hover:text-[#C9A96E]'
                }
              `}
              style={isSelected ? { background: 'linear-gradient(135deg, #C9A96E, #dbb97a)' } : {}}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A96E]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Loading Spinner ───
function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  )
}

// ─── Service card with optional duration toggle ───
function BookingServiceCard({
  variants,
  isAr,
  selectedKeys,
  onSelect,
  imageMap,
  fallbackImg,
}: {
  variants: Service[]
  isAr: boolean
  selectedKeys: Set<string>
  onSelect: (variant: Service, prevVariantKey?: string) => void
  imageMap: Record<string, string>
  fallbackImg: string
}) {
  const hasVariants = variants.length > 1
  const selectedSibling = variants.find((v) => selectedKeys.has(v.key))
  const selectedIdx = selectedSibling ? variants.indexOf(selectedSibling) : -1
  const [localActiveIdx, setLocalActiveIdx] = useState(0)
  const activeIdx = selectedIdx >= 0 ? selectedIdx : Math.min(localActiveIdx, variants.length - 1)

  const service = variants[activeIdx]
  const isSelected = selectedKeys.has(service.key)
  const img = imageMap[service.key] || fallbackImg

  const toggleSelection = () => {
    if (isSelected) {
      onSelect(service)
    } else if (selectedSibling) {
      onSelect(service, selectedSibling.key)
    } else {
      onSelect(service)
    }
  }

  const switchVariant = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (i === activeIdx) return
    const prev = variants[activeIdx]
    const next = variants[i]
    setLocalActiveIdx(i)
    if (selectedKeys.has(prev.key)) {
      onSelect(next, prev.key)
    }
  }

  return (
    <div
      onClick={toggleSelection}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleSelection()
        }
      }}
      className={`
        group relative text-start rounded-3xl transition-all duration-400 overflow-hidden
        border backdrop-blur-sm cursor-pointer
        ${isSelected
          ? 'border-[#C9A96E]/40 shadow-[0_0_40px_rgba(201,169,110,0.1)]'
          : 'border-white/[0.05] hover:border-white/[0.1] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
        }
      `}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={img} alt={isAr ? service.nameAr : service.nameEn} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(6,6,8,0.9) 0%, rgba(6,6,8,0.3) 50%, rgba(6,6,8,0.1) 100%)'
        }} />
        {!hasVariants && (service.duration || service.durationEn) && (
          <span className="absolute top-3 end-3 badge z-10">
            {isAr ? service.duration : (service.durationEn || service.duration)}
          </span>
        )}
        {isSelected && (
          <div className="absolute top-3 start-3 z-10">
            <div className="w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center shadow-[0_0_12px_rgba(201,169,110,0.3)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3
            className="text-white font-semibold text-base"
            style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic", sans-serif' : '"Cormorant Garamond", serif' }}
          >
            {isAr ? service.nameAr : service.nameEn}
          </h3>
          {!hasVariants && service.duration && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-md whitespace-nowrap"
              style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>
              {isAr ? service.duration : (service.durationEn || service.duration)}
            </span>
          )}
        </div>

        <p
          className="text-[#888] text-sm leading-relaxed"
          style={{ lineHeight: isAr ? '1.8' : '1.7' }}
        >
          {isAr ? service.descriptionAr : service.descriptionEn}
        </p>

        {hasVariants && (
          <div className="mt-4">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#C9A96E' }}>
              {isAr ? 'اختر المدة' : 'Choose Duration'}
            </p>
            <div className="inline-flex gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {variants.map((v, i) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={(e) => switchVariant(i, e)}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 ${isAr ? 'font-ar' : ''}`}
                  style={{
                    background: i === activeIdx ? 'linear-gradient(135deg, #C9A96E, #dbb97a)' : 'transparent',
                    color: i === activeIdx ? '#060608' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  {isAr ? v.duration : v.durationEn || v.duration}
                </button>
              ))}
            </div>
          </div>
        )}

        {service.price && (
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-[#C9A96E] font-bold text-base inline-flex items-baseline gap-2" style={{ fontFamily: '"DM Sans", sans-serif', direction: 'ltr' }}>
              {service.originalPrice && (
                <span className="text-xs font-normal line-through text-[#666]">{service.originalPrice}</span>
              )}
              {service.price} <span className="text-xs font-normal text-[#888]">{isAr ? 'ر.س' : 'SAR'}</span>
            </span>
            {isSelected && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-1 rounded-lg">
                {isAr ? 'تم الاختيار' : 'Selected'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Booking Content (uses useSearchParams) ───
function BookingContent() {
  const { locale, t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAr = locale === 'ar'

  // Standalone Al Nahda booking flow.
  const branch = 'al-nahda' as const
  const catalog: Service[] = nahdaServicesAsServices
  const cats = nahdaCategoriesTabs
  // Al Nahda uses its real interior shots (/services/nahda-*.webp).
  const branchImages = nahdaServiceImages
  const branchFallbackImg = nahdaServiceImages['dry-massage']

  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingReference, setBookingReference] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [error, setError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  // Attribution payload — captured once on mount from the URL query string and
  // document.referrer, then sent with the booking submit so /admin can show
  // where the lead came from.
  const [attribution, setAttribution] = useState<{
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    referer?: string
  }>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    setAttribution({
      utm_source: sp.get('utm_source') || undefined,
      utm_medium: sp.get('utm_medium') || undefined,
      utm_campaign: sp.get('utm_campaign') || undefined,
      utm_term: sp.get('utm_term') || undefined,
      utm_content: sp.get('utm_content') || undefined,
      referer: document.referrer || undefined,
    })
    trackEvent('view_booking_page', {
      utm_source: sp.get('utm_source') || undefined,
      utm_campaign: sp.get('utm_campaign') || undefined,
      referer: document.referrer || undefined,
    })
  }, [])

  // Funnel events: fire once per step entry (2 = picked service, 3 = picked
  // datetime, 4 = reviewing). Step 5 is success and is tracked by the
  // booking_submit + conversion events in the submit handler.
  useEffect(() => {
    if (step === 2) trackEvent('select_service', { service_count: selectedServices.length })
    else if (step === 3) trackEvent('select_datetime', { date: selectedDate || undefined, time: selectedTime || undefined })
    else if (step === 4) trackEvent('review_booking')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Pre-select service from URL param
  useEffect(() => {
    const serviceKey = searchParams.get('service')
    if (serviceKey) {
      const found = catalog.find((s) => s.key === serviceKey)
      if (found) {
        setSelectedServices([found])
        setSelectedCategory(found.category)
      }
    }
  }, [searchParams, catalog])

  // Fetch slots when date is selected
  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSlots([])
    setSelectedTime(null)
    try {
      const res = await fetch(`/api/booking/slots?date=${date}`)
      const data = await res.json()
      if (data.slots) {
        setSlots(data.slots)
      }
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    fetchSlots(date)
  }

  const handleSubmit = async () => {
    if (selectedServices.length === 0 || !selectedDate || !selectedTime || !name.trim() || !phone) return

    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          service_key: selectedServices[0].key,
          service_keys: selectedServices.map(s => s.key),
          branch,
          date: selectedDate,
          time_slot: selectedTime,
          consent,
          website,
          ...attribution,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Conversion tracking — fire on every site successful booking.
        // All three are no-ops if the corresponding pixel isn't loaded.
        const total = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)
        const w = window as unknown as {
          ttq?: { track: (event: string, params?: unknown) => void }
          fbq?: (action: string, event: string, params?: unknown) => void
          gtag?: (action: string, event: string, params?: unknown) => void
          snaptr?: (action: string, event: string, params?: unknown) => void
        }
        try {
          w.ttq?.track('Purchase', { value: total, currency: 'SAR' })
          w.ttq?.track('CompleteRegistration')
          w.fbq?.('track', 'Lead', { content_name: 'Booking', currency: 'SAR', value: total })
          w.fbq?.('track', 'Schedule')
          w.gtag?.('event', 'booking_submit', { currency: 'SAR', value: total })
          // Snap advanced matching: re-init with the customer's phone so Snap
          // can match this booking to the Snapchatter who saw the ad. Without
          // an identifier the conversion scores "Poor" match quality and
          // attributes ~0. Snap auto-hashes (SHA-256); pass E.164, not a hash.
          const snapPixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim()
          if (snapPixelId) {
            w.snaptr?.('init', snapPixelId, {
              user_phone_number: '+966' + phone.trim().replace(/^0/, ''),
            })
          }
          // Dedup against the server-side Conversions API event (same booking):
          // Snap matches the pixel's transaction_id (purchase) / client_dedup_id
          // (non-purchase) to the CAPI event_id within a 48h window.
          w.snaptr?.('track', 'PURCHASE', { price: total, currency: 'SAR', transaction_id: data.booking_id })
          w.snaptr?.('track', 'SIGN_UP', { client_dedup_id: data.booking_id })
          // Al Nahda has its own separate Google Ads account, so its booking
          // conversion must report to the Al Nahda account.
          const gadsConv = process.env.NEXT_PUBLIC_GADS_CONVERSION_NAHDA?.trim()
          if (gadsConv) {
            w.gtag?.('event', 'conversion', {
              send_to: gadsConv,
              value: total,
              currency: 'SAR',
            })
          }
        } catch {
          /* never block booking on tracking */
        }
        setBookingReference(data.reference || '')
        setBookingSuccess(true)
        setStep(5)
      } else {
        setError(data.error || (isAr ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again'))
      }
    } catch {
      setError(isAr ? 'حدث خطأ في الاتصال' : 'Connection error')
    } finally {
      setSubmitting(false)
    }
  }

  const validatePhone = (value: string) => {
    setPhone(value)
    if (value && !/^05\d{0,8}$/.test(value)) {
      setPhoneError(isAr ? 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Must start with 05 and be 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedServices.length > 0
      case 2: return selectedDate !== null
      case 3: return selectedTime !== null
      case 4: return name.trim().length >= 2 && /^05\d{8}$/.test(phone) && consent
      default: return false
    }
  }

  const filteredServices = selectedCategory === 'all'
    ? catalog
    : catalog.filter((s) => s.category === selectedCategory)

  // Group same-name services into a single card with duration variants
  const groupedServices: Service[][] = (() => {
    const out: Service[][] = []
    const seen = new Map<string, number>()
    for (const s of filteredServices) {
      const key = s.nameEn
      if (seen.has(key)) {
        out[seen.get(key)!].push(s)
      } else {
        seen.set(key, out.length)
        out.push([s])
      }
    }
    return out
  })()
  const selectedKeys = new Set(selectedServices.map((s) => s.key))

  const handleVariantSelect = (variant: Service, prevVariantKey?: string) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s.key === variant.key)) {
        return prev.filter((s) => s.key !== variant.key)
      }
      if (prevVariantKey) {
        return prev.map((s) => (s.key === prevVariantKey ? variant : s))
      }
      return [...prev, variant]
    })
  }

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const dayNames = isAr
      ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthNames = isAr
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${dayNames[d.getDay()]}${isAr ? '، ' : ', '}${d.getDate()} ${monthNames[d.getMonth()]}`
  }

  // Convert 24h time to display format
  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    if (isAr) {
      if (h === 0) return `12:${String(m).padStart(2, '0')} ص`
      if (h < 12) return `${h}:${String(m).padStart(2, '0')} ص`
      if (h === 12) return `12:${String(m).padStart(2, '0')} م`
      return `${h - 12}:${String(m).padStart(2, '0')} م`
    }
    if (h === 0) return `12:${String(m).padStart(2, '0')} AM`
    if (h < 12) return `${h}:${String(m).padStart(2, '0')} AM`
    if (h === 12) return `12:${String(m).padStart(2, '0')} PM`
    return `${h - 12}:${String(m).padStart(2, '0')} PM`
  }

  // ─── Step 5: Success ───
  if (bookingSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 animate-[fadeInUp_0.6s_ease-out]">
        {/* Check animation */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#C9A96E]/20 animate-[ping_1.5s_ease-in-out_1]" />
          <div className="absolute inset-0 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
            <svg
              width="36" height="36" viewBox="0 0 36 36" fill="none"
              className="animate-[fadeScaleIn_0.5s_ease-out_0.3s_both]"
            >
              <path
                d="M8 18L15 25L28 11"
                stroke="#C9A96E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[drawCheck_0.6s_ease-out_0.5s_both]"
                style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
              />
            </svg>
          </div>
        </div>

        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gold-gradient mb-4 ${isAr ? 'font-ar' : 'font-display'}`}
        >
          {t('booking.success.title')}
        </h2>
        <p
          className="mb-10 max-w-sm"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {t('booking.success.text')}
        </p>

        {/* Booking summary */}
        <div className="w-full max-w-sm glass-card rounded-3xl p-6 mb-6 !transform-none !shadow-none"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          {bookingReference && (
            <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
              <div className="text-[#555] text-xs tracking-[0.15em] uppercase mb-1">{isAr ? 'رقم الحجز' : 'Reference'}</div>
              <div className="text-[#C9A96E] font-mono text-xl font-semibold tracking-[0.2em]">{bookingReference}</div>
            </div>
          )}
          <div className="space-y-4">
            {[
              { label: isAr ? 'الخدمات' : 'Services', value: selectedServices.map(s => isAr ? s.nameAr : s.nameEn).join('، ') },
              { label: isAr ? 'الإجمالي' : 'Total', value: `${selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)} ${isAr ? 'ر.س' : 'SAR'}` },
              { label: isAr ? 'التاريخ' : 'Date', value: selectedDate ? formatDisplayDate(selectedDate) : '' },
              { label: isAr ? 'الوقت' : 'Time', value: selectedTime ? formatTime(selectedTime) : '' },
              { label: isAr ? 'الاسم' : 'Name', value: name },
              { label: isAr ? 'الجوال' : 'Phone', value: phone },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-[#555] text-sm">{item.label}</span>
                <span className="text-white text-sm font-medium text-start max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#555] mb-6 max-w-sm">
          {isAr ? 'سنرسل تأكيد الحجز عبر واتساب خلال دقائق.' : 'We will send a WhatsApp confirmation within minutes.'}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={(() => {
                if (!selectedDate || !selectedTime) return '#'
                const titles = selectedServices.map(s => isAr ? s.nameAr : s.nameEn).join(', ')
                // Google Calendar wants UTC YYYYMMDDTHHMMSSZ. Riyadh = UTC+3.
                const [yy, mm, dd] = selectedDate.split('-').map(Number)
                const [h, m] = selectedTime.split(':').map(Number)
                const startUtc = new Date(Date.UTC(yy, mm - 1, dd, h - 3, m))
                const endUtc = new Date(startUtc.getTime() + 60 * 60 * 1000)
                const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
                const ab = branches['al-nahda']
                const locName = `Oilo Spa — ${ab.nameEn}`
                const params = new URLSearchParams({
                  action: 'TEMPLATE',
                  text: `${titles} — Oilo Spa`,
                  dates: `${fmt(startUtc)}/${fmt(endUtc)}`,
                  details: `Reference: ${bookingReference}\n${locName}\n${ab.addressEn}\n${ab.mapsLink}`,
                  location: `${locName}, ${ab.addressEn}`,
                })
                return `https://calendar.google.com/calendar/render?${params.toString()}`
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3 text-sm tracking-[0.05em] rounded-full border border-[rgba(201,169,110,0.3)] text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors text-center"
            >
              {isAr ? 'تقويم Google' : 'Google Calendar'}
            </a>
            <button
              onClick={() => {
                if (!selectedDate || !selectedTime) return
                const titles = selectedServices.map(s => isAr ? s.nameAr : s.nameEn).join(', ')
                const dt = selectedDate.replace(/-/g, '')
                const [h, m] = selectedTime.split(':')
                const start = `${dt}T${h}${m}00`
                const endH = String((parseInt(h) + 1) % 24).padStart(2, '0')
                const end = `${dt}T${endH}${m}00`
                const ab = branches['al-nahda']
                const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Oilo Spa//EN', 'BEGIN:VEVENT',
                  `UID:${bookingReference}@oilospa.com`, `DTSTAMP:${start}Z`, `DTSTART;TZID=Asia/Riyadh:${start}`,
                  `DTEND;TZID=Asia/Riyadh:${end}`, `SUMMARY:${titles} — Oilo Spa`,
                  `LOCATION:Oilo Spa — ${ab.nameEn}, ${ab.addressEn}`, `DESCRIPTION:Reference ${bookingReference}`,
                  'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
                const blob = new Blob([ics], { type: 'text/calendar' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `oilo-${bookingReference}.ics`; a.click()
                URL.revokeObjectURL(url)
              }}
              className="flex-1 px-5 py-3 text-sm tracking-[0.05em] rounded-full border border-[rgba(201,169,110,0.3)] text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
            >
              {isAr ? 'تنزيل .ics' : 'Apple / .ics'}
            </button>
          </div>
          <Link
            href={`/booking/manage?ref=${bookingReference}`}
            className="text-center text-xs text-[#888] hover:text-[#C9A96E] transition-colors py-2"
          >
            {isAr ? 'إدارة الحجز (إلغاء أو تعديل)' : 'Manage booking (cancel or reschedule)'}
          </Link>
          <button
            onClick={() => router.push('/')}
            className="btn-primary px-6 py-3 text-sm tracking-[0.05em]"
          >
            {t('booking.success.back')}
          </button>
        </div>
      </div>
    )
  }

  const activeBranch = branches[branch]

  return (
    <>
      {/* Branch indicator (static). */}
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
          style={{ border: '1px solid rgba(201,169,110,0.25)', color: '#C9A96E', background: 'rgba(6,6,8,0.5)' }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.75c-2.35 0-4.25 1.9-4.25 4.25 0 3.1 4.25 8.25 4.25 8.25s4.25-5.15 4.25-8.25c0-2.35-1.9-4.25-4.25-4.25zm0 5.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{isAr ? activeBranch.nameAr : activeBranch.nameEn}</span>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} total={4} />

      {/* Step title */}
      <div className="text-center mb-10 md:mb-14">
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gold-gradient mb-2 ${isAr ? 'font-ar' : 'font-display'}`}
        >
          {step === 1 && t('booking.select.service')}
          {step === 2 && t('booking.select.date')}
          {step === 3 && t('booking.select.time')}
          {step === 4 && t('booking.your.info')}
        </h2>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {/* ─── Step 1: Select Service ─── */}
        {step === 1 && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">
            {/* Category tabs — glass bar */}
            <div className="flex justify-center mb-10 md:mb-12">
              <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300
                    ${selectedCategory === 'all'
                      ? 'text-[#060608] shadow-[0_4px_24px_rgba(201,169,110,0.3)]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                    }`}
                  style={selectedCategory === 'all' ? { background: 'linear-gradient(135deg, #C9A96E, #dbb97a)' } : {}}
                >
                  {t('cat.all')}
                </button>
                {cats.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300
                      ${selectedCategory === cat.key
                        ? 'text-[#060608] shadow-[0_4px_24px_rgba(201,169,110,0.3)]'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                      }`}
                    style={selectedCategory === cat.key ? { background: 'linear-gradient(135deg, #C9A96E, #dbb97a)' } : {}}
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Service cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedServices.map((group) => (
                <BookingServiceCard
                  key={group[0].nameEn}
                  variants={group}
                  isAr={isAr}
                  selectedKeys={selectedKeys}
                  onSelect={handleVariantSelect}
                  imageMap={branchImages}
                  fallbackImg={branchFallbackImg}
                />
              ))}
            </div>

            {/* Sticky bottom bar when services selected */}
            {selectedServices.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 z-50 animate-[fadeInUp_0.3s_ease-out]"
                style={{ background: 'linear-gradient(to top, rgba(6,6,8,0.98) 60%, rgba(6,6,8,0.0))' }}>
                <div className="max-w-3xl mx-auto px-6 pb-6 pt-10">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white text-sm font-medium">
                        {selectedServices.length} {isAr ? (selectedServices.length === 1 ? 'خدمة' : 'خدمات') : (selectedServices.length === 1 ? 'service' : 'services')}
                      </span>
                      <span className="text-[#C9A96E] font-bold text-lg" style={{ fontFamily: '"DM Sans", sans-serif', direction: 'ltr' }}>
                        {selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)} <span className="text-xs font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="btn-primary px-8 py-3.5 text-sm font-bold tracking-[0.04em] flex items-center gap-2"
                    >
                      {isAr ? 'التالي' : 'Continue'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={isAr ? 'rotate-180' : ''}>
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 2: Select Date ─── */}
        {step === 2 && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">
            <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
          </div>
        )}

        {/* ─── Step 3: Select Time ─── */}
        {step === 3 && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">
            {loadingSlots ? (
              <Spinner />
            ) : slots.length === 0 ? (
              <p className="text-center text-[#555] py-12">
                {t('booking.no.slots')}
              </p>
            ) : (
              <>
                {/* Selected date display */}
                {selectedDate && (
                  <p className="text-center text-[#C9A96E] text-sm mb-6">
                    {formatDisplayDate(selectedDate)}
                  </p>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 max-w-2xl mx-auto">
                  {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => { setSelectedTime(slot.time) }}
                        className={`
                          relative py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200
                          ${!slot.available
                            ? 'bg-white/[0.01] text-[#333] cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-[#C9A96E] text-[#0a0a0a] shadow-[0_0_16px_rgba(201,169,110,0.2)]'
                              : 'bg-white/[0.03] text-white/70 border border-white/[0.06] hover:border-[#C9A96E]/30 hover:text-[#C9A96E]'
                          }
                        `}
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        {formatTime(slot.time)}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── Step 4: Your Info ─── */}
        {step === 4 && (
          <div className="animate-[fadeInUp_0.4s_ease-out] max-w-md mx-auto">
            {/* Booking summary mini */}
            <div className="glass-card rounded-3xl p-6 mb-8 !transform-none !shadow-none"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-[#555] text-sm">{isAr ? 'الخدمات' : 'Services'}</span>
                  <span className="text-white text-sm text-start max-w-[60%]">{selectedServices.map(s => isAr ? s.nameAr : s.nameEn).join('، ')}</span>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="flex justify-between">
                  <span className="text-[#555] text-sm">{isAr ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-[#C9A96E] text-sm font-bold" style={{ fontFamily: '"DM Sans", sans-serif' }}>{selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)} {isAr ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="flex justify-between">
                  <span className="text-[#555] text-sm">{isAr ? 'التاريخ' : 'Date'}</span>
                  <span className="text-white text-sm">{selectedDate ? formatDisplayDate(selectedDate) : ''}</span>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="flex justify-between">
                  <span className="text-[#555] text-sm">{isAr ? 'الوقت' : 'Time'}</span>
                  <span className="text-white text-sm">{selectedTime ? formatTime(selectedTime) : ''}</span>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {t('booking.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('booking.name.placeholder')}
                  className="
                    w-full bg-white/[0.02] border border-white/[0.06]
                    rounded-2xl px-5 py-4 text-white placeholder-white/20
                    focus:border-[#C9A96E]/40 focus:outline-none focus:bg-white/[0.04]
                    focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]
                    transition-all duration-400
                  "
                  style={{ direction: isAr ? 'rtl' : 'ltr' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {t('booking.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('booking.phone.placeholder')}
                  dir="ltr"
                  className={`
                    w-full bg-white/[0.02] border rounded-2xl px-5 py-4
                    text-white placeholder-white/20 focus:outline-none
                    transition-all duration-400
                    ${phoneError
                      ? 'border-red-500/30 focus:border-red-500/50'
                      : 'border-white/[0.06] focus:border-[#C9A96E]/40 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]'
                    }
                  `}
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                />
                {phoneError && (
                  <p className="text-red-400/80 text-xs mt-2">{phoneError}</p>
                )}
              </div>

              {/* Honeypot — hidden from users, bots will fill */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              {/* PDPL consent */}
              <label className="flex items-start gap-3 cursor-pointer select-none pt-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#C9A96E] cursor-pointer flex-shrink-0"
                />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isAr
                    ? 'أوافق على معالجة بياناتي (الاسم ورقم الجوال) لتأكيد الحجز والتواصل، وفقًا لنظام حماية البيانات الشخصية في المملكة العربية السعودية.'
                    : 'I consent to processing my data (name and phone) to confirm and contact me about this booking, in accordance with Saudi Arabia’s Personal Data Protection Law (PDPL).'}
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
                <p className="text-red-400/90 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Navigation buttons ─── */}
      <div className="flex items-center justify-between mt-12 md:mt-16 pt-8" style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-[#888] hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/[0.03]"
          >
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={isAr ? 'rotate-180' : ''}
            >
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isAr ? 'رجوع' : 'Back'}
          </button>
        ) : (
          <Link href="/"
            className="text-[#888] hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/[0.03]"
          >
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={isAr ? 'rotate-180' : ''}
            >
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
        )}

        {step < 4 ? (
          <button
            disabled={!canProceed()}
            onClick={() => setStep(step + 1)}
            className={`
              px-8 sm:px-10 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] transition-all duration-400
              flex items-center gap-2
              ${canProceed()
                ? 'btn-primary'
                : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'
              }
            `}
          >
            {isAr ? 'التالي' : 'Next'}
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={isAr ? 'rotate-180' : ''}
            >
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <button
            disabled={!canProceed() || submitting}
            onClick={handleSubmit}
            className={`
              px-8 sm:px-10 py-4 rounded-2xl font-bold text-sm tracking-[0.06em] transition-all duration-400
              ${canProceed() && !submitting
                ? 'btn-primary'
                : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'
              }
            `}
          >
            {submitting ? t('booking.submitting') : t('booking.confirm')}
          </button>
        )}
      </div>
    </>
  )
}

// ─── Page wrapper with Suspense for useSearchParams ───
export default function BookingPage() {
  const { t, locale, toggleLocale } = useI18n()
  const isAr = locale === 'ar'

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      {/* Ambient glow orbs */}
      <div className="glow-orb w-[500px] h-[500px] -top-[200px] start-1/4"
        style={{ background: 'rgba(201,169,110,0.05)' }} />
      <div className="glow-orb w-[300px] h-[300px] bottom-[20%] end-0"
        style={{ background: 'rgba(201,169,110,0.04)', animationDelay: '4s' }} />

      {/* Language toggle */}
      <button
        onClick={toggleLocale}
        aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 px-4 py-2 rounded-full border text-xs font-bold tracking-[0.12em] uppercase transition-all duration-300 hover:bg-[rgba(201,169,110,0.08)]"
        style={{
          borderColor: 'rgba(201,169,110,0.4)',
          color: '#C9A96E',
          fontFamily: '"DM Sans", sans-serif',
          background: 'rgba(6,6,8,0.7)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {isAr ? 'EN' : 'AR'}
      </button>

      {/* Header */}
      <div className="relative z-10 pt-10 sm:pt-16 pb-8 text-center px-4">
        <Link href="/" className="inline-block mb-10 group">
          <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
        </Link>
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}
        >
          {t('booking.title')}
        </h1>
        <p
          className={`text-sm ${isAr ? 'font-body' : 'font-ar'}`}
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {t('booking.subtitle')}
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pb-28">
        <Suspense fallback={<Spinner />}>
          <BookingContent />
        </Suspense>

        <section className="mt-20 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 text-center sm:p-8 md:p-10">
          <p className="mb-3 text-xs font-bold tracking-[0.35em] uppercase text-[#C9A96E]">
            {isAr ? 'حجز سبا في الرياض' : 'Spa Booking in Riyadh'}
          </p>
          <h2 className={`text-2xl font-bold text-white sm:text-3xl ${isAr ? 'font-ar' : 'font-display'}`}>
            {isAr ? 'احجز مساج أو حمام مغربي' : 'Book massage or hammam at Oilo Spa Al Nahda'}
          </h2>
          <p className={`mx-auto mt-4 max-w-3xl leading-8 text-white/60 ${isAr ? 'font-body' : 'font-ar'}`}>
            {isAr
              ? 'احجز موعدك بسهولة، ثم حدد الخدمة والوقت المناسب. صفحة الحجز تدعم المساج، الحمام المغربي، البديكير، حمام الزيت، العناية بالبشرة، وباقات الاسترخاء، مع تأكيد سريع عبر رقم الجوال.'
              : 'Book in Riyadh, then select the service and appointment time. Booking supports massage, Moroccan hammam, pedicure, oil bath, facials, and spa packages with quick phone confirmation.'}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="rounded-full border border-[#C9A96E]/40 px-6 py-3 text-sm font-bold text-[#C9A96E]">
              {isAr ? 'حجز' : 'Book'}
            </Link>
          </div>
        </section>
      </div>

      {/* Keyframe styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </main>
  )
}
