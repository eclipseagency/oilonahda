import type { Metadata } from 'next'

// Utility page (lookup/cancel an existing booking). Kept out of the index.
export const metadata: Metadata = {
  title: 'إدارة حجزك | Oilo Spa',
  description: 'استعرض حجزك في أويلو سبا أو عدّل موعدك أو ألغه باستخدام رقم الحجز ورقم جوالك.',
  robots: { index: false },
}

export default function BookingManageLayout({ children }: { children: React.ReactNode }) {
  return children
}
