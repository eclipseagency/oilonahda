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
