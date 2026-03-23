import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow cross-origin requests in development (for network access)
  allowedDevOrigins: ['10.30.1.26', 'localhost'],
};

export default nextConfig;
