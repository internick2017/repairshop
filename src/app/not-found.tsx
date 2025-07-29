import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { ImageWithFallback } from '@/components/ui/image-fallback'
import { HomeIcon, SearchIcon, ArrowLeftIcon } from 'lucide-react'
import { BackButton } from '@/components/BackButton'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="text-center max-w-2xl w-full">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>
        
        {/* Error Message */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 space-y-6">
          <div className="relative w-[200px] h-[200px] mx-auto mb-6">
            <ImageWithFallback
              src="https://illustrations.popsy.co/white/crashed-error.svg"
              alt="404 Illustration"
              className="dark:invert opacity-80"
              fill
              priority
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
            Oops! The page you are looking for seems to have gone missing. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/tickets">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6 py-3">
                <HomeIcon className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <BackButton />
          </div>
          
          {/* Help Links */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Need help? Try these options:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/tickets" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                View Tickets
              </Link>
              <Link href="/customers" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                View Customers
              </Link>
              <a href="mailto:support@repairshop.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 