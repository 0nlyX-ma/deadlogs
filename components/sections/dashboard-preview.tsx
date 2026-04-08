export function DashboardPreview() {
  return (
    <section className="py-40 px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-[2rem] p-1.5 shadow-2xl overflow-hidden">
        <div className="bg-black rounded-[1.8rem] overflow-hidden">
          {/* Mock Dashboard Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <span className="text-primary text-2xl">&#9634;</span>
              <span className="font-headline font-bold text-lg tracking-tight">
                Log Intelligence Panel
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-error/10 border border-error/20">
              <div className="h-2 w-2 rounded-full bg-error animate-pulse" />
              <span className="text-[10px] font-label text-error font-black uppercase tracking-widest">
                34 Orphaned Endpoints Found
              </span>
            </div>
          </div>

          {/* Mock Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] text-on-surface-variant/50 text-[10px] font-label uppercase tracking-[0.2em]">
                  <th className="p-6 pl-10 border-b border-white/5">Endpoint</th>
                  <th className="p-6 text-center border-b border-white/5">Status</th>
                  <th className="p-6 border-b border-white/5">Last Called</th>
                  <th className="p-6 border-b border-white/5">Monthly Cost</th>
                  <th className="p-6 pr-10 border-b border-white/5">Confidence</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body">
                <tr className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 pl-10 font-mono text-primary">/v1/legacy/oauth/callback</td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 rounded-full border border-error/30 text-error text-[9px] font-black uppercase">
                      Inferred Dead
                    </span>
                  </td>
                  <td className="p-6 text-on-surface-variant/70">424 days ago</td>
                  <td className="p-6 font-bold text-on-surface">$1,420.00</td>
                  <td className="p-6 pr-10">
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[98%] shadow-[0_0_10px_#d1a2fe]" />
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 pl-10 font-mono text-primary">/api/internal/debug-logs</td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 rounded-full border border-white/20 text-on-surface-variant text-[9px] font-black uppercase">
                      Zombie
                    </span>
                  </td>
                  <td className="p-6 text-on-surface-variant/70">12 days ago</td>
                  <td className="p-6 font-bold text-on-surface">$890.00</td>
                  <td className="p-6 pr-10">
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[85%] shadow-[0_0_10px_#d1a2fe]" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
