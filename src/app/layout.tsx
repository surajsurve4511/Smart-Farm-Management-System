import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Smart Farm OS — AI-Powered Agriculture Intelligence',
  description: 'The ultimate AI-powered operating system for Indian farmers. Manage farms, analyze crops with Gemini AI, track market prices, discover government schemes, and maximize yields.',
  keywords: ['smart farming', 'agriculture AI', 'Indian farmers', 'crop management', 'market prices', 'government schemes'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

