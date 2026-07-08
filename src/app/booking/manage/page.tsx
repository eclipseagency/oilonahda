'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'

interface BookingSummary {
  reference: string
  name: string
  phone: string
  service_key: string
  serviceEn: string
  serviceAr: string
  date: string
  time_slot: string
  status: string
  minutesUntil: number
}

interface TimeSlot { time: string; available: boolean; booked: number; past?: boolean }

function ManageContent() {
  const { locale } = useI18n()
  const isAr = locale === 'ar'
  const search = useSearchParams()

  const [reference, setReference] = useState((search.get('ref') || '').toUpperCase())
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [booking, setBooking] = useState<BookingSummary | null>(null)
  const [mode, setMode] = useState<'idle' | 'reschedule'>('idle')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const validatePhone = (v: string) => {
    setPhone(v)
    setPhoneError(v && !/^05\d{0,8}$/.test(v) ? (isAr ? 'يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Must start with 05 and be 10 digits') : '')
  }

  const post = async (action: 'lookup' | 'cancel' | 'reschedule', extra: Record<string, unknown> = {}) => {
    setLoading(true); setError(''); setInfo('')
    try {
      const res = await fetch('/api/booking/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reference, phone, ...extra }),
      })
      const data = await res.json()
      if (data.success) {
        setBooking(data.booking)
        if (action === 'cancel') {
          setInfo(isAr ? 'تم إلغاء الحجز.' : 'Your booking has been cancelled.')
          setMode('idle')
        } else if (action === 'reschedule') {
          setInfo(isAr ? 'تم تعديل الموعد بنجاح.' : 'Your appointment has been rescheduled.')
          setMode('idle')
        }
      } else {
        setError(data.error || (isAr ? 'حدث خطأ' : 'Something went wrong'))
      }
    } catch {
      setError(isAr ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = useCallback(async (date: string) => {
    setSlotsLoading(true); setSlots([]); setNewTime('')
    try {
      const res = await fetch(`/api/booking/slots?date=${date}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch {
      setSlots([])
    } finally { setSlotsLoading(false) }
  }, [])

  useEffect(() => {
    if (mode === 'reschedule' && newDate) fetchSlots(newDate)
  }, [mode, newDate, fetchSlots])

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    const ampm = isAr ? (h < 12 ? 'ص' : 'م') : (h < 12 ? 'AM' : 'PM')
    const hh = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
  }

  const minDate = new Date().toISOString().slice(0, 10)
  const maxDate = (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().slice(0, 10) })()

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#060608' }}>
      <div className="glow-orb w-[400px] h-[400px] -top-[150px] start-1/4" style={{ background: 'rgba(201,169,110,0.05)' }} />

      <div className="relative z-10 pt-12 sm:pt-16 pb-8 text-center px-4">
        <Link href="/" className="inline-block mb-8 group">
          <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
        </Link>
        <h1 className={`text-3xl sm:text-4xl font-bold text-gold-gradient mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
          {isAr ? 'إدارة الحجز' : 'Manage Booking'}
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {isAr ? 'أدخل رقم الحجز ورقم الجوال للإلغاء أو التعديل' : 'Enter your reference and phone to cancel or reschedule'}
        </p>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 pb-20">
        {!booking && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 !transform-none !shadow-none" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isAr ? 'رقم الحجز' : 'Reference'}
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase().slice(0, 8))}
                  placeholder="A1B2C3D4"
                  dir="ltr"
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:border-[#C9A96E]/40 focus:outline-none focus:bg-white/[0.04] transition-all duration-400 font-mono tracking-[0.2em]"
                />
              </div>
              <div>
                <label className="block text-sm mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isAr ? 'رقم الجوال' : 'Phone'}
                </label>
                <input
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none transition-all duration-400 ${
                    phoneError ? 'border-red-500/30 focus:border-red-500/50' : 'border-white/[0.06] focus:border-[#C9A96E]/40 focus:bg-white/[0.04]'
                  }`}
                />
                {phoneError && <p className="text-red-400/80 text-xs mt-2">{phoneError}</p>}
              </div>
              <button
                disabled={loading || !/^[0-9A-F]{8}$/.test(reference) || !/^05\d{8}$/.test(phone)}
                onClick={() => post('lookup')}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-[0.06em] transition-all duration-400 ${
                  !loading && /^[0-9A-F]{8}$/.test(reference) && /^05\d{8}$/.test(phone)
                    ? 'btn-primary'
                    : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]'
                }`}
              >
                {loading ? (isAr ? 'جارٍ البحث…' : 'Searching…') : (isAr ? 'بحث' : 'Find Booking')}
              </button>
              {error && <div className="p-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl"><p className="text-red-400/90 text-sm text-center">{error}</p></div>}
            </div>
          </div>
        )}

        {booking && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 !transform-none !shadow-none" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
                <div className="text-[#555] text-xs tracking-[0.15em] uppercase mb-1">{isAr ? 'رقم الحجز' : 'Reference'}</div>
                <div className="text-[#C9A96E] font-mono text-xl font-semibold tracking-[0.2em]">{booking.reference}</div>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                    booking.status === 'cancelled' ? 'bg-red-500/15 text-red-400/90' :
                    booking.status === 'completed' ? 'bg-green-500/15 text-green-400/90' :
                    'bg-[#C9A96E]/15 text-[#C9A96E]'
                  }`}>{booking.status}</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  [isAr ? 'الاسم' : 'Name', booking.name],
                  [isAr ? 'الجوال' : 'Phone', booking.phone],
                  [isAr ? 'الخدمة' : 'Service', isAr ? booking.serviceAr : booking.serviceEn],
                  [isAr ? 'التاريخ' : 'Date', booking.date],
                  [isAr ? 'الوقت' : 'Time', formatTime(booking.time_slot)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-[#555]">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {info && <div className="p-4 bg-green-500/[0.06] border border-green-500/15 rounded-xl"><p className="text-green-400/90 text-sm text-center">{info}</p></div>}
            {error && <div className="p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl"><p className="text-red-400/90 text-sm text-center">{error}</p></div>}

            {mode === 'idle' && booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <div className="space-y-3">
                {booking.minutesUntil < 120 ? (
                  <p className="text-center text-xs text-[#888] py-3">
                    {isAr ? 'لا يمكن تعديل الحجز قبل أقل من ساعتين من الموعد. للمساعدة اتصل بنا على 0556733851.' : 'Bookings cannot be modified less than 2 hours before the appointment. Call us at 0556733851 for help.'}
                  </p>
                ) : (
                  <>
                    <button
                      onClick={() => { setMode('reschedule'); setNewDate(''); setNewTime('') }}
                      className="w-full py-4 rounded-2xl font-bold text-sm tracking-[0.06em] btn-primary"
                    >
                      {isAr ? 'تعديل الموعد' : 'Reschedule'}
                    </button>
                    <button
                      onClick={() => { if (confirm(isAr ? 'تأكيد إلغاء الحجز؟' : 'Confirm cancellation?')) post('cancel') }}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl font-bold text-sm tracking-[0.06em] border border-red-500/25 text-red-400/90 hover:bg-red-500/[0.06] transition-colors"
                    >
                      {loading ? '…' : (isAr ? 'إلغاء الحجز' : 'Cancel Booking')}
                    </button>
                  </>
                )}
              </div>
            )}

            {mode === 'reschedule' && (
              <div className="glass-card rounded-3xl p-6 !transform-none !shadow-none" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className={`text-lg font-bold mb-4 ${isAr ? 'font-ar' : 'font-display'}`} style={{ color: '#C9A96E' }}>
                  {isAr ? 'اختر موعدًا جديدًا' : 'Pick a new slot'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{isAr ? 'التاريخ' : 'Date'}</label>
                    <input
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 text-white focus:border-[#C9A96E]/40 focus:outline-none"
                    />
                  </div>
                  {newDate && (
                    <div>
                      <label className="block text-sm mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{isAr ? 'الوقت' : 'Time'}</label>
                      {slotsLoading ? (
                        <p className="text-[#555] text-sm py-4 text-center">…</p>
                      ) : slots.length === 0 ? (
                        <p className="text-[#555] text-sm py-4 text-center">{isAr ? 'لا توجد مواعيد' : 'No slots'}</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.map(s => (
                            <button
                              key={s.time}
                              disabled={!s.available}
                              onClick={() => setNewTime(s.time)}
                              className={`py-2 px-2 rounded-xl text-xs font-medium transition-all ${
                                !s.available ? 'bg-white/[0.01] text-[#333] cursor-not-allowed line-through' :
                                newTime === s.time ? 'bg-[#C9A96E] text-[#0a0a0a]' :
                                'bg-white/[0.03] text-white/70 border border-white/[0.06] hover:border-[#C9A96E]/30'
                              }`}
                            >
                              {formatTime(s.time)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setMode('idle')}
                      className="flex-1 py-3 rounded-2xl text-sm border border-white/[0.06] text-white/60 hover:bg-white/[0.04]"
                    >{isAr ? 'إلغاء' : 'Cancel'}</button>
                    <button
                      disabled={loading || !newDate || !newTime}
                      onClick={() => post('reschedule', { date: newDate, time_slot: newTime })}
                      className={`flex-1 py-3 rounded-2xl text-sm font-bold ${
                        !loading && newDate && newTime ? 'btn-primary' : 'bg-white/[0.03] text-white/20 border border-white/[0.04]'
                      }`}
                    >{loading ? '…' : (isAr ? 'تأكيد' : 'Confirm')}</button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => { setBooking(null); setError(''); setInfo(''); setMode('idle') }}
              className="w-full py-3 text-sm text-[#888] hover:text-white transition-colors"
            >
              {isAr ? 'بحث جديد' : 'Search again'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ManagePage() {
  return (
    <Suspense fallback={null}>
      <ManageContent />
    </Suspense>
  )
}
