# Supabase RLS Lockdown — Security Remediation

**Date:** 2026-06-24
**Trigger:** Supabase critical-advisory email (issues as of 2026-06-22) flagging `rls_disabled_in_public` and `sensitive_columns_exposed` on projects `oilo-spa` and `farisgroup-erp`.
**Status:** Both flagged projects fixed and verified. One related DB still unchecked (see Follow-ups).

> No secrets are stored in this file. Keys/passwords live only in the env files referenced below.

---

## 1. Oilo (`oilo-spa`, ref `ooltmgblbnuoutandexv`)

Shared Supabase project hosting BOTH Oilo (`bookings` + lead tables) and Elite (`elite_*` via SECURITY DEFINER RPCs).

### Problem (live-exploitable)
The app shipped `NEXT_PUBLIC_SUPABASE_ANON_KEY` (inlined into the browser bundle), and that key had:
- `bookings`: `Allow public read/insert/update` anon policies with `USING(true)` — anyone could read every booking (name, phone, IP) and overwrite/cancel any.
- `contact_messages`, `membership_requests`, `gift_requests`, `booking_phone_attempts`: RLS fully disabled — open read/write to anon.

Proven with the anon key: read **62 bookings + 2 gift_requests**, open `200` access to the lead tables.

### Root cause
Every DB call is server-side (`/api/*` + cron) through `getSupabase()` in `src/lib/supabase.ts`, but it used the **anon** key. No service-role key existed anywhere.

### Fix
1. Set a **server-only** secret key `SUPABASE_SERVICE_ROLE_KEY` (an `sb_secret_…` key) in Vercel (production + preview + development) and local `.env.local`. NOT `NEXT_PUBLIC_`.
2. `getSupabase()` now prefers the service-role key (falls back to anon if absent). Server-only, never bundled to the browser. Commit `9ab7d0e` on `master`, deployed to `oilo.sa`.
3. Migration `lockdown_public_lead_tables_and_bookings_rls`:

```sql
alter table public.contact_messages       enable row level security;
alter table public.membership_requests    enable row level security;
alter table public.gift_requests          enable row level security;
alter table public.booking_phone_attempts enable row level security;

drop policy if exists "Allow public read"   on public.bookings;
drop policy if exists "Allow public insert" on public.bookings;
drop policy if exists "Allow public update" on public.bookings;
```

### Verified
- App: `/api/booking/slots?date=2026-07-02&branch=al-rabie` still returns `21:00 booked:1` (service-role read works).
- Attacker: anon REST now returns `[]` for all five tables (was 62 + 2); anon `INSERT` into `bookings` → `401 / violates row-level security policy`.
- Advisor: **0 ERROR findings**. Remaining items are INFO/WARN and intentional (Elite `elite_*` RPCs, deny-all RLS state).

### Rollback (if ever needed)
```sql
create policy "Allow public read"   on public.bookings for select to anon using (true);
create policy "Allow public insert" on public.bookings for insert to anon with check (true);
create policy "Allow public update" on public.bookings for update to anon using (true) with check (true);
alter table public.contact_messages       disable row level security;
alter table public.membership_requests    disable row level security;
alter table public.gift_requests          disable row level security;
alter table public.booking_phone_attempts disable row level security;
```

---

## 2. Faris ERP (`farisgroup-erp`, ref `nkujutbbzqizoyuvsjuz`)

Eclipse Cloud ERP (`www.eclipsecloud.io`). Repo: `C:\Users\acer\on-boarding`. Connection in `on-boarding/.env.faris`.

### Problem (catastrophic, live-exploitable)
**All 80 public tables had RLS disabled**, and `anon` + `authenticated` held full `SELECT/INSERT/UPDATE/DELETE/TRUNCATE` on every table. The public anon key could read or wipe the entire multi-tenant DB, including:
- `users.password`, `users.resetToken`, `users.resetTokenExpiry`
- `tenant_email_accounts.imapPassword` / `smtpPassword`
- `erp_requests.adminPassword`
- `payments`, `payroll_records`, `subscriptions`, and client/employee/supplier PII across all tenants.

Proven with the anon key: read `users` (12), `invoices` (1), `tenants` (2); open access to `tenant_email_accounts`.

