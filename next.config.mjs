/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone',
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
