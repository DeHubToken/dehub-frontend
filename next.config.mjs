import withBundleAnalyzer from "@next/bundle-analyzer";

import { env } from "./configs/env.mjs";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: env.ANALYZE === "true"
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
        hostname: new URL(env.NEXT_PUBLIC_CDN_BASE_URL).host
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc"
      },
      {
        protocol: "https",
        hostname: "api.dehub.io"
      },
      {
        protocol: "https",
        hostname: "api.blockjerk.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "tenor.com"
      },
      {
        protocol: "https",
        hostname: "media.tenor.com"
      }
    ]
  }
});

export default nextConfig;
