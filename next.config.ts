import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/pdfs/:path*",
        destination:
          "https://llqptt7vz21n4gjy.public.blob.vercel-storage.com/pdfs/:path*",
      },
      {
        source: "/images/:path*",
        destination:
          "https://llqptt7vz21n4gjy.public.blob.vercel-storage.com/images/:path*",
      },
    ];
  },
};

export default nextConfig;
