// Aggregates a branch's ad platforms for the /admin Ads panel. Google live +
// Snap snapshot run in parallel; each fails soft so one never breaks the other.

import { dateWindow, type AdRange, type PlatformResult } from "./types";
import type { AdminBranch } from "@/lib/auth";
import { adAccountsFor } from "./accounts";
import { fetchGoogle } from "./google";
import { getPlatformSnapshot } from "./snap";

export type { AdRange, AdCampaign, PlatformResult, AdStatus } from "./types";

export interface BranchAds {
  branch: AdminBranch;
  range: AdRange;
  window: { start: string; end: string };
  platforms: PlatformResult[];
  fetchedAt: string;
}

export async function fetchBranchAds(branch: AdminBranch, range: AdRange): Promise<BranchAds> {
  const window = dateWindow(range);
  const cfg = adAccountsFor(branch);

  const tasks: Promise<PlatformResult | null>[] = [];
  // Google: prefer live API; fall back to a stored snapshot until tokens are wired.
  if (cfg.google) {
    const customerId = cfg.google.customerId;
    const loginCustomerId = cfg.google.loginCustomerId;
    tasks.push(
      fetchGoogle(window, customerId, loginCustomerId).then(async (live) =>
        live.connected ? { ...live, source: "live" as const } : (await getPlatformSnapshot(branch, "google")) ?? live,
      ),
    );
  }
  // Snap: always a snapshot (no read API exists).
  if (cfg.snap) tasks.push(getPlatformSnapshot(branch, "snap"));

  const settled = await Promise.all(tasks);
  const platforms = settled.filter((p): p is PlatformResult => p !== null);
  return { branch, range, window, platforms, fetchedAt: new Date().toISOString() };
}
