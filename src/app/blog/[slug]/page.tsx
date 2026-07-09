import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug, getAllSlugs } from '@/lib/blog'
import BlogArticle from './BlogArticle'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(decodeURIComponent(slug))
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.titleAr} | Oilo Spa`,
    description: post.descriptionAr,
    keywords: post.keywords,
    alternates: {
      canonical: `https://www.oilospa.com/blog/${encodeURI(post.slug)}`,
    },
    openGraph: {
      title: post.titleAr,
      description: post.descriptionAr,
      url: `https://www.oilospa.com/blog/${post.slug}`,
      siteName: 'Oilo Spa',
      locale: 'ar_SA',
      type: 'article',
      publishedTime: post.date,
      images: [{ url: `https://www.oilospa.com${post.image}`, width: 1200, height: 630, alt: post.titleAr }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titleAr,
      description: post.descriptionAr,
      images: [`https://www.oilospa.com${post.image}`],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(decodeURIComponent(slug))
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleAr,
    description: post.descriptionAr,
    image: `https://www.oilospa.com${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Oilo Spa', url: 'https://www.oilospa.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Oilo Spa',
      logo: { '@type': 'ImageObject', url: 'https://www.oilospa.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.oilospa.com/blog/${post.slug}` },
  }

  const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogArticle post={post} related={related} />
    </>
  )
}
