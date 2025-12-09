import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/jugaducollection",
        destination: "https://www.jugaaducollection.com",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
