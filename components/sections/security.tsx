import { Lock } from "lucide-react"

export function Security() {
  return (
    <section id="security" className="py-48 bg-black relative overflow-hidden">
      <div className="absolute inset-0 hero-glow opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white/5 p-4 rounded-full mb-12 border border-white/10">
          <Lock className="w-5 h-5 text-primary" />
          <span className="font-label font-bold uppercase tracking-[0.3em] text-[10px]">
            Security First Protocol
          </span>
        </div>

        <h2 className="font-headline text-5xl md:text-7xl font-bold mb-10 text-gradient leading-tight">
          &quot;Runs 100% in your browser&quot;
        </h2>

        <p className="text-xl md:text-2xl text-on-surface-variant/60 leading-relaxed font-body">
          We believe in zero-trust data analysis. Deadlog uses client-side WebAssembly to process
          data. We don&apos;t store your logs, we don&apos;t track your endpoints, and we certainly
          don&apos;t sell your metadata.
        </p>
      </div>
    </section>
  )
}
