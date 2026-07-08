'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import type { BlogPost } from '@/lib/blog'

function markdownToHtml(md: string): string {
  return md
    .split('\n\n')
    .map(block => {
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`
      if (block.startsWith('- **')) {
        const items = block.split('\n').map(line => {
          const m = line.match(/^- \*\*(.+?)\*\*\s*(.*)$/)
          if (m) return `<li><strong>${m[1]}</strong>${m[2]}</li>`
          return `<li>${line.replace(/^- /, '')}</li>`
        }).join('')
        return `<ul>${items}</ul>`
      }
      if (block.startsWith('- ')) {
        const items = block.split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      const html = block
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>')
      return `<p>${html}</p>`
    })
    .join('\n')
}

export default function BlogArticle({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const { locale, toggleLocale } = useI18n()
  const isAr = locale === 'ar'

  const title = isAr ? post.titleAr : post.titleEn
  const content = isAr ? post.contentAr : post.contentEn
  const readTime = isAr ? post.readTimeAr : post.readTimeEn
  const contentHtml = markdownToHtml(content)

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: '#060608' }}>
      <article className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="group">
            <img src="/logo.png" alt="Oilo Spa" className="h-10 w-auto transition-all duration-300 group-hover:brightness-125" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLocale}
              className="text-[11px] font-semibold tracking-wider px-3 py-2 rounded-xl transition-all hover:bg-white/[0.06]"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {isAr ? 'EN' : 'عربي'}
            </button>
            <Link href="/blog"
              className={`text-[11px] font-semibold tracking-wider px-4 py-2 rounded-xl transition-all hover:bg-white/[0.06] ${isAr ? 'font-ar' : 'font-body'}`}
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {isAr ? 'جميع المقالات' : 'All Articles'}
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-10" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <img src={post.image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(6,6,8,0.8) 0%, rgba(6,6,8,0.2) 50%, transparent 100%)'
          }} />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <time className="text-[11px] font-medium tracking-wider font-body" style={{ color: 'rgba(201,169,110,0.5)' }}>
            {new Date(post.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,169,110,0.3)' }} />
          <span className={`text-[11px] font-medium tracking-wider ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(201,169,110,0.5)' }}>
            {readTime}
          </span>
        </div>

        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-8 leading-[1.6] ${isAr ? 'font-ar' : 'font-display'}`} style={{ color: '#C9A96E' }}>
          {title}
        </h1>

        <div className="w-16 h-px mb-10" style={{ background: 'linear-gradient(90deg, #C9A96E, transparent)' }} />

        <div
          className={`prose-oilo ${isAr ? 'font-ar' : 'font-body'}`}
          dir={isAr ? 'rtl' : 'ltr'}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="mt-16 p-8 sm:p-10 rounded-3xl text-center"
          style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)' }}>
          <p className={`text-lg font-bold text-white mb-3 ${isAr ? 'font-ar' : 'font-display'}`}>
            {isAr ? 'جاهز لتجربة الاسترخاء؟' : 'Ready for the Relaxation Experience?'}
          </p>
          <p className={`text-sm mb-6 ${isAr ? 'font-ar' : 'font-body'}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
            {isAr ? 'احجز جلستك الآن في أويلو سبا واستمتع بتجربة لا تُنسى' : 'Book your session at Oilo Spa and enjoy an unforgettable experience'}
          </p>
          <Link href="/booking"
            className="inline-block px-10 py-4 text-sm font-bold tracking-wider uppercase rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(201,169,110,0.3)]"
            style={{ background: 'linear-gradient(135deg, #C9A96E, #dbb97a)', color: '#0a0a0a' }}>
            {isAr ? 'احجز الآن' : 'Book Now'}
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className={`text-xl font-bold text-white mb-8 ${isAr ? 'font-ar' : 'font-display'}`}>
              {isAr ? 'مقالات ذات صلة' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={r.image} alt={isAr ? r.titleAr : r.titleEn} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,8,0.9), transparent 60%)' }} />
                  </div>
                  <div className="p-5">
                    <h3 className={`text-sm font-bold text-white leading-relaxed group-hover:text-[#C9A96E] transition-colors ${isAr ? 'font-ar' : 'font-display text-base'}`}>
                      {isAr ? r.titleAr : r.titleEn}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
