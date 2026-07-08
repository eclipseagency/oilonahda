# Email pipeline — finish deploy

The Resend code is shipped. To go live you only need: an API key, a Vercel env, and (for branded sender) DNS records.

---

## Step 1 — Pick a path

| Path | Cost | Sender shown in inbox |
|------|------|------------------------|
| **A1** Free Resend on `mustafa.halawa9+oilo@gmail.com` | $0 | `Oilo Spa <info@oilo.sa>` |
| **A2** Upgrade airpost's Resend to Pro | $20/mo | `Oilo Spa <info@oilo.sa>` |
| **A3** Ship today on `onboarding@resend.dev` | $0 | `Oilo Spa <onboarding@resend.dev>` (works, less branded) |

A3 is the default the code already uses. To upgrade to A1/A2, follow the rest of this doc.

---

## Step 2 — Resend account & API key

1. Sign up / log in at https://resend.com (use the gmail+oilo alias if A1).
2. **API Keys** → Create API Key → copy the `re_…` value. **You only see it once.**
3. **Domains** → Add Domain → enter `oilo.sa`. Resend shows you DNS records to add.

---

## Step 3 — DNS records

Add these at the registrar that hosts `oilo.sa` (likely SaudiNIC or whichever provider Mustafa used). All three Resend will spit out, plus DMARC.

### Resend will give you three (exact values vary per account)
| Type | Host | Value |
|------|------|-------|
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | (long DKIM key from Resend dashboard — copy verbatim) |

### DMARC (you add manually, doesn't change per account)
| Type | Host | Value |
|------|------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@oilo.sa` |

After adding, click **Verify** in Resend. Usually green within 10 minutes.

---

## Step 4 — Zoho mailboxes (for replies + sender mailbox)

Zoho Mail Lite — $1/user/month, billed yearly (~$24/yr for 2 boxes).

1. https://www.zoho.com/mail/ → sign up, pick **Mail Lite**.
2. Add domain `oilo.sa`.
3. Add users:
   - `info@oilo.sa` — general inbox / Resend Reply-To
   - `booking@oilo.sa` — outbound sender alias
4. Zoho gives you DNS records. Add these:

| Type | Host | Value |
|------|------|-------|
| MX | `@` | `mx.zoho.com` (priority 10) |
| MX | `@` | `mx2.zoho.com` (priority 20) |
| MX | `@` | `mx3.zoho.com` (priority 50) |
| TXT | `@` | `v=spf1 include:zoho.com ~all` (merge with the Resend SPF — Resend's SPF only applies to the `send` subdomain, so this is the root SPF) |
| TXT | `zmail._domainkey` | (Zoho will provide DKIM key) |

> Note: SPF for the **root** is Zoho. Resend uses its own SPF on the `send` subdomain — the two don't conflict.

5. Verify in Zoho dashboard.

---

## Step 5 — Vercel env vars

Project: `oilo-spa` on the `eclipse-agencys-projects` team.

```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxxxxx
NOTIFY_FROM    = Oilo Spa <info@oilo.sa>
NOTIFY_REPLY_TO = info@oilo.sa
CRON_SECRET    = <openssl rand -hex 32>
```

- If staying on A3: leave `NOTIFY_FROM` unset (defaults to `Oilo Spa <onboarding@resend.dev>`).
- `CRON_SECRET` protects `/api/cron/reminders` from public abuse — Vercel Cron auto-attaches it once you set it in env.

After adding env vars: **Redeploy** so the new vars take effect:
```bash
cd C:\Users\acer\oilo-spa
npx vercel --prod
```

---

## Step 6 — Smoke test

1. Submit a booking on https://oilo.sa/booking with a real phone.
2. Check `info@oilo.sa` (Zoho) and `mustafa.halawa9@gmail.com` for the email.
3. Reply to the email — confirm it lands in Zoho `info@oilo.sa`.
4. Submit a contact / gift / membership form — same drill.

If nothing arrives:
- Resend dashboard → **Logs** tab shows every send attempt + bounce reason.
- Vercel project logs → look for `[email] send failed`.

---

## Recipients (hard-coded in `src/lib/email.ts`)

```ts
const NOTIFY_TO = ['oilo.spa@outlook.sa', 'mustafa.halawa9@gmail.com']
```

Change in code if the spa wants a different inbox; redeploy.
