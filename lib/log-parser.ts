import type {
  LogEntry,
  LogFormat,
  EndpointMetrics,
  EndpointStatus,
  AnalysisResult,
  CostEstimate,
} from "./types"

// Nginx log format parser
const NGINX_REGEX =
  /^(?<ip>[\d.]+)\s+-\s+(?<user>\S+)\s+\[(?<timestamp>[^\]]+)\]\s+"(?<method>\S+)\s+(?<endpoint>\S+)\s+[^"]*"\s+(?<status>\d+)\s+(?<bytes>\d+).*$/

// AWS CloudWatch/ALB log format parser
const CLOUDWATCH_REGEX =
  /^(?<type>\S+)\s+(?<timestamp>\S+)\s+\S+\s+(?<client>\S+)\s+\S+\s+\S+\s+\S+\s+\S+\s+(?<status>\d+)\s+\d+\s+\d+\s+\d+\s+"(?<method>\S+)\s+(?<endpoint>\S+)\s+[^"]*".*$/

// Express/morgan log format parser
const EXPRESS_REGEX =
  /^(?<ip>\S+)\s+-\s+(?<user>\S+)\s+\[(?<timestamp>[^\]]+)\]\s+"(?<method>\S+)\s+(?<endpoint>\S+)\s+[^"]*"\s+(?<status>\d+)\s+(?<bytes>\d+).*?(?<responseTime>[\d.]+)\s*ms$/

// JSON log parser
function parseJSONLog(line: string): LogEntry | null {
  try {
    const data = JSON.parse(line)
    return {
      timestamp: data.timestamp || data.time || data.ts || new Date().toISOString(),
      method: data.method || data.httpMethod || "GET",
      endpoint: data.endpoint || data.path || data.url || "/",
      status: parseInt(data.status || data.statusCode || "200"),
      responseTime: data.responseTime || data.duration || data.latency,
      userAgent: data.userAgent || data["user-agent"],
      ip: data.ip || data.clientIp || data.source,
    }
  } catch {
    return null
  }
}

// CSV log parser
function parseCSVLog(line: string): LogEntry | null {
  const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""))
  if (parts.length < 3) return null

  const timestamp = parts.find((p) => p.includes("T") || p.includes("/")) || parts[0]
  const methodPart = parts.find((p) =>
    ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(p.toUpperCase())
  )
  const statusPart = parts.find((p) => /^\d{3}$/.test(p))
  const endpointPart = parts.find((p) => p.startsWith("/") || p.startsWith("http"))

  return {
    timestamp: timestamp || new Date().toISOString(),
    method: methodPart || "GET",
    endpoint: endpointPart || "/",
    status: parseInt(statusPart || "200"),
    responseTime: undefined,
    userAgent: undefined,
    ip: undefined,
  }
}

// Auto-detect log format
export function detectLogFormat(sample: string): LogFormat {
  if (sample.trim().startsWith("{")) return "json"
  if (sample.includes(",") && !sample.includes("[")) return "csv"
  if ((sample.includes("app/") && sample.includes("https ")) || sample.includes("http "))
    return "cloudwatch"
  if (sample.includes("ms") && sample.match(/\d+\.?\d*\s*ms$/)) return "express"
  if (sample.match(/^\d+\.\d+\.\d+\.\d+/) && sample.includes("[") && sample.includes("]"))
    return "nginx"
  return "nginx"
}

// Parse a single log line
export function parseLogLine(line: string, format: LogFormat): LogEntry | null {
  if (!line.trim()) return null

  switch (format) {
    case "json":
      return parseJSONLog(line)
    case "csv":
      return parseCSVLog(line)
    case "cloudwatch": {
      const match = line.match(CLOUDWATCH_REGEX)
      if (match?.groups) {
        return {
          timestamp: match.groups.timestamp,
          method: match.groups.method,
          endpoint: match.groups.endpoint.split("?")[0],
          status: parseInt(match.groups.status),
          responseTime: undefined,
          userAgent: undefined,
          ip: match.groups.client?.split(":")[0],
        }
      }
      return null
    }
    case "express": {
      const match = line.match(EXPRESS_REGEX)
      if (match?.groups) {
        return {
          timestamp: match.groups.timestamp,
          method: match.groups.method,
          endpoint: match.groups.endpoint.split("?")[0],
          status: parseInt(match.groups.status),
          responseTime: parseFloat(match.groups.responseTime),
          userAgent: undefined,
          ip: match.groups.ip,
        }
      }
      return null
    }
    case "nginx":
    default: {
      const match = line.match(NGINX_REGEX)
      if (match?.groups) {
        return {
          timestamp: match.groups.timestamp,
          method: match.groups.method,
          endpoint: match.groups.endpoint.split("?")[0],
          status: parseInt(match.groups.status),
          responseTime: undefined,
          userAgent: undefined,
          ip: match.groups.ip,
        }
      }
      return null
    }
  }
}

