import type { Metadata } from 'next'
import { branches } from '@/lib/branches'

export const metadata: Metadata = {
  title: 'حجز مساج وسبا في الرياض | احجز موعدك في Oilo Spa',
  description: 'احجز جلسة مساج، حمام مغربي، حجامة أو باقة عناية في أويلو سبا بالرياض. اختر الخدمة، التاريخ والوقت المناسب لك.',
  alternates: { canonical: 'https://www.oilospa.com/booking' },
  openGraph: {
    title: 'حجز مساج وسبا في الرياض | Oilo Spa',
    description: 'احجز جلسة مساج أو حمام مغربي أو حجامة في أويلو سبا بالرياض.',
    url: 'https://www.oilospa.com/booking',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.oilospa.com/booking#webpage',
        url: 'https://www.oilospa.com/booking',
        name: 'حجز مساج وسبا في الرياض | Oilo Spa',
        description: metadata.description,
        inLanguage: 'ar-SA',
        isPartOf: { '@id': 'https://www.oilospa.com/#organization' },
        about: { '@id': 'https://www.oilospa.com/#organization' },
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.oilospa.com/booking',
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          result: { '@type': 'Reservation', name: 'حجز موعد في Oilo Spa' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://www.oilospa.com/' },
          { '@type': 'ListItem', position: 2, name: 'الحجز', item: 'https://www.oilospa.com/booking' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'فرع Oilo Spa المتاح للحجز في الرياض',
        itemListElement: [branches['al-nahda']].map((branch, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: 'https://www.oilospa.com/booking',
          name: `${branch.nameAr} - ${branch.districtAr}`,
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
