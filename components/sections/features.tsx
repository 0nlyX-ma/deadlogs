import { BarChart3, DollarSign, Code2, Download, Shield } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-48 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Large Feature Card */}
        <div className="md:col-span-8 glass-card p-16 rounded-[3rem] relative overflow-hidden flex flex-col justify-end min-h-[500px]">
          <div className="absolute inset-0 opacity-10 pointer-events-none p-12">
            <div className="grid grid-cols-4 gap-6 items-end h-full">
              <div className="h-[60%] bg-primary rounded-2xl" />
              <div className="h-[40%] bg-primary/60 rounded-2xl" />
              <div className="h-[90%] bg-primary rounded-2xl" />
              <div className="h-[70%] bg-primary/40 rounded-2xl" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline text-4xl font-bold mb-6">Smart Classification</h3>
            <p className="text-on-surface-variant/80 max-w-md text-lg leading-relaxed">
              Our neural engine automatically groups dynamic paths into logical endpoints for
              accurate usage tracking.
            </p>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="md:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col gap-8">
          <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">Cost Analysis</h3>
            <p className="text-on-surface-variant/70 leading-relaxed">
              Calculate exactly how much compute and egress bandwidth each zombie endpoint is
              wasting every month.
            </p>
          </div>
        </div>

        {/* Snippets */}
        <div className="md:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col gap-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">Snippets</h3>
            <p className="text-on-surface-variant/70 leading-relaxed">
              Auto-generate Nginx &apos;deny&apos; blocks or Cloudflare Worker scripts to block
              traffic.
            </p>
          </div>
        </div>

        {/* Smart Export */}
        <div className="md:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col gap-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Download className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">Smart Export</h3>
            <p className="text-on-surface-variant/70 leading-relaxed">
              Download reports in JSON, CSV, or formatted PDF for architectural review boards.
            </p>
          </div>
        </div>

        {/* Secure by Design - Highlighted */}
        <div className="md:col-span-4 bg-primary p-10 rounded-[3rem] flex flex-col gap-8 text-black shadow-[0_20px_60px_-15px_rgba(209,162,254,0.3)]">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">Secure by Design</h3>
            <p className="text-black/80 leading-relaxed">
              Local processing means your secrets never touch our servers. SOC2 compliant by nature.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
