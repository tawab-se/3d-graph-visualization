import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/countries',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
