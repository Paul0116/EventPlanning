import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: "256kb",
    },
  },
};

export default nextConfig;
