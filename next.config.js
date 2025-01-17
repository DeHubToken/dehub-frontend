/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      new URL(process.env.NEXT_PUBLIC_CDN_BASE_URL).host,
      'localhost',
      'cryptologos.cc',
      'api.dehub.io',
      'https://api.blockjerk.com',
      'images.unsplash.com',
      'tenor.com', 'media.tenor.com'],
  },
};

module.exports = nextConfig;
//dev-dhub.s3.us-east-1.amazonaws.com