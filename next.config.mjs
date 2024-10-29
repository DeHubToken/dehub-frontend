import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  eslint: {
    dirs: ["."]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, context) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate"
    });
    return config;
  },
  transpilePackages: ["jotai-devtools"],
  async rewrites() {
    return [
      {
        source: "/:username",
        destination: "/profile/:username"
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
});

export default nextConfig;
