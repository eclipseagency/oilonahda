// Centralised tracking helper for ad-conversion events.
// trackEvent() always fires a named gtag('event', ...) (picked up by GA4 if
// linked to Ads), and additionally fires gtag('event', 'conversion', ...) when
// the matching NEXT_PUBLIC_GADS_CONV_* env var is set — so individual events
// can be promoted to Google Ads conversions without code changes.

export type TrackedEventName =
  | 'whatsapp_click'
  | 'booking_cta_click'
  | 'view_booking_page'
  | 'phone_click'
  | 'select_branch'
  | 'select_service'
  | 'select_datetime'
  | 'review_booking'

type Win = {
  gtag?: (cmd: string, name: string, params?: Record<string, unknown>) => void
}

const nahdaAdsId = process.env.NEXT_PUBLIC_GADS_ID_NAHDA?.trim()

// Main account send_to labels.
const sendToFor: Record<TrackedEventName, string | undefined> = {
  whatsapp_click: process.env.NEXT_PUBLIC_GADS_CONV_WA?.trim(),
  booking_cta_click: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW?.trim(),
  view_booking_page: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW?.trim(),
  phone_click: process.env.NEXT_PUBLIC_GADS_CONV_PHONE?.trim(),
  select_branch: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_BRANCH?.trim(),
  select_service: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_SERVICE?.trim(),
  select_datetime: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_DATETIME?.trim(),
  review_booking: process.env.NEXT_PUBLIC_GADS_CONV_REVIEW_BOOKING?.trim(),
}

// Al Nahda runs a SEPARATE Google Ads account (AW-18247209948), so its lead
// events must report there. Soft funnel events only report as Ads conversions
// when a dedicated _NAHDA label exists; the generic lead label is reserved for
// real booking submits in the booking flow.
const nahdaSendToFor: Partial<Record<TrackedEventName, string | undefined>> = {
  whatsapp_click: process.env.NEXT_PUBLIC_GADS_CONV_WA_NAHDA?.trim(),
  booking_cta_click: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW_NAHDA?.trim(),
  view_booking_page: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW_NAHDA?.trim(),
  phone_click: process.env.NEXT_PUBLIC_GADS_CONV_PHONE_NAHDA?.trim(),
}

function isNahdaBranch(): boolean {
  // This is the standalone Al Nahda site (oilospa.com) — every page and the
  // booking flow (which hardcodes branch = 'al-nahda') is Nahda. So conversions
  // always report to the Nahda Google Ads account. Previously this sniffed the
  // URL for ?branch=al-nahda, but the booking links were cleaned to a bare
  // /booking, so URL sniffing would miss them. Always true here.
  return true
}

function validNahdaSendTo(sendTo: string | undefined): string | undefined {
  if (!sendTo || !nahdaAdsId) return undefined
  return sendTo.startsWith(`${nahdaAdsId}/`) ? sendTo : undefined
}

export function trackEvent(
  name: TrackedEventName,
  params: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return
  const w = window as unknown as Win
  try {
    w.gtag?.('event', name, params)
    const sendTo = isNahdaBranch()
      ? validNahdaSendTo(nahdaSendToFor[name])
      : sendToFor[name]
    if (sendTo) {
      w.gtag?.('event', 'conversion', { send_to: sendTo, ...params })
    }
  } catch {
    /* never block UX on tracking */
  }
}
