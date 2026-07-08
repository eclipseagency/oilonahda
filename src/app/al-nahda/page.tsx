import type { Metadata } from 'next'
import Link from 'next/link'
import BranchPageClient from '@/components/BranchPageClient'
import { branches } from '@/lib/branches'

// Legacy Al Nahda path; production redirects this slug to the root.
export const metadata: Metadata = {
  title: 'Oilo Spa فرع النهضة | حجز مساج وسبا في شرق الرياض',
  description:
    'احجز في أويلو سبا فرع النهضة بالرياض: مساج، حمام مغربي، عناية، وباقات استرخاء في حي النهضة شرق الرياض. اختر موعدك أونلاين أو تواصل واتساب.',
  alternates: { canonical: 'https://oilo.sa/al-nahda' },
  openGraph: {
    title: 'Oilo Spa فرع النهضة | حجز مساج وسبا في شرق الرياض',
    description:
      'فرع النهضة في شرق الرياض لخدمات المساج والحمام المغربي والباقات. احجز موعدك مباشرة.',
    url: 'https://oilo.sa/al-nahda',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
    images: [{ url: '/services/nahda-hero.webp', width: 1200, height: 630, alt: 'Oilo Spa فرع النهضة الرياض' }],
  },
}

export default function AlNahdaPage() {
  const branch = branches['al-nahda']
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://oilo.sa/al-nahda#webpage',
        url: 'https://oilo.sa/al-nahda',
        name: 'Oilo Spa فرع النهضة | حجز مساج وسبا في شرق الرياض',
        description: metadata.description,
        inLanguage: 'ar-SA',
        about: { '@id': 'https://oilo.sa/#branch-al-nahda' },
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://oilo.sa/booking?branch=al-nahda',
          },
          result: { '@type': 'Reservation', name: 'حجز موعد في فرع النهضة' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://oilo.sa/' },
          { '@type': 'ListItem', position: 2, name: branch.nameAr, item: 'https://oilo.sa/al-nahda' },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BranchPageClient branchId="al-nahda" />
      <section className="bg-[#060608] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-[#C9A96E]">OILO SPA · حي النهضة</p>
          <h2 className="text-3xl font-bold md:text-4xl">احجز موعدك في فرع النهضة بالرياض</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/70">
            فرع النهضة مناسب لسكان شرق وجنوب الرياض الباحثين عن مساج، حمام مغربي،
            حجامة، أو باقة استرخاء في موقع قريب وساعات عمل ممتدة. احجز أونلاين
            وحدد الخدمة والوقت، أو تواصل مباشرة مع واتساب الفرع.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/booking?branch=al-nahda" className="rounded-full bg-[#C9A96E] px-7 py-3 font-semibold text-[#060608]">
              حجز فرع النهضة
            </Link>
            <a href={`https://wa.me/${branch.whatsapp}`} className="rounded-full border border-[#C9A96E]/40 px-7 py-3 font-semibold text-[#C9A96E]">
              واتساب فرع النهضة
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
