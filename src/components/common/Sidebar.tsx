import React from 'react';
import { 
  LayoutDashboard, 
  SearchCode, 
  ShieldAlert, 
  Network, 
  FileTerminal, 
  Wrench, 
  FileSpreadsheet, 
  Settings,
  AlertTriangle
} from 'lucide-react';

export type TabId = 
  | 'dashboard' 
  | 'assessment' 
  | 'findings' 
  | 'attack-surface' 
  | 'evidence' 
  | 'remediation' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  openFindingsCount: number;
  urgentRemediationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  openFindingsCount,
  urgentRemediationsCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'assessment' as TabId,
      label: 'Scan Console',
      icon: SearchCode,
      badge: null
    },
    {
      id: 'findings' as TabId,
      label: 'Findings',
      icon: ShieldAlert,
      badge: openFindingsCount > 0 ? `${openFindingsCount}` : null,
      badgeColor: 'bg-red-950 text-red-300 border border-red-800/50'
    },
    {
      id: 'attack-surface' as TabId,
      label: 'Attack Surface',
      icon: Network,
      badge: null
    },
    {
      id: 'evidence' as TabId,
      label: 'Evidence Center',
      icon: FileTerminal,
      badge: null
    },
    {
      id: 'remediation' as TabId,
      label: 'Remediation',
      icon: Wrench,
      badge: urgentRemediationsCount > 0 ? `${urgentRemediationsCount} Urgent` : null,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800/50'
    },
    {
      id: 'reports' as TabId,
      label: 'Reports',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'settings' as TabId,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800/90 bg-[#0a0d16] flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3">
            Core Modules
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workflow breadcrumb preview */}
        <div className="p-3 rounded-lg bg-[#0e121e] border border-slate-800/80 text-[11px] font-mono text-slate-400">
          <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Assessment Pipeline
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Target → Checks → Findings → Risk → Safe PoC → Remediation → Report
          </p>
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="p-3 rounded-xl bg-gradient-to-b from-amber-950/20 to-[#0e121e] border border-amber-900/40 text-[11px] font-mono text-amber-200/90 space-y-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Controlled Prototype</span>
        </div>
        <p className="text-[10px] text-amber-300/80 leading-normal">
          Authorized demonstration prototype. All findings & PoC checks execute in simulated test harnesses with synthetic payloads.
        </p>
      </div>
    </aside>
  );
};
