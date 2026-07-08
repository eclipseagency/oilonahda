// Al Nahda ad-account config. The Google customer id lives here (not env).

import type { AdminBranch } from "@/lib/auth";

export interface BranchAdAccounts {
  google?: { customerId: string; loginCustomerId?: string };
  snap?: { label: string };
}

const ACCOUNTS: Record<AdminBranch, BranchAdAccounts> = {
  "al-nahda": {
    // Google Ads account 300-401-7182 (digits only). Search campaign 23947202811.
    google: { customerId: "3004017182" },
    snap: { label: "Snapchat" },
  },
};

export function adAccountsFor(branch: AdminBranch): BranchAdAccounts {
  return ACCOUNTS[branch] ?? {};
}
