import Link from "next/link";
import Image from "next/image";
import {
  nahdaServices,
  NAHDA_MASSAGE_OPENING_DISCOUNT,
  NAHDA_HOUR_UPGRADE,
} from "@/lib/nahdaServices";
import { branches } from "@/lib/branches";

const siteUrl = "https://oilo.sa";
const pageUrl = `${siteUrl}/offers`;
const heroImage = "/aamassage_13_1310x980.webp";

const titleSeo = "عروض وباقات أويلو سبا فرع النهضة، مساج وحمام مغربي بأسعار خاصة | Oilo Spa";
const descriptionSeo =
  "العروض الحالية في أويلو سبا فرع النهضة بالرياض: عروض مجمعة مساج وحمام مغربي وبديكير من 310 ريال، وباقات متكاملة، وخصم افتتاح على جلسات المساج. احجز عرضك الآن.";

export const metadata = {
  title: titleSeo,
  description: descriptionSeo,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: titleSeo,
    description: descriptionSeo,
    url: pageUrl,
    siteName: "Oilo Spa",
    locale: "ar_SA",
    type: "website",
    images: [{ url: `${siteUrl}${heroImage}`, width: 1200, height: 630, alt: "عروض أويلو سبا فرع النهضة" }],
  },
  twitter: {
    card: "summary_large_image",
    title: titleSeo,
    description: descriptionSeo,
    images: [`${siteUrl}${heroImage}`],
  },
};

const gold = "#C9A96E";
const cardStyle = {
  background: "rgba(201,169,110,0.05)",
  borderColor: "rgba(201,169,110,0.2)",
};

