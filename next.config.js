/** @type {import('next').NextConfig} */
const nextConfig = {
  // 嚴格模式
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
