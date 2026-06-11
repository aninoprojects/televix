import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — for channel banners and show posters
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Placeholder (remove in production)
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
