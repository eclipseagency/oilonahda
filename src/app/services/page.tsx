import Link from "next/link";
import Image from "next/image";
import { SERVICE_LANDINGS, SERVICE_LANDING_SLUGS } from "@/lib/serviceLanding";
import { nahdaServices, nahdaCategories, NAHDA_MASSAGE_OPENING_DISCOUNT, NAHDA_HOUR_UPGRADE } from "@/lib/nahdaServices";
import { nahdaServiceImages } from "@/lib/nahdaBranchData";
import { branches } from "@/lib/branches";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const siteUrl = "https://www.oilospa.com";
const url = `${siteUrl}/services`;
const gold = "#C9A96E";

const titleSeo = "خدمات السبا والاسترخاء في الرياض، مساج وحمام مغربي | Oilo Spa";
const descriptionSeo =
  "خدمات أويلو سبا فرع النهضة بالرياض: مساج واسترخاء احترافي، حمام مغربي، بديكير ومنكير، عناية القدمين، وباقات متكاملة بأسعار واضحة. اختر خدمتك واحجز الآن.";

export async function generateMetadata() {
  return {
    title: titleSeo,
    description: descriptionSeo,
    alternates: { canonical: url },
    openGraph: {
      title: titleSeo,
      description: descriptionSeo,
      url,
      siteName: "Oilo Spa",
      locale: "ar_SA",
      type: "website",
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "Oilo Spa" }],
    },
    twitter: { card: "summary_large_image", title: titleSeo, description: descriptionSeo, images: [`${siteUrl}/og.png`] },
  };
}

