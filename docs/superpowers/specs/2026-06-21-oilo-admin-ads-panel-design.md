# Oilo `/admin` Ads panel — design spec

Date: 2026-06-21
Owner: Mustafa
Status: approved for planning

## Problem

Oilo's `/admin` dashboard shows bookings, gifts, memberships, contact, customers,
and analytics — but nothing about the **ad spend driving those bookings**. To see
what's running and how much it's costing, Mustafa has to log into each ad platform
separately. We already solved this for NICK (`nick.sa/admin/ads`); Oilo should get
the same, **starting with the Al Nahda branch**.

## Goal

A new **"Ads" (الإعلانات) tab** inside the existing `/admin` page that shows, for the
**currently-viewed branch**, each ad platform's campaigns: what's running vs paused
vs rejected, spend, results, impressions, and CPA — over today / 7d / 30d / this
month. Nahda first; the design is branch-keyed so Al Rabie is a trivial later add.

## Non-goals (v1)

- No write actions (pause/resume/budget). Read-only panel.
- No Meta or TikTok (Nahda runs only Google + Snapchat, confirmed 2026-06-21).
- No new test framework. The Oilo repo has none; we verify by build + live endpoint.
- Al Rabie data is out of scope now (config leaves a clean slot for it).

## Platforms (Al Nahda)

- **Google Ads** — live via REST API. Search campaign `23947202811`, customer id
  `3004017182` (acct 300-401-7182), 150 SAR/day, login `oilonahda@gmail.com`.
  Appeal pending, so showing **rejected/limited** status matters.
- **Snapchat** — no read API exists, so it is **snapshot-only**: figures pulled from
  the Snap dashboard into a stored row, refreshed by a seed script.

## Architecture

Mirrors NICK's `src/lib/ads/` (trimmed to the two platforms Nahda uses), adapted to
Oilo's **branch-scoped** auth instead of NICK's org-roles.

### Auth & placement
- The Ads tab lives in `src/app/admin/page.tsx` (client component): add `'ads'` to the
  `Tab` union, a nav entry, and a panel block. The panel body is extracted into its
  own component `src/app/admin/AdsPanel.tsx` to keep `page.tsx` from bloating.
- Data comes from a new route `src/app/api/admin/ads/route.ts` that does the standard
  `requireAdmin()` + `resolveBranch(request, session)`. The branch the panel reads is
  whatever branch the admin is viewing — no new auth code.

### Data flow
```
AdsPanel (range selector) → GET /api/admin/ads?branch=<branch>&range=<range>
  route: requireAdmin() + resolveBranch()
    → adAccountsFor(branch)                       // src/lib/ads/accounts.ts
    → fetchGoogle(window, customerId, loginCid)   // live REST v24, fails soft
    → getSnapSnapshot(branch)                     // latest Snap snapshot row
    → { range, window, platforms: [...], fetchedAt }
```

### Modules (`src/lib/ads/`)
- `types.ts` — `AdStatus` (`active|paused|rejected|other`), `AdRange`, `AdPlatform`
  (`google|snap`), `AdCampaign`, `PlatformResult`, `DateWindow`, and the Riyadh-tz
  `dateWindow(range)` helper. Ported from NICK; add `rejected` to `AdStatus` so the
  appeal state is visible.
- `accounts.ts` — branch → ad-account config:
  `{ google?: { customerId, loginCustomerId? }, snap?: { label } }`. Nahda filled;
  Al Rabie slot left empty/commented for later.
- `google.ts` — ported from NICK, but takes `customerId` (and optional
  `loginCustomerId`) as **arguments** instead of reading them from env, so one shared
  OAuth credential set serves multiple branches. Shared creds from env
  (`GOOGLE_ADS_DEVELOPER_TOKEN`, `_CLIENT_ID`, `_CLIENT_SECRET`, `_REFRESH_TOKEN`,
  optional `_LOGIN_CUSTOMER_ID`). Returns `connected:false` (no crash) when creds or
  customerId are missing. Maps `ENABLED→active`, `PAUSED→paused`, and any
  removed/disapproved state → `rejected/other`.
- `snap.ts` — reads the most recent `ads_snapshots` row for `(branch,'snap')` and
  returns it as a `PlatformResult` with `source:'snapshot'`, `asOf`, `periodLabel`.
- `index.ts` — `fetchBranchAds(branch, range)`: resolves the branch config, runs the
  Google live fetch + Snap snapshot read in parallel, returns the combined result.
  Each platform fails independently.

### Snapshot storage (new Supabase table)
Oilo has no settings/kv table, so create:
```sql
create table if not exists ads_snapshots (
  branch       text not null,
  platform     text not null,
  data         jsonb not null,   -- { label, currency, periodLabel, campaigns: [...] }
  as_of        date  not null,
  updated_at   timestamptz not null default now(),
  updated_by   text,
  primary key (branch, platform)
);
```
Created directly in Supabase project `ooltmgblbnuoutandexv` (the shared spa project)
via MCP/management API — consistent with how Oilo's schema is managed (no local
migrations dir). Seeded by `scripts/seed-ads-snapshot.mjs` (Node, service-role key
from `.env.local`): I pull the Snap dashboard (Playwright, oilo-nahda profile) and
upsert the Snap row for `al-nahda`. Re-run to refresh.

### Currency
Al Nahda is **all SAR** (Google and Snap both budget in SAR), so no FX conversion;
the panel can show a single combined SAR total.

### What the panel shows
Per platform card: connection state (or error/snapshot badge with `as of`), and per
campaign: status pill (running/paused/rejected), spend, results (Google:
conversions, with clicks; Snap: purchases/swipes from the snapshot), impressions,
CPA. A small combined SAR total for the branch at the top. Arabic-default labels
(RTL), matching the existing admin styling (`#C9A96E` accent, dark theme).

### Error handling / fail-soft
- Missing Google creds → Google card shows "not connected" (snapshot fallback if a
  Google snapshot ever exists; none planned for Nahda). Google API failure → error
  string on the card.
- No Snap snapshot row yet → Snap card shows "no snapshot yet".
- One platform's failure never affects the other or the rest of `/admin`.
- Route returns 401 via `requireAdmin()` when unauthenticated.

## Testing / verification
No unit-test harness exists in this repo; do **not** add one. Verify by:
1. `npm run build` (type-check + lint clean).
2. Seed a Snap snapshot locally, hit `/api/admin/ads?branch=al-nahda&range=30d`,
   confirm JSON shape; load `/admin`, open the Ads tab, confirm both cards render and
   currencies/totals look right.
3. Deploy to Vercel; smoke-test the live route returns 401 unauthenticated and the
   tab renders for a logged-in Nahda admin.

## Env to wire (live Google; until present, Google card shows "not connected")
`GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`,
`GOOGLE_ADS_REFRESH_TOKEN`, optional `GOOGLE_ADS_LOGIN_CUSTOMER_ID` (MCC). The
per-branch customer id (`3004017182`) lives in `accounts.ts`, not env. NICK already
has a Google Ads dev token + OAuth client; whether they can be reused depends on
whether `3004017182` is reachable under that login/MCC — to be confirmed when wiring.

## Phasing
- **P1 (this spec):** Nahda read-only panel — Google live + Snap snapshot.
- Later: Al Rabie (add to `accounts.ts` + seed its Snap), write actions, auto-refresh
  cron for the Snap snapshot.

Related: NICK template `nick/src/lib/ads/*` + `nick/src/app/admin/ads/page.tsx`;
shared Supabase project `ooltmgblbnuoutandexv`; Oilo branch auth `src/lib/auth.ts`.
