/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'images.unsplash.com',
        'firebasestorage.googleapis.com'
      ],
        remotePatterns: [
          {
            protocol: "http",
            hostname: "**",
          },
        ],
      },
}

module.exports = nextConfig
