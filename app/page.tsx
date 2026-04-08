import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero"
import { DashboardPreview } from "@/components/sections/dashboard-preview"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Features } from "@/components/sections/features"
import { Security } from "@/components/sections/security"
import { Pricing } from "@/components/sections/pricing"
import { UploadSection } from "@/components/sections/upload-section"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <UploadSection />
      <DashboardPreview />
      <HowItWorks />
      <Features />
      <Security />
      <Pricing />
      <Footer />
    </main>
  )
}
