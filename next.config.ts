import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/services/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/gallery/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.webp",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.mp4",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    // This deployment is standalone for Al Nahda, so old branch slugs land on /.
    return [
      { source: "/al-rabie", destination: "/", permanent: true },
      { source: "/al-nahda", destination: "/", permanent: true },
      { source: "/النهضة", destination: "/", permanent: true },
      { source: "/ar/النهضة", destination: "/", permanent: true },
      { source: "/bookings", destination: "/booking", permanent: true },
      { source: "/النهضة/حجز", destination: "/booking", permanent: true },
      { source: "/ar/النهضة/حجز", destination: "/booking", permanent: true },
    ];
  },
};

export default nextConfig;
