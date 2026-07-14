# Oilo Spa — Al Nahda site (oilospa.com) — STATUS & RUNBOOK

Last updated: 2026-07-09

## 1. What this is
- **oilospa.com** = the standalone website for **Oilo Spa فرع النهضة (Al Nahda branch)**, a men's spa in Al Nahda, Riyadh.
- It is **separate** from oilo.sa (the original two-branch site). Different repo, different Vercel project, different domain.
- **Repo:** `eclipseagency/oilonahda` (branch `main`), cloned locally at `C:\Users\acer\oilonahda`.
- **Vercel project:** `oilonahda` (prj_dLMkdGbsHc6y5LpoL4HCGIATW6FQ, team `eclipse-agencys-projects`).
- **Domain:** `www.oilospa.com` (apex `oilospa.com` 308-redirects to www).
- **Framework:** Next.js 16 (App Router). ⚠ This is a modified Next — see `AGENTS.md`; read `node_modules/next/dist/docs/` before using unfamiliar Next APIs.

> ⚠ **Do NOT confuse with `C:\Users\acer\oilo-spa`** (that's oilo.sa / Al Rabie, a different repo+project+domain). Edits for oilospa.com go HERE, in `oilonahda`.

## 2. Deploy
GitHub auto-deploy is unreliable — deploy from the CLI:
```bash
cd /c/Users/acer/oilonahda
npm run build            # verify it compiles first
git add -A && git commit -m "..."   # ⚠ see caveat below
git push origin main
npx vercel link --project oilonahda --yes   # once, if .vercel missing
npx vercel --prod --yes
```
- **⚠ `vercel --prod` deploys the WORKING DIRECTORY, not git.** Uncommitted changes in the working tree WILL go live. Keep git and the working tree in sync before deploying, or you'll ship half-finished work (this bit us — see §6).
- Env vars (Supabase, analytics, SMTP) live on the Vercel project — already configured.

## 3. Architecture / where things live
- **Homepage** = `src/components/BranchHome.tsx` — one big client component with **internal** `Navbar()` / `Hero()` / `Services()` / `Offers()` / `Footer()` functions that read Al Nahda data via `useBranch()` context (`BRANCH_CTX['al-nahda']`). The homepage keeps its OWN nav/footer.
- **Shared chrome for sub-pages** = `src/components/SiteNav.tsx` + `SiteFooter.tsx`. Mounted on: services, offers, contact, gallery, blog list, blog post, gift, membership, service-detail. Booking keeps its own minimal flow header.
  - ⚠ **Two nav implementations** (BranchHome's + SiteNav) kept in sync by hand — the 8 items must match: Home · Services · Offers · Ambiance(الأجواء) · Reviews · FAQ · Blog · Contact. If you add/rename a nav item, edit BOTH.
- **Service menu data** = `src/lib/nahdaServices.ts` (the master list; categories massage/addon/pedicure/bath/package/offer). Adapted for the homepage/booking shape by `src/lib/nahdaBranchData.ts` (`nahdaServicesAsServices`, `nahdaServiceImages`, `nahdaCategoriesTabs`).
  - Per-service images auto-map by key → `public/services/nahda-<key>.webp` (so a new service just needs an entry + that webp file).
- **Booking** (`src/app/booking/page.tsx`) **hardcodes** `const branch = 'al-nahda'` — it always books Nahda regardless of URL. So `/booking` is clean (no `?branch=` needed).
- **Branch facts** (address, phone, WhatsApp, hours, geo) = `src/lib/branches.ts` → `branches['al-nahda']`. Phone `0556733851`, WhatsApp `966556733851`. Hours: Sat–Thu 10 AM–6 AM, Fri 4 PM–6 AM.
- **Contact email (display)** = `oilonahda@gmail.com`. **SMTP sender** (`src/lib/email.ts`) is still `info@oilo.sa` (verified sender — left intentionally; moving to an @oilospa.com sender needs DNS/DKIM first).

## 4. Pages
`/` (home) · `/services` (full menu) · `/offers` · `/gallery` (الأجواء) · `/contact` · `/blog` + `/blog/[slug]` · `/gift` · `/membership` · `/booking` + `/booking/manage` · `/al-nahda` (renders the homepage; canonicalizes to `/`) · `/services/[slug]` (SEO landing pages) · `/admin`, `/dashboard` (internal).

## 5b. Done 2026-07-10
- **Outbound / "exit" click tracking → admin.** New `src/app/api/track/click/route.ts` persists every WhatsApp/phone/email/location/social link click to Supabase `outbound_clicks` (branch `al-nahda`, service-role insert). `AnalyticsListeners.tsx` now classifies those hrefs and `navigator.sendBeacon`s them (still fires the gtag WA/phone events too). `/api/admin/analytics` rolls them up (30d/90d, by type); the admin dashboard (Analytics view) shows an **"Outbound / Contact Clicks"** card. Ported from oilo-spa (same shared Supabase `ooltmgblbnuoutandexv`; `outbound_clicks` table already existed). Deployed + live-tested (204 + row landed as al-nahda, test rows deleted). ⚠ this deploy also shipped the still-uncommitted massage→wellness working-tree changes (already live before — no regression; see §6).

## 5. Done in the 2026-07-09 session
- **Booking URL cleaned** → `/booking` (dropped redundant `?branch=al-nahda` from all links; `isNahdaBranch()` in `track.ts` returns true).
- **Contact page** rebuilt (form + Nahda location panel: embedded map, address, hours, WhatsApp/call).
- **Services page** rebuilt into a real menu (hero + category sections with image/price/book + guides + CTA).
- **Offers page** wired into nav + offer-card images + bundle-price chip.
- **Gallery (الأجواء) page** created — was a dead scroll link (homepage `showGallery:false`); now `/gallery` with Nahda photos + lightbox.
- **New service:** `foot-crack-care` عناية تشققات القدمين — 250 SAR/session, 600 SAR for 3 sessions, image `public/services/nahda-foot-crack-care.webp`.
- **Nav unified** across all pages; nav+footer added to blog/gift/membership/service-detail.
- **Open-now badge** fixed to Nahda hours (closes 6 AM).
- **SEO domain migration** oilo.sa → www.oilospa.com everywhere (canonical/OG/metadataBase/sitemap/JSON-LD/blog links/snapCapi). robots.txt + manifest too. Left `email.ts` SMTP untouched.
- **Membership** now uses the Nahda catalog (was Rabie's `@/lib/services`).
- **i18n Location hours** corrected to Nahda.
- **Sitemap** gained `/gallery` + `/al-nahda`.
- **Reviews:** removed the fabricated "4.9 · 187 reviews on Google" badge (new branch can't claim it).
- **Analytics:** stopped firing the main (Rabie) Google Ads tag — only the Nahda account (`AW-18168193830`) configures now.
- **Cleanup:** deleted dead `Services.tsx`/`Offers.tsx`/`Footer.tsx`; removed stray source PNG.
- **Fixes:** broken blog image `swedish.webp`→`swedish-massage.webp`; hero `<video>` got a `poster` (no mobile black flash).

## 6. ⚠ OPEN / IN PROGRESS
- **"Massage → Wellness" rebrand (uncommitted, half-live).** A terminology change مساج/سبا → عافية/عناية (Massage/Spa → Wellness/Grooming), likely for ad-policy compliance, is in the working tree across ~7 files (layout, page, BranchHome, SiteFooter, al-nahda, booking/layout, nahdaBranchData) but **not committed**. Because a `vercel --prod` deploy shipped the working tree, the **homepage meta/hero already say "عافية/عناية" LIVE**, while the **service menu (`nahdaServices.ts`), booking, and blog still say "مساج"** → the live site is currently inconsistent, and git HEAD is behind production. DECISION NEEDED: finish the rebrand through the service menu + commit, or revert.
- **Reviews testimonials** are carried over from Al Rabie (the fake count is gone, but the quotes aren't verified Nahda reviews). Swap for real ones or hide the section — client call.
- **Email sending domain** still `info@oilo.sa`. Move to `@oilospa.com` only after DNS/DKIM setup.

## 7. Gotchas
- Modified Next 16 — heed `AGENTS.md`.
- `vercel --prod` ships the working dir (see §2).
- Two navs to keep in sync (see §3).
- Homepage hero is a `/hero.mp4` video (needs a poster; already added).
