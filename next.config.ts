import type { NextConfig } from 'next'

const basePath = process.env.DEPLOY_TARGET === 'github' ? '/perfilweb' : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
