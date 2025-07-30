import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SentryUserProvider } from '@/components/SentryUserProvider'
import { NotificationProvider } from '@/components/notifications/NotificationSystem'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Computer Repair Shop',
    default: 'Computer Repair Shop - Professional Computer Repair Services',
  },
  description: 'Professional computer repair management system. Track repair tickets, manage customers, and streamline your repair shop operations with our comprehensive CRM solution.',
  keywords: ['computer repair', 'repair shop', 'CRM', 'ticket management', 'customer management', 'repair tracking'],
  authors: [{ name: 'Computer Repair Shop' }],
  creator: 'Computer Repair Shop',
  publisher: 'Computer Repair Shop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://repairshop.com',
    title: 'Computer Repair Shop - Professional Repair Services',
    description: 'Professional computer repair management system for tracking tickets and managing customers.',
    siteName: 'Computer Repair Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Computer Repair Shop - Professional Repair Services',
    description: 'Professional computer repair management system for tracking tickets and managing customers.',
  },
  alternates: {
    canonical: 'https://repairshop.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ErrorBoundary>
          <SentryUserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NotificationProvider>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Header will be added to authenticated routes via their specific layouts */}
                  {children}
                </div>
                <Toaster />
              </NotificationProvider>
            </ThemeProvider>
          </SentryUserProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
