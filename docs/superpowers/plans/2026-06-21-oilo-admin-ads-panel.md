# Oilo `/admin` Ads Panel (Nahda) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Ads" (الإعلانات) tab to Oilo's `/admin` showing the viewed branch's ad campaigns — status, spend, results, impressions, CPA — with Google live via API and Snapchat from a stored snapshot, starting with Al Nahda.

**Architecture:** Port NICK's `src/lib/ads/` (trimmed to google + snap), but scope by Oilo's existing branch auth (`requireAdmin()` + `resolveBranch()`) instead of org-roles, and pass the Google customer id per-branch from a config module instead of from env. A new `/api/admin/ads` route aggregates the platforms; a new `AdsPanel.tsx` renders them inside the existing admin shell. Snapchat figures live in a new `ads_snapshots` Supabase table, seeded by a script.

**Tech Stack:** Next.js (App Router, repo-modified — see Global Constraints), TypeScript, Supabase JS, Google Ads REST API v24, Playwright (seed script only).

## Global Constraints

- **Modified Next.js:** per `AGENTS.md`, this is not stock Next. Do NOT invent App-Router APIs — mirror the existing working routes `src/app/api/admin/overview/route.ts` and `src/app/api/admin/auth/route.ts` (they use `export async function GET/POST(request: Request)`, `Response.json(...)`, and `@/lib/auth`). Check `node_modules/next/dist/docs/` only if you hit something the existing routes don't cover.
- **Auth gate:** every admin API route starts with `const auth = await requireAdmin(); if (auth instanceof Response) return auth;` then `const branch = resolveBranch(request, auth)`. Copy verbatim from `overview/route.ts`.
- **Supabase client:** server reads use `getSupabase()` from `@/lib/supabase` (anon key). The seed script (Node) uses the **service-role** key from `.env.local`.
- **No test framework:** this repo has none and the spec forbids adding one. Each task verifies with `npm run build` (type-check + lint) plus a targeted runtime check (curl / manual). No `pytest`/`vitest`.
- **Locale:** Arabic-default, RTL. UI labels use the existing `tr(ar, en)` pattern from `page.tsx`. No em dashes in any copy.
- **Currency:** Al Nahda is SAR-only; no FX conversion anywhere.
- **Commit + push** after each task (repo deploys from `master` on push). End commit messages with the Co-Authored-By trailer.

---

### Task 1: Ads types + branch account config

**Files:**
- Create: `src/lib/ads/types.ts`
- Create: `src/lib/ads/accounts.ts`

**Interfaces:**
- Produces: `AdStatus` (`"active"|"paused"|"rejected"|"other"`), `AdRange` (`"today"|"7d"|"30d"|"month"`), `AdPlatform` (`"google"|"snap"`), `AdCampaign`, `PlatformResult`, `DateWindow`, `dateWindow(range: AdRange): DateWindow`. And `adAccountsFor(branch: AdminBranch): BranchAdAccounts` where `BranchAdAccounts = { google?: { customerId: string; loginCustomerId?: string }; snap?: { label: string } }`.

- [ ] **Step 1: Write `src/lib/ads/types.ts`**

```typescript
// Shared shapes for the in-admin Ads panel. Each platform source normalises
// into these so the panel renders uniformly. Ported from NICK, trimmed to the
// platforms Oilo runs, with "rejected" added so a policy-disapproved campaign
// (e.g. the Nahda appeal) is visible.

export type AdStatus = "active" | "paused" | "rejected" | "other";
export type AdRange = "today" | "7d" | "30d" | "month";
export type AdPlatform = "google" | "snap";

export interface AdCampaign {
  id: string;
  name: string;
  status: AdStatus;
  statusRaw: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface PlatformResult {
  platform: AdPlatform;
  label: string;
  connected: boolean;        // tokens set AND request succeeded
  error?: string;            // tokens set but call failed
  currency: string;
  campaigns: AdCampaign[];
  source?: "live" | "snapshot";
  asOf?: string;             // snapshot capture date YYYY-MM-DD
  periodLabel?: string;      // snapshot human period, e.g. "Lifetime"
}

export interface DateWindow {
  start: string;             // inclusive YYYY-MM-DD, Riyadh local
  end: string;
}

function riyadhToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function dateWindow(range: AdRange): DateWindow {
  const end = riyadhToday();
  const [y, m, d] = end.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d));
  const start = new Date(base);
  if (range === "7d") start.setUTCDate(base.getUTCDate() - 6);
  else if (range === "30d") start.setUTCDate(base.getUTCDate() - 29);
  else if (range === "month") start.setUTCDate(1);
  return { start: start.toISOString().slice(0, 10), end };
}
```