// Parse multiple log lines
export function parseLogs(content: string, format: LogFormat): LogEntry[] {
  const lines = content.split("\n")
  const detectedFormat =
    format === "auto" ? detectLogFormat(lines.find((l) => l.trim()) || "") : format

  const entries: LogEntry[] = []
  for (const line of lines) {
    const entry = parseLogLine(line, detectedFormat)
    if (entry) entries.push(entry)
  }

  return entries
}

// Calculate endpoint metrics from log entries
export function calculateEndpointMetrics(entries: LogEntry[]): EndpointMetrics[] {
  const endpointMap = new Map<
    string,
    {
      method: string
      endpoint: string
      calls: number
      statusCodes: Record<number, number>
      lastCalled: Date | null
      responseTimes: number[]
    }
  >()

  for (const entry of entries) {
    const key = `${entry.method} ${entry.endpoint}`
    const existing = endpointMap.get(key)

    const entryDate = new Date(entry.timestamp)

    if (existing) {
      existing.calls++
      existing.statusCodes[entry.status] = (existing.statusCodes[entry.status] || 0) + 1
      if (!existing.lastCalled || entryDate > existing.lastCalled) {
        existing.lastCalled = entryDate
      }
      if (entry.responseTime) {
        existing.responseTimes.push(entry.responseTime)
      }
    } else {
      endpointMap.set(key, {
        method: entry.method,
        endpoint: entry.endpoint,
        calls: 1,
        statusCodes: { [entry.status]: 1 },
        lastCalled: entryDate,
        responseTimes: entry.responseTime ? [entry.responseTime] : [],
      })
    }
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  return Array.from(endpointMap.values())
    .map((data) => {
      const lastCalled = data.lastCalled
      let status: EndpointStatus = "active"
      let healthScore = 100

      if (!lastCalled || lastCalled < thirtyDaysAgo) {
        status = "dead"
        healthScore = 0
      } else if (lastCalled < sevenDaysAgo || data.calls < 10) {
        status = "low"
        healthScore = 50
      }

      const totalCalls = data.calls
      const errorCalls = Object.entries(data.statusCodes)
        .filter(([code]) => parseInt(code) >= 400)
        .reduce((sum, [, count]) => sum + count, 0)
      const errorRate = errorCalls / totalCalls

      if (errorRate > 0.1) {
        healthScore = Math.max(0, healthScore - 30)
      } else if (errorRate > 0.05) {
        healthScore = Math.max(0, healthScore - 15)
      }

      return {
        endpoint: data.endpoint,
        method: data.method,
        totalCalls: data.calls,
        statusCodes: data.statusCodes,
        lastCalled: lastCalled?.toISOString() || null,
        avgResponseTime:
          data.responseTimes.length > 0
            ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length
            : undefined,
        status,
        healthScore,
      }
    })
    .sort((a, b) => b.healthScore - a.healthScore)
}

// Calculate cost estimate
export function calculateCostEstimate(
  endpoints: EndpointMetrics[],
  costPerRequest: number = 0.0001
): CostEstimate {
  const deadEndpoints = endpoints.filter((e) => e.status === "dead")
  const lowTrafficEndpoints = endpoints.filter((e) => e.status === "low")

  const deadRequests = deadEndpoints.reduce((sum, e) => sum + e.totalCalls, 0)
  const lowRequests = lowTrafficEndpoints.reduce((sum, e) => sum + e.totalCalls, 0)

  const monthlyDeadRequests = deadRequests * 4
  const monthlyLowRequests = lowRequests * 4

  const monthlyCost = (monthlyDeadRequests + monthlyLowRequests * 0.5) * costPerRequest
  const annualSavings = monthlyCost * 12

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    deadEndpointCount: deadEndpoints.length,
    lowTrafficCount: lowTrafficEndpoints.length,
    assumptions: {
      costPerRequest,
      requestsPerMonth: monthlyDeadRequests + monthlyLowRequests,
    },
  }
}

