import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateAnalysisResult, detectLogFormat } from '@/utils/logParser';
import { saveAnalysis } from '@/utils/storage';
import type { LogFormat } from '@/types';
import type { AppView } from '@/App';

interface LogUploadProps {
  onNavigate: (view: AppView) => void;
}

const SAMPLE_LOGS = {
  nginx: `127.0.0.1 - - [24/Oct/2023:13:45:30 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:31 +0000] "POST /api/users HTTP/1.1" 201 567 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:32 +0000] "GET /api/legacy-endpoint HTTP/1.1" 200 89 "-" "Mozilla/5.0"
127.0.0.1 - - [24/Oct/2023:13:45:33 +0000] "GET /health HTTP/1.1" 200 15 "-" "Mozilla/5.0"`,
  express: `::1 - - [24/Oct/2023:13:45:30 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0" 23.456 ms
::1 - - [24/Oct/2023:13:45:31 +0000] "POST /api/users HTTP/1.1" 201 567 "-" "Mozilla/5.0" 45.123 ms
::1 - - [24/Oct/2023:13:45:32 +0000] "GET /api/legacy-endpoint HTTP/1.1" 200 89 "-" "Mozilla/5.0" 12.345 ms
::1 - - [24/Oct/2023:13:45:33 +0000] "GET /health HTTP/1.1" 200 15 "-" "Mozilla/5.0" 5.678 ms`,
  json: JSON.stringify([
    { timestamp: '2023-10-24T13:45:30Z', method: 'GET', endpoint: '/api/users', status: 200, responseTime: 23.456 },
    { timestamp: '2023-10-24T13:45:31Z', method: 'POST', endpoint: '/api/users', status: 201, responseTime: 45.123 },
    { timestamp: '2023-10-24T13:45:32Z', method: 'GET', endpoint: '/api/legacy-endpoint', status: 200, responseTime: 12.345 },
    { timestamp: '2023-10-24T13:45:33Z', method: 'GET', endpoint: '/health', status: 200, responseTime: 5.678 },
  ], null, 2),
};

export default function LogUpload({ onNavigate }: LogUploadProps) {
  const [logContent, setLogContent] = useState('');
  const [logFormat, setLogFormat] = useState<LogFormat>('auto');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 50MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setLogContent(content);
      
      // Auto-detect format
      if (logFormat === 'auto') {
        const detected = detectLogFormat(content.split('\n')[0] || '');
        setDetectedFormat(detected);
        toast.success(`Detected format: ${detected}`);
      }
    };
    reader.readAsText(file);
    toast.success(`Loaded: ${file.name}`);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!logContent.trim()) {
      toast.error('Please paste or upload logs first.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = generateAnalysisResult(
        `Analysis ${new Date().toLocaleDateString()}`,
        logContent,
        logFormat
      );
      
      saveAnalysis(result);
      
      toast.success(`Analyzed ${result.totalEntries} log entries`);
      onNavigate('dashboard');
    } catch (error) {
      toast.error('Failed to analyze logs. Please check the format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (type: keyof typeof SAMPLE_LOGS) => {
    setLogContent(SAMPLE_LOGS[type]);
    setDetectedFormat(type);
    toast.info(`Loaded sample ${type} logs`);
  };

  const clearContent = () => {
    setLogContent('');
    setDetectedFormat(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Format selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {(['auto', 'nginx', 'cloudwatch', 'express', 'json', 'csv'] as LogFormat[]).map((format) => (
          <button
            key={format}
            onClick={() => setLogFormat(format)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              logFormat === format
                ? 'bg-lime text-dark'
                : 'bg-deadlog-800 text-muted-foreground hover:text-white'
            }`}
          >
            {format === 'auto' ? 'Auto-detect' : format.charAt(0).toUpperCase() + format.slice(1)}
          </button>
        ))}
      </div>

      {/* Drop zone / Text area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-lime bg-lime/5'
            : 'border-deadlog-700 bg-deadlog-900/30 hover:border-deadlog-600'
        }`}
      >
        {logContent ? (
          <div className="relative">
            <textarea
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              className="w-full h-64 p-6 bg-transparent text-sm font-mono text-muted-foreground resize-none focus:outline-none"
              placeholder="Paste log lines here..."
            />
            <button
              onClick={clearContent}
              className="absolute top-4 right-4 p-2 rounded-lg bg-deadlog-800 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {detectedFormat && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/20 text-lime text-xs">
                <Check className="w-3 h-3" />
                Detected: {detectedFormat}
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-deadlog-800 flex items-center justify-center">
              <Upload className="w-8 h-8 text-lime" />
            </div>
            <p className="text-white font-medium mb-2">
              Drop your log file here
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              or paste log lines directly
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-deadlog-800 text-white text-sm cursor-pointer hover:bg-deadlog-700 transition-colors">
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
          <p className="text-sm text-muted-foreground mb-3">Try with sample logs:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(SAMPLE_LOGS) as Array<keyof typeof SAMPLE_LOGS>).map((type) => (
              <button
                key={type}
                onClick={() => loadSample(type)}
                className="px-3 py-1.5 rounded-lg bg-deadlog-800/50 text-sm text-muted-foreground hover:text-white hover:bg-deadlog-800 transition-colors"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Supported formats */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span>Supports: Nginx, AWS ALB, CloudFront, Express, JSON, CSV</span>
      </div>

      {/* Analyze button */}
      {logContent && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary text-lg px-12 py-6 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Analyze Logs
              </>
            )}
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Processing happens locally in your browser
          </p>
        </div>
      )}
    </div>
  );
}
