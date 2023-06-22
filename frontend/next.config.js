// @ts-check
const { PHASE_DEVELOPMENT_SERVER, PHASE_TEST } = require("next/constants");

/** @type {import("next").NextConfig} */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    ...(phase !== PHASE_DEVELOPMENT_SERVER &&
      phase !== PHASE_TEST && { removeConsole: true }),
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: process.env.TYPED_ROUTES === "true",
  },
});

module.exports = nextConfig;
