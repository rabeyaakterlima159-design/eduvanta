/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@eduvanta/shared-types',
    '@eduvanta/shared-config',
    '@eduvanta/api-contracts',
  ],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
