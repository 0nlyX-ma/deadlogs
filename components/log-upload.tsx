"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, X, AlertCircle, Check } from "lucide-react"
import { toast } from "sonner"
import { generateAnalysisResult, detectLogFormat } from "@/lib/log-parser"
import { saveAnalysis } from "@/lib/storage"
import type { LogFormat } from "@/lib/types"

const SAMPLE_LOGS = {
  nginx: `127.0.0.1 - - [24/Oct/2023:13:45:30 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:31 +0000] "POST /api/users HTTP/1.1" 201 567 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:32 +0000] "GET /api/legacy-endpoint HTTP/1.1" 200 89 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:33 +0000] "GET /health HTTP/1.1" 200 15 "-" "Mozilla/5.0"`,
  express: `::1 - - [24/Oct/2023:13:45:30 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0" 23.456 ms
::1 - - [24/Oct/2023:13:45:31 +0000] "POST /api/users HTTP/1.1" 201 567 "-" "Mozilla/5.0" 45.123 ms
::1 - - [24/Oct/2023:13:45:32 +0000] "GET /api/legacy-endpoint HTTP/1.1" 200 89 "-" "Mozilla/5.0" 12.345 ms
::1 - - [24/Oct/2023:13:45:33 +0000] "GET /health HTTP/1.1" 200 15 "-" "Mozilla/5.0" 5.678 ms`,
  json: JSON.stringify(
    [
      {
        timestamp: "2023-10-24T13:45:30Z",
        method: "GET",
        endpoint: "/api/users",
        status: 200,
        responseTime: 23.456,
      },
      {
        timestamp: "2023-10-24T13:45:31Z",
        method: "POST",
        endpoint: "/api/users",
        status: 201,
        responseTime: 45.123,
      },
      {
        timestamp: "2023-10-24T13:45:32Z",
        method: "GET",
        endpoint: "/api/legacy-endpoint",
        status: 200,
        responseTime: 12.345,
      },
      {
        timestamp: "2023-10-24T13:45:33Z",
        method: "GET",
        endpoint: "/health",
        status: 200,
        responseTime: 5.678,
      },
    ],
    null,
    2
  ),
}

export function LogUpload() {
  const router = useRouter()
  const [logContent, setLogContent] = useState("")
  const [logFormat, setLogFormat] = useState<LogFormat>("auto")
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 50MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setLogContent(content)

      if (logFormat === "auto") {
        const detected = detectLogFormat(content.split("\n")[0] || "")
        setDetectedFormat(detected)
        toast.success(`Detected format: ${detected}`)
      }
    }
    reader.readAsText(file)
    toast.success(`Loaded: ${file.name}`)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!logContent.trim()) {
      toast.error("Please paste or upload logs first.")
      return
    }

    setIsAnalyzing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = generateAnalysisResult(
        `Analysis ${new Date().toLocaleDateString()}`,
        logContent,
        logFormat
      )

      saveAnalysis(result)

      toast.success(`Analyzed ${result.totalEntries} log entries`)
      router.push("/dashboard")
    } catch {
      toast.error("Failed to analyze logs. Please check the format.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadSample = (type: keyof typeof SAMPLE_LOGS) => {
    setLogContent(SAMPLE_LOGS[type])
    setDetectedFormat(type)
    toast.info(`Loaded sample ${type} logs`)
  }

  const clearContent = () => {
    setLogContent("")
    setDetectedFormat(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Format selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {(["auto", "nginx", "cloudwatch", "express", "json", "csv"] as LogFormat[]).map(
          (format) => (
            <button
              key={format}
              onClick={() => setLogFormat(format)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                logFormat === format
                  ? "bg-primary text-black"
                  : "bg-white/5 text-on-surface-variant hover:text-white border border-white/10"
              }`}
            >
              {format === "auto" ? "Auto-detect" : format}
            </button>
          )
        )}
      </div>

      {/* Drop zone / Text area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-white/10 bg-white/[0.02] hover:border-white/20"
        }`}
      >
        {logContent ? (
          <div className="relative">
            <textarea
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              className="w-full h-64 p-6 bg-transparent text-sm font-mono text-on-surface-variant resize-none focus:outline-none"
              placeholder="Paste log lines here..."
            />
            <button
              onClick={clearContent}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {detectedFormat && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                <Check className="w-3 h-3" />
                Detected: {detectedFormat}
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-white font-headline font-bold text-lg mb-2">
              Drop your log file here
            </p>
            <p className="text-sm text-on-surface-variant mb-6">or paste log lines directly</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors">
              <FileText className="w-4 h-4" />
              Choose File
              <input
                type="file"
                accept=".log,.txt,.json,.csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Sample logs */}
      {!logContent && (
        <div className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant mb-3">Try with sample logs:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(SAMPLE_LOGS) as Array<keyof typeof SAMPLE_LOGS>).map((type) => (
              <button
                key={type}
                onClick={() => loadSample(type)}
                className="px-4 py-2 rounded-lg bg-white/5 text-sm text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors border border-white/5"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Supported formats */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
        <AlertCircle className="w-4 h-4" />
        <span>Supports: Nginx, AWS ALB, CloudFront, Express, JSON, CSV</span>
      </div>

      {/* Analyze button */}
      {logContent && (
        <div className="mt-8 text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-primary text-black px-12 py-5 rounded-full font-headline font-bold text-lg button-glow hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Analyze Logs
              </span>
            )}
          </button>
          <p className="mt-3 text-sm text-on-surface-variant">
            Processing happens locally in your browser
          </p>
        </div>
      )}
    </div>
  )
}
