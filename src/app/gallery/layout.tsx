import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'أجواء أويلو سبا فرع النهضة بالرياض | Oilo Spa',
  description:
    'تعرّف على أجواء أويلو سبا فرع النهضة بالرياض: غرف المساج، الحمام المغربي، والزوايا الهادئة الفاخرة في بيئة نظيفة ومريحة. شاهد الصور واحجز جلستك.',
  alternates: { canonical: 'https://www.oilospa.com/gallery' },
  openGraph: {
    title: 'أجواء أويلو سبا فرع النهضة بالرياض',
    description: 'صور من داخل أويلو سبا فرع النهضة: غرف المساج، الحمام المغربي، والأجواء الهادئة الفاخرة.',
    url: 'https://www.oilospa.com/gallery',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
