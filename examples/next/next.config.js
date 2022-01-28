/** @type {import('next').NextConfig} */

const withPreconstruct = require("@preconstruct/next");

module.exports = withPreconstruct();

// content security headers things
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // {
  //   key: "Content-Security-Policy",
  //   value: `default-src * 'self' 'unsafe-eval' localhost:* thirdweb.com *.thirdweb.com *.vercel.app *.nftlabs.co *.ingest.sentry.io vitals.vercel-insights.com *.g.alchemy.com rpc.ftm.tools api.avax.network nftlabs.mypinata.cloud https:; style-src 'self' 'unsafe-eval' 'unsafe-inline' rsms.me fonts.googleapis.com; object-src 'none'; font-src rsms.me *.gstatic.com; base-uri 'none'; connect-src *; img-src * blob: data:;`,
  // },
];

const moduleExports = {
  reactStrictMode: true,
  outputFileTracing: false,

  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      child_process: false,
      crypto: false,
      os: false,
      tty: false,
      worker_threads: false,
      process: false,
    };
    return config;
  },
};

module.exports = withPreconstruct(moduleExports);
