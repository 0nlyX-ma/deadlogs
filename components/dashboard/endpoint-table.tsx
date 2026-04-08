"use client"

import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import type { EndpointMetrics } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EndpointTableProps {
  endpoints: EndpointMetrics[]
  onDelete?: () => void
}

const ITEMS_PER_PAGE = 10

export function EndpointTable({ endpoints }: EndpointTableProps) {
  const [filter, setFilter] = useState<"all" | "dead" | "low" | "active">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredEndpoints =
    filter === "all" ? endpoints : endpoints.filter((e) => e.status === filter)

  const totalPages = Math.ceil(filteredEndpoints.length / ITEMS_PER_PAGE)
  const paginatedEndpoints = filteredEndpoints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getStatusBadge = (status: EndpointMetrics["status"]) => {
    switch (status) {
      case "dead":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 border border-error/20 text-error-dim text-[10px] font-black uppercase tracking-widest glow-badge-error animate-status-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_10px_rgba(255,110,132,1)]" />
            Dead
          </span>
        )
      case "low":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest glow-badge-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(190,130,255,1)]" />
            Low
          </span>
        )
      case "active":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-dim text-[10px] font-black uppercase tracking-widest glow-badge-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(209,162,254,1)]" />
            Active
          </span>
        )
    }
  }

  const getTrafficWidth = (calls: number, maxCalls: number) => {
    if (calls === 0) return 0
    return Math.max(5, (calls / maxCalls) * 100)
  }

  const maxCalls = Math.max(...endpoints.map((e) => e.totalCalls), 1)

  return (
    <section className="aether-glass rounded-2xl overflow-hidden">
      <div className="px-8 py-8 flex items-center justify-between border-b border-white/5">
        <h4 className="text-2xl font-headline font-bold text-white tracking-tight">
          Endpoint Inventory
        </h4>
        <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
          {(["all", "dead", "low", "active"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f)
                setCurrentPage(1)
              }}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                filter === f
                  ? "text-black bg-primary shadow-lg shadow-primary/20"
                  : "text-white/40 hover:text-white"
              )}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-white/30 font-label text-[10px] uppercase tracking-[0.4em] bg-white/[0.02]">
              <th className="px-10 py-6 font-medium">Endpoint Path</th>
              <th className="px-10 py-6 font-medium">Method</th>
              <th className="px-10 py-6 font-medium">Traffic (24h)</th>
              <th className="px-10 py-6 font-medium">Status</th>
              <th className="px-10 py-6 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedEndpoints.map((endpoint, index) => (
              <tr key={index} className="hover:bg-white/[0.03] transition-all group">
                <td className="px-10 py-8 font-mono text-sm text-primary-dim">
                  {endpoint.endpoint}
                </td>
                <td className="px-10 py-8">
                  <span className="px-3 py-1 bg-white/5 text-white/60 border border-white/10 rounded-md text-[10px] font-black tracking-widest uppercase">
                    {endpoint.method}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-[2px] bg-white/5 rounded-full w-32 relative overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full",
                          endpoint.status === "dead"
                            ? "bg-error-dim"
                            : endpoint.status === "low"
                              ? "bg-secondary"
                              : "bg-primary shadow-[0_0_10px_rgba(209,162,254,0.3)]"
                        )}
                        style={{ width: `${getTrafficWidth(endpoint.totalCalls, maxCalls)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/40">
                      {endpoint.totalCalls.toLocaleString()} reqs
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">{getStatusBadge(endpoint.status)}</td>
                <td className="px-10 py-8 text-right">
                  <button className="text-white/20 hover:text-primary transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-white/30 font-label uppercase tracking-widest">
          Displaying {paginatedEndpoints.length} / {filteredEndpoints.length} endpoints
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all",
                currentPage === page
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "border border-white/10 text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
