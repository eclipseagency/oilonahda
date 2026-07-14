import type { Metadata } from 'next'
import BranchPageClient from '@/components/BranchPageClient'

// Site root = Al Nahda branch for this standalone branch build.
export const metadata: Metadata = {
  title: 'Oilo Spa فرع النهضة | مساج وحمام مغربي في حي النهضة، الرياض',
  description:
    'أويلو سبا فرع النهضة في شرق الرياض: مساج رجالي، حمام مغربي، بديكير، عناية بالبشرة وباقات سبا. احجز موعدك الآن.',
  alternates: { canonical: 'https://www.oilospa.com' },
}

export default function Home() {
  return <BranchPageClient branchId="al-nahda" />
}
