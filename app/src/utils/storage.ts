import type { AnalysisResult, AnalysisHistoryItem, UserSettings } from '@/types';

const STORAGE_KEYS = {
  analyses: 'deadlog_analyses',
  settings: 'deadlog_settings',
  user: 'deadlog_user',
};

// Analysis storage
export function saveAnalysis(result: AnalysisResult): void {
  const existing = getAnalyses();
  const updated = [result, ...existing].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(updated));
}

export function getAnalyses(): AnalysisResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.analyses);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const analyses = getAnalyses();
  return analyses.find(a => a.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  const analyses = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(analyses));
}

export function clearAnalyses(): void {
  localStorage.removeItem(STORAGE_KEYS.analyses);
}

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  const analyses = getAnalyses();
  return analyses.map(a => ({
    id: a.id,
    name: a.name,
    createdAt: a.createdAt,
    endpointCount: a.summary.total,
    deadCount: a.summary.dead,
    fileSize: 0, // We don't store file size currently
  }));
}

// Settings storage
export function getSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Fall through to defaults
  }
  
  return {
    defaultLogFormat: 'auto',
    emailNotifications: true,
    autoAnalyze: false,
    defaultCostPerRequest: 0.0001,
  };
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

// Export analysis as JSON
export function exportAnalysisAsJSON(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}

// Download file helper
export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
