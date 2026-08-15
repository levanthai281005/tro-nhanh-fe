import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@tronhanh/api',
    '@tronhanh/schemas',
    '@tronhanh/types',
    '@tronhanh/constants',
    '@tronhanh/utils',
  ],
};

export default nextConfig;
