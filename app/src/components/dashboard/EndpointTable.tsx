import { useState } from 'react';
import { ArrowUpDown, Skull, TrendingDown, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import type { EndpointMetrics, EndpointStatus } from '@/types';

interface EndpointTableProps {
  endpoints: EndpointMetrics[];
}

type SortField = 'endpoint' | 'method' | 'totalCalls' | 'lastCalled' | 'healthScore';
type SortDirection = 'asc' | 'desc';

export default function EndpointTable({ endpoints }: EndpointTableProps) {
  const [sortField, setSortField] = useState<SortField>('healthScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<EndpointStatus | 'all'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleRow = (endpoint: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(endpoint)) {
      newExpanded.delete(endpoint);
    } else {
      newExpanded.add(endpoint);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusIcon = (status: EndpointStatus) => {
    switch (status) {
      case 'dead':
        return <Skull className="w-4 h-4 text-red-400" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-yellow-400" />;
      case 'active':
        return <TrendingUp className="w-4 h-4 text-lime" />;
    }
  };

  const getStatusBadge = (status: EndpointStatus) => {
    const styles = {
      dead: 'bg-red-400/10 text-red-400 border-red-400/20',
      low: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      active: 'bg-lime/10 text-lime border-lime/20',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatLastCalled = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredEndpoints = endpoints.filter(e => 
    filter === 'all' || e.status === filter
  );

  const sortedEndpoints = [...filteredEndpoints].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'endpoint':
        comparison = a.endpoint.localeCompare(b.endpoint);
        break;
      case 'method':
        comparison = a.method.localeCompare(b.method);
        break;
      case 'totalCalls':
        comparison = a.totalCalls - b.totalCalls;
        break;
      case 'lastCalled':
        const aDate = a.lastCalled ? new Date(a.lastCalled).getTime() : 0;
        const bDate = b.lastCalled ? new Date(b.lastCalled).getTime() : 0;
        comparison = aDate - bDate;
        break;
      case 'healthScore':
        comparison = a.healthScore - b.healthScore;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-muted-foreground hover:text-white transition-colors"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'dead', 'low', 'active'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === status
                ? 'bg-lime text-dark'
                : 'bg-deadlog-800 text-muted-foreground hover:text-white'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 opacity-60">
              {status === 'all' 
                ? endpoints.length 
                : endpoints.filter(e => e.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-deadlog-800">
              <th className="pb-3 pr-4"></th>
              <th className="pb-3 pr-4">
                <SortHeader field="method">Method</SortHeader>
              </th>
              <th className="pb-3 pr-4">
                <SortHeader field="endpoint">Endpoint</SortHeader>
              </th>
              <th className="pb-3 pr-4">
                <SortHeader field="totalCalls">Calls</SortHeader>
              </th>
              <th className="pb-3 pr-4">
                <SortHeader field="lastCalled">Last Called</SortHeader>
              </th>
              <th className="pb-3 pr-4">
                <SortHeader field="healthScore">Health</SortHeader>
              </th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedEndpoints.map((endpoint) => (
              <>
                <tr
                  key={endpoint.endpoint}
                  onClick={() => toggleRow(endpoint.endpoint)}
                  className="border-b border-deadlog-800/50 hover:bg-deadlog-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-4 pr-4">
                    {expandedRows.has(endpoint.endpoint) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-deadlog-800 text-xs font-mono text-white">
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <code className="text-sm text-white font-mono">{endpoint.endpoint}</code>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-white">{endpoint.totalCalls.toLocaleString()}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-muted-foreground text-sm">
                      {formatLastCalled(endpoint.lastCalled)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-deadlog-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            endpoint.healthScore >= 80 ? 'bg-lime' :
                            endpoint.healthScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${endpoint.healthScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{endpoint.healthScore}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    {getStatusBadge(endpoint.status)}
                  </td>
                </tr>
                
                {/* Expanded details */}
                {expandedRows.has(endpoint.endpoint) && (
                  <tr className="bg-deadlog-800/20">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status Codes</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(endpoint.statusCodes).map(([code, count]) => (
                              <span
                                key={code}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono ${
                                  parseInt(code) >= 400 
                                    ? 'bg-red-400/10 text-red-400' 
                                    : 'bg-lime/10 text-lime'
                                }`}
                              >
                                {code}: {count}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {endpoint.avgResponseTime && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                            <p className="text-white font-mono">
                              {endpoint.avgResponseTime.toFixed(2)}ms
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                          <p className={`text-sm ${
                            endpoint.status === 'dead' ? 'text-red-400' :
                            endpoint.status === 'low' ? 'text-yellow-400' : 'text-lime'
                          }`}>
                            {endpoint.status === 'dead' 
                              ? 'Consider removing or deprecating'
                              : endpoint.status === 'low'
                              ? 'Monitor usage or optimize'
                              : 'Healthy endpoint'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {sortedEndpoints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No endpoints match this filter</p>
        </div>
      )}
    </div>
  );
}
