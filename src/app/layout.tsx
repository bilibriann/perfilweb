import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/themes/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import BackgroundRenderer from '@/themes/BackgroundRenderer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'Backend Developer | Portfolio',
  description:
    'Desarrollador Backend especializado en TypeScript, NestJS, Node.js, MongoDB y Docker. Construyendo APIs REST escalables y sistemas de servidor robustos.',
  keywords: ['backend developer', 'NestJS', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'REST API', 'JWT'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <BackgroundRenderer />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