### Why the fix is safe with zero app/code change
- The MCP cannot reach this project (different Supabase org → `permission denied`).
- The ERP is **Prisma-only** (no `@supabase/supabase-js` in the codebase) and connects as the table-owner `postgres` role.
- A non-owner role is blocked by RLS; the **owner bypasses non-forced RLS**. So enabling RLS (not FORCE) denies the unused anon/PostgREST surface and leaves Prisma untouched.

### Fix
Applied over the direct owner connection (`POSTGRES_URL_NON_POOLING` in `.env.faris`), in one transaction:

```sql
-- For every base table in schema public (80 of them):
ALTER TABLE public."<table>" ENABLE ROW LEVEL SECURITY;  -- NOT forced
```

Idempotent re-apply (run from a temp dir with `pg` installed; reads conn from `.env.faris`):

```js
// faris_apply_rls.mjs — enable RLS on all RLS-disabled public tables
import fs from 'node:fs'; import pg from 'pg'
const env = fs.readFileSync('C:/Users/acer/on-boarding/.env.faris','utf8')
const get = k => { const m = env.match(new RegExp('^'+k+'=(.*)$','m')); return m ? m[1].trim().replace(/^["']|["']$/g,'') : null }
const conn = (get('POSTGRES_URL_NON_POOLING') || get('DATABASE_URL')).split('?')[0]
const c = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
await c.connect()
const { rows } = await c.query(`SELECT relname t FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity=false`)
await c.query('BEGIN')
for (const r of rows) await c.query(`ALTER TABLE public."${r.t}" ENABLE ROW LEVEL SECURITY`)
await c.query('COMMIT')
console.log('enabled RLS on', rows.length, 'tables'); await c.end()
```
> Note: recent `pg` treats `?sslmode=require` as `verify-full` and rejects Supabase's cert — strip the query string and pass `ssl:{rejectUnauthorized:false}`.

### Verified
- App: owner role (Prisma) still reads `users:12, invoices:1, tickets:2001` after RLS; `eclipsecloud.io/api/health` → `{"status":"healthy","database":{"status":"up"}}`.
- Attacker: anon REST now returns `[]` on `users/invoices/tenants/payments/payroll_records`; anon `INSERT` into `users` → `401 / violates row-level security policy`.

### Rollback (if ever needed)
```sql
ALTER TABLE public."<table>" DISABLE ROW LEVEL SECURITY;  -- per table
```

---

## Follow-ups / open items

1. **Faris RLS is not in a Prisma migration.** Migrate-on-deploy is disabled for this repo, so schema/security live as manual DDL on the DB. A `migrate reset`/rebuild-from-migrations would drop the RLS — re-run the script above or fold the `ALTER ... ENABLE ROW LEVEL SECURITY` into the migration baseline.
2. **Apex `on-boarding` DB not checked.** Two Vercel projects deploy `on-boarding` from `main`: `farisgroup-crm-demo` (www.eclipsecloud.io, the DB fixed here) and `on-boarding` (apex eclipsecloud.io, its OWN separate DB whose URL lives only in Vercel env). It was not in the Supabase email, but if it is a Supabase project it likely has the same wide-open RLS. Pull its `DATABASE_URL` from Vercel and check/fix the same way.
3. **Optional credential rotation.** The Faris Postgres password and the Oilo `sb_secret_` key appeared in command output during this work (own credentials, already in env, no new external exposure). Rotate if desired; if so, update Vercel env + `.env.*` accordingly.
4. **Oilo minor advisor WARNs (left as-is):** `book_slot` mutable search_path; `elite-content` public bucket listing; `elite_*` SECURITY DEFINER RPCs callable by anon (intentional). Optional hardening only.

---

## Quick reference
| Item | Value |
|---|---|
| Oilo project ref | `ooltmgblbnuoutandexv` |
| Oilo repo | `C:\Users\acer\oilo-spa` (Vercel `oilo-spa`, team `team_FrwoUNWFl9ZnsSAA5UWuEB9K`) |
| Oilo env var added | `SUPABASE_SERVICE_ROLE_KEY` (prod+preview+dev + `.env.local`) |
| Oilo commit | `9ab7d0e` |
| Faris project ref | `nkujutbbzqizoyuvsjuz` |
| Faris repo / env | `C:\Users\acer\on-boarding` / `.env.faris` |
| Faris fix method | direct Postgres DDL (owner role), 80 tables |
