import { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateDeprecationSnippet } from '@/utils/logParser';
import type { EndpointMetrics, CodeLanguage } from '@/types';

interface DeprecationModalProps {
  endpoints: EndpointMetrics[];
  language: CodeLanguage;
  onLanguageChange: (lang: CodeLanguage) => void;
  onClose: () => void;
}

const LANGUAGES: { id: CodeLanguage; name: string; icon: string }[] = [
  { id: 'nodejs', name: 'Node.js', icon: '●' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'go', name: 'Go', icon: '⚡' },
];

export default function DeprecationModal({
  endpoints,
  language,
  onLanguageChange,
  onClose,
}: DeprecationModalProps) {
  const [copied, setCopied] = useState(false);
  
  const code = generateDeprecationSnippet(endpoints, language);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-deadlog-900 border border-deadlog-700 shadow-panel">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deadlog-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-lime" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Deprecation Code</h3>
              <p className="text-sm text-muted-foreground">
                Middleware to return 410 Gone for dead endpoints
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-deadlog-800 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Language selector */}
        <div className="flex gap-2 p-4 border-b border-deadlog-800">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                language === lang.id
                  ? 'bg-lime text-dark'
                  : 'bg-deadlog-800 text-muted-foreground hover:text-white'
              }`}
            >
              <span className="mr-2">{lang.icon}</span>
              {lang.name}
            </button>
          ))}
        </div>
        
        {/* Code block */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="border-deadlog-700 bg-deadlog-900/80 backdrop-blur"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-lime" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          <div className="overflow-auto max-h-[50vh] p-6 bg-dark">
            <pre className="font-mono text-sm">
              <code className="text-muted-foreground">
                {code.split('\n').map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    {/* Simple syntax highlighting */}
                    {line.startsWith('//') || line.startsWith('#') ? (
                      <span className="code-comment">{line}</span>
                    ) : line.includes('const') || line.includes('let') || line.includes('var') || line.includes('import') || line.includes('from') || line.includes('def') || line.includes('func') ? (
                      <span>
                        <span className="code-keyword">{line.match(/^(const|let|var|import|from|def|func|package|type)\s*/)?.[0]}</span>
                        {line.replace(/^(const|let|var|import|from|def|func|package|type)\s*/, '')}
                      </span>
                    ) : line.includes('"') || line.includes("'") ? (
                      <span>
                        {line.split(/("[^"]*"|'[^']*')/).map((part, j) => 
                          part.startsWith('"') || part.startsWith("'") ? (
                            <span key={j} className="code-string">{part}</span>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-deadlog-800 bg-deadlog-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {endpoints.filter(e => e.status === 'dead').length} dead endpoints will be deprecated
            </p>
            <Button onClick={onClose} className="btn-primary">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
