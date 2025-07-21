import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Login to Computer Repair Shop'
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </div>
  )
} 