// Generate analysis result
export function generateAnalysisResult(
  name: string,
  content: string,
  format: LogFormat
): AnalysisResult {
  const entries = parseLogs(content, format)
  const endpoints = calculateEndpointMetrics(entries)

  const timestamps = entries.map((e) => new Date(e.timestamp)).filter((d) => !isNaN(d.getTime()))
  const startTime =
    timestamps.length > 0 ? new Date(Math.min(...timestamps.map((d) => d.getTime()))) : new Date()
  const endTime =
    timestamps.length > 0 ? new Date(Math.max(...timestamps.map((d) => d.getTime()))) : new Date()

  const deadCount = endpoints.filter((e) => e.status === "dead").length
  const lowCount = endpoints.filter((e) => e.status === "low").length
  const activeCount = endpoints.filter((e) => e.status === "active").length

  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    totalEntries: entries.length,
    endpoints,
    timeRange: {
      start: startTime.toISOString(),
      end: endTime.toISOString(),
    },
    summary: {
      dead: deadCount,
      low: lowCount,
      active: activeCount,
      total: endpoints.length,
    },
    costEstimate: calculateCostEstimate(endpoints),
  }
}

// Export to CSV
export function exportToCSV(endpoints: EndpointMetrics[]): string {
  const headers = [
    "Method",
    "Endpoint",
    "Status",
    "Total Calls",
    "Last Called",
    "Health Score",
    "Avg Response Time (ms)",
  ]
  const rows = endpoints.map((e) => [
    e.method,
    e.endpoint,
    e.status,
    e.totalCalls,
    e.lastCalled || "Never",
    e.healthScore,
    e.avgResponseTime?.toFixed(2) || "N/A",
  ])

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}

// Generate deprecation code snippets
export function generateDeprecationSnippet(
  endpoints: EndpointMetrics[],
  language: "nodejs" | "python" | "go"
): string {
  const deadEndpoints = endpoints.filter((e) => e.status === "dead")
  const routes = deadEndpoints.map((e) => ({ method: e.method, path: e.endpoint }))

  switch (language) {
    case "nodejs":
      return `// Deprecation Middleware for Node.js/Express
// Returns 410 Gone for deprecated routes

const deprecatedRoutes = ${JSON.stringify(routes, null, 2)};

function deprecationMiddleware(req, res, next) {
  const isDeprecated = deprecatedRoutes.some(
    route => route.method === req.method && route.path === req.path
  );
  
  if (isDeprecated) {
    return res.status(410).json({
      error: 'Gone',
      message: 'This endpoint has been deprecated.',
      deprecatedAt: new Date().toISOString(),
      alternatives: []
    });
  }
  
  next();
}

module.exports = deprecationMiddleware;`

    case "python":
      return `# Deprecation Middleware for Python/Flask
# Returns 410 Gone for deprecated routes

from flask import request, jsonify
from datetime import datetime

DEPRECATED_ROUTES = ${JSON.stringify(routes, null, 2)}

def deprecation_middleware():
    """Check if the current route is deprecated."""
    is_deprecated = any(
        route['method'] == request.method and route['path'] == request.path
        for route in DEPRECATED_ROUTES
    )
    
    if is_deprecated:
        return jsonify({
            'error': 'Gone',
            'message': 'This endpoint has been deprecated.',
            'deprecated_at': datetime.utcnow().isoformat(),
            'alternatives': []
        }), 410`

    case "go":
      return `// Deprecation Middleware for Go/Gin
// Returns 410 Gone for deprecated routes

package middleware

import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

type Route struct {
  Method string
  Path   string
}

var deprecatedRoutes = []Route{
${routes.map((r) => `  {Method: "${r.method}", Path: "${r.path}"},`).join("\n")}
}

func DeprecationMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    for _, route := range deprecatedRoutes {
      if route.Method == c.Request.Method && route.Path == c.Request.URL.Path {
        c.JSON(http.StatusGone, gin.H{
          "error":         "Gone",
          "message":       "This endpoint has been deprecated.",
          "deprecated_at": time.Now().UTC().Format(time.RFC3339),
          "alternatives":  []string{},
        })
        c.Abort()
        return
      }
    }
    c.Next()
  }
}`

    default:
      return ""
  }
}
