import type { Metadata } from 'next'
import { branches } from '@/lib/branches'

export const metadata: Metadata = {
  title: 'حجز مساج وسبا في الرياض | احجز موعدك في Oilo Spa',
  description: 'احجز جلسة مساج، حمام مغربي، حجامة أو باقة عناية في أويلو سبا فرع النهضة بالرياض. اختر الخدمة، التاريخ والوقت المناسب لك.',
  alternates: { canonical: 'https://oilo.sa/booking' },
  openGraph: {
    title: 'حجز مساج وسبا في الرياض | Oilo Spa',
    description: 'احجز جلسة مساج أو حمام مغربي أو حجامة في أويلو سبا فرع النهضة بالرياض.',
    url: 'https://oilo.sa/booking',
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
        '@id': 'https://oilo.sa/booking#webpage',
        url: 'https://oilo.sa/booking',
        name: 'حجز مساج وسبا في الرياض | Oilo Spa',
        description: metadata.description,
        inLanguage: 'ar-SA',
        isPartOf: { '@id': 'https://oilo.sa/#organization' },
        about: { '@id': 'https://oilo.sa/#organization' },
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://oilo.sa/booking',
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
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://oilo.sa/' },
          { '@type': 'ListItem', position: 2, name: 'الحجز', item: 'https://oilo.sa/booking' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'فرع Oilo Spa المتاح للحجز في الرياض',
        itemListElement: [branches['al-nahda']].map((branch, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: 'https://oilo.sa/booking',
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
