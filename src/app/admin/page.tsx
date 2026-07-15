'use client'

import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { services } from '@/lib/services'
import { nahdaServices } from '@/lib/nahdaServices'
import type { Booking } from '@/lib/supabase'
import AdsPanel from './AdsPanel'

type Tab = 'overview' | 'bookings' | 'gifts' | 'memberships' | 'contact' | 'customers' | 'analytics' | 'ads'

type BookingStatus = Booking['status']
type LeadStatus = string

interface GiftRequest {
  id: string
  sender_name: string
  sender_phone: string
  recipient_name: string
  amount: number
  message?: string
  status: string
  notes?: string
  created_at: string
}
interface MembershipRequest {
  id: string
  name: string
  phone: string
  bundle: '5' | '10'
  status: string
  notes?: string
  created_at: string
}
interface ContactMessage {
  id: string
  name: string
  phone?: string
  email?: string
  subject?: string
  message: string
  status: string
  notes?: string
  created_at: string
}
interface Overview {
  bookings: { today: number; pending: number; upcoming: number }
  gift: { pending: number; total: number }
  membership: { pending: number; total: number }
  contact: { new: number; total: number }
}
interface Analytics {
  range: { from: string; to: string }
  totals: { revenue: number; bookings: number; confirmed: number; unique_customers: number; repeat_customers: number }
  top_services: { key: string; name_ar: string; name_en: string; count: number; revenue: number }[]
  trend: { date: string; total: number; confirmed: number; revenue: number }[]
  status_breakdown: Record<string, number>
  busiest_hours: { hour: number; count: number }[]
  busiest_days: { day: number; count: number }[]
  gift: { total: number; pending: number; paid: number; revenue: number }
  membership: { total: number; pending: number; active: number }
  outbound_clicks: {
    total_30d: number
    total_90d: number
    by_type_30d: Record<string, number>
    by_type_90d: Record<string, number>
  }
}
interface Customer {
  phone: string
  name: string
  all_names: string[]
  bookings: number
  bookings_confirmed: number
  bookings_revenue: number
  gifts: number
  gifts_revenue: number
  memberships: number
  total_revenue: number
  touchpoints: number
  last_activity: string
  first_activity: string
  is_vip: boolean
}

const BOOKING_STATUS: Record<BookingStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  confirmed: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  completed: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
  cancelled: 'bg-red-500/15 text-red-300 border border-red-500/25',
}
const LEAD_STATUS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  new: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  contacted: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  read: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  paid: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
  delivered: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  active: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  responded: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  archived: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
  cancelled: 'bg-red-500/15 text-red-300 border border-red-500/25',
}

// Arabic labels for status pills (English shown as-is when EN locale)
const STATUS_EN: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  new: 'New',
  contacted: 'Contacted',
  paid: 'Paid',
  delivered: 'Delivered',
  active: 'Active',
  read: 'Read',
  responded: 'Responded',
  archived: 'Archived',
}

// Module-scope status renderer so child components (AnalyticsTab) can use it
// without prop-drilling. Falls back to the raw code if the map is missing.
function trStatusGlobal(s: string, isAr: boolean): string {
  return isAr ? (STATUS_AR[s] || s) : (STATUS_EN[s] || s)
}

const STATUS_AR: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  new: 'جديد',
  contacted: 'تم التواصل',
  paid: 'مدفوع',
  delivered: 'تم التسليم',
  active: 'نشط',
  read: 'مقروء',
  responded: 'تم الرد',
  archived: 'مؤرشف',
}

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

