"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Terminal, GitBranch, BarChart3, Bell, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/logs", icon: Terminal, label: "Live Logs" },
  { href: "/dashboard/traces", icon: GitBranch, label: "Traces" },
  { href: "/dashboard/metrics", icon: BarChart3, label: "Metrics" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-black border-r border-white/5 flex flex-col p-6 space-y-2 z-40 hidden md:flex font-body text-sm">
      <div className="py-4 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tighter font-headline flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Deadlog Pro
          </h1>
        </Link>
        <p className="text-[10px] text-white/30 font-label uppercase tracking-[0.3em] mt-2">
          Core Engine v2.4.0
        </p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "text-white font-semibold bg-white/5 border border-white/10"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn("w-5 h-5", isActive ? "text-primary" : "text-current")}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-white/5 mt-auto space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </Link>
        <div className="mt-4">
          <Link
            href="#"
            className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl active:scale-95 hover:bg-primary transition-all duration-300 text-xs uppercase tracking-wider flex items-center justify-center"
          >
            New Project
          </Link>
        </div>
      </div>
    </aside>
  )
}
