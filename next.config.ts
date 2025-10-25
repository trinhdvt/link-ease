import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    useLightningcss: true,
    inlineCss: true,
  },
  reactCompiler: true,
  poweredByHeader: false,
};

export default nextConfig;
