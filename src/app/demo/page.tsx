import { Metadata } from "next"
import { WrenchIcon, LogIn } from "lucide-react"
import Link from "next/link"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { DashboardClient } from "@/app/(rs)/dashboard/DashboardClient"
import { getAllTickets } from "@/lib/queries/getAllTickets"
import { getAllCustomers } from "@/lib/queries/getAllCustomers"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Live Demo — Computer Repair Shop",
  description: "Read-only preview of the repair shop management dashboard.",
}

export default async function DemoPage() {
  const [allTickets, allCustomers] = await Promise.all([
    getAllTickets(),
    getAllCustomers(),
  ])

  const dashboardData = {
    totalTickets: allTickets.length,
    openTickets: allTickets.filter((t) => !t.completed).length,
    completedTickets: allTickets.filter((t) => t.completed).length,
    totalCustomers: allCustomers.length,
    activeCustomers: allCustomers.filter((c) => c.active).length,
    completionRate:
      allTickets.length > 0
        ? Math.round(
            (allTickets.filter((t) => t.completed).length / allTickets.length) * 100
          )
        : 0,
    recentTickets: allTickets
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
    recentCustomers: allCustomers
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Demo header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 font-bold text-[#1e40af] text-lg">
            <WrenchIcon className="w-5 h-5" />
            Computer Repair Shop
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
              Read-only preview
            </span>
            <LoginLink className="flex items-center gap-1.5 rounded-md bg-[#1e40af] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 transition-colors">
              <LogIn className="w-4 h-4" />
              Log in for full access
            </LoginLink>
          </div>
        </div>
      </header>

      {/* Demo banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-center text-sm text-amber-800">
        <strong>Demo mode</strong> — real data, read-only.{" "}
        <Link href="/" className="underline font-medium hover:text-amber-900">
          Back to landing page
        </Link>
      </div>

      {/* Dashboard content */}
      <DashboardClient dashboardData={dashboardData} isManager={true} />
    </div>
  )
}
