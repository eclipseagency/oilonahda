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
- **Reviews (2026-07-22):** replaced the inherited/fabricated testimonials with seven real 5-star reviews manually verified on the Al Nahda Google Maps listing. The live Google-style slider shows the verified aggregate **4.9 / 18 reviews** and links back to the listing. This is a curated snapshot, not an automatic API feed.
- **Performance (2026-07-22):** removed the sticky announcement ticker, its continuous animation, and its navbar offset (`cfc0c38`).
- **Service catalog/images (2026-07-22):** reconciled the latest client prices/services, including warm-compress massage at 100 SAR and 60-minute Mix Massage at 365 SAR. The rendered catalog has 29 cards using 29 content-distinct images (MD5 + dHash checked). Images showing or ambiguously suggesting women were replaced; the site is a men's spa.
- **Analytics:** stopped firing the main (Rabie) Google Ads tag — only the Nahda account (`AW-18168193830`) configures now.
- **Cleanup:** deleted dead `Services.tsx`/`Offers.tsx`/`Footer.tsx`; removed stray source PNG.
- **Fixes:** broken blog image `swedish.webp`→`swedish-massage.webp`; hero `<video>` got a `poster` (no mobile black flash).

## 6. ⚠ OPEN / IN PROGRESS
- **"Massage → Wellness" rebrand (uncommitted, half-live).** A terminology change مساج/سبا → عافية/عناية (Massage/Spa → Wellness/Grooming), likely for ad-policy compliance, is in the working tree across ~7 files (layout, page, BranchHome, SiteFooter, al-nahda, booking/layout, nahdaBranchData) but **not committed**. Because a `vercel --prod` deploy shipped the working tree, the **homepage meta/hero already say "عافية/عناية" LIVE**, while the **service menu (`nahdaServices.ts`), booking, and blog still say "مساج"** → the live site is currently inconsistent, and git HEAD is behind production. DECISION NEEDED: finish the rebrand through the service menu + commit, or revert.
- **Hero replacement awaiting approval.** `public/services/nahda-hero-branch-v2.webp` and a local `BranchHome.tsx` change replace the video with a 120 KB branch-derived still, but Mustafa asked to inspect it before changing the live site. It remains uncommitted and must not be included in unrelated deploys until explicitly approved.
- **Email sending domain** still `info@oilo.sa`. Move to `@oilospa.com` only after DNS/DKIM setup.

## 7. Gotchas
- Modified Next 16 — heed `AGENTS.md`.
- `vercel --prod` ships the working dir (see §2).
- Two navs to keep in sync (see §3).
- The live homepage hero remains the video. A branch-derived still is staged locally but unapproved; see §6.
- Several unrelated local files remain modified. For production, commit only task files and deploy from a clean detached worktree at the intended commit; never run `vercel --prod` from the dirty primary tree.

## 8. Service card images — read before touching them

Four traps, each of which cost real time on 2026-07-17. Every one was avoidable.

**Read §1 first.** `oilospa.com` is **this** repo (Al Nahda). `oilo.sa` is the
*other* one (`oilo-spa`). A bug reported on oilospa.com was diagnosed and shipped
against the wrong site before anyone re-read §1, which says this plainly. Quick
check: oilospa.com serves `/services/nahda-*.webp`; oilo.sa does not.

**`public/` is served `immutable, max-age=31536000`.** The filename is the cache
key. **Never replace an image's contents in place** — new visitors get the new
picture, everyone who already loaded the page keeps the old one for a year, and
you will "fix" a bug that the reporter still sees. Rename instead (`-v2`, as in
`SERVICE_IMAGE_OVERRIDES`). A `?v=` query does *not* work here: `next/image`
rejects query strings unless `images.localPatterns` enumerates every local image
path, and anything not listed then 400s.

**Counting distinct URLs proves nothing.** The set once had 39 files but only 26
pictures — `nahda-pedi`, `nahda-addon-foot`, `nahda-mani-pedi-vip` and
`nahda-offer-massage-pedi` were byte-identical, plus six more groups. "33 distinct
images" passed while the grid still looked duplicated. Verify by **content**:
```
cd public/services && md5 -q nahda-*.webp | sort | uniq -d      # identical files
```
Expect **two** hits, both fine: `nahda-candles` = `nahda-pkg-grooms-program` and
`nahda-hammam` = `nahda-pkg-grooms-day`. Those pairs are a booking card and a
`gallery/page.tsx` image sharing a photo — different sections, not two cards.
Any *other* hit is a real duplicate.

Then verify by **appearance**: dHash the image each card resolves to and compare
every pair. Two different photos of the same room (as `بدكير يد` and `بدكير قدم`
once were) still read as a duplicate to a customer, which is the only test that
counts.

**Same-room services can't be told apart by a photo.** The five facial cleansings
are one procedure at five price points; the two oil baths differ only by what goes
in the hair. They share a card with a type toggle via `SERVICE_VARIANTS` in
`src/lib/services.ts` (same mechanism as the 60/40 min massages) — grouping, not
ten near-identical photos. Booking renders **33 cards from 39 keys** because of it.

Images are AI-generated still lifes in the branch's style (warm beige, objects, no
people, no text). Swap in real photos whenever they exist — only the filename
matters, and per the rule above, give the replacement a new name.

## 9. Homepage → booking (verified 2026-07-17)

Already wired; don't rebuild it. Homepage service cards are `<Link>`s to
`/booking?service=<key>` (`serviceHref` in `BranchHome.tsx`), and `booking/page.tsx`
pre-selects from that param, sets the right category tab, and enables Continue.
Homepage and booking both render the same 33 services from the same catalog
(`nahdaServices` → `nahdaServicesAsServices`), so they cannot drift.

Note `/services` is a different thing: 4 **SEO landing pages**
(`serviceLanding.ts`), not the bookable catalog. It is not meant to match booking.
