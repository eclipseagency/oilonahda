// Upserts a Snapchat snapshot for a branch into ads_snapshots. Run after pulling
// the numbers from Snap Ads Manager (oilo-nahda Chrome profile).
//   node scripts/seed-ads-snapshot.mjs
// Reads SUPABASE URL + SERVICE ROLE from .env.local.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Minimal .env.local loader (no dotenv dep).
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing SUPABASE url/service-role in .env.local"); process.exit(1); }
const supa = createClient(url, key);

// EDIT these figures from the Snap dashboard, then run.
const branch = "al-nahda";
const asOf = "2026-06-21";
const snapshot = {
  label: "Snapchat",
  currency: "SAR",
  periodLabel: "Lifetime",
  asOf,
  campaigns: [
    // { id, name, status: "active"|"paused"|"rejected"|"other", statusRaw,
    //   spend, impressions, clicks, conversions }
  ],
};

const { error } = await supa.from("ads_snapshots").upsert(
  { branch, platform: "snap", data: snapshot, as_of: asOf, updated_by: "seed-script" },
  { onConflict: "branch,platform" },
);
if (error) { console.error(error); process.exit(1); }
console.log(`Seeded snap snapshot for ${branch} (${snapshot.campaigns.length} campaigns).`);
