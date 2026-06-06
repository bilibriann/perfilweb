'use client'
import dynamic from 'next/dynamic'
import { useTheme } from './ThemeContext'

const MidnightBackground = dynamic(
  () => import('./effects/MidnightBackground'),
  { ssr: false },
)

const RetrowaveBackground = dynamic(
  () => import('./effects/RetrowaveBackground'),
  { ssr: false },
)

const CyberpunkBackground = dynamic(
  () => import('./effects/CyberpunkBackground'),
  { ssr: false },
)

const TerminalBackground = dynamic(
  () => import('./effects/TerminalBackground'),
  { ssr: false },
)

const OceanBackground = dynamic(
  () => import('./effects/OceanBackground'),
  { ssr: false },
)

const ForestBackground = dynamic(
  () => import('./effects/ForestBackground'),
  { ssr: false },
)

const SimpleBackground = dynamic(
  () => import('./effects/SimpleBackground'),
  { ssr: false },
)

export default function BackgroundRenderer() {
  const { theme } = useTheme()

  switch (theme.id) {
    case 'midnight':
      return <MidnightBackground />
    case 'retrowave':
      return <RetrowaveBackground />
    case 'cyberpunk':
      return <CyberpunkBackground />
    case 'terminal':
      return <TerminalBackground />
    case 'ocean':
      return <OceanBackground />
    case 'forest':
      return <ForestBackground />
    case 'dark':
    case 'light':
    case 'portfolio':
    default:
      return <SimpleBackground />
  }
}