function waHref(whatsapp: string, offerNameAr: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `السلام عليكم، أبغى أحجز ${offerNameAr} في فرع النهضة`
  )}`;
}

const faqs = [
  {
    q: "هل العروض متاحة في فرع النهضة؟",
    a: "نعم، العروض والباقات المعروضة هنا خاصة بفرع النهضة، وتشمل عروض المساج والحمام المغربي والبديكير والباقات المتكاملة.",
  },
  {
    q: "كيف أحجز عرضًا؟",
    a: "تقدر تحجز مباشرة من صفحة الحجز في الموقع باختيار العرض، أو ترسل لنا واتساب على رقم فرع النهضة ونأكد لك الموعد.",
  },
  {
    q: "هل يوجد عرض افتتاح على المساج؟",
    a: `نعم، يوجد خصم ${NAHDA_MASSAGE_OPENING_DISCOUNT} ريال على جلسات المساج، ويمكن ترقية أي جلسة 40 دقيقة إلى 60 دقيقة بإضافة ${NAHDA_HOUR_UPGRADE} ريال فقط.`,
  },
];

export default function OffersPage() {
  const nahda = branches["al-nahda"];
  const nahdaOffers = nahdaServices.filter((s) => s.category === "offer");
  const nahdaPackages = nahdaServices.filter((s) => s.category === "package");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        name: "عروض وباقات أويلو سبا فرع النهضة",
        url: pageUrl,
        itemListElement: [...nahdaOffers, ...nahdaPackages].map((s) => ({
          "@type": "Offer",
          name: s.nameAr,
          price: s.price ? String(s.price) : undefined,
          priceCurrency: "SAR",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/booking?service=${s.key}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "العروض", item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main dir="rtl" lang="ar" className="min-h-screen" style={{ background: "#060608", color: "#e0ddd8" }}>
        <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src={heroImage}
            alt="عروض أويلو سبا فرع النهضة"
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060608 5%, rgba(6,6,8,0.6) 50%, transparent 100%)" }} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4" style={{ color: "#F5EFE4" }}>
              عروض وباقات أويلو سبا فرع النهضة
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl" style={{ color: "#D8CFBF" }}>
              عروض مجمعة وباقات متكاملة بأسعار خاصة في حي النهضة
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/booking"
                className="inline-block px-8 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
                style={{ background: gold, color: "#060608" }}
              >
                احجز عرضك الآن
              </Link>
              <a
                href={waHref(nahda.whatsapp, "أحد العروض")}
                className="inline-block px-8 py-4 font-bold rounded-full transition-colors text-lg border-2"
                style={{ borderColor: gold, color: gold }}
              >
                واتساب
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(201,169,110,0.15)", color: "#dbb97a" }}>
                عروض مجمعة من 310 ريال
              </span>
              <span className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(201,169,110,0.15)", color: "#dbb97a" }}>
                ترقية المساج إلى 60 دقيقة
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2" style={{ color: gold }}>
            عروض فرع النهضة
          </h2>
          <p className="mb-8" style={{ color: "#D8CFBF" }}>
            عرض الافتتاح: خصم {NAHDA_MASSAGE_OPENING_DISCOUNT} ريال على جميع أنواع المساج، وترقية أي جلسة 40 دقيقة إلى 60 دقيقة بإضافة {NAHDA_HOUR_UPGRADE} ريال فقط.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nahdaOffers.map((s) => (
              <div key={s.key} className="rounded-xl p-5 border flex flex-col" style={cardStyle}>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#F5EFE4" }}>{s.nameAr}</h3>
                {s.descriptionAr && (
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "#D8CFBF" }}>{s.descriptionAr}</p>
                )}
                {s.price !== undefined && (
                  <p className="text-2xl font-bold mb-4" style={{ color: gold }}>
                    {s.fromPrice ? "من " : ""}{s.price} <span className="text-sm font-normal">ريال</span>
                  </p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/booking?service=${s.key}`}
                    className="flex-1 text-center px-4 py-3 font-bold rounded-full text-sm"
                    style={{ background: gold, color: "#060608" }}
                  >
                    احجز الآن
                  </Link>
                  <a
                    href={waHref(nahda.whatsapp, s.nameAr)}
                    className="px-4 py-3 font-bold rounded-full text-sm border"
                    style={{ borderColor: gold, color: gold }}
                  >
                    واتساب
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2" style={{ color: gold }}>
            الباقات المتكاملة، فرع النهضة
          </h2>
          <p className="mb-8" style={{ color: "#D8CFBF" }}>
            باقات سبا كاملة تشمل المساج والحمام المغربي والعناية، حسب اختيارك.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nahdaPackages.map((s) => (
              <div key={s.key} className="rounded-xl p-6 border flex flex-col" style={cardStyle}>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#F5EFE4" }}>{s.nameAr}</h3>
                {s.includes && (
                  <ul className="text-sm leading-relaxed mb-4 flex-1 space-y-1.5" style={{ color: "#D8CFBF" }}>
                    {s.includes.map((inc, i) => (
                      <li key={i} className="flex gap-2">
                        <span style={{ color: gold }}>✦</span>
                        <span>{inc.ar}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.price !== undefined && (
                  <p className="text-3xl font-bold mb-4" style={{ color: gold }}>
                    {s.price} <span className="text-sm font-normal">ريال</span>
                  </p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/booking?service=${s.key}`}
                    className="flex-1 text-center px-4 py-3 font-bold rounded-full text-sm"
                    style={{ background: gold, color: "#060608" }}
                  >
                    احجز الآن
                  </Link>
                  <a
                    href={waHref(nahda.whatsapp, s.nameAr)}
                    className="px-4 py-3 font-bold rounded-full text-sm border"
                    style={{ borderColor: gold, color: gold }}
                  >
                    واتساب
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6" style={{ color: gold }}>
            أسئلة شائعة عن العروض
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-xl p-5 border" style={cardStyle}>
                <summary className="font-bold cursor-pointer text-lg" style={{ color: "#F5EFE4" }}>{f.q}</summary>
                <p className="mt-3 leading-loose" style={{ color: "#D8CFBF" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6" style={{ color: gold }}>
            فرع النهضة في الرياض
          </h2>
          <div className="rounded-xl p-5 border" style={cardStyle}>
            <Link href="/" className="font-bold text-lg hover:underline underline-offset-4" style={{ color: "#F5EFE4" }}>
              {nahda.nameAr}، {nahda.districtAr}
            </Link>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#D8CFBF" }}>يخدم شرق الرياض وجنوبها</p>
            <p className="mt-1 text-sm" style={{ color: "#D8CFBF" }}>{nahda.addressAr}</p>
            <a href={`tel:${nahda.phone}`} className="mt-3 inline-block text-sm font-bold" dir="ltr" style={{ color: gold }}>
              {nahda.phone}
            </a>
          </div>
        </section>

        <section className="py-12" style={{ background: "linear-gradient(135deg, #C9A96E, #a8883f)" }}>
          <div className="max-w-3xl mx-auto px-6 text-center" style={{ color: "#060608" }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">العروض متاحة الآن</h2>
            <p className="mb-6 text-lg">احجز جلستك في أويلو سبا فرع النهضة واستفد من الأسعار الخاصة</p>
            <Link
              href="/booking"
              className="inline-block px-10 py-4 font-bold rounded-full transition-opacity hover:opacity-90 text-lg"
              style={{ background: "#060608", color: gold }}
            >
              احجز الآن
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
