const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: "/cart",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cart",
        basePath: false,
        permanent: false,
      },
      {
        source: "/favicon.ico",
        destination: "/cart/icon.svg",
        basePath: false,
        permanent: false,
      },
      {
        source: "/icon.svg",
        destination: "/cart/icon.svg",
        basePath: false,
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
