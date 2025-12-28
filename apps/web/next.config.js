/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@typeforge/types", "@typeforge/utils"],
};

module.exports = nextConfig;
