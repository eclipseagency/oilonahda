// Snapchat Conversions API (server-side) sender.
//
// Fires the same conversion as the browser Snap Pixel, but from the server with
// a SHA-256 hashed phone, the client IP and the user-agent. This means the event
// still lands when an ad-blocker strips the client pixel, and it scores high
// match quality (a hashed identifier is mandatory — without one Snap attributes
// ~0, which already bit Oilo before).
//
// Deduplicated against the browser pixel by a shared id (the booking id): CAPI
// sends it as custom_data.event_id; the pixel sends it as client_dedup_id (or
// transaction_id for purchases). Snap reconciles them within a 48h window.
//
// Endpoint + payload shape per the pixel's "Set up the Conversions API" screen:
//   POST https://tr.snapchat.com/v3/{PIXEL_ID}/events?access_token={TOKEN}
//
// Configured via env (both must be set or this is a silent no-op):
//   NEXT_PUBLIC_SNAP_PIXEL_ID  — the pixel id (also used by the browser pixel)
//   SNAP_CAPI_TOKEN            — the Conversions API access token (secret)

import { createHash } from 'crypto'

const PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim()
const TOKEN = process.env.SNAP_CAPI_TOKEN?.trim()

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export type SnapEventName =
  | 'PAGE_VIEW'
  | 'VIEW_CONTENT'
  | 'ADD_CART'
  | 'SIGN_UP'
  | 'PURCHASE'

export interface SnapEventInput {
  eventName: SnapEventName
  /** Dedup key shared with the browser pixel — use the booking id. */
  eventId: string
  eventSourceUrl?: string
  /** Saudi phone in E.164 without the leading "+", e.g. 9665XXXXXXXX. Hashed here. */
  phoneE164NoPlus?: string
  /** Plain email; lowercased, trimmed and hashed here. */
  email?: string
  clientIp?: string
  userAgent?: string
  /** Snap click id from the &ScCid= landing param, if captured. */
  scClickId?: string
  /** Value of the _scid cookie set by the browser pixel, if present. */
  scCookie1?: string
  value?: number
  currency?: string
  contentIds?: string[]
  contentCategory?: string[]
}

/**
 * Send one conversion to Snap's Conversions API. Best-effort and self-timing —
 * never throws, so callers can await it without risking the booking flow.
 */
export async function sendSnapConversion(input: SnapEventInput): Promise<void> {
  if (!PIXEL_ID || !TOKEN) return // not configured → skip silently

  const userData: Record<string, unknown> = {}
  // Snap hashes: phone as E.164 digits (no "+"); email lowercased + trimmed.
  if (input.phoneE164NoPlus) userData.ph = [sha256(input.phoneE164NoPlus.trim())]
  if (input.email) userData.em = [sha256(input.email.trim().toLowerCase())]
  if (input.userAgent) userData.user_agent = input.userAgent
  if (input.clientIp) userData.client_ip_address = input.clientIp
  if (input.scClickId) userData.sc_click_id = input.scClickId
  if (input.scCookie1) userData.sc_cookie1 = input.scCookie1

  const customData: Record<string, unknown> = { event_id: input.eventId }
  if (input.value != null) customData.value = String(input.value)
  if (input.currency) customData.currency = input.currency
  if (input.contentIds?.length) customData.content_ids = input.contentIds
  if (input.contentCategory?.length) customData.content_category = input.contentCategory

  const payload = {
    data: [
      {
        event_name: input.eventName,
        action_source: 'website',
        event_source_url: input.eventSourceUrl || 'https://oilo.sa',
        event_time: Math.floor(Date.now() / 1000),
        user_data: userData,
        custom_data: customData,
      },
    ],
  }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 3000)
  try {
    await fetch(
      `https://tr.snapchat.com/v3/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      },
    )
  } catch {
    // best effort — never block the booking on tracking
  } finally {
    clearTimeout(timer)
  }
}