- [ ] **Step 2: Write `src/lib/ads/accounts.ts`**

```typescript
// Per-branch ad-account config. The Google customer id lives here (not env) so
// one shared OAuth credential set can serve multiple branches. Al Rabie is left
// as a commented slot for a later phase.

import type { AdminBranch } from "@/lib/auth";

export interface BranchAdAccounts {
  google?: { customerId: string; loginCustomerId?: string };
  snap?: { label: string };
}

const ACCOUNTS: Record<AdminBranch, BranchAdAccounts> = {
  "al-nahda": {
    // Google Ads account 300-401-7182 (digits only). Search campaign 23947202811.
    google: { customerId: "3004017182" },
    snap: { label: "Snapchat" },
  },
  "al-rabie": {
    // TODO(later phase): add Al Rabie's Google customer id + Snap when in scope.
  },
};

export function adAccountsFor(branch: AdminBranch): BranchAdAccounts {
  return ACCOUNTS[branch] ?? {};
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles with no type errors touching `src/lib/ads/*`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/ads/types.ts src/lib/ads/accounts.ts
git commit -m "feat(ads): shared ad types + per-branch account config"
```

---

### Task 2: `ads_snapshots` table + snapshot reader + seed script

**Files:**
- Create (Supabase, via MCP/management API on project `ooltmgblbnuoutandexv`): table `ads_snapshots`
- Create: `src/lib/ads/snap.ts`
- Create: `scripts/seed-ads-snapshot.mjs`

**Interfaces:**
- Consumes: `AdCampaign`, `AdPlatform`, `PlatformResult` (Task 1); `AdminBranch` (`@/lib/auth`).
- Produces: `getSnapSnapshot(branch: AdminBranch): Promise<PlatformResult | null>`.

- [ ] **Step 1: Create the table (run via Supabase MCP `apply_migration`, name `ads_snapshots`)**

```sql
create table if not exists public.ads_snapshots (
  branch       text not null,
  platform     text not null,
  data         jsonb not null,   -- { label, currency, periodLabel, asOf, campaigns: [...] }
  as_of        date  not null,
  updated_at   timestamptz not null default now(),
  updated_by   text,
  primary key (branch, platform)
);
alter table public.ads_snapshots enable row level security;
-- Reads go through the anon server client (route is requireAdmin-gated already);
-- writes use the service-role key (bypasses RLS).
create policy ads_snapshots_read on public.ads_snapshots for select using (true);
```

Verify: `select * from public.ads_snapshots;` returns 0 rows, no error.

- [ ] **Step 2: Write `src/lib/ads/snap.ts`**

```typescript
// Snapchat figures for a branch. Snap has no read API, so the panel reads the
// most recent snapshot row pulled from the dashboard by scripts/seed-ads-snapshot.mjs.

import { getSupabase } from "@/lib/supabase";
import type { AdminBranch } from "@/lib/auth";
import type { AdCampaign, PlatformResult } from "./types";

interface SnapData {
  label?: string;
  currency?: string;
  periodLabel?: string;
  asOf?: string;
  campaigns?: AdCampaign[];
}

export async function getSnapSnapshot(branch: AdminBranch): Promise<PlatformResult | null> {
  const supa = getSupabase();
  const { data, error } = await supa
    .from("ads_snapshots")
    .select("data, as_of")
    .eq("branch", branch)
    .eq("platform", "snap")
    .maybeSingle();
  if (error || !data?.data) return null;
  const d = data.data as SnapData;
  return {
    platform: "snap",
    label: d.label || "Snapchat",
    connected: true,
    currency: d.currency || "SAR",
    campaigns: Array.isArray(d.campaigns) ? d.campaigns : [],
    source: "snapshot",
    asOf: d.asOf || (data.as_of as string),
    periodLabel: d.periodLabel,
  };
}
```

- [ ] **Step 3: Write `scripts/seed-ads-snapshot.mjs`** (manual figures now; swap to a Playwright pull later)

```javascript
// Upserts a Snapchat snapshot for a branch into ads_snapshots. Run after pulling
// the numbers from Snap Ads Manager (oilo-nahda Chrome profile).
//   node scripts/seed-ads-snapshot.mjs
// Reads SUPABASE URL + SERVICE ROLE from .env.local.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Minimal .env.local loader (no dotenv dep).
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing SUPABASE url/service-role in .env.local"); process.exit(1); }
const supa = createClient(url, key);

// EDIT these figures from the Snap dashboard, then run.
const branch = "al-nahda";
const asOf = "2026-06-21";
const snapshot = {
  label: "Snapchat",
  currency: "SAR",
  periodLabel: "Lifetime",
  asOf,
  campaigns: [
    // { id, name, status: "active"|"paused"|"rejected"|"other", statusRaw,
    //   spend, impressions, clicks, conversions }
  ],
};

const { error } = await supa.from("ads_snapshots").upsert(
  { branch, platform: "snap", data: snapshot, as_of: asOf, updated_by: "seed-script" },
  { onConflict: "branch,platform" },
);
if (error) { console.error(error); process.exit(1); }
console.log(`Seeded snap snapshot for ${branch} (${snapshot.campaigns.length} campaigns).`);
```

- [ ] **Step 4: Verify**

Run: `node scripts/seed-ads-snapshot.mjs` then re-query the table.
Expected: one `(al-nahda, snap)` row. (Campaigns array may be empty until you fill real figures — that is fine; the panel will show the Snap card with 0 campaigns.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/ads/snap.ts scripts/seed-ads-snapshot.mjs
git commit -m "feat(ads): ads_snapshots table reader + Snap seed script"
```

---

### Task 3: Google Ads live client

**Files:**
- Create: `src/lib/ads/google.ts`

**Interfaces:**
- Consumes: `AdCampaign`, `AdStatus`, `DateWindow`, `PlatformResult` (Task 1).
- Produces: `fetchGoogle(window: DateWindow, customerId: string, loginCustomerId?: string): Promise<PlatformResult>`. Returns `connected:false` when creds/customerId missing; never throws.

- [ ] **Step 1: Write `src/lib/ads/google.ts`**

```typescript
// Google Ads REST v24 client. Refreshes an OAuth access token, runs a GAQL
// searchStream for campaign metrics. customerId/loginCustomerId are passed in
// (per-branch from accounts.ts); the OAuth credential set is shared via env:
//   GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
//   GOOGLE_ADS_REFRESH_TOKEN  (+ optional GOOGLE_ADS_LOGIN_CUSTOMER_ID fallback)

import type { AdCampaign, AdStatus, DateWindow, PlatformResult } from "./types";

const API_VERSION = "v24";

interface GoogleRow {
  campaign?: { id?: string | number; name?: string; status?: string; primaryStatus?: string };
  metrics?: {
    costMicros?: string | number;
    impressions?: string | number;
    clicks?: string | number;
    conversions?: string | number;
  };
}

function gStatus(raw?: string, primary?: string): AdStatus {
  if (primary === "DISAPPROVED" || primary === "LIMITED") return "rejected";
  if (raw === "ENABLED") return "active";
  if (raw === "PAUSED") return "paused";
  return "other";
}

async function accessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<{ token?: string; error?: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.access_token) return { error: json.error_description || json.error || "OAuth refresh failed" };
  return { token: json.access_token as string };
}

export async function fetchGoogle(window: DateWindow, customerId: string, loginCustomerId?: string): Promise<PlatformResult> {
  const dev = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const loginCid = loginCustomerId || process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  const base: PlatformResult = { platform: "google", label: "Google", connected: false, currency: "SAR", campaigns: [] };
  if (!dev || !clientId || !clientSecret || !refreshToken || !customerId) return base;
  const cid = customerId.replace(/[^0-9]/g, "");

  try {
    const tok = await accessToken(clientId, clientSecret, refreshToken);
    if (!tok.token) return { ...base, error: tok.error };

    const query =
      "SELECT campaign.id, campaign.name, campaign.status, campaign.primary_status, " +
      "metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions FROM campaign " +
      `WHERE segments.date BETWEEN '${window.start}' AND '${window.end}'`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${tok.token}`,
      "developer-token": dev,
      "Content-Type": "application/json",
    };
    if (loginCid) headers["login-customer-id"] = loginCid.replace(/[^0-9]/g, "");

    const res = await fetch(
      `https://googleads.googleapis.com/${API_VERSION}/customers/${cid}/googleAds:searchStream`,
      { method: "POST", headers, body: JSON.stringify({ query }), cache: "no-store" },
    );
    const json = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(json) ? "Google Ads API error" : json?.error?.message || `Google Ads API error (${res.status})`;
      return { ...base, error: msg };
    }

    const chunks: Array<{ results?: GoogleRow[] }> = Array.isArray(json) ? json : [json];
    const byId = new Map<string, AdCampaign>();
    for (const chunk of chunks) {
      for (const row of chunk.results || []) {
        const camp = row.campaign || {};
        const m = row.metrics || {};
        const id = String(camp.id ?? "");
        if (!id) continue;
        const prev = byId.get(id) || ({
          id, name: camp.name || id,
          status: gStatus(camp.status, camp.primaryStatus),
          statusRaw: camp.primaryStatus || camp.status || "",
          spend: 0, impressions: 0, clicks: 0, conversions: 0,
        } as AdCampaign);
        prev.spend += (Number(m.costMicros) || 0) / 1e6;
        prev.impressions += Number(m.impressions) || 0;
        prev.clicks += Number(m.clicks) || 0;
        prev.conversions += Number(m.conversions) || 0;
        byId.set(id, prev);
      }
    }
    return { ...base, connected: true, campaigns: [...byId.values()] };
  } catch (e) {
    return { ...base, error: e instanceof Error ? e.message : "Google fetch failed" };
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: compiles clean. (No live call yet; tokens are absent so it would return `connected:false` at runtime.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/ads/google.ts
git commit -m "feat(ads): Google Ads REST v24 live client (per-branch customer id)"
```

---

### Task 4: Aggregator + `/api/admin/ads` route

**Files:**
- Create: `src/lib/ads/index.ts`
- Create: `src/app/api/admin/ads/route.ts`

**Interfaces:**
- Consumes: `dateWindow`, `AdRange`, `PlatformResult` (Task 1); `adAccountsFor` (Task 1); `fetchGoogle` (Task 3); `getSnapSnapshot` (Task 2); `requireAdmin`, `resolveBranch`, `AdminBranch` (`@/lib/auth`).
- Produces: `fetchBranchAds(branch: AdminBranch, range: AdRange): Promise<BranchAds>` where `BranchAds = { branch; range; window; platforms: PlatformResult[]; fetchedAt: string }`. Route: `GET /api/admin/ads?branch=&range=` → `BranchAds` JSON (or 401).

- [ ] **Step 1: Write `src/lib/ads/index.ts`**

```typescript
// Aggregates a branch's ad platforms for the /admin Ads panel. Google live +
// Snap snapshot run in parallel; each fails soft so one never breaks the other.

import { dateWindow, type AdRange, type PlatformResult } from "./types";
import type { AdminBranch } from "@/lib/auth";
import { adAccountsFor } from "./accounts";
import { fetchGoogle } from "./google";
import { getSnapSnapshot } from "./snap";

export type { AdRange, AdCampaign, PlatformResult, AdStatus } from "./types";

export interface BranchAds {
  branch: AdminBranch;
  range: AdRange;
  window: { start: string; end: string };
  platforms: PlatformResult[];
  fetchedAt: string;
}

export async function fetchBranchAds(branch: AdminBranch, range: AdRange): Promise<BranchAds> {
  const window = dateWindow(range);
  const cfg = adAccountsFor(branch);

  const tasks: Promise<PlatformResult | null>[] = [];
  if (cfg.google) tasks.push(fetchGoogle(window, cfg.google.customerId, cfg.google.loginCustomerId));
  if (cfg.snap) tasks.push(getSnapSnapshot(branch));

  const settled = await Promise.all(tasks);
  const platforms = settled.filter((p): p is PlatformResult => p !== null);
  return { branch, range, window, platforms, fetchedAt: new Date().toISOString() };
}
```

- [ ] **Step 2: Write `src/app/api/admin/ads/route.ts`** (mirror `overview/route.ts` for the auth preamble)

```typescript
import { requireAdmin, resolveBranch } from "@/lib/auth";
import { fetchBranchAds } from "@/lib/ads";
import type { AdRange } from "@/lib/ads";

const RANGES: AdRange[] = ["today", "7d", "30d", "month"];

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof Response) return auth;
  const branch = resolveBranch(request, auth);

  const rangeParam = new URL(request.url).searchParams.get("range");
  const range: AdRange = RANGES.includes(rangeParam as AdRange) ? (rangeParam as AdRange) : "30d";

  const data = await fetchBranchAds(branch, range);
  return Response.json(data);
}
```

- [ ] **Step 3: Verify build + endpoint auth**

Run: `npm run build`, then `npm run dev` in one shell and in another:
`curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/admin/ads?branch=al-nahda&range=30d"`
Expected: build clean; curl prints `401` (no session cookie). With a logged-in browser session, the route returns the JSON shape `{branch, range, window, platforms, fetchedAt}`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/ads/index.ts src/app/api/admin/ads/route.ts
git commit -m "feat(ads): branch ads aggregator + /api/admin/ads route"
```

---

### Task 5: AdsPanel UI + wire into `/admin`

**Files:**
- Create: `src/app/admin/AdsPanel.tsx`
- Modify: `src/app/admin/page.tsx` (Tab union ~line 9; `tabs` array ~line 494; panel blocks near other `{tab === ...}` sections)

**Interfaces:**
- Consumes: `GET /api/admin/ads` (Task 4) returning `BranchAds`.
- Produces: `<AdsPanel branch={branch} tr={tr} />` default-exported React client component. Read `branch` and `tr` from how `page.tsx` already passes locale/branch to other panels (it uses a module-level `tr(ar,en)` via `useI18n`; pass the same `tr` down, and the viewed branch string).

- [ ] **Step 1: Write `src/app/admin/AdsPanel.tsx`**

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

type AdStatus = 'active' | 'paused' | 'rejected' | 'other'
interface AdCampaign { id: string; name: string; status: AdStatus; statusRaw: string; spend: number; impressions: number; clicks: number; conversions: number }
interface PlatformResult { platform: string; label: string; connected: boolean; error?: string; currency: string; campaigns: AdCampaign[]; source?: string; asOf?: string; periodLabel?: string }
interface BranchAds { branch: string; range: string; platforms: PlatformResult[]; fetchedAt: string }

const RANGES: { k: string; ar: string; en: string }[] = [
  { k: 'today', ar: 'اليوم', en: 'Today' },
  { k: '7d', ar: '٧ أيام', en: '7 days' },
  { k: '30d', ar: '٣٠ يوم', en: '30 days' },
  { k: 'month', ar: 'هذا الشهر', en: 'This month' },
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

  const total = (data?.platforms || []).reduce((s, p) => s + p.campaigns.reduce((a, c) => a + c.spend, 0), 0)
  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-[#999]">
          {tr('إجمالي الصرف', 'Total spend')}: <span className="text-white font-semibold">{fmt(total)} SAR</span>
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
```

- [ ] **Step 2: Add `'ads'` to the `Tab` union** in `src/app/admin/page.tsx` (~line 9)

```typescript
type Tab = 'overview' | 'bookings' | 'gifts' | 'memberships' | 'contact' | 'customers' | 'analytics' | 'ads'
```

- [ ] **Step 3: Import the panel** near the other imports at the top of `page.tsx`

```typescript
import AdsPanel from './AdsPanel'
```

- [ ] **Step 4: Add the nav entry** to the `tabs` array (the `{ k: 'overview', l: tr(...), i: '...' }` list ~line 494). Append:

```typescript
    { k: 'ads', l: tr('الإعلانات', 'Ads'), i: 'M3 3h18v4H3zM3 10h12v4H3zM3 17h18v4H3z' },
```

- [ ] **Step 5: Add the panel block** alongside the other `{tab === '...' && (...)}` sections (after the `analytics` block). Use the branch the dashboard is currently viewing. `page.tsx` already tracks the viewed branch for its other fetches (it sends `?branch=` to the admin APIs); pass that same value. If the viewed branch is held in a state/var named differently, use that var; it is the `branch` string sent to the other admin endpoints.

```tsx
        {tab === 'ads' && (
          <AdsPanel branch={viewedBranch} tr={tr} />
        )}
```

- [ ] **Step 6: Verify build + manual**

Run: `npm run build` (expect clean). Then `npm run dev`, log in to `/admin`, switch to / log in as Al Nahda, open the **Ads** tab. Expect: a Google card (likely "not connected" until tokens are wired) and a Snapchat card (snapshot, showing seeded campaigns or "No campaigns"), a range selector, and a SAR total. Confirm the rest of `/admin` still works.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/AdsPanel.tsx src/app/admin/page.tsx
git commit -m "feat(ads): Ads tab in /admin (branch-scoped Google + Snap)"
```

---

### Task 6: Deploy, live smoke test, document

**Files:**
- Modify: memory `project_oilo_*` (index + topic file) after verification.

- [ ] **Step 1: Push and let Vercel deploy**

```bash
git push
```

- [ ] **Step 2: Live smoke test**

`curl -s -o /dev/null -w "%{http_code}\n" "https://oilo.sa/api/admin/ads?branch=al-nahda&range=30d"` → expect `401` unauthenticated. Log into `oilo.sa/admin` as Al Nahda, open the Ads tab, confirm both cards render and the Snap snapshot shows.

- [ ] **Step 3: (When ready) wire Google live**

Add to Vercel env (Production): `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, optional `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. Redeploy. The Google card flips from "not connected" to live for customer `3004017182`. (Customer id is in `accounts.ts`, not env.)

- [ ] **Step 4: Update memory**

Add a topic file note: Oilo `/admin` now has a branch-scoped Ads tab (Google live + Snap snapshot), Nahda first; table `ads_snapshots`; seed via `scripts/seed-ads-snapshot.mjs`; Google needs the 4-5 env tokens to go live. Add a one-line index entry in `MEMORY.md`.

---

## Self-Review

**Spec coverage:**
- Ads tab in `/admin`, branch-scoped → Tasks 5 (UI) + 4 (route uses `resolveBranch`). Covered.
- Google live (per-branch customer id, fail-soft) → Task 3 + accounts (Task 1). Covered.
- Snap snapshot + storage table + seed → Task 2. Covered.
- `rejected` status visible → Task 1 type + Task 3 `gStatus` (primary_status) + Task 5 pill. Covered.
- SAR-only, combined total → Task 5 (no FX anywhere). Covered.
- Fail-soft per platform → Task 4 (`Promise.all`, filter) + each client. Covered.
- No new test framework; build + endpoint verify → every task's verify step. Covered.
- Nahda first, al-rabie a clean slot → Task 1 `accounts.ts`. Covered.

**Placeholder scan:** The only `TODO` is the intentional al-rabie config slot (a real future-phase marker, not missing implementation) and the seed script's campaigns array (filled by the operator from the live dashboard, by design). No vague "add error handling" steps — fail-soft is concrete in each client.

**Type consistency:** `AdStatus`/`AdRange`/`AdPlatform`, `AdCampaign`, `PlatformResult`, `fetchGoogle(window, customerId, loginCustomerId?)`, `getSnapSnapshot(branch)`, `fetchBranchAds(branch, range)`, `adAccountsFor(branch)` are consistent across Tasks 1-5. The `AdsPanel` redeclares the wire types locally (client component, no server imports) — kept identical to `types.ts` on purpose.

**One open item (carried from spec):** whether NICK's Google dev token / OAuth client can reach customer `3004017182` (same MCC?) is unknown until wiring in Task 6 Step 3; the panel ships working (Snap + Google-not-connected) regardless.
