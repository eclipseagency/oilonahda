// Stored ad figures for a branch, read from the ads_snapshots table. Snap has
// no read API so it is always a snapshot; Google uses this as a fallback until
// its live API tokens are wired. Rows are seeded by scripts/seed-ads-snapshot.mjs.

import { getSupabase } from "@/lib/supabase";
import type { AdminBranch } from "@/lib/auth";
import type { AdCampaign, AdPlatform, PlatformResult } from "./types";

interface SnapData {
  label?: string;
  currency?: string;
  periodLabel?: string;
  asOf?: string;
  campaigns?: AdCampaign[];
}

const DEFAULT_LABEL: Record<AdPlatform, string> = { google: "Google", snap: "Snapchat" };

export async function getPlatformSnapshot(branch: AdminBranch, platform: AdPlatform): Promise<PlatformResult | null> {
  const supa = getSupabase();
  const { data, error } = await supa
    .from("ads_snapshots")
    .select("data, as_of")
    .eq("branch", branch)
    .eq("platform", platform)
    .maybeSingle();
  if (error || !data?.data) return null;
  const d = data.data as SnapData;
  return {
    platform,
    label: d.label || DEFAULT_LABEL[platform],
    connected: true,
    currency: d.currency || "SAR",
    campaigns: Array.isArray(d.campaigns) ? d.campaigns : [],
    source: "snapshot",
    asOf: d.asOf || (data.as_of as string),
    periodLabel: d.periodLabel,
  };
}

export function getSnapSnapshot(branch: AdminBranch): Promise<PlatformResult | null> {
  return getPlatformSnapshot(branch, "snap");
}
