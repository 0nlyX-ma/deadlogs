"use client"

import Link from "next/link"
import { Search } from "lucide-react"

export function TopNav() {
  return (
    <header className="sticky top-0 right-0 left-0 bg-black/80 backdrop-blur-2xl z-50 flex justify-between items-center px-10 py-5 border-b border-white/5 font-headline">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-10 pr-4 py-2 w-72 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/20 outline-none"
            placeholder="Search systems..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8 font-label text-xs uppercase tracking-widest">
          <Link href="/#pricing" className="text-white/40 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-white/40 hover:text-white transition-colors">
            Changelog
          </Link>
          <Link href="#" className="text-white/40 hover:text-white transition-colors">
            Docs
          </Link>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <Link
          href="/"
          className="text-primary font-bold hover:text-white transition-colors active:scale-95 text-sm uppercase tracking-wider"
        >
          Back Home
        </Link>
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-white/20 p-0.5 hover:border-primary transition-all cursor-pointer bg-primary/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
        </div>
      </div>
    </header>
  )
}
