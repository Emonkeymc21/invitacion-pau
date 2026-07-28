/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;