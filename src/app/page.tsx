import type { Metadata } from 'next'
import BranchPageClient from '@/components/BranchPageClient'

// Site root = Al Nahda branch for this standalone branch build.
export const metadata: Metadata = {
  title: 'Oilo Spa | مركز سبا واسترخاء فاخر في الرياض',
  description:
    'أويلو سبا، منتجع صحي وسبا واسترخاء فاخر في شرق الرياض. مساج واسترخاء، حمام مغربي، عناية، وباقات مميزة. احجز موعدك الآن.',
  alternates: { canonical: 'https://www.oilospa.com' },
}

export default function Home() {
  return <BranchPageClient branchId="al-nahda" />
}