export default function ServicesIndexPage() {
  const nahda = branches["al-nahda"];
  const guides = SERVICE_LANDING_SLUGS.map((slug) => SERVICE_LANDINGS[slug]);
  // Only show categories that actually have services, in menu order.
  const menu = nahdaCategories
    .map((c) => ({ ...c, items: nahdaServices.filter((s) => s.category === c.id) }))
    .filter((c) => c.items.length > 0);

  const waHref = `https://wa.me/${nahda.whatsapp}?text=${encodeURIComponent("السلام عليكم، أود الاستفسار عن خدمات فرع النهضة والحجز")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        name: "خدمات أويلو سبا فرع النهضة",
        url,
        itemListElement: nahdaServices.map((s, i) => ({
          "@type": "Offer",
          position: i + 1,
          name: s.nameAr,
          price: s.price ? String(s.price) : undefined,
          priceCurrency: "SAR",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/booking?service=${s.key}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "الخدمات", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main dir="rtl" lang="ar" className="min-h-screen" style={{ background: "#060608", color: "#e0ddd8" }}>

        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-36 pb-16 text-center">
          <div className="glow-orb w-[520px] h-[520px] -top-[220px] start-1/3" style={{ background: "rgba(201,169,110,0.06)" }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase mb-5 font-ar" style={{ color: gold }}>
              أويلو سبا · فرع النهضة
            </p>
            <h1 className="font-ar text-3xl sm:text-5xl font-bold leading-[1.25] mb-5 text-gold-gradient">
              قائمة الخدمات والأسعار
            </h1>
            <p className="text-base sm:text-lg leading-loose mx-auto max-w-2xl font-ar" style={{ color: "#C7BEAE" }}>
              مساج واسترخاء، حمام مغربي، بديكير ومنكير، عناية القدمين، وباقات متكاملة، على يد معالجين محترفين
              في بيئة هادئة ونظيفة. الأسعار واضحة، والحجز في دقيقة.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking" className="inline-block px-8 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-base font-ar" style={{ background: gold, color: "#060608" }}>
                احجز جلستك الآن
              </Link>
              <a href={waHref} className="inline-block px-8 py-4 font-bold rounded-full transition-colors text-base border-2 font-ar" style={{ borderColor: gold, color: gold }}>
                استفسر على واتساب
              </a>
            </div>
            <p className="mt-6 text-sm font-ar" style={{ color: "#8f877a" }}>
              عرض الافتتاح: خصم {NAHDA_MASSAGE_OPENING_DISCOUNT} ريال على كل أنواع المساج · ترقية أي جلسة 40 دقيقة إلى 60 دقيقة بـ {NAHDA_HOUR_UPGRADE} ريال.
            </p>
          </div>
        </section>

        {/* Menu by category */}
        {menu.map((cat) => (
          <section key={cat.id} className="max-w-6xl mx-auto px-6 py-10 scroll-mt-24" id={cat.id}>
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-ar text-2xl sm:text-3xl font-bold" style={{ color: gold }}>{cat.titleAr}</h2>
              <span className="flex-1 h-px" style={{ background: "rgba(201,169,110,0.12)" }} />
              <span className="text-sm font-ar" style={{ color: "#8f877a" }}>{cat.items.length} خدمات</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((s) => (
                <div key={s.key} className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(201,169,110,0.15)" }}>
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={nahdaServiceImages[s.key]}
                      alt={s.nameAr}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,6,8,0.9) 6%, transparent 65%)" }} />
                    {s.durationAr && (
                      <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-[11px] font-bold font-ar"
                        style={{ background: "rgba(6,6,8,0.6)", color: "#dbb97a", backdropFilter: "blur(4px)" }}>
                        {s.durationAr}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-ar font-bold text-base mb-2" style={{ color: "#F5EFE4" }}>{s.nameAr}</h3>
                    {s.descriptionAr && (
                      <p className="font-ar text-[13px] leading-relaxed mb-4 flex-1" style={{ color: "#B8AF9F" }}>{s.descriptionAr}</p>
                    )}
                    {s.includes && (
                      <ul className="font-ar text-[13px] leading-relaxed mb-4 flex-1 space-y-1" style={{ color: "#B8AF9F" }}>
                        {s.includes.map((inc, i) => (
                          <li key={i} className="flex gap-2"><span style={{ color: gold }}>✦</span><span>{inc.ar}</span></li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex flex-col">
                        {s.price !== undefined && (
                          <span className="font-bold text-lg" style={{ color: gold }}>
                            {s.fromPrice ? "من " : ""}{s.price} <span className="text-xs font-normal font-ar">ريال</span>
                          </span>
                        )}
                        {s.bundlePrice && s.bundleCount && (
                          <span className="font-ar text-[11px]" style={{ color: "#8f877a" }}>{s.bundleCount} جلسات بـ {s.bundlePrice} ريال</span>
                        )}
                      </div>
                      <Link href={`/booking?service=${s.key}`}
                        className="font-ar text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
                        style={{ background: gold, color: "#060608" }}>
                        احجز
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Service guides (SEO landing pages) */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="font-ar text-2xl sm:text-3xl font-bold" style={{ color: gold }}>أدلة الخدمات</h2>
            <span className="flex-1 h-px" style={{ background: "rgba(201,169,110,0.12)" }} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((l) => (
              <Link key={l.slug} href={`/services/${l.slug}`}
                className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:border-[#C9A96E]/40"
                style={{ background: "rgba(201,169,110,0.04)", borderColor: "rgba(201,169,110,0.15)" }}>
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image src={l.heroImage} alt={l.h1} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-ar font-bold text-sm mb-0.5 truncate" style={{ color: "#F5EFE4" }}>{l.h1}</h3>
                  <span className="font-ar text-xs" style={{ color: gold }}>اعرف أكثر ←</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 mt-4" style={{ background: "linear-gradient(135deg, #C9A96E, #a8883f)" }}>
          <div className="max-w-3xl mx-auto px-6 text-center" style={{ color: "#060608" }}>
            <h2 className="font-ar text-2xl sm:text-3xl font-bold mb-3">جاهز للاسترخاء؟</h2>
            <p className="mb-6 text-lg font-ar">اختر خدمتك واحجز موعدك في أويلو سبا فرع النهضة</p>
            <Link href="/booking" className="inline-block px-10 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg font-ar" style={{ background: "#060608", color: gold }}>
              احجز الآن
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
