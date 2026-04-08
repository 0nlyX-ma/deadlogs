"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center px-8 py-5">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-white font-headline"
        >
          Deadlog
        </Link>
        <div className="hidden md:flex gap-8 font-headline text-sm tracking-tight text-on-surface-variant/80">
          <Link href="/#features" className="hover:text-white transition-colors">
            Product
          </Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#security" className="hover:text-white transition-colors">
            Security
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant/80 hover:text-white transition-colors font-headline text-sm tracking-tight active:scale-95 duration-200">
          Login
        </button>
        <Link
          href={isDashboard ? "/" : "/dashboard"}
          className={cn(
            "px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-tight active:scale-95 duration-200 transition-all",
            isDashboard
              ? "border border-white/10 text-white hover:bg-white/5"
              : "bg-primary text-black hover:brightness-110"
          )}
        >
          {isDashboard ? "Back Home" : "Launch Dashboard"}
        </Link>
      </div>
    </nav>
  )
}
