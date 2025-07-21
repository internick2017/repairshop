import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { ImageWithFallback } from '@/components/ui/image-fallback'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6 text-center">
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
        <ImageWithFallback
          src="https://illustrations.popsy.co/white/crashed-error.svg"
          alt="404 Illustration"
          className="dark:invert"
          fill
          priority
        />
      </div>
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          Oops! The page you are looking for seems to have gone missing.
          It might have been moved or deleted.
        </p>
        <Link href="/home" className="inline-block">
          <Button variant="default">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
} 