function getServiceName(key: string, isAr: boolean): string {
  // Search the service catalogs, prioritizing Al Nahda services for this build.
  // Nahda-only keys (e.g. pkg-vip, bath-royal) render their real names.
  const service = nahdaServices.find(s => s.key === key)
    ?? services.find(s => s.key === key)
  if (!service) return key
  return isAr ? service.nameAr : service.nameEn
}
function formatPhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '')
}
function formatDateTime(iso: string, isAr: boolean): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}
function formatDate(iso: string, isAr: boolean): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return iso }
}
function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function AdminPage() {
  const { locale, toggleLocale } = useI18n()
  const isAr = locale === 'ar'
  const tr = (ar: string, en: string) => (isAr ? ar : en)
  const trStatus = (s: string) => trStatusGlobal(s, isAr)

  const [authed, setAuthed] = useState(false)
  // This standalone build is scoped to Al Nahda.
  const [viewBranch, setViewBranch] = useState<string>('al-nahda')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [tab, setTab] = useState<Tab>('overview')
  const [overview, setOverview] = useState<Overview | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const [bookingDate, setBookingDate] = useState<string>(toLocalDateString(new Date()))
  const [bookingRange, setBookingRange] = useState<'today' | 'upcoming' | 'recent'>('recent')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  const [gifts, setGifts] = useState<GiftRequest[]>([])
  const [loadingGifts, setLoadingGifts] = useState(false)
  const [memberships, setMemberships] = useState<MembershipRequest[]>([])
  const [loadingMemberships, setLoadingMemberships] = useState(false)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')

  const VIEW_BRANCH_KEY = 'oilo_admin_view_branch'
  const isBranchValue = (v: unknown): v is 'al-nahda' => v === 'al-nahda'

  // Switch the viewed branch and persist it; reset to the overview so the
  // operator lands on the fresh branch's summary.
  const changeViewBranch = (b: string) => {
    setViewBranch(b)
    try { localStorage.setItem(VIEW_BRANCH_KEY, b) } catch {}
    setTab('overview')
  }

  useEffect(() => {
    fetch('/api/admin/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.authed) {
          setAuthed(true)
          const sessionBranch = d.branch || 'al-nahda'
          let stored: string | null = null
          try { stored = localStorage.getItem(VIEW_BRANCH_KEY) } catch {}
          setViewBranch(isBranchValue(stored) ? stored : sessionBranch)
        }
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        setAuthed(true)
        // A fresh login lands on its own branch; the stored view choice (if any)
        // still applies on the next reload.
        changeViewBranch(data.branch || 'al-nahda')
        setPassword('')
      } else {
        setAuthError(data.error || tr('بيانات الدخول غير صحيحة', 'Invalid credentials'))
      }
    } catch {
      setAuthError(tr('خطأ في الاتصال', 'Connection error'))
    } finally {
      setAuthLoading(false)
    }
  }
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' })
    } catch {}
    setAuthed(false)
    setUsername('')
    setPassword('')
  }

  // Append the viewed branch to any admin API URL so the server scopes data to it.
  const withBranch = useCallback((url: string) => {
    return url + (url.includes('?') ? '&' : '?') + `branch=${encodeURIComponent(viewBranch)}`
  }, [viewBranch])

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch(withBranch('/api/admin/overview'))
      const data = await res.json()
      setOverview(data)
    } catch {}
  }, [withBranch])

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true)
    try {
      const res = await fetch(withBranch('/api/admin/analytics'))
      setAnalytics(await res.json())
    } finally { setLoadingAnalytics(false) }
  }, [withBranch])

  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    try {
      const res = await fetch(withBranch('/api/admin/customers'))
      const data = await res.json()
      setCustomers(data.customers || [])
    } finally { setLoadingCustomers(false) }
  }, [withBranch])

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    try {
      let url = '/api/admin/bookings'
      if (bookingRange === 'today') url += `?date=${bookingDate}`
      else if (bookingRange === 'upcoming') url += `?range=upcoming`
      else url += `?range=recent`
      const res = await fetch(withBranch(url))
      const data = await res.json()
      setBookings(data.bookings || [])
    } finally { setLoadingBookings(false) }
  }, [bookingDate, bookingRange, withBranch])

  const fetchGifts = useCallback(async () => {
    setLoadingGifts(true)
    try {
      const res = await fetch(withBranch('/api/admin/leads?type=gift'))
      const data = await res.json()
      setGifts(data.items || [])
    } finally { setLoadingGifts(false) }
  }, [withBranch])

  const fetchMemberships = useCallback(async () => {
    setLoadingMemberships(true)
    try {
      const res = await fetch(withBranch('/api/admin/leads?type=membership'))
      const data = await res.json()
      setMemberships(data.items || [])
    } finally { setLoadingMemberships(false) }
  }, [withBranch])

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true)
    try {
      const res = await fetch(withBranch('/api/admin/leads?type=contact'))
      const data = await res.json()
      setMessages(data.items || [])
    } finally { setLoadingMessages(false) }
  }, [withBranch])

  useEffect(() => { if (authed) fetchOverview() }, [authed, fetchOverview])
  useEffect(() => {
    if (!authed) return
    if (tab === 'bookings') fetchBookings()
    else if (tab === 'gifts') fetchGifts()
    else if (tab === 'memberships') fetchMemberships()
    else if (tab === 'contact') fetchMessages()
    else if (tab === 'analytics') fetchAnalytics()
    else if (tab === 'customers') fetchCustomers()
    setExpandedId(null)
    setSearch('')
  }, [authed, tab, fetchBookings, fetchGifts, fetchMemberships, fetchMessages, fetchAnalytics, fetchCustomers])

  const updateBookingStatus = async (id: string, status: BookingStatus, notes?: string) => {
    setUpdatingId(id)
    try {
      await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, branch: viewBranch, ...(notes !== undefined ? { notes } : {}) }),
      })
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status, ...(notes !== undefined ? { notes } : {}) } : b)))
      fetchOverview()
    } finally { setUpdatingId(null) }
  }

  const deleteLead = async (type: 'gift' | 'membership' | 'contact', id: string) => {
    if (!confirm(tr('هل تريد حذف هذه الرسالة نهائياً؟', 'Permanently delete this message?'))) return
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, branch: viewBranch }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || tr('فشل الحذف', 'Delete failed'))
        return
      }
      if (type === 'gift') setGifts(prev => prev.filter(g => g.id !== id))
      else if (type === 'membership') setMemberships(prev => prev.filter(m => m.id !== id))
      else setMessages(prev => prev.filter(m => m.id !== id))
      fetchOverview()
    } finally { setUpdatingId(null) }
  }

  const updateLeadStatus = async (type: 'gift' | 'membership' | 'contact', id: string, status?: LeadStatus, notes?: string) => {
    setUpdatingId(id)
    try {
      const payload: Record<string, unknown> = { type, id, branch: viewBranch }
      if (status) payload.status = status
      if (notes !== undefined) payload.notes = notes
      await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const patch = { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) }
      if (type === 'gift') setGifts(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)))
      else if (type === 'membership') setMemberships(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)))
      else setMessages(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)))
      fetchOverview()
    } finally { setUpdatingId(null) }
  }

  const saveNote = async (kind: 'booking' | 'gift' | 'membership' | 'contact', id: string) => {
    const notes = noteDraft[id] ?? ''
    if (kind === 'booking') {
      const b = bookings.find(x => x.id === id)
      if (!b) return
      await updateBookingStatus(id, b.status, notes)
    } else {
      await updateLeadStatus(kind, id, undefined, notes)
    }
  }

  const filterSearch = <T extends Record<string, unknown>>(items: T[], fields: (keyof T)[]): T[] => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(q)))
  }

  const exportCsv = (rows: Record<string, unknown>[], filename: string) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        const v = String(r[h] ?? '').replace(/"/g, '""')
        return `"${v}"`
      }).join(','))
    ].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const LangToggleBtn = (
    <button
      onClick={toggleLocale}
      aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
      className="px-3 py-1.5 rounded-lg border text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:bg-[#C9A96E]/10"
      style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#C9A96E', fontFamily: '"DM Sans", sans-serif' }}
    >
      {isAr ? 'EN' : 'AR'}
    </button>
  )

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 end-4">{LangToggleBtn}</div>
        <div className="w-full max-w-sm">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-8">
            <h1 className="text-xl font-semibold text-white mb-1 tracking-wide">{tr('لوحة تحكم أويلو سبا', 'Oilo Spa Admin')}</h1>
            <p className="text-sm text-[#666] mb-6">{tr('سجّل الدخول للمتابعة', 'Sign in to continue')}</p>
            <form onSubmit={handleLogin}>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={tr('اسم المستخدم', 'Username')} autoComplete="username" className="w-full bg-white/[0.04] border border-[rgba(201,169,110,0.15)] rounded-xl px-4 py-3 text-white placeholder-[#666] focus:border-[#C9A96E] focus:outline-none transition-colors mb-3" autoFocus />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr('كلمة المرور', 'Password')} autoComplete="current-password" className="w-full bg-white/[0.04] border border-[rgba(201,169,110,0.15)] rounded-xl px-4 py-3 text-white placeholder-[#666] focus:border-[#C9A96E] focus:outline-none transition-colors mb-4" />
              {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
              <button type="submit" disabled={authLoading || !username || !password} className="w-full bg-[#C9A96E] text-[#1A1A1A] font-semibold py-3 rounded-xl text-sm tracking-wider hover:bg-[#D4B87A] transition-colors disabled:opacity-50">
                {authLoading ? tr('جارٍ التحقق...', 'Checking...') : tr('دخول', 'Login')}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const filteredBookings = filterSearch(bookings as unknown as Record<string, unknown>[], ['name', 'phone', 'service_key']) as unknown as Booking[]
  const filteredGifts = filterSearch(gifts as unknown as Record<string, unknown>[], ['sender_name', 'sender_phone', 'recipient_name']) as unknown as GiftRequest[]
  const filteredMemberships = filterSearch(memberships as unknown as Record<string, unknown>[], ['name', 'phone']) as unknown as MembershipRequest[]
  const filteredMessages = filterSearch(messages as unknown as Record<string, unknown>[], ['name', 'phone', 'email', 'subject', 'message']) as unknown as ContactMessage[]
  const filteredCustomers = filterSearch(customers as unknown as Record<string, unknown>[], ['name', 'phone']) as unknown as Customer[]

  const dayNames = isAr ? DAY_NAMES_AR : DAY_NAMES_EN

  const TABS: { k: Tab; l: string; i: string; badge?: number }[] = [
    { k: 'overview', l: tr('نظرة عامة', 'Overview'), i: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
    { k: 'bookings', l: tr('الحجوزات', 'Bookings'), i: 'M8 7V3m8 4V3M3 10h18M5 5h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z', badge: overview?.bookings.pending || 0 },
    { k: 'gifts', l: tr('الهدايا', 'Gifts'), i: 'M12 8v13m0-13l-3-3m3 3l3-3M5 12h14v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8zm-1-4h16v4H4V8z', badge: overview?.gift.pending || 0 },
    { k: 'memberships', l: tr('العضويات', 'Memberships'), i: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', badge: overview?.membership.pending || 0 },
    { k: 'contact', l: tr('الرسائل', 'Messages'), i: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z', badge: overview?.contact.new || 0 },
    { k: 'customers', l: tr('العملاء', 'Customers'), i: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z' },
    { k: 'analytics', l: tr('التحليلات', 'Analytics'), i: 'M3 3v18h18M7 13l4-4 4 4 5-5' },
    { k: 'ads', l: tr('الإعلانات', 'Ads'), i: 'M3 3h18v4H3zM3 10h12v4H3zM3 17h18v4H3z' },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="border-b border-[#333] bg-[#1A1A1A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center justify-between gap-2 lg:justify-start lg:gap-4 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold tracking-wide text-[#C9A96E] truncate">{tr('لوحة تحكم Oilo Spa', 'Oilo Spa Dashboard')}</h1>
            <span
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
              style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
            >
              {tr('Oilo Spa فقط', 'Oilo Spa only')}
            </span>
            <nav className="hidden lg:flex items-center gap-1">
              {TABS.map(t => {
                const isActive = tab === t.k
                const badge = t.badge || 0
                return (
                  <button key={t.k} onClick={() => setTab(t.k)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#C9A96E]/15 text-[#C9A96E]' : 'text-[#999] hover:text-white hover:bg-white/[0.04]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={t.i} /></svg>
                    {t.l}
                    {badge ? <span className="inline-block text-[10px] bg-[#C9A96E] text-[#0D0D0D] font-bold rounded-full px-1.5 min-w-[18px] text-center leading-[18px]">{badge}</span> : null}
                  </button>
                )
              })}
            </nav>
            </div>
            <div className="flex items-center gap-2 shrink-0 lg:hidden">
              {LangToggleBtn}
              <button onClick={handleLogout} className="text-sm text-[#999] hover:text-white transition-colors">{tr('خروج', 'Logout')}</button>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:shrink-0">
            <select value={tab} onChange={e => setTab(e.target.value as Tab)} className="lg:hidden w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-3 py-2 text-sm [color-scheme:dark]">
              {TABS.map(t => <option key={t.k} value={t.k}>{t.l}</option>)}
            </select>
            <div className="hidden lg:flex items-center gap-2">
              {LangToggleBtn}
              <button onClick={handleLogout} className="text-sm text-[#999] hover:text-white transition-colors">{tr('خروج', 'Logout')}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label={tr('حجوزات اليوم', 'Bookings Today')} value={overview?.bookings.today ?? 0} sub={`${overview?.bookings.pending ?? 0} ${tr('قيد الانتظار', 'pending')}`} accent="#C9A96E" onClick={() => setTab('bookings')} />
              <StatCard label={tr('الحجوزات القادمة', 'Upcoming Bookings')} value={overview?.bookings.upcoming ?? 0} sub={tr('كل المستقبلية', 'All future')} accent="#10b981" onClick={() => { setBookingRange('upcoming'); setTab('bookings') }} />
              <StatCard label={tr('بطاقات الهدايا', 'Gift Cards')} value={overview?.gift.total ?? 0} sub={`${overview?.gift.pending ?? 0} ${tr('قيد الانتظار', 'pending')}`} accent="#a855f7" onClick={() => setTab('gifts')} />
              <StatCard label={tr('العضويات', 'Memberships')} value={overview?.membership.total ?? 0} sub={`${overview?.membership.pending ?? 0} ${tr('قيد الانتظار', 'pending')}`} accent="#ec4899" onClick={() => setTab('memberships')} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('مهام للمتابعة', 'Action Items')}</h3>
                <ul className="space-y-3 text-sm">
                  {(overview?.bookings.pending ?? 0) > 0 && <li className="flex items-center justify-between"><span>{tr(`تأكيد ${overview?.bookings.pending} حجز قيد الانتظار`, `Confirm ${overview?.bookings.pending} pending booking(s)`)}</span><button onClick={() => setTab('bookings')} className="text-[#C9A96E] hover:underline text-xs">{tr('مراجعة ←', 'Review →')}</button></li>}
                  {(overview?.gift.pending ?? 0) > 0 && <li className="flex items-center justify-between"><span>{tr(`التواصل مع ${overview?.gift.pending} طلب هدية`, `Contact ${overview?.gift.pending} gift card request(s)`)}</span><button onClick={() => setTab('gifts')} className="text-[#C9A96E] hover:underline text-xs">{tr('مراجعة ←', 'Review →')}</button></li>}
                  {(overview?.membership.pending ?? 0) > 0 && <li className="flex items-center justify-between"><span>{tr(`متابعة ${overview?.membership.pending} طلب عضوية`, `Follow up on ${overview?.membership.pending} membership request(s)`)}</span><button onClick={() => setTab('memberships')} className="text-[#C9A96E] hover:underline text-xs">{tr('مراجعة ←', 'Review →')}</button></li>}
                  {(overview?.contact.new ?? 0) > 0 && <li className="flex items-center justify-between"><span>{tr(`الرد على ${overview?.contact.new} رسالة جديدة`, `Respond to ${overview?.contact.new} new message(s)`)}</span><button onClick={() => setTab('contact')} className="text-[#C9A96E] hover:underline text-xs">{tr('مراجعة ←', 'Review →')}</button></li>}
                  {!overview?.bookings.pending && !overview?.gift.pending && !overview?.membership.pending && !overview?.contact.new && <li className="text-[#666] text-center py-4">{tr('لا توجد مهام معلقة', 'All caught up — no pending actions')}</li>}
                </ul>
              </div>
              <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('روابط سريعة', 'Quick Links')}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="https://wa.me/966556733851" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition flex items-center gap-2"><span className="text-emerald-400">●</span> {tr('واتساب', 'WhatsApp')}</a>
                  <a href="https://www.instagram.com/oilo_sa/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition flex items-center gap-2"><span className="text-pink-400">●</span> {tr('انستجرام', 'Instagram')}</a>
                  <a href="https://www.oilospa.com" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition flex items-center gap-2"><span className="text-[#C9A96E]">●</span> {tr('الموقع', 'Website')}</a>
                  <button onClick={() => setTab('analytics')} className="text-left px-3 py-2 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition flex items-center gap-2"><span className="text-blue-400">●</span> {tr('التحليلات', 'Analytics')}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <RangeButton active={bookingRange === 'today'} onClick={() => setBookingRange('today')}>{tr('يوم محدد', 'Single Day')}</RangeButton>
                <RangeButton active={bookingRange === 'upcoming'} onClick={() => setBookingRange('upcoming')}>{tr('القادمة', 'Upcoming')}</RangeButton>
                <RangeButton active={bookingRange === 'recent'} onClick={() => setBookingRange('recent')}>{tr('آخر 100', 'Recent 100')}</RangeButton>
                {bookingRange === 'today' && <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-1.5 text-white text-sm [color-scheme:dark]" />}
              </div>
              <div className="flex items-center gap-2">
                <SearchInput value={search} onChange={setSearch} placeholder={tr('بحث...', 'Search...')} />
                <button onClick={() => exportCsv(filteredBookings as unknown as Record<string, unknown>[], `bookings-${new Date().toISOString().slice(0,10)}.csv`)} className="px-3 py-1.5 bg-white/[0.04] border border-[#333] rounded-lg text-sm text-[#999] hover:text-white hover:bg-white/[0.08] transition">{tr('تصدير CSV', 'Export CSV')}</button>
              </div>
            </div>
            <DataCard loading={loadingBookings} empty={!filteredBookings.length} emptyText={tr('لا توجد حجوزات', 'No bookings found')}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#333] text-left">
                    <Th>{tr('التاريخ / الوقت', 'Date / Time')}</Th><Th>{tr('الاسم', 'Name')}</Th><Th>{tr('الجوال', 'Phone')}</Th><Th>{tr('الخدمة', 'Service')}</Th><Th>{tr('المصدر', 'Source')}</Th><Th>{tr('IP', 'IP')}</Th><Th>{tr('الحالة', 'Status')}</Th><Th>{tr('إجراءات', 'Actions')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <>
                      <tr key={b.id} className="border-b border-[#333]/50 last:border-b-0 hover:bg-white/[0.02]">
                        <Td><span className="text-[#F5F5F5] font-medium whitespace-nowrap">{b.date} · {b.time_slot}</span></Td>
                        <Td>{b.name}</Td>
                        <Td dir="ltr">{b.phone}</Td>
                        <Td dir={isAr ? 'rtl' : 'ltr'}>{getServiceName(b.service_key, isAr)}</Td>
                        <Td><SourceBadge booking={b} isAr={isAr} /></Td>
                        <Td><IpCell ip={b.ip} isAr={isAr} /></Td>
                        <Td><Pill cls={BOOKING_STATUS[b.status]}>{trStatus(b.status)}</Pill></Td>
                        <Td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <select value={b.status} onChange={e => updateBookingStatus(b.id!, e.target.value as BookingStatus)} disabled={updatingId === b.id} className="bg-[#0D0D0D] border border-[#333] rounded px-2 py-1 text-xs [color-scheme:dark]">
                              <option value="pending">{tr('قيد الانتظار', 'Pending')}</option><option value="confirmed">{tr('مؤكد', 'Confirmed')}</option><option value="completed">{tr('مكتمل', 'Completed')}</option><option value="cancelled">{tr('ملغي', 'Cancelled')}</option>
                            </select>
                            <WhatsAppLink phone={b.phone} label={tr('واتساب', 'WhatsApp')} />
                            <NoteToggle id={b.id!} expanded={expandedId === b.id} hasNote={!!b.notes} onClick={() => { setExpandedId(expandedId === b.id ? null : b.id!); setNoteDraft(prev => ({ ...prev, [b.id!]: b.notes || '' })) }} addLabel={tr('+ ملاحظة', '+')} noteLabel={tr('ملاحظة', 'Note')} />
                          </div>
                        </Td>
                      </tr>
                      {expandedId === b.id && (
                        <tr className="bg-white/[0.02]">
                          <td colSpan={8} className="px-4 py-3">
                            <NoteEditor value={noteDraft[b.id!] ?? ''} onChange={v => setNoteDraft(prev => ({ ...prev, [b.id!]: v }))} onSave={() => saveNote('booking', b.id!)} saving={updatingId === b.id} placeholder={tr('ملاحظة داخلية — تظهر للأدمن فقط', 'Internal note — only visible in admin')} saveLabel={tr('حفظ', 'Save Note')} savingLabel={tr('جارٍ الحفظ...', 'Saving...')} />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </DataCard>
          </>
        )}

        {tab === 'gifts' && (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SearchInput value={search} onChange={setSearch} placeholder={tr('بحث...', 'Search...')} />
              <button onClick={() => exportCsv(filteredGifts as unknown as Record<string, unknown>[], `gifts-${new Date().toISOString().slice(0,10)}.csv`)} className="px-3 py-1.5 bg-white/[0.04] border border-[#333] rounded-lg text-sm text-[#999] hover:text-white hover:bg-white/[0.08] transition">{tr('تصدير CSV', 'Export CSV')}</button>
            </div>
            <DataCard loading={loadingGifts} empty={!filteredGifts.length} emptyText={tr('لا توجد طلبات هدايا', 'No gift card requests yet')}>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#333] text-left"><Th>{tr('استلم في', 'Received')}</Th><Th>{tr('المرسل', 'Sender')}</Th><Th>{tr('الجوال', 'Phone')}</Th><Th>{tr('المستلم', 'Recipient')}</Th><Th>{tr('المبلغ', 'Amount')}</Th><Th>{tr('الحالة', 'Status')}</Th><Th>{tr('إجراءات', 'Actions')}</Th></tr></thead>
                <tbody>
                  {filteredGifts.map(g => (
                    <>
                      <tr key={g.id} className="border-b border-[#333]/50 hover:bg-white/[0.02]">
                        <Td><span className="text-[#999] whitespace-nowrap">{formatDateTime(g.created_at, isAr)}</span></Td>
                        <Td>{g.sender_name}</Td>
                        <Td dir="ltr">{g.sender_phone}</Td>
                        <Td>{g.recipient_name}</Td>
                        <Td><span className="font-semibold text-[#C9A96E]">{g.amount} {tr('ر.س', 'SAR')}</span></Td>
                        <Td><Pill cls={LEAD_STATUS[g.status] || LEAD_STATUS.pending}>{trStatus(g.status)}</Pill></Td>
                        <Td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <select value={g.status} onChange={e => updateLeadStatus('gift', g.id, e.target.value)} disabled={updatingId === g.id} className="bg-[#0D0D0D] border border-[#333] rounded px-2 py-1 text-xs [color-scheme:dark]">
                              <option value="pending">{tr('قيد الانتظار', 'Pending')}</option><option value="contacted">{tr('تم التواصل', 'Contacted')}</option><option value="paid">{tr('مدفوع', 'Paid')}</option><option value="delivered">{tr('تم التسليم', 'Delivered')}</option><option value="cancelled">{tr('ملغي', 'Cancelled')}</option>
                            </select>
                            <WhatsAppLink phone={g.sender_phone} label={tr('واتساب', 'WhatsApp')} />
                            <NoteToggle id={g.id} expanded={expandedId === g.id} hasNote={!!g.notes} onClick={() => { setExpandedId(expandedId === g.id ? null : g.id); setNoteDraft(prev => ({ ...prev, [g.id]: g.notes || '' })) }} addLabel={tr('+ ملاحظة', '+')} noteLabel={tr('ملاحظة', 'Note')} />
                          </div>
                        </Td>
                      </tr>
                      {expandedId === g.id && (
                        <tr className="bg-white/[0.02]"><td colSpan={7} className="px-4 py-3">
                          {g.message && <div className="mb-3 p-3 rounded bg-white/[0.03] border border-[#333] text-sm text-[#ccc]"><span className="text-xs uppercase tracking-wider text-[#C9A96E]">{tr('رسالة الهدية:', 'Gift Message:')}</span><br />{g.message}</div>}
                          <NoteEditor value={noteDraft[g.id] ?? ''} onChange={v => setNoteDraft(prev => ({ ...prev, [g.id]: v }))} onSave={() => saveNote('gift', g.id)} saving={updatingId === g.id} placeholder={tr('ملاحظة داخلية — تظهر للأدمن فقط', 'Internal note — only visible in admin')} saveLabel={tr('حفظ', 'Save Note')} savingLabel={tr('جارٍ الحفظ...', 'Saving...')} />
                        </td></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </DataCard>
          </>
        )}

        {tab === 'memberships' && (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SearchInput value={search} onChange={setSearch} placeholder={tr('بحث...', 'Search...')} />
              <button onClick={() => exportCsv(filteredMemberships as unknown as Record<string, unknown>[], `memberships-${new Date().toISOString().slice(0,10)}.csv`)} className="px-3 py-1.5 bg-white/[0.04] border border-[#333] rounded-lg text-sm text-[#999] hover:text-white hover:bg-white/[0.08] transition">{tr('تصدير CSV', 'Export CSV')}</button>
            </div>
            <DataCard loading={loadingMemberships} empty={!filteredMemberships.length} emptyText={tr('لا توجد طلبات عضوية', 'No membership requests yet')}>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#333] text-left"><Th>{tr('استلم في', 'Received')}</Th><Th>{tr('الاسم', 'Name')}</Th><Th>{tr('الجوال', 'Phone')}</Th><Th>{tr('الباقة', 'Bundle')}</Th><Th>{tr('الحالة', 'Status')}</Th><Th>{tr('إجراءات', 'Actions')}</Th></tr></thead>
                <tbody>
                  {filteredMemberships.map(m => (
                    <>
                      <tr key={m.id} className="border-b border-[#333]/50 hover:bg-white/[0.02]">
                        <Td><span className="text-[#999] whitespace-nowrap">{formatDateTime(m.created_at, isAr)}</span></Td>
                        <Td>{m.name}</Td>
                        <Td dir="ltr">{m.phone}</Td>
                        <Td><span className="inline-block px-2 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E] font-semibold text-xs">{m.bundle} {tr('جلسات', 'sessions')}</span></Td>
                        <Td><Pill cls={LEAD_STATUS[m.status] || LEAD_STATUS.pending}>{trStatus(m.status)}</Pill></Td>
                        <Td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <select value={m.status} onChange={e => updateLeadStatus('membership', m.id, e.target.value)} disabled={updatingId === m.id} className="bg-[#0D0D0D] border border-[#333] rounded px-2 py-1 text-xs [color-scheme:dark]">
                              <option value="pending">{tr('قيد الانتظار', 'Pending')}</option><option value="contacted">{tr('تم التواصل', 'Contacted')}</option><option value="active">{tr('نشط', 'Active')}</option><option value="cancelled">{tr('ملغي', 'Cancelled')}</option>
                            </select>
                            <WhatsAppLink phone={m.phone} label={tr('واتساب', 'WhatsApp')} />
                            <NoteToggle id={m.id} expanded={expandedId === m.id} hasNote={!!m.notes} onClick={() => { setExpandedId(expandedId === m.id ? null : m.id); setNoteDraft(prev => ({ ...prev, [m.id]: m.notes || '' })) }} addLabel={tr('+ ملاحظة', '+')} noteLabel={tr('ملاحظة', 'Note')} />
                          </div>
                        </Td>
                      </tr>
                      {expandedId === m.id && (
                        <tr className="bg-white/[0.02]"><td colSpan={6} className="px-4 py-3">
                          <NoteEditor value={noteDraft[m.id] ?? ''} onChange={v => setNoteDraft(prev => ({ ...prev, [m.id]: v }))} onSave={() => saveNote('membership', m.id)} saving={updatingId === m.id} placeholder={tr('ملاحظة داخلية — تظهر للأدمن فقط', 'Internal note — only visible in admin')} saveLabel={tr('حفظ', 'Save Note')} savingLabel={tr('جارٍ الحفظ...', 'Saving...')} />
                        </td></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </DataCard>
          </>
        )}

        {tab === 'contact' && (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SearchInput value={search} onChange={setSearch} placeholder={tr('بحث...', 'Search...')} />
              <button onClick={() => exportCsv(filteredMessages as unknown as Record<string, unknown>[], `messages-${new Date().toISOString().slice(0,10)}.csv`)} className="px-3 py-1.5 bg-white/[0.04] border border-[#333] rounded-lg text-sm text-[#999] hover:text-white hover:bg-white/[0.08] transition">{tr('تصدير CSV', 'Export CSV')}</button>
            </div>
            <DataCard loading={loadingMessages} empty={!filteredMessages.length} emptyText={tr('لا توجد رسائل', 'No messages yet')}>
              <div className="divide-y divide-[#333]/50">
                {filteredMessages.map(m => (
                  <div key={m.id} className="p-5 hover:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-[#999]">
                          {m.phone && <span dir="ltr">{m.phone}</span>}{m.phone && m.email && ' · '}{m.email && <span dir="ltr">{m.email}</span>}{' · '}
                          <span className="text-[#666]">{formatDateTime(m.created_at, isAr)}</span>
                        </p>
                        {m.subject && <p className="text-sm text-[#C9A96E] mt-1">{m.subject}</p>}
                      </div>
                      <Pill cls={LEAD_STATUS[m.status] || LEAD_STATUS.new}>{trStatus(m.status)}</Pill>
                    </div>
                    <p className="text-sm text-[#ddd] leading-relaxed my-3 whitespace-pre-line">{m.message}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      <select value={m.status} onChange={e => updateLeadStatus('contact', m.id, e.target.value)} disabled={updatingId === m.id} className="bg-[#0D0D0D] border border-[#333] rounded px-2 py-1 text-xs [color-scheme:dark]">
                        <option value="new">{tr('جديد', 'New')}</option><option value="read">{tr('مقروء', 'Read')}</option><option value="responded">{tr('تم الرد', 'Responded')}</option><option value="archived">{tr('مؤرشف', 'Archived')}</option>
                      </select>
                      {m.phone && <WhatsAppLink phone={m.phone} label={tr('واتساب', 'WhatsApp')} />}
                      {m.email && <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30 hover:bg-blue-600/30 transition-colors">{tr('إيميل', 'Email')}</a>}
                      <NoteToggle id={m.id} expanded={expandedId === m.id} hasNote={!!m.notes} onClick={() => { setExpandedId(expandedId === m.id ? null : m.id); setNoteDraft(prev => ({ ...prev, [m.id]: m.notes || '' })) }} addLabel={tr('+ ملاحظة', '+')} noteLabel={tr('ملاحظة', 'Note')} />
                      <button onClick={() => deleteLead('contact', m.id)} disabled={updatingId === m.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-red-600/20 text-red-300 border border-red-600/30 hover:bg-red-600/30 transition-colors disabled:opacity-50">{tr('حذف', 'Delete')}</button>
                    </div>
                    {expandedId === m.id && (
                      <div className="mt-3">
                        <NoteEditor value={noteDraft[m.id] ?? ''} onChange={v => setNoteDraft(prev => ({ ...prev, [m.id]: v }))} onSave={() => saveNote('contact', m.id)} saving={updatingId === m.id} placeholder={tr('ملاحظة داخلية — تظهر للأدمن فقط', 'Internal note — only visible in admin')} saveLabel={tr('حفظ', 'Save Note')} savingLabel={tr('جارٍ الحفظ...', 'Saving...')} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DataCard>
          </>
        )}

        {tab === 'customers' && (
          <>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <SearchInput value={search} onChange={setSearch} placeholder={tr('بحث...', 'Search...')} />
                <span className="text-sm text-[#999]">{filteredCustomers.length} {tr('عميل', `customer${filteredCustomers.length !== 1 ? 's' : ''}`)} · {filteredCustomers.filter(c => c.is_vip).length} {tr('VIP', 'VIP')}</span>
              </div>
              <button onClick={() => exportCsv(filteredCustomers as unknown as Record<string, unknown>[], `customers-${new Date().toISOString().slice(0,10)}.csv`)} className="px-3 py-1.5 bg-white/[0.04] border border-[#333] rounded-lg text-sm text-[#999] hover:text-white hover:bg-white/[0.08] transition">{tr('تصدير CSV', 'Export CSV')}</button>
            </div>
            <DataCard loading={loadingCustomers} empty={!filteredCustomers.length} emptyText={tr('لا يوجد عملاء بعد', 'No customers yet')}>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#333] text-left"><Th>{tr('العميل', 'Customer')}</Th><Th>{tr('الجوال', 'Phone')}</Th><Th>{tr('الحجوزات', 'Bookings')}</Th><Th>{tr('الهدايا', 'Gifts')}</Th><Th>{tr('العضويات', 'Memberships')}</Th><Th>{tr('إجمالي الإنفاق', 'Total Revenue')}</Th><Th>{tr('آخر زيارة', 'Last Visit')}</Th><Th>&nbsp;</Th></tr></thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.phone} className="border-b border-[#333]/50 hover:bg-white/[0.02]">
                      <Td>
                        <div className="flex items-center gap-2">
                          <span>{c.name}</span>
                          {c.is_vip && <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#C9A96E] text-[#0D0D0D]">VIP</span>}
                        </div>
                      </Td>
                      <Td dir="ltr">{c.phone}</Td>
                      <Td><span className="text-[#999]">{c.bookings_confirmed}/{c.bookings}</span></Td>
                      <Td><span className="text-[#999]">{c.gifts}</span></Td>
                      <Td><span className="text-[#999]">{c.memberships}</span></Td>
                      <Td><span className="font-semibold text-[#C9A96E]">{c.total_revenue} {tr('ر.س', 'SAR')}</span></Td>
                      <Td><span className="text-[#999] text-xs whitespace-nowrap">{formatDate(c.last_activity, isAr)}</span></Td>
                      <Td><WhatsAppLink phone={c.phone} label={tr('واتساب', 'WhatsApp')} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataCard>
          </>
        )}

        {tab === 'analytics' && (
          <AnalyticsTab analytics={analytics} loading={loadingAnalytics} isAr={isAr} dayNames={dayNames} />
        )}

        {tab === 'ads' && (
          <AdsPanel branch={viewBranch} tr={tr} />
        )}
      </main>
    </div>
  )
}

// ============= ANALYTICS TAB COMPONENT =============
function AnalyticsTab({ analytics: a, loading, isAr, dayNames }: { analytics: Analytics | null; loading: boolean; isAr: boolean; dayNames: string[] }) {
  const tr = (ar: string, en: string) => (isAr ? ar : en)

  if (loading || !a) {
    return (
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl py-16 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const maxTrend = Math.max(1, ...a.trend.map(t => t.total))
  const maxHour = Math.max(1, ...a.busiest_hours.map(h => h.count))
  const maxDay = Math.max(1, ...a.busiest_days.map(d => d.count))

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#666]">{tr('آخر 90 يوم', 'Last 90 days')} · {a.range.from} {tr('إلى', 'to')} {a.range.to}</p>

      {/* Big stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label={tr('إجمالي الإيرادات', 'Total Revenue')} value={a.totals.revenue} sub={tr('ر.س (مؤكد + مكتمل)', 'SAR (confirmed+completed)')} accent="#C9A96E" />
        <StatCard label={tr('إجمالي الحجوزات', 'Total Bookings')} value={a.totals.bookings} sub={`${a.totals.confirmed} ${tr('مؤكد', 'confirmed')}`} accent="#10b981" />
        <StatCard label={tr('عملاء فريدون', 'Unique Customers')} value={a.totals.unique_customers} sub={tr('أرقام مختلفة', 'Distinct phones')} accent="#3b82f6" />
        <StatCard label={tr('عملاء متكررون', 'Repeat Customers')} value={a.totals.repeat_customers} sub={`${a.totals.unique_customers ? Math.round((a.totals.repeat_customers / a.totals.unique_customers) * 100) : 0}% ${tr('عائدون', 'returning')}`} accent="#a855f7" />
        <StatCard label={tr('إيرادات الهدايا', 'Gift Revenue')} value={a.gift.revenue} sub={`${a.gift.paid}/${a.gift.total} ${tr('مدفوع', 'paid')}`} accent="#ec4899" />
      </div>

      {/* Trend chart */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('الحجوزات (آخر 30 يوم)', 'Bookings Trend (last 30 days)')}</h3>
        <div className="flex items-end gap-1 h-32">
          {a.trend.map(t => (
            <div key={t.date} className="flex-1 group relative" title={`${t.date}: ${t.total} ${tr('حجز', 'bookings')} · ${t.revenue} ${tr('ر.س', 'SAR')}`}>
              <div className="w-full rounded-t" style={{ height: `${(t.total / maxTrend) * 100}%`, background: 'linear-gradient(to top, #C9A96E, #dbb97a)', minHeight: t.total > 0 ? '3px' : '0' }} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap text-xs bg-black/80 text-white px-2 py-1 rounded z-10">
                {t.date.slice(5)} · {t.total}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[#666] mt-2">
          <span>{a.trend[0]?.date.slice(5) || ''}</span>
          <span>{a.trend[Math.floor(a.trend.length / 2)]?.date.slice(5) || ''}</span>
          <span>{a.trend[a.trend.length - 1]?.date.slice(5) || ''}</span>
        </div>
      </div>

      {/* Outbound / exit-link clicks — off-site conversions */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
        <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider">{tr('نقرات التواصل والخروج', 'Outbound / Contact Clicks')}</h3>
          <span className="text-xs text-[#666]">{tr('آخر 30 يوم', 'last 30d')}: <span className="text-white font-semibold">{a.outbound_clicks.total_30d}</span> · {tr('90 يوم', '90d')}: {a.outbound_clicks.total_90d}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {([
            ['whatsapp', tr('واتساب', 'WhatsApp'), '#25D366'],
            ['phone', tr('اتصال', 'Phone'), '#3b82f6'],
            ['email', tr('إيميل', 'Email'), '#eab308'],
            ['location', tr('الموقع', 'Location'), '#ef4444'],
            ['social', tr('السوشيال', 'Social'), '#a855f7'],
          ] as const).map(([key, label, color]) => (
            <div key={key} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
              <div className="text-2xl font-bold" style={{ color }}>{a.outbound_clicks.by_type_90d[key] || 0}</div>
              <div className="text-xs text-[#888] mt-1">{label}</div>
              <div className="text-[10px] text-[#666] mt-0.5">{a.outbound_clicks.by_type_30d[key] || 0} · {tr('آخر 30ي', 'last 30d')}</div>
            </div>
          ))}
        </div>
        {a.outbound_clicks.total_90d === 0 && (
          <p className="text-xs text-[#666] mt-3">{tr('لا توجد نقرات مسجلة بعد — ستظهر فور نقر الزوار على واتساب أو الهاتف أو الموقع.', 'No clicks yet — they appear as soon as visitors tap WhatsApp, phone, email or location.')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top services */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('أعلى الخدمات إيراداً', 'Top Services by Revenue')}</h3>
          {a.top_services.length === 0 ? (
            <p className="text-sm text-[#666] py-4">{tr('لا توجد حجوزات مؤكدة بعد', 'No confirmed bookings yet')}</p>
          ) : (
            <div className="space-y-3">
              {a.top_services.map(s => {
                const pct = a.totals.revenue ? (s.revenue / a.totals.revenue) * 100 : 0
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white" dir={isAr ? 'rtl' : 'ltr'}>{isAr ? s.name_ar : s.name_en}</span>
                      <span className="text-[#C9A96E] font-semibold">{s.revenue} {tr('ر.س', 'SAR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #C9A96E, #dbb97a)' }} />
                      </div>
                      <span className="text-[10px] text-[#666] w-14 text-right">{s.count} {tr('بيع', 'sold')} · {pct.toFixed(0)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('توزيع حالات الحجوزات', 'Booking Status Breakdown')}</h3>
          <div className="space-y-3">
            {Object.entries(a.status_breakdown).map(([status, count]) => {
              const total = Object.values(a.status_breakdown).reduce((s, c) => s + c, 0)
              const pct = total ? (count / total) * 100 : 0
              const colors: Record<string, string> = { pending: '#f59e0b', confirmed: '#10b981', completed: '#6b7280', cancelled: '#ef4444' }
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize text-white">{trStatusGlobal(status, isAr)}</span>
                    <span className="font-semibold" style={{ color: colors[status] }}>{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[status] || '#6b7280' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Busiest hours */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('أكثر الساعات ازدحاماً', 'Busiest Hours')}</h3>
          <div className="flex items-end gap-0.5 h-24">
            {a.busiest_hours.map(h => (
              <div key={h.hour} className="flex-1 group relative" title={`${h.hour}:00 — ${h.count} ${tr('حجز', 'bookings')}`}>
                <div className="w-full rounded-t bg-[#C9A96E]/70 hover:bg-[#C9A96E] transition" style={{ height: `${(h.count / maxHour) * 100}%`, minHeight: h.count > 0 ? '2px' : '0' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#666] mt-2">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </div>

        {/* Busiest days of week */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('أكثر أيام الأسبوع ازدحاماً', 'Busiest Day of Week')}</h3>
          <div className="flex items-end gap-2 h-24">
            {a.busiest_days.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full rounded-t bg-[#C9A96E]/70 hover:bg-[#C9A96E] transition" style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? '2px' : '0' }} title={`${dayNames[d.day]}: ${d.count}`} />
                <span className="text-[10px] text-[#666]">{dayNames[d.day]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('تحويل بطاقات الهدايا', 'Gift Card Conversion')}</h3>
          <div className="flex flex-wrap items-end justify-around gap-4">
            <FunnelStat label={tr('الإجمالي', 'Total')} value={a.gift.total} />
            <FunnelStat label={tr('قيد الانتظار', 'Pending')} value={a.gift.pending} accent="#f59e0b" />
            <FunnelStat label={tr('مدفوع/مسلَّم', 'Paid/Delivered')} value={a.gift.paid} accent="#10b981" />
            <FunnelStat label={tr('الإيرادات', 'Revenue')} value={a.gift.revenue} suffix={tr('ر.س', 'SAR')} accent="#C9A96E" />
          </div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">{tr('تحويل العضويات', 'Membership Conversion')}</h3>
          <div className="flex flex-wrap items-end justify-around gap-4">
            <FunnelStat label={tr('الإجمالي', 'Total')} value={a.membership.total} />
            <FunnelStat label={tr('قيد الانتظار', 'Pending')} value={a.membership.pending} accent="#f59e0b" />
            <FunnelStat label={tr('نشط', 'Active')} value={a.membership.active} accent="#10b981" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent, onClick }: { label: string; value: number; sub: string; accent: string; onClick?: () => void }) {
  const content = (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-5 text-left hover:border-[#C9A96E]/40 hover:bg-white/[0.02] transition-colors h-full">
      <p className="text-[10px] uppercase tracking-wider text-[#666] font-medium mb-2">{label}</p>
      <p className="text-3xl font-semibold" style={{ color: accent }}>{value.toLocaleString()}</p>
      <p className="text-xs text-[#999] mt-1">{sub}</p>
    </div>
  )
  return onClick ? <button onClick={onClick} className="block w-full">{content}</button> : content
}

function FunnelStat({ label, value, accent = '#F5F5F5', suffix }: { label: string; value: number; accent?: string; suffix?: string }) {
  return (
    <div className="text-center flex-1">
      <p className="text-2xl font-semibold" style={{ color: accent }}>{value.toLocaleString()}{suffix ? <span className="text-xs ml-1">{suffix}</span> : null}</p>
      <p className="text-[10px] uppercase tracking-wider text-[#666] mt-1">{label}</p>
    </div>
  )
}

function RangeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30' : 'bg-[#1A1A1A] border border-[#333] text-[#999] hover:text-white'}`}>{children}</button>
}
function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Search...'} className="bg-[#1A1A1A] border border-[#333] rounded-lg ps-9 pe-4 py-1.5 text-white text-sm focus:border-[#C9A96E] focus:outline-none w-48 sm:w-64" />
      <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </div>
  )
}
function DataCard({ children, loading, empty, emptyText }: { children: React.ReactNode; loading: boolean; empty: boolean; emptyText: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl overflow-hidden">
      {loading ? <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" /></div>
        : empty ? <div className="text-center py-16 text-[#666] text-sm">{emptyText}</div>
        : <div className="overflow-x-auto">{children}</div>}
    </div>
  )
}
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 text-xs text-[#666] uppercase tracking-wider font-medium">{children}</th> }
function Td({ children, dir }: { children: React.ReactNode; dir?: string }) { return <td className="px-4 py-3 text-[#F5F5F5]" dir={dir}>{children}</td> }
function Pill({ cls, children }: { cls: string; children: React.ReactNode }) { return <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${cls}`}>{children}</span> }

// Per-source pill colors. Mirrors the platform's brand color so the table is
// scannable at a glance — TikTok pink, Google blue, Instagram fuchsia, etc.
const SOURCE_PILL: Record<string, string> = {
  tiktok:    'bg-pink-500/15 text-pink-300 border border-pink-500/30',
  instagram: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30',
  facebook:  'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  snapchat:  'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  google:    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  bing:      'bg-teal-500/15 text-teal-300 border border-teal-500/30',
  whatsapp:  'bg-green-500/15 text-green-300 border border-green-500/30',
  x:         'bg-white/10 text-white border border-white/20',
  youtube:   'bg-red-500/15 text-red-300 border border-red-500/30',
  linkedin:  'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  direct:    'bg-white/[0.04] text-[#888] border border-[#333]',
}

function SourceBadge({ booking, isAr }: { booking: { source?: string | null; utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null; referer?: string | null }; isAr: boolean }) {
  const src = (booking.source || 'direct').toLowerCase()
  const cls = SOURCE_PILL[src] || 'bg-white/[0.04] text-[#bbb] border border-[#333]'
  const tip = [
    booking.utm_source && `utm_source: ${booking.utm_source}`,
    booking.utm_medium && `utm_medium: ${booking.utm_medium}`,
    booking.utm_campaign && `utm_campaign: ${booking.utm_campaign}`,
    booking.referer && `referer: ${booking.referer}`,
  ].filter(Boolean).join('\n') || (isAr ? 'لم يُلتقط مصدر — رابط مكتوب يدوياً أو متصفّح داخل تطبيق' : 'No attribution captured (e.g. typed URL or app browser).')
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${cls}`} title={tip}>{src}</span>
  )
}

// Statcounter project for oilo.sa — see reference_statcounter_ids.md.
const OILO_STATCOUNTER_URL = 'https://statcounter.com/p13224581/visitors/?dr=&fdr=&fdrs='

function IpCell({ ip, isAr }: { ip?: string | null; isAr: boolean }) {
  const [copied, setCopied] = useState(false)
  if (!ip) return <span className="text-[11px] text-[#555]">—</span>
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // older browsers without clipboard API
    }
  }
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onCopy}
        title={isAr ? 'انقر لنسخ الـ IP' : 'Click to copy IP'}
        className="font-mono text-[11px] text-[#bbb] hover:text-white bg-white/[0.04] border border-[#333] hover:border-[#555] rounded px-1.5 py-0.5 transition"
        dir="ltr"
      >
        {copied ? (isAr ? '✓ نُسخ' : '✓ copied') : ip}
      </button>
      <a
        href={OILO_STATCOUNTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={isAr ? 'افتح Statcounter — الصق الـ IP في خانة البحث' : 'Open Statcounter — paste IP into search'}
        className="text-[10px] text-[#888] hover:text-[#C9A96E] underline-offset-2 hover:underline"
      >
        Statcounter ↗
      </a>
    </div>
  )
}
function WhatsAppLink({ phone, label }: { phone: string; label: string }) {
  const num = phone.startsWith('05') ? `966${phone.slice(1)}` : formatPhone(phone)
  return <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 hover:bg-emerald-600/30 transition-colors">{label}</a>
}
function NoteToggle({ expanded, hasNote, onClick, addLabel, noteLabel }: { id: string; expanded: boolean; hasNote: boolean; onClick: () => void; addLabel: string; noteLabel: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${expanded ? 'bg-[#C9A96E]/20 text-[#C9A96E]' : hasNote ? 'bg-[#C9A96E]/10 text-[#C9A96E]/80 hover:bg-[#C9A96E]/15' : 'text-[#666] hover:text-white hover:bg-white/[0.04]'}`} title={hasNote ? noteLabel : addLabel}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z" /></svg>
      {hasNote ? noteLabel : addLabel}
    </button>
  )
}
function NoteEditor({ value, onChange, onSave, saving, placeholder, saveLabel, savingLabel }: { value: string; onChange: (v: string) => void; onSave: () => void; saving: boolean; placeholder: string; saveLabel: string; savingLabel: string }) {
  return (
    <div className="flex items-start gap-2">
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#C9A96E] focus:outline-none resize-none" />
      <button onClick={onSave} disabled={saving} className="bg-[#C9A96E] text-[#1A1A1A] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#D4B87A] transition-colors disabled:opacity-50 whitespace-nowrap">
        {saving ? savingLabel : saveLabel}
      </button>
    </div>
  )
}
