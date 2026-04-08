import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col bg-black">
        <TopNav />
        {children}
      </main>
    </div>
  )
}
