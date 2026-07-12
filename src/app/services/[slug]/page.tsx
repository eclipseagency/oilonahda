import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SERVICE_LANDINGS, SERVICE_LANDING_SLUGS } from "@/lib/serviceLanding";
import { branches } from "@/lib/branches";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const siteUrl = "https://www.oilospa.com";

export function generateStaticParams() {
  return SERVICE_LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = SERVICE_LANDINGS[slug];
  if (!data) return {};
  const url = `${siteUrl}/services/${slug}`;
  return {
    title: data.titleSeo,
    description: data.descriptionSeo,
    alternates: { canonical: url },
    openGraph: {
      title: data.titleSeo,
      description: data.descriptionSeo,
      url,
      siteName: "Oilo Spa",
      locale: "ar_SA",
      type: "website",
      images: [{ url: `${siteUrl}${data.heroImage}`, width: 1200, height: 630, alt: data.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.titleSeo,
      description: data.descriptionSeo,
      images: [`${siteUrl}${data.heroImage}`],
    },
  };
}

export default async function ServiceLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = SERVICE_LANDINGS[slug];
  if (!data) notFound();

  const url = `${siteUrl}/services/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: data.serviceName,
        description: data.descriptionSeo,
        provider: { "@id": `${siteUrl}/#business` },
        areaServed: [
          { "@type": "City", name: "Riyadh" },
          { "@type": "City", name: "الرياض" },
        ],
        ...(data.priceFromSAR && {
          offers: {
            "@type": "Offer",
            price: String(data.priceFromSAR),
            priceCurrency: "SAR",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/booking`,
          },
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "الخدمات", item: `${siteUrl}/services` },
          { "@type": "ListItem", position: 3, name: data.h1, item: url },
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
        <section className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
          <Image
            src={data.heroImage}
            alt={data.h1}
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060608 5%, rgba(6,6,8,0.6) 50%, transparent 100%)" }} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4" style={{ color: "#F5EFE4" }}>
              {data.h1}
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl" style={{ color: "#D8CFBF" }}>
              {data.subhead}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/booking"
                className="inline-block px-8 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
                style={{ background: "#C9A96E", color: "#060608" }}
              >
                احجز جلستك الآن
              </Link>
              <a
                href="https://wa.me/966556733851?text=السلام عليكم، أبغى أحجز جلسة"
                className="inline-block px-8 py-4 font-bold rounded-full transition-colors text-lg border-2"
                style={{ borderColor: "#C9A96E", color: "#C9A96E" }}
              >
                واتساب
              </a>
            </div>
            {(data.priceFromSAR || data.durationMin) && (
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {data.priceFromSAR && (
                  <span className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(201,169,110,0.15)", color: "#dbb97a" }}>
                    يبدأ من {data.priceFromSAR.toLocaleString("ar-SA")} ريال
                  </span>
                )}
                {data.durationMin && (
                  <span className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(201,169,110,0.15)", color: "#dbb97a" }}>
                    {data.durationMin} دقيقة
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-lg leading-loose" style={{ color: "#D8CFBF" }}>{data.intro}</p>
        </section>

        {/* Sections */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          {data.sections.map((s, i) => (
            <article key={i} className="mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#C9A96E" }}>
                {s.heading}
              </h2>
              <p className="text-base leading-loose" style={{ color: "#D8CFBF" }}>{s.body}</p>
            </article>
          ))}
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#C9A96E" }}>
            أسئلة شائعة
          </h2>
          <div className="space-y-4">
            {data.faqs.map((f, i) => (
              <details key={i} className="rounded-xl p-5 border" style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.2)" }}>
                <summary className="font-bold cursor-pointer text-lg" style={{ color: "#F5EFE4" }}>{f.q}</summary>
                <p className="mt-3 leading-loose" style={{ color: "#D8CFBF" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Branch */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#C9A96E" }}>
            النهضة في الرياض
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {(() => {
              const branch = branches["al-nahda"];
              return (
                <div className="rounded-xl p-5 border" style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.2)" }}>
                  <Link href="/" className="font-bold text-lg hover:underline underline-offset-4" style={{ color: "#F5EFE4" }}>
                    {branch.nameAr}، {branch.districtAr}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#D8CFBF" }}>يخدم شرق الرياض وجنوبها</p>
                  <p className="mt-1 text-sm" style={{ color: "#D8CFBF" }}>{branch.addressAr}</p>
                  <a href={`tel:${branch.phone}`} className="mt-3 inline-block text-sm font-bold" dir="ltr" style={{ color: "#C9A96E" }}>
                    {branch.phone}
                  </a>
                </div>
              );
            })()}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12" style={{ background: "linear-gradient(135deg, #C9A96E, #a8883f)" }}>
          <div className="max-w-3xl mx-auto px-6 text-center" style={{ color: "#060608" }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">جاهز للاسترخاء؟</h2>
            <p className="mb-6 text-lg">احجز جلستك في أويلو سبا اليوم</p>
            <Link
              href="/booking"
              className="inline-block px-10 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
              style={{ background: "#060608", color: "#C9A96E" }}
            >
              احجز الآن
            </Link>
          </div>
        </section>

        {/* Related */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#C9A96E" }}>خدمات أخرى</h2>
          <div className="flex flex-wrap gap-3">
            {data.related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="px-5 py-3 rounded-full border transition-colors"
                style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.25)", color: "#F5EFE4" }}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
