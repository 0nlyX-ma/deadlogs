import { LogUpload } from "@/components/log-upload"

export function UploadSection() {
  return (
    <section id="upload" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            Paste Your Logs
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto text-lg">
            Drag a file or paste a snippet. We parse it locally in your browser.
          </p>
        </div>

        <LogUpload />
      </div>
    </section>
  )
}
