'use client'

import BranchHome, { BranchContext, BRANCH_CTX } from '@/components/BranchHome'
import type { BranchId } from '@/lib/branches'

// Renders the Al Nahda branch as a standalone page.
export default function BranchPageClient({ branchId }: { branchId: BranchId }) {
  return (
    <BranchContext.Provider value={BRANCH_CTX[branchId]()}>
      <BranchHome />
    </BranchContext.Provider>
  )
}
