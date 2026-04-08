import type { AnalysisResult } from "./types"

const STORAGE_KEY = "deadlog_analyses"

export function getAnalyses(): AnalysisResult[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAnalysis(analysis: AnalysisResult): void {
  if (typeof window === "undefined") return
  const analyses = getAnalyses()
  analyses.unshift(analysis)
  // Keep only last 20 analyses
  const trimmed = analyses.slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function deleteAnalysis(id: string): void {
  if (typeof window === "undefined") return
  const analyses = getAnalyses()
  const filtered = analyses.filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
