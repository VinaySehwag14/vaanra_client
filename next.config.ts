import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      // 🔴 Force non-www → www (THIS FIXES YOUR ISSUE)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "vaanra.com",
          },
        ],
        destination: "https://www.vaanra.com/:path*",
        permanent: true, // 301 redirect (SEO safe)
      },

    ];
  },
};

export default nextConfig;
