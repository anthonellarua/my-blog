/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')();

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withMDX(nextConfig);