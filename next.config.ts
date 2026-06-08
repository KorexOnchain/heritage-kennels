import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ycvvdqczkfftndzqrgfp.supabase.co",
      },
    ],
  },
};

export default nextConfig;