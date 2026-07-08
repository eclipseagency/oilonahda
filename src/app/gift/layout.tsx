import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'بطاقة هدية سبا في الرياض | Oilo Spa',
  description:
    'أهدِ من تحب جلسة استرخاء في أويلو سبا بالرياض. بطاقات هدايا بقيم مختلفة تشمل المساج والحمام المغربي وباقات العناية، تصلك بعلبة أنيقة مع رسالة شخصية. اطلبها الآن.',
  alternates: { canonical: 'https://oilo.sa/gift' },
  openGraph: {
    title: 'بطاقة هدية سبا في الرياض | Oilo Spa',
    description: 'بطاقات هدايا أويلو سبا بقيم مختلفة: مساج، حمام مغربي، وباقات عناية في الرياض.',
    url: 'https://oilo.sa/gift',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return children
}
