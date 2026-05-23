'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function DemoBar() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo-bar-dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  if (!visible || pathname === '/demo') return null

  const dismiss = () => {
    sessionStorage.setItem('demo-bar-dismissed', '1')
    setVisible(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-2 bg-[#1e40af] px-4 py-3 text-white text-sm">
      <span className="font-medium">
        🎯 Live demo available — no sign-up required
      </span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/demo/start"
          className="rounded bg-white px-3 py-1 text-[#1e40af] font-semibold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Try Demo →
        </Link>
        <button
          onClick={dismiss}
          aria-label="Close demo banner"
          className="hover:opacity-70 transition-opacity ml-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#1e40af] rounded"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
