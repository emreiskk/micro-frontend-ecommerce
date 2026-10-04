const path = require("path");
const CART_URL = process.env.CART_URL || "http://localhost:3001";

/** @type {import("next").NextConfig} */
const nextConfig = {
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
  async rewrites() {
    return [
      {
        source: "/cart",
        destination: `${CART_URL}/cart`,
      },
      {
        source: "/cart/:path*",
        destination: `${CART_URL}/cart/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
