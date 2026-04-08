import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Deadlog | Find Dead API Endpoints Costing You Money",
  description:
    "Analyze millions of lines of logs in seconds without your data ever leaving your browser. Private, fast, and surgical.",
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-surface text-on-surface font-body selection:bg-primary/30 overflow-x-hidden">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a0b2e",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f2f2f2",
            },
          }}
        />
      </body>
    </html>
  )
}
