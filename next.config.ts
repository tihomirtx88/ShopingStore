import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
     domains: [
      'pkhrcwdgwgoenfdvbicg.supabase.co',
      'img.clerk.com', 
    ], 
  },
};

export default nextConfig;
