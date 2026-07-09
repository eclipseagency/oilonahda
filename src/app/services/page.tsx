import Link from "next/link";
import Image from "next/image";
import { SERVICE_LANDINGS, SERVICE_LANDING_SLUGS } from "@/lib/serviceLanding";

const siteUrl = "https://www.oilospa.com";
const url = `${siteUrl}/services`;

const titleSeo = "خدمات السبا والاسترخاء في الرياض، مساج، حمام مغربي، حجامة | Oilo Spa";
const descriptionSeo =
  "خدمات أويلو سبا في الرياض: مساج واسترخاء احترافي، حمام مغربي، حجامة جافة ورطبة، وبديكير ومنكير. أجواء هادئة وفاخرة وبيئة نظيفة ومريحة. احجز الآن.";

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
  const landings = SERVICE_LANDING_SLUGS.map((slug) => SERVICE_LANDINGS[slug]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        itemListElement: landings.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: l.h1,
          url: `${siteUrl}/services/${l.slug}`,
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
      <main dir="rtl" lang="ar" className="min-h-screen" style={{ background: "#060608", color: "#e0ddd8" }}>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-24 pb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm tracking-[0.3em] mb-4" style={{ color: "#C9A96E" }}>OILO SPA · الرياض</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-5" style={{ color: "#F5EFE4" }}>
              خدمات السبا والاسترخاء في الرياض
            </h1>
            <p className="text-lg leading-loose mx-auto max-w-2xl" style={{ color: "#D8CFBF" }}>
              منتجع صحي وسبا واسترخاء في الرياض. مساج واسترخاء احترافي، حمام مغربي أصيل، حجامة بمعايير طبية،
              وبديكير ومنكير، كلها في بيئة هادئة ونظيفة ومريحة. اختر خدمتك واحجز في دقيقة.
            </p>
            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-block px-8 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
                style={{ background: "#C9A96E", color: "#060608" }}
              >
                احجز جلستك الآن
              </Link>
            </div>
          </div>
        </section>

        {/* Service grid */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {landings.map((l) => (
              <Link
                key={l.slug}
                href={`/services/${l.slug}`}
                className="group block overflow-hidden rounded-2xl border transition-colors"
                style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.2)" }}
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={l.heroImage}
                    alt={l.h1}
                    fill
                    className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060608 10%, transparent 90%)" }} />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: "#C9A96E" }}>
                    {l.h1}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#D8CFBF" }}>{l.subhead}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {l.priceFromSAR && (
                      <span className="px-3 py-1.5 rounded-full text-xs" style={{ background: "rgba(201,169,110,0.15)", color: "#dbb97a" }}>
                        يبدأ من {l.priceFromSAR.toLocaleString("ar-SA")} ريال
                      </span>
                    )}
                    <span className="text-sm font-bold transition-transform group-hover:-translate-x-1" style={{ color: "#C9A96E" }}>
                      اعرف أكثر ←
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14" style={{ background: "linear-gradient(135deg, #C9A96E, #a8883f)" }}>
          <div className="max-w-3xl mx-auto px-6 text-center" style={{ color: "#060608" }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">جاهز للاسترخاء؟</h2>
            <p className="mb-6 text-lg">احجز جلستك في أويلو سبا الرياض اليوم</p>
            <Link
              href="/booking"
              className="inline-block px-10 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
              style={{ background: "#060608", color: "#C9A96E" }}
            >
              احجز الآن
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
