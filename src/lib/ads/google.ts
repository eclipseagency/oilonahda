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
