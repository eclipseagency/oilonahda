import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'عضويات وباقات اشتراك السبا | Oilo Spa الرياض',
  description:
    'عضوية أويلو سبا الشهرية في الرياض: جلستان كل شهر وخصومات على المساج والحمام المغربي وخدمات العناية. اختر باقتك واحجز مواعيدك بمرونة على مدار الشهر.',
  alternates: { canonical: 'https://www.oilospa.com/membership' },
  openGraph: {
    title: 'عضويات وباقات اشتراك السبا | Oilo Spa الرياض',
    description: 'اشتراك شهري في أويلو سبا بالرياض: جلستان كل شهر وخصومات على باقي الخدمات.',
    url: 'https://www.oilospa.com/membership',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children
}
