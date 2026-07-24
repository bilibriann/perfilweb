'use client'
import dynamic from 'next/dynamic'
import { useTheme } from './ThemeContext'

const CyberpunkBackground = dynamic(() => import('./effects/CyberpunkBackground'), { ssr: false })
const GalaxyBackground    = dynamic(() => import('./effects/GalaxyBackground'),    { ssr: false })
const SimpleBackground    = dynamic(() => import('./effects/SimpleBackground'),    { ssr: false })

const BgMatrixRain   = dynamic(() => import('@/components/backgrounds/BgMatrixRain'),   { ssr: false })

export default function BackgroundRenderer() {
  const { theme } = useTheme()

  switch (theme.id) {
    case 'main':
      return <><CyberpunkBackground /><BgMatrixRain /></>
    case 'portfolio':
      return <GalaxyBackground />
    default:
      return <SimpleBackground />
  }
}
