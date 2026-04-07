import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Backend Developer | Portfolio',
  description:
    'Desarrollador Backend especializado en TypeScript, NestJS, Node.js, MongoDB y Docker. Construyendo APIs REST escalables y sistemas de servidor robustos.',
  keywords: [
    'backend developer',
    'NestJS',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Docker',
    'REST API',
    'JWT',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-[#070b14] antialiased">{children}</body>
    </html>
  )
}
