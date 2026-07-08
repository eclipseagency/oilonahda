'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import type { BlogPost } from '@/lib/blog'

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const { locale, toggleLocale } = useI18n()
  const isAr = locale === 'ar'

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: '#060608' }}>
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
        <div className="absolute top-6 end-6 md:top-10 md:end-10 z-20">
          <button
            onClick={toggleLocale}
            className="text-[11px] font-semibold tracking-wider px-3 py-2 rounded-xl transition-all hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {isAr ? 'EN' : 'عربي'}
          </button>
        </div>

        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-8 group">
            <img src="/logo.png" alt="Oilo Spa" className="h-12 w-auto mx-auto transition-all duration-300 group-hover:brightness-125" />
          </Link>
          <div className="w-10 h-px mx-auto mb-8" style={{ background: '#C9A96E' }} />
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isAr ? 'font-ar' : 'font-display'}`} style={{ color: '#C9A96E' }}>
            {isAr ? 'المدونة' : 'Blog'}
          </h1>
          <p className={`text-sm tracking-wider italic ${isAr ? 'font-display' : 'font-ar'}`} style={{ color: 'rgba(255,255,255,0.3)' }}>
            {isAr ? 'Blog' : 'المدونة'}
          </p>
          <p className={`text-base mt-6 leading-relaxed max-w-2xl mx-auto ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
            {isAr
              ? 'مقالات ونصائح من خبرائنا حول الصحة والاسترخاء والعناية بالنفس'
              : 'Articles and tips from our experts on health, relaxation, and self-care'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative block overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={isAr ? post.titleAr : post.titleEn}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.4) 50%, rgba(6,6,8,0.1) 100%)'
                }} />
                <span className={`absolute top-4 end-4 px-3 py-1.5 text-[10px] font-semibold tracking-wider z-10 rounded-xl ${isAr ? 'font-ar' : 'font-body'}`}
                  style={{ color: '#C9A96E', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,169,110,0.15)' }}>
                  {isAr ? post.readTimeAr : post.readTimeEn}
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <time className="text-[11px] font-medium tracking-wider mb-3 block font-body" style={{ color: 'rgba(201,169,110,0.5)' }}>
                  {new Date(post.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h2 className={`text-lg md:text-xl font-bold text-white mb-3 leading-relaxed group-hover:text-[#C9A96E] transition-colors duration-300 ${isAr ? 'font-ar' : 'font-display text-2xl'}`}>
                  {isAr ? post.titleAr : post.titleEn}
                </h2>
                <p className={`text-sm leading-relaxed line-clamp-2 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isAr ? post.descriptionAr : post.descriptionEn}
                </p>
                <span className={`inline-flex items-center gap-2 mt-5 text-xs font-semibold tracking-wider ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: '#C9A96E' }}>
                  {isAr ? 'اقرأ المزيد' : 'Read More'}
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/"
            className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] ${isAr ? 'font-ar' : 'font-body'}`}
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </main>
  )
}
