"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, RefreshCw, AlertTriangle, TrendingUp, Skull, Activity } from "lucide-react"
import { getAnalyses, deleteAnalysis, downloadFile } from "@/lib/storage"
import { exportToCSV } from "@/lib/log-parser"
import type { AnalysisResult } from "@/lib/types"
import { EndpointTable } from "./endpoint-table"
import { cn } from "@/lib/utils"

export function DashboardContent() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const data = getAnalyses()
    setAnalyses(data)
    if (data.length > 0) {
      setSelectedAnalysis(data[0])
    }
  }, [])

  const handleExportCSV = () => {
    if (!selectedAnalysis) return
    const csv = exportToCSV(selectedAnalysis.endpoints)
    downloadFile(csv, `deadlog-analysis-${selectedAnalysis.id}.csv`, "text/csv")
  }

  const handleExportJSON = () => {
    if (!selectedAnalysis) return
    const json = JSON.stringify(selectedAnalysis, null, 2)
    downloadFile(json, `deadlog-analysis-${selectedAnalysis.id}.json`, "application/json")
  }

  const handleDelete = (id: string) => {
    deleteAnalysis(id)
    const data = getAnalyses()
    setAnalyses(data)
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(data[0] || null)
    }
  }

  if (!selectedAnalysis) {
    return (
      <div className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
        <div className="text-center py-32">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-container-high flex items-center justify-center">
            <Activity className="w-10 h-10 text-on-surface-variant" />
          </div>
          <h3 className="text-2xl font-headline font-bold text-white mb-4">No analyses yet</h3>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
            Upload your first log file to get started with finding dead API endpoints
          </p>
          <Link
            href="/#upload"
            className="bg-primary text-black px-8 py-4 rounded-full font-headline font-bold hover:scale-105 active:scale-95 transition-all"
          >
            Analyze Logs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-headline font-bold text-white tracking-tighter">
            Results Overview
          </h2>
          <p className="text-on-surface-variant mt-3 max-w-xl text-lg font-light leading-relaxed">
            System-wide analysis completed. Scanned {selectedAnalysis.totalEntries.toLocaleString()}{" "}
            trace paths to identify potential operational decay.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            className="px-6 py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-6 py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <Link
            href="/#upload"
            className="px-6 py-3 bg-primary text-black rounded-xl font-black active:scale-95 transition-all shadow-xl shadow-primary/20 hover:bg-white flex items-center gap-3"
          >
            <RefreshCw className="w-4 h-4" />
            Re-run Analysis
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Endpoints */}
        <div className="aether-glass inner-glow-primary group p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.3em]">
                Total Endpoints
              </p>
              <div className="mt-4 flex items-baseline gap-4">
                <h3 className="text-6xl font-headline font-extrabold text-white tracking-tighter">
                  {selectedAnalysis.summary.total.toLocaleString()}
                </h3>
                <span className="text-primary text-xs font-bold bg-primary/10 border border-primary/20 px-2 py-1 rounded flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>
            <Activity className="w-10 h-10 text-primary/40" />
          </div>
          <p className="mt-6 text-sm text-white/30 font-light italic">
            Distributed across {selectedAnalysis.summary.active} active routes
          </p>
        </div>

        {/* Dead Detected */}
        <div className="aether-glass inner-glow-error group p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:border-error/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.3em]">
                Dead Detected
              </p>
              <div className="mt-4 flex items-baseline gap-4">
                <h3 className="text-6xl font-headline font-extrabold text-error-dim tracking-tighter">
                  {selectedAnalysis.summary.dead}
                </h3>
                {selectedAnalysis.summary.dead > 0 && (
                  <span className="animate-status-pulse glow-badge-error text-error-dim text-[10px] font-black bg-error/10 border border-error/30 px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest">
                    <AlertTriangle className="w-3 h-3" />
                    Critical
                  </span>
                )}
              </div>
            </div>
            <Skull className="w-10 h-10 text-error-dim/40" />
          </div>
          <p className="mt-6 text-sm text-white/30 font-light italic">
            No traffic activity recorded in 30 days
          </p>
        </div>

        {/* Estimated Waste */}
        <div className="aether-glass group p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:border-secondary/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-[0.3em]">
                Estimated Waste
              </p>
              <div className="mt-4 flex items-baseline gap-4">
                <h3 className="text-6xl font-headline font-extrabold text-secondary tracking-tighter">
                  ${selectedAnalysis.costEstimate?.monthlyCost.toLocaleString() || "0"}
                </h3>
                <span className="text-secondary text-[10px] font-bold bg-secondary/10 border border-secondary/20 px-2 py-1 rounded uppercase tracking-wider">
                  Monthly
                </span>
              </div>
            </div>
            <span className="text-4xl text-secondary/40">$</span>
          </div>
          <p className="mt-6 text-sm text-white/30 font-light italic">
            Optimization potential for compute & storage
          </p>
        </div>
      </section>

      {/* Main Data Table Container */}
      <EndpointTable
        endpoints={selectedAnalysis.endpoints}
        onDelete={() => handleDelete(selectedAnalysis.id)}
      />

      {/* History */}
      {analyses.length > 1 && (
        <section className="aether-glass rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5">
            <h4 className="text-xl font-headline font-bold text-white">Previous Analyses</h4>
          </div>
          <div className="divide-y divide-white/5">
            {analyses.slice(1).map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                className={cn(
                  "w-full px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left",
                  selectedAnalysis?.id === analysis.id && "bg-white/[0.02]"
                )}
              >
                <div>
                  <p className="text-white font-medium">{analysis.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {new Date(analysis.createdAt).toLocaleString()} &bull;{" "}
                    {analysis.totalEntries} entries
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-error-dim">
                    <Skull className="w-4 h-4" />
                    {analysis.summary.dead}
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <AlertTriangle className="w-4 h-4" />
                    {analysis.summary.low}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
