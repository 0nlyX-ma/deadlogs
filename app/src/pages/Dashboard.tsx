import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Settings, LogOut, 
  TrendingDown, TrendingUp, Activity, Skull,
  Download, Code2, Trash2, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalyses, deleteAnalysis, downloadFile } from '@/utils/storage';
import { exportToCSV } from '@/utils/logParser';
import EndpointTable from '@/components/dashboard/EndpointTable';
import DeprecationModal from '@/components/dashboard/DeprecationModal';
import CostEstimateCard from '@/components/dashboard/CostEstimateCard';
import type { AnalysisResult, CodeLanguage } from '@/types';
import type { AppView } from '@/App';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

type DashboardTab = 'overview' | 'history' | 'settings';

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [showDeprecationModal, setShowDeprecationModal] = useState(false);
  const [deprecationLanguage, setDeprecationLanguage] = useState<CodeLanguage>('nodejs');

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    const data = getAnalyses();
    setAnalyses(data);
    if (data.length > 0 && !selectedAnalysis) {
      setSelectedAnalysis(data[0]);
    }
  };

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    loadAnalyses();
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
    }
    toast.success('Analysis deleted');
  };

  const handleExportCSV = () => {
    if (!selectedAnalysis) return;
    const csv = exportToCSV(selectedAnalysis.endpoints);
    downloadFile(csv, `deadlog-analysis-${selectedAnalysis.id}.csv`, 'text/csv');
    toast.success('CSV exported');
  };

  const handleExportJSON = () => {
    if (!selectedAnalysis) return;
    const json = JSON.stringify(selectedAnalysis, null, 2);
    downloadFile(json, `deadlog-analysis-${selectedAnalysis.id}.json`, 'application/json');
    toast.success('JSON exported');
  };

  const handleShowDeprecation = (language: CodeLanguage) => {
    setDeprecationLanguage(language);
    setShowDeprecationModal(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('landing')}
              className="text-muted-foreground hover:text-white mb-2 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="heading-display text-3xl text-white">Dashboard</h1>
            <p className="text-muted-foreground">
              {selectedAnalysis 
                ? `Analysis from ${new Date(selectedAnalysis.createdAt).toLocaleDateString()}`
                : 'No analyses yet'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                const element = document.getElementById('upload-section');
                onNavigate('landing');
                setTimeout(() => {
                  element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn-primary"
            >
              New Analysis
            </Button>
          </div>
        </div>

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
          <TabsList className="bg-deadlog-900/50 border border-deadlog-800 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {selectedAnalysis ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card-dark p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-lime" />
                      </div>
                      <span className="text-sm text-muted-foreground">Total Endpoints</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-white">
                      {selectedAnalysis.summary.total}
                    </p>
                  </div>

                  <div className="card-dark p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                        <Skull className="w-5 h-5 text-red-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">Dead</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-white">
                      {selectedAnalysis.summary.dead}
                    </p>
                  </div>

                  <div className="card-dark p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-yellow-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">Low Traffic</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-white">
                      {selectedAnalysis.summary.low}
                    </p>
                  </div>

                  <div className="card-dark p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-lime" />
                      </div>
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-white">
                      {selectedAnalysis.summary.active}
                    </p>
                  </div>
                </div>

                {/* Cost estimate */}
                {selectedAnalysis.costEstimate && (
                  <CostEstimateCard estimate={selectedAnalysis.costEstimate} />
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleExportCSV}
                    variant="outline"
                    className="border-deadlog-700 hover:bg-deadlog-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={handleExportJSON}
                    variant="outline"
                    className="border-deadlog-700 hover:bg-deadlog-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button
                    onClick={() => handleShowDeprecation('nodejs')}
                    variant="outline"
                    className="border-deadlog-700 hover:bg-deadlog-800"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Deprecation Code
                  </Button>
                </div>

                {/* Endpoint table */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Endpoints</h2>
                  <EndpointTable endpoints={selectedAnalysis.endpoints} />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-deadlog-800 flex items-center justify-center">
                  <Activity className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first log file to get started
                </p>
                <Button
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      const element = document.getElementById('upload-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="btn-primary"
                >
                  Analyze Logs
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {analyses.length > 0 ? (
                analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => {
                      setSelectedAnalysis(analysis);
                      setActiveTab('overview');
                    }}
                    className="card-dark p-6 cursor-pointer hover:border-lime/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-deadlog-800 flex items-center justify-center group-hover:bg-lime/10 transition-colors">
                          <Activity className="w-6 h-6 text-muted-foreground group-hover:text-lime" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{analysis.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(analysis.createdAt).toLocaleString()} • {analysis.totalEntries} entries
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1.5">
                            <Skull className="w-4 h-4 text-red-400" />
                            {analysis.summary.dead}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <TrendingDown className="w-4 h-4 text-yellow-400" />
                            {analysis.summary.low}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-lime" />
                            {analysis.summary.active}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(analysis.id);
                            }}
                            className="text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No history yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <div className="card-dark p-8 mb-6">
                <h3 className="text-lg font-semibold text-white mb-6">Account</h3>
                
                {user ? (
                  <div className="flex items-center gap-4">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-deadlog-800 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-lime/20 text-lime text-xs font-medium">
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Guest mode</p>
                      <p className="text-sm text-muted-foreground">
                        Sign in to sync your analyses across devices
                      </p>
                    </div>
                    <Button
                      onClick={() => toast.info('Sign in coming soon')}
                      className="btn-primary"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              <div className="card-dark p-8 mb-6">
                <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Email notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new features
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Coming soon')}
                      className="border-deadlog-700"
                    >
                      Enabled
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Default cost per request</p>
                      <p className="text-sm text-muted-foreground">
                        Used for cost estimates
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Coming soon')}
                      className="border-deadlog-700"
                    >
                      $0.0001
                    </Button>
                  </div>
                </div>
              </div>

              {user && (
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="w-full border-red-400/50 text-red-400 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deprecation Modal */}
      {showDeprecationModal && selectedAnalysis && (
        <DeprecationModal
          endpoints={selectedAnalysis.endpoints}
          language={deprecationLanguage}
          onLanguageChange={setDeprecationLanguage}
          onClose={() => setShowDeprecationModal(false)}
        />
      )}
    </div>
  );
}
