/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      domains: [
        new URL(process.env.NEXT_PUBLIC_CDN_BASE_URL??"http://localhost").host,
        'cryptologos.cc',
        'api.dehub.io',
        'https://api.blockjerk.com',
        'images.unsplash.com',
        'tenor.com', 'media.tenor.com'],
    },  eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;