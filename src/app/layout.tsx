import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Computer Repair Shop',
    default: 'Computer Repair Shop',
  },
  description: 'Manage repair tickets and customers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header will be added to authenticated routes via their specific layouts */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
