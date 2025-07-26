import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackages: ["bcrypt"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
