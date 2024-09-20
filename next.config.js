/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'images.unsplash.com', 'pixabay.com', 'cdn.pixabay.com', 'utfs.io'], // Add utfs.io to allowed image domains
  },
}

module.exports = nextConfig;
