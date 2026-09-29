import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Finding, FindingStatus } from '../../types/security';

interface RemediationCenterViewProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onUpdateStatus: (id: string, status: FindingStatus) => void;
}

export const RemediationCenterView: React.FC<RemediationCenterViewProps> = ({
  findings,
  onSelectFinding,
  onUpdateStatus
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Urgent' | 'High' | 'Medium' | 'Low'>('All');

  const priorityGroups = [
    {
      level: 'Urgent' as const,
      color: 'border-red-800/80 bg-red-950/20 text-red-300',
      badge: 'bg-red-950 text-red-300 border-red-800',
      description: 'Critical business risk. Immediate patch deployment required.'
    },
    {
      level: 'High' as const,
      color: 'border-orange-800/80 bg-orange-950/20 text-orange-300',
      badge: 'bg-orange-950 text-orange-300 border-orange-800',
      description: 'Severe vulnerability. Target fix within 48-72 hours.'
    },
    {
      level: 'Medium' as const,
      color: 'border-amber-800/80 bg-amber-950/20 text-amber-300',
      badge: 'bg-amber-950 text-amber-300 border-amber-800',
      description: 'Defensive hardening issue. Include in upcoming release sprint.'
    },
    {
      level: 'Low' as const,
      color: 'border-cyan-800/80 bg-cyan-950/20 text-cyan-300',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      description: 'Minor hygiene or dependency upgrade. Routine maintenance.'
    }
  ];

  const filteredGroups = priorityGroups.filter(
    (g) => priorityFilter === 'All' || g.level === priorityFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#0f131d] border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            ENGINEERING REMEDIATION ROADMAP
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Prescriptive security recommendations categorized by operational urgency and development effort
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-[#090c14] border border-slate-800 rounded-lg p-1 text-xs font-mono">
          {(['All', 'Urgent', 'High', 'Medium', 'Low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setPriorityFilter(lvl)}
              className={`px-2.5 py-1 rounded transition-colors ${
                priorityFilter === lvl
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Sections */}
      <div className="space-y-6">
        {filteredGroups.map((group) => {
          const groupFindings = findings.filter(
            (f) => f.remediation.priority.toLowerCase() === group.level.toLowerCase()
          );

          if (groupFindings.length === 0) return null;

          return (
            <div key={group.level} className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${group.badge}`}>
                    {group.level} PRIORITY
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {group.description}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {groupFindings.length} Recommendation{groupFindings.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {groupFindings.map((finding) => {
                  const isResolved = finding.status === 'Remediated';

                  return (
                    <div
                      key={finding.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isResolved
                          ? 'bg-emerald-950/10 border-emerald-900/40 opacity-75'
                          : 'bg-[#0f1422] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                            <span className="font-bold text-cyan-400">{finding.id}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-300 font-semibold">{finding.affectedComponent}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400">Effort: <strong className="text-white">{finding.remediation.effort}</strong></span>
                            {isResolved && (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-300">
                                <Check className="w-3 h-3" /> Resolved
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-white font-sans">
                            {finding.title}
                          </h3>

                          {/* Why it matters */}
                          <div className="p-2.5 rounded-lg bg-[#090c14] border border-slate-800/80 text-xs font-mono text-slate-300">
                            <strong className="text-cyan-400 font-medium">Why it matters: </strong>
                            {finding.whyIsThisRisky}
                          </div>

                          {/* Recommended Fix */}
                          <div className="text-xs font-mono text-slate-300 pt-1">
                            <strong className="text-emerald-400">Recommended Fix: </strong>
                            {finding.remediation.summary}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col items-center gap-2 flex-shrink-0 self-end lg:self-start">
                          <button
                            onClick={() =>
                              onUpdateStatus(
                                finding.id,
                                isResolved ? 'Open' : 'Remediated'
                              )
                            }
                            className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                              isResolved
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900'
                            }`}
                          >
                            {isResolved ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reopen
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Mark Resolved
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onSelectFinding(finding)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                          >
                            <span>View Finding</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
