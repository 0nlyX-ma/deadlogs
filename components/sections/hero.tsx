import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Animated Glow/Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] hero-glow animate-pulse-slow pointer-events-none blur-[120px]" />

      {/* Horizon Line Effect */}
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-purple-400/10 to-transparent" />

      <div className="relative z-10 max-w-5xl px-8 text-center animate-fade-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
          Secure Browser-Based Analysis
        </span>

        <h1 className="font-headline text-6xl md:text-8xl lg:text-[100px] font-bold tracking-tighter leading-[0.9] mb-10 text-gradient">
          Find Dead API Endpoints Costing You Money
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-16 leading-relaxed opacity-80">
          Analyze millions of lines of logs in seconds without your data ever leaving your browser.
          Private, fast, and surgical.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link
            href="#upload"
            className="w-full md:w-auto bg-purple-400 text-black px-12 py-5 rounded-full font-headline font-bold text-lg button-glow hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Upload Logs
          </Link>
          <Link
            href="/dashboard"
            className="w-full md:w-auto border border-white/10 hover:bg-white/5 text-white px-12 py-5 rounded-full font-headline font-bold text-lg backdrop-blur-md transition-all active:scale-95 duration-200"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  )
}
