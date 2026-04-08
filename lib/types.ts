// Log Analysis Types
export type LogFormat = "nginx" | "cloudwatch" | "express" | "json" | "csv" | "auto"

export interface LogEntry {
  timestamp: string
  method: string
  endpoint: string
  status: number
  responseTime?: number
  userAgent?: string
  ip?: string
}

export type EndpointStatus = "dead" | "low" | "active"

export interface EndpointMetrics {
  endpoint: string
  method: string
  totalCalls: number
  statusCodes: Record<number, number>
  lastCalled: string | null
  avgResponseTime?: number
  status: EndpointStatus
  healthScore: number
}

export interface AnalysisResult {
  id: string
  name: string
  createdAt: string
  totalEntries: number
  endpoints: EndpointMetrics[]
  timeRange: {
    start: string
    end: string
  }
  summary: {
    dead: number
    low: number
    active: number
    total: number
  }
  costEstimate?: CostEstimate
}

export interface CostEstimate {
  monthlyCost: number
  annualSavings: number
  deadEndpointCount: number
  lowTrafficCount: number
  assumptions: {
    costPerRequest: number
    requestsPerMonth: number
  }
}

// Deprecation Code Types
export type CodeLanguage = "nodejs" | "python" | "go"
