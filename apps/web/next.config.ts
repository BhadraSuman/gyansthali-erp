import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@gyansthali/design-tokens', '@gyansthali/i18n', '@gyansthali/api-types'],
};

export default nextConfig;
