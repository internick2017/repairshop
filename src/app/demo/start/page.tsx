'use client'

import { useEffect } from 'react'
import { WrenchIcon, Loader2 } from 'lucide-react'

export default function DemoStartPage() {
  useEffect(() => {
    window.location.href = '/api/demo-login'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1e40af] mb-6 shadow-lg">
          <WrenchIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#0f172a] mb-3">
          Preparing your demo...
        </h1>
        <p className="text-slate-600 mb-8">
          Logging you in as the demo user. This may take a few seconds.
        </p>
        <div className="flex items-center justify-center gap-3 text-[#1e40af]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  )
}
