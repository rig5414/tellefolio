// app/layout.tsx

import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import themeScript from './theme-script'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: "Manasseh's Portfolio - %s",
    default: "Manasseh's Portfolio",
  },
  description: 'Full Stack Engineer & ICT Specialist showcasing innovative projects and technical expertise',
  keywords: ['portfolio', 'web development', 'full stack', 'engineer', 'ICT'],
  authors: [{ name: 'Telle' }],
  creator: 'Telle',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-white dark:bg-[#232b3b] transition-colors">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}