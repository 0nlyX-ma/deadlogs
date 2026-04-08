import { Upload, BarChart3, Trash2 } from "lucide-react"

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload",
    description:
      "Drop your Nginx, Cloudflare, or AWS logs directly. We process chunks locally in your browser memory.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Analyze",
    description:
      "Our WASM engine classifies endpoints, detects patterns, and highlights unused logic paths.",
  },
  {
    icon: Trash2,
    number: "03",
    title: "Remove",
    description:
      "Export a cleanup list or Terraform scripts to safely decommission costly infrastructure.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-48 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8">
            Optimized Analysis Pipeline
          </h2>
          <p className="text-on-surface-variant/60 max-w-2xl mx-auto text-lg">
            From messy logs to actionable cost savings in three precise steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-12 rounded-[2.5rem] flex flex-col gap-8 group hover:translate-y-[-12px] transition-all duration-500"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-headline text-3xl font-bold mb-4">
                  {step.number}. {step.title}
                </h3>
                <p className="text-on-surface-variant/70 font-body leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
