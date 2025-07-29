'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'

export function BackButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.history.back()}
      className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3"
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2" />
      Go Back
    </Button>
  )
} 