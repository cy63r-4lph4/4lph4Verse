import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // Don't activate SW during development — keeps HMR working cleanly
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    // Served when a user navigates to a page that isn't cached
    document: "/offline.html",
  },
  workboxOptions: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    runtimeCaching: [
      // App shell — cache first (permanently versioned by Next.js hash)
      {
        urlPattern: /^\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      // Next.js image optimiser responses
      {
        urlPattern: /^\/_next\/image\?.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-image",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      // Static assets in /public (icons, logos)
      {
        urlPattern: /^\/icons\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "public-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // External avatar API (dicebear)
      {
        urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "dicebear-avatars",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      // Datapads/resources — network-first, long cache for offline reads
      {
        urlPattern: /\/v1\/arena\/courses\/[^/]+\/resources/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-datapads",
          networkTimeoutSeconds: 8,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 48 },
        },
      },
      // All other API calls — network-first, short cache fallback
      {
        urlPattern: /\/v1\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-general",
          networkTimeoutSeconds: 6,
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 4 },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Explicit empty turbopack config silences the Turbopack/webpack conflict
  // warning that @ducanh2912/next-pwa triggers (it injects webpack config for
  // SW compilation; Turbopack is still used for the rest of the build).
  turbopack: {},
};

export default withPWA(nextConfig);
