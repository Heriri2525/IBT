/** @type {import('next').NextConfig} */
const nextConfig = {
  // Day 37 teaches the classic route-segment model (revalidate, dynamic,
  // generateStaticParams). With cacheComponents: true Next 16 rejects those
  // exports, so it is switched off explicitly here (the Day 36 scaffold had it on).
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
