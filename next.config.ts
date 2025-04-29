import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ["lucide-react"],
	experimental: {
		reactCompiler: true,
		useLightningcss: true,
	},
};

export default nextConfig;
