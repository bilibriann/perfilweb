import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/perfilweb' : '',
  assetPrefix: isProd ? '/perfilweb/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
