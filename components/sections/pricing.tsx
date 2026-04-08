"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for side projects",
    features: ["Up to 10MB Logs", "Basic Classification", "Browser-only engine"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professional developers",
    features: [
      "Unlimited Log Size",
      "Neural Cost Detection",
      "Terraform/IaC Export",
      "Priority Support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "/once",
    description: "Pay once, use forever",
    features: ["All Pro Features", "Lifetime Updates", "Enterprise Support"],
    cta: "Get Access",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-48 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <h2 className="font-headline text-5xl font-bold mb-6 tracking-tight">
          Transparent Pricing
        </h2>
        <p className="text-on-surface-variant/60 text-lg">
          No hidden fees. No per-log charges. Just clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={cn(
              "p-12 rounded-[2.5rem] flex flex-col relative",
              plan.highlighted
                ? "glass-card border-2 border-primary/50 shadow-[0_0_80px_rgba(209,162,254,0.15)] scale-105 z-10"
                : "glass-card"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Most Popular
              </div>
            )}

            <h3
              className={cn(
                "font-headline text-2xl font-bold mb-4",
                !plan.highlighted && "opacity-70"
              )}
            >
              {plan.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-12">
              <span className="text-5xl font-bold">{plan.price}</span>
              <span className="text-on-surface-variant/50 text-sm">{plan.period}</span>
            </div>

            <ul className="space-y-6 mb-16 flex-grow font-label text-sm">
              {plan.features.map((feature, fIndex) => (
                <li
                  key={fIndex}
                  className={cn(
                    "flex items-center gap-4",
                    !plan.highlighted && "text-on-surface-variant/80"
                  )}
                >
                  <Check
                    className={cn("w-5 h-5", plan.highlighted ? "text-primary" : "text-primary")}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.name === "Free" ? "#upload" : "#"}
              className={cn(
                "w-full py-5 rounded-full font-headline font-bold transition-all text-center",
                plan.highlighted
                  ? "bg-primary text-black hover:scale-105 shadow-lg shadow-primary/20"
                  : "border border-white/10 hover:bg-white/5"
              )}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
