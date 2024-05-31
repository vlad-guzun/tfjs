/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
          },
          {
            protocol: 'https',
            hostname: 'utfs.io'
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
          }
        ],
      },
};

export default nextConfig;
