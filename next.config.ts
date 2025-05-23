import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["lucide-react"],
  experimental: {
    reactCompiler: true,
    useLightningcss: true,
    inlineCss: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
