// Centralised tracking helper for ad-conversion events.
// trackEvent() always fires a named gtag('event', ...) (picked up by GA4 if
// linked to Ads), and additionally fires gtag('event', 'conversion', ...) when
// the matching NEXT_PUBLIC_GADS_CONV_* env var is set — so individual events
// can be promoted to Google Ads conversions without code changes.

export type TrackedEventName =
  | 'whatsapp_click'
  | 'view_booking_page'
  | 'phone_click'
  | 'select_branch'
  | 'select_service'
  | 'select_datetime'
  | 'review_booking'

type Win = {
  gtag?: (cmd: string, name: string, params?: Record<string, unknown>) => void
}

// Main account send_to labels.
const sendToFor: Record<TrackedEventName, string | undefined> = {
  whatsapp_click: process.env.NEXT_PUBLIC_GADS_CONV_WA?.trim(),
  view_booking_page: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW?.trim(),
  phone_click: process.env.NEXT_PUBLIC_GADS_CONV_PHONE?.trim(),
  select_branch: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_BRANCH?.trim(),
  select_service: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_SERVICE?.trim(),
  select_datetime: process.env.NEXT_PUBLIC_GADS_CONV_SELECT_DATETIME?.trim(),
  review_booking: process.env.NEXT_PUBLIC_GADS_CONV_REVIEW_BOOKING?.trim(),
}

// Al Nahda runs a SEPARATE Google Ads account (AW-18247209948), so its lead
// events must report there. When a _NAHDA
// label is configured we use it on the Nahda branch; otherwise we fall back to
// the main label, so nothing changes until the Nahda labels are set.
const nahdaSendToFor: Partial<Record<TrackedEventName, string | undefined>> = {
  whatsapp_click: process.env.NEXT_PUBLIC_GADS_CONV_WA_NAHDA?.trim(),
  view_booking_page: process.env.NEXT_PUBLIC_GADS_CONV_BOOKING_VIEW_NAHDA?.trim(),
  phone_click: process.env.NEXT_PUBLIC_GADS_CONV_PHONE_NAHDA?.trim(),
}

function isNahdaBranch(): boolean {
  if (typeof window === 'undefined') return false
  const { pathname, search } = window.location
  return pathname.startsWith('/al-nahda') || /[?&]branch=al-nahda\b/.test(search)
}

export function trackEvent(
  name: TrackedEventName,
  params: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return
  const w = window as unknown as Win
  try {
    w.gtag?.('event', name, params)
    const sendTo =
      (isNahdaBranch() && nahdaSendToFor[name]) || sendToFor[name]
    if (sendTo) {
      w.gtag?.('event', 'conversion', { send_to: sendTo, ...params })
    }
  } catch {
    /* never block UX on tracking */
  }
}
