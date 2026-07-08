import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog'
import BlogList from './BlogList'

export const metadata: Metadata = {
  title: 'المدونة | Oilo Spa، مقالات عن الصحة والاسترخاء والعناية',
  description: 'مقالات ونصائح من خبراء أويلو سبا حول المساج، الحمام المغربي، العناية بالبشرة، والاسترخاء. دليلك لحياة أكثر صحة وراحة.',
  alternates: {
    canonical: 'https://oilo.sa/blog',
  },
  openGraph: {
    title: 'المدونة | Oilo Spa',
    description: 'مقالات ونصائح حول المساج والاسترخاء والعناية من خبراء أويلو سبا',
    url: 'https://oilo.sa/blog',
    siteName: 'Oilo Spa',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function BlogPage() {
  return <BlogList posts={blogPosts} />
}
