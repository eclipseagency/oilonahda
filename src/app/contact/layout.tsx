import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تواصل مع أويلو سبا فرع النهضة بالرياض',
  description:
    'تواصل مع فريق أويلو سبا فرع النهضة بالرياض على 0556733851، اتصالًا أو واتساب أو عبر نموذج الموقع، ونرد عليك سريعًا لتأكيد حجزك.',
  alternates: { canonical: 'https://www.oilospa.com/contact' },
  openGraph: {
    title: 'تواصل مع أويلو سبا فرع النهضة بالرياض',
    description: 'اتصال، واتساب، أو نموذج الموقع: تواصل مع فرع النهضة في الرياض لتأكيد حجزك.',
    url: 'https://www.oilospa.com/contact',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
