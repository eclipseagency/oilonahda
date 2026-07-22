import type { Metadata } from "next";
import Script from "next/script";
import { I18nProvider } from "@/lib/i18n";
import AnalyticsListeners from "@/components/AnalyticsListeners";
import { branches } from "@/lib/branches";
import "./globals.css";

// Al Nahda's own TikTok pixel. This site was forked from the Al Rabie site and
// inherited its pixel (D7KD9ARC77UDI5AAGF50), so until now both branches were
// reporting into one dataset. Keep these two IDs distinct.
// 2026-07-20: replaced Al Nahda's previous pixel (D9E9VUJC77UD5IE52D6G) with
// the new one Mustafa set up; history stays on the old dataset.
const TIKTOK_PIXEL_ID = "D9ETNTJC77UBS5FSHTG0";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();
// NEXT_PUBLIC_GADS_ID (the main / Al Rabie account) is deliberately NOT read here.
// This standalone Al Nahda site must neither load nor configure the Rabie tag —
// see the gtag-init comment below.
const GADS_ID_NAHDA = process.env.NEXT_PUBLIC_GADS_ID_NAHDA?.trim(); // Al Nahda's separate Google Ads account tag
const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim();

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oilospa.com"),
  title: "Oilo Spa | منتجع صحي وسبا واسترخاء في الرياض",
  description:
    "أويلو سبا، منتجع صحي وسبا واسترخاء فاخر في الرياض. مساج واسترخاء، حمام مغربي، عناية بالبشرة، وباقات فاخرة. احجز جلستك الآن.",
  keywords: [
    "سبا واسترخاء الرياض",
    "مساج الرياض",
    "حمام مغربي الرياض",
    "Oilo Spa",
    "spa Riyadh",
    "massage Riyadh",
    "مركز سبا الرياض",
    "أويلو سبا",
  ],
  openGraph: {
    title: "Oilo Spa | مركز سبا واسترخاء فاخر في الرياض",
    description:
      "تجربة استرخاء متكاملة. مساج واسترخاء، حمام مغربي، عناية بالبشرة، وباقات فاخرة.",
    url: "https://www.oilospa.com",
    siteName: "Oilo Spa",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "https://www.oilospa.com/og.png",
        width: 1200,
        height: 630,
        alt: "Oilo Spa، مركز سبا واسترخاء فاخر في الرياض",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oilo Spa | مركز سبا واسترخاء فاخر في الرياض",
    description:
      "تجربة استرخاء متكاملة. مساج واسترخاء، حمام مغربي، عناية بالبشرة، وباقات فاخرة.",
    images: ["https://www.oilospa.com/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.oilospa.com",
  },
  verification: {
    google: "NMhACYAy_--TdZlIkqD1x5nNP3ryKXqkfMScZcwPLRg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C9A96E" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.oilospa.com/#business",
              name: "Oilo Spa",
              description:
                "منتجع صحي وسبا واسترخاء فاخر في الرياض. مساج واسترخاء، حمام مغربي، عناية بالبشرة، وباقات فاخرة",
              url: "https://www.oilospa.com",
              email: "oilonahda@gmail.com",
              telephone: `+966${branches["al-nahda"].phone.slice(1)}`,
              logo: "https://www.oilospa.com/icon-192.png",
              image: "https://www.oilospa.com/og.png",
              knowsLanguage: ["ar", "en"],
              department: [
                {
                  "@type": ["DaySpa", "HealthAndBeautyBusiness"],
                  "@id": "https://www.oilospa.com/#branch-al-nahda",
                  name: "Oilo Spa",
                  url: "https://www.oilospa.com",
                  telephone: `+966${branches["al-nahda"].phone.slice(1)}`,
                  image: "https://www.oilospa.com/og.png",
                  priceRange: "SAR 150-850",
                  knowsLanguage: ["ar", "en"],
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "شارع سلمان الفارسي",
                    addressLocality: "الرياض",
                    addressRegion: "منطقة الرياض",
                    postalCode: "10011",
                    addressCountry: "SA",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: branches["al-nahda"].geo!.lat,
                    longitude: branches["al-nahda"].geo!.lng,
                  },
                  hasMap: branches["al-nahda"].mapsLink,
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                      opens: "10:00",
                      closes: "06:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: "Friday",
                      opens: "16:00",
                      closes: "06:00",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full" style={{ background: "#060608", color: "#e0ddd8" }}>
        {(GA_ID || GADS_ID_NAHDA) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || GADS_ID_NAHDA}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                ${GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : ""}
                ${/* Al Nahda standalone site: only configure the Al Nahda Google Ads
                     account. The main (Al Rabie) tag is intentionally NOT configured
                     here so Nahda traffic doesn't report to the Rabie account. */""}
                ${GADS_ID_NAHDA ? `gtag('config', '${GADS_ID_NAHDA}');` : ""}
              `}
            </Script>
          </>
        )}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        {SNAP_PIXEL_ID && (
          <Script id="snap-pixel" strategy="afterInteractive">
            {`
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init', '${SNAP_PIXEL_ID}');
snaptr('track', 'PAGE_VIEW');
            `}
          </Script>
        )}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
          `}
        </Script>
        <I18nProvider>
          {children}
        </I18nProvider>
        <AnalyticsListeners />
        <Script id="statcounter-config" strategy="afterInteractive">
          {`var sc_project=13224581; var sc_invisible=1; var sc_security="44f76be7";`}
        </Script>
        <Script
          id="statcounter-js"
          src="https://www.statcounter.com/counter/counter.js"
          strategy="afterInteractive"
        />
        <noscript>
          <div className="statcounter">
            <a
              title="Web Analytics"
              href="https://statcounter.com/"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="statcounter"
                src="https://c.statcounter.com/13224581/0/44f76be7/1/"
                alt="Web Analytics"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>
      </body>
    </html>
  );
}
