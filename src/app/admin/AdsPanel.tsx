'use client'

import { useState, useEffect, useCallback } from 'react'

type AdStatus = 'active' | 'paused' | 'rejected' | 'other'
interface AdCampaign { id: string; name: string; status: AdStatus; statusRaw: string; spend: number; impressions: number; clicks: number; conversions: number }
interface PlatformResult { platform: string; label: string; connected: boolean; error?: string; currency: string; campaigns: AdCampaign[]; source?: string; asOf?: string; periodLabel?: string }
interface BranchAds { branch: string; range: string; platforms: PlatformResult[]; fetchedAt: string }

// Snapshots are captured for a fixed period, so the short ranges (today / 7d /
// month) would all show the same figure and read as wrong. Keep only 30 days,
// which roughly matches the captured window. (Re-add ranges once Google is live.)
const RANGES: { k: string; ar: string; en: string }[] = [
  { k: '30d', ar: '٣٠ يوم', en: '30 days' },
]

const STATUS_STYLE: Record<AdStatus, { ar: string; en: string; cls: string }> = {
  active: { ar: 'يعمل', en: 'Running', cls: 'bg-emerald-500/15 text-emerald-400' },
  paused: { ar: 'متوقف', en: 'Paused', cls: 'bg-yellow-500/15 text-yellow-400' },
  rejected: { ar: 'مرفوض', en: 'Rejected', cls: 'bg-red-500/15 text-red-400' },
  other: { ar: '—', en: '—', cls: 'bg-white/10 text-[#999]' },
}

export default function AdsPanel({ branch, tr }: { branch: string; tr: (ar: string, en: string) => string }) {
  const [range, setRange] = useState('30d')
  const [data, setData] = useState<BranchAds | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setErr(null)
    try {
      const res = await fetch(`/api/admin/ads?branch=${encodeURIComponent(branch)}&range=${range}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) { setErr(e instanceof Error ? e.message : 'failed') } finally { setLoading(false) }
  }, [branch, range])

  useEffect(() => { load() }, [load])

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  // Sum spend per currency — never add EGP and SAR together.
  const totals: Record<string, number> = {}
  for (const p of data?.platforms || []) {
    const s = p.campaigns.reduce((a, c) => a + c.spend, 0)
    totals[p.currency] = (totals[p.currency] || 0) + s
  }
  const totalLabel = Object.entries(totals).map(([c, v]) => `${fmt(v)} ${c}`).join('  ·  ') || '0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-[#999]">
          {tr('إجمالي الصرف', 'Total spend')}: <span className="text-white font-semibold">{totalLabel}</span>
        </div>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button key={r.k} onClick={() => setRange(r.k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${range === r.k ? 'bg-[#C9A96E]/15 text-[#C9A96E]' : 'text-[#999] hover:text-white hover:bg-white/[0.04]'}`}>
              {tr(r.ar, r.en)}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-[#999] text-sm">{tr('جارٍ التحميل...', 'Loading...')}</div>}
      {err && <div className="text-red-400 text-sm">{err}</div>}

      {!loading && (data?.platforms || []).map(p => (
        <div key={p.platform} className="bg-[#0D0D0D] border border-[#333] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{p.label}</span>
              {p.source === 'snapshot' && <span className="text-xs text-[#999]">{tr('لقطة', 'snapshot')}{p.asOf ? ` · ${p.asOf}` : ''}</span>}
              {!p.connected && !p.error && p.source !== 'snapshot' && <span className="text-xs text-[#999]">{tr('غير متصل', 'not connected')}</span>}
            </div>
            <span className="text-sm text-[#999]">{fmt(p.campaigns.reduce((a, c) => a + c.spend, 0))} {p.currency}</span>
          </div>
          {p.error && <div className="px-4 py-3 text-red-400 text-sm">{p.error}</div>}
          {!p.error && p.campaigns.length === 0 && <div className="px-4 py-3 text-[#999] text-sm">{tr('لا توجد حملات', 'No campaigns')}</div>}
          {p.campaigns.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#777] text-xs">
                  <th className="text-right px-4 py-2">{tr('الحملة', 'Campaign')}</th>
                  <th className="text-right px-4 py-2">{tr('الحالة', 'Status')}</th>
                  <th className="text-right px-4 py-2">{tr('الصرف', 'Spend')}</th>
                  <th className="text-right px-4 py-2">{tr('النتائج', 'Results')}</th>
                  <th className="text-right px-4 py-2">{tr('الظهور', 'Impr.')}</th>
                  <th className="text-right px-4 py-2">CPA</th>
                </tr></thead>
                <tbody>
                  {p.campaigns.map(c => {
                    const st = STATUS_STYLE[c.status] || STATUS_STYLE.other
                    const cpa = c.conversions > 0 ? c.spend / c.conversions : 0
                    return (
                      <tr key={c.id} className="border-t border-[#1c1c1c]">
                        <td className="px-4 py-2 text-white">{c.name}</td>
                        <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs ${st.cls}`}>{tr(st.ar, st.en)}</span></td>
                        <td className="px-4 py-2">{fmt(c.spend)} {p.currency}</td>
                        <td className="px-4 py-2">{fmt(c.conversions)} <span className="text-[#777] text-xs">({fmt(c.clicks)} {tr('نقرة', 'clicks')})</span></td>
                        <td className="px-4 py-2">{fmt(c.impressions)}</td>
                        <td className="px-4 py-2">{cpa > 0 ? `${fmt(cpa)} ${p.currency}` : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
