import { requireAdmin, resolveBranch } from "@/lib/auth";
import { fetchBranchAds } from "@/lib/ads";
import type { AdRange } from "@/lib/ads";

const RANGES: AdRange[] = ["today", "7d", "30d", "month"];

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof Response) return auth;
  const branch = resolveBranch(request, auth);

  const rangeParam = new URL(request.url).searchParams.get("range");
  const range: AdRange = RANGES.includes(rangeParam as AdRange) ? (rangeParam as AdRange) : "30d";

  const data = await fetchBranchAds(branch, range);
  return Response.json(data);
}
