import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-2xl font-bold tracking-tighter text-white font-headline">
            Deadlog
          </span>
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40">
            2024 Deadlog Systems. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="#"
            className="text-on-surface-variant/40 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant/40 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex gap-8 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Status
          </Link>
        </div>
      </div>
    </footer>
  )
}
