import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    turbo: {
      loaders: {}, // You can add custom loaders
      resolveAlias: {} // You can add custom resolveAlias
    }
  },
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
        source: "/profile/:username",
        destination: "/:username"
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_BASE_URL
          ? new URL(process.env.NEXT_PUBLIC_CDN_BASE_URL).host
          : ""
      },
      {
        protocol: "http",
        hostname: "localhost"
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
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
});

export default nextConfig;
