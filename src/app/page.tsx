import Link from 'next/link'
import { WrenchIcon, UsersIcon, TicketIcon, BarChart3Icon } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pt-12">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 font-bold text-[#1e40af] text-lg">
          <WrenchIcon className="w-5 h-5" />
          Francisco Repair Shop
        </div>
        <Link
          href="/api/demo-login"
          className="rounded-md bg-[#1e40af] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 transition-colors"
        >
          Try Demo
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Your shop, perfectly
          <br />
          <span className="text-[#3b82f6]">organized</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-xl mx-auto">
          Customer management, repair tickets, and analytics — all in one place.
        </p>
        <Link
          href="/api/demo-login"
          className="inline-block rounded-lg bg-[#1e40af] px-8 py-4 text-lg font-semibold text-white hover:bg-blue-900 transition-colors shadow-lg"
        >
          Try Demo →
        </Link>
      </section>

      {/* Stats bar */}
      <div className="border-y border-slate-200 bg-white py-8">
        <div className="max-w-2xl mx-auto flex justify-center gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">25</div>
            <div className="text-sm text-slate-500 mt-1">Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">40</div>
            <div className="text-sm text-slate-500 mt-1">Tickets</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">$4,820</div>
            <div className="text-sm text-slate-500 mt-1">Demo Revenue</div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <UsersIcon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Customer Management</h3>
          <p className="text-sm text-slate-500">
            Full customer profiles, history, and contact info in one click.
          </p>
        </div>
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <TicketIcon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Ticket Tracking</h3>
          <p className="text-sm text-slate-500">
            Assign, update, and close repair tickets with a full audit trail.
          </p>
        </div>
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <BarChart3Icon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Analytics</h3>
          <p className="text-sm text-slate-500">
            Dashboard with completion rates, open tickets, and customer trends.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p className="mb-3">
          Built by{' '}
          <a
            href="https://nickgranados.com"
            className="text-[#1e40af] font-medium hover:underline"
          >
            Nick Granados
          </a>
        </p>
        <div className="flex justify-center flex-wrap gap-2">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Next.js 16</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Kinde Auth</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Neon DB</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Drizzle ORM</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">shadcn/ui</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Sentry</span>
        </div>
      </footer>
    </div>
  )
}
