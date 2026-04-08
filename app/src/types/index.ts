// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'lifetime';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Log Analysis Types
export type LogFormat = 'nginx' | 'cloudwatch' | 'express' | 'json' | 'csv' | 'auto';

export interface LogEntry {
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
}

export type EndpointStatus = 'dead' | 'low' | 'active';

export interface EndpointMetrics {
  endpoint: string;
  method: string;
  totalCalls: number;
  statusCodes: Record<number, number>;
  lastCalled: string | null;
  avgResponseTime?: number;
  status: EndpointStatus;
  healthScore: number;
}

export interface AnalysisResult {
  id: string;
  name: string;
  createdAt: string;
  totalEntries: number;
  endpoints: EndpointMetrics[];
  timeRange: {
    start: string;
    end: string;
  };
  summary: {
    dead: number;
    low: number;
    active: number;
    total: number;
  };
  costEstimate?: CostEstimate;
}

export interface CostEstimate {
  monthlyCost: number;
  annualSavings: number;
  deadEndpointCount: number;
  lowTrafficCount: number;
  assumptions: {
    costPerRequest: number;
    requestsPerMonth: number;
  };
}

// Deprecation Code Types
export type CodeLanguage = 'nodejs' | 'python' | 'go';

export interface DeprecationSnippet {
  language: CodeLanguage;
  code: string;
  description: string;
}

// History Types
export interface AnalysisHistoryItem {
  id: string;
  name: string;
  createdAt: string;
  endpointCount: number;
  deadCount: number;
  fileSize: number;
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceAnnual?: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  limits: {
    projects: number;
    analyses: number;
    history: number;
  };
}

// UI Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// Settings Types
export interface UserSettings {
  defaultLogFormat: LogFormat;
  emailNotifications: boolean;
  autoAnalyze: boolean;
  defaultCostPerRequest: number;
}
