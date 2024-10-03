/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
    });

    // Make sure to return the modified config object
    return config;
  },
  images: {
    domains: ['uploadthing.com', 'images.unsplash.com', 'pixabay.com', 'cdn.pixabay.com', 'utfs.io'], // Add utfs.io to allowed image domains
  },
};

module.exports = nextConfig;
