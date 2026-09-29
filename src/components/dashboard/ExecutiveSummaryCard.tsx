import React from 'react';
import { AlertTriangle, ArrowRight, ShieldCheck, ListOrdered } from 'lucide-react';
import { AssessmentMetadata, Finding } from '../../types/security';

interface ExecutiveSummaryCardProps {
  metadata: AssessmentMetadata;
  findings: Finding[];
  onViewRemediation: () => void;
  onViewReport: () => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  metadata,
  findings,
  onViewRemediation,
  onViewReport
}) => {
  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;
  const mediumCount = findings.filter(f => f.severity === 'Medium').length;
  const lowCount = findings.filter(f => f.severity === 'Low').length;

  const topRecommendations = [
    { id: 1, text: 'Strengthen server-side authorization enforcement on API endpoints (BOLA/IDOR prevention).' },
    { id: 2, text: 'Harden session cookie attributes by enforcing HttpOnly, Secure, and SameSite=Lax flags.' },
    { id: 3, text: 'Implement centralized input validation & regex escaping on search query parsers.' },
    { id: 4, text: 'Restrict CORS access-control headers on metrics and telemetry endpoints.' },
    { id: 5, text: 'Deploy strict Content-Security-Policy (CSP) and HSTS Preload headers at edge reverse proxy.' }
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e1322] via-[#0f1422] to-[#141b2e] border border-slate-800 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Executive Assessment Synthesis
            </span>
            <h3 className="text-base font-bold text-white">
              Target Risk Posture: <span className="text-orange-400 font-mono">ELEVATED / HIGH</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewReport}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            Full Report Preview
          </button>
          <button
            onClick={onViewRemediation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono transition-colors"
          >
            <span>Remediation Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Key Posture Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#090c14] border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Calculated Security Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400">{metadata.securityScore}</span>
            <span className="text-slate-500 text-xs">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">+{metadata.scoreDelta} pts from previous audit</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090c14] border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">High-Priority Vulnerabilities</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-red-400">{criticalCount + highCount}</span>
            <span className="text-slate-400 text-xs">Critical & High</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Requires immediate engineering attention</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090c14] border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Moderate & Low Issues</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">{mediumCount + lowCount}</span>
            <span className="text-slate-400 text-xs">Medium & Low</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Scheduled for sprint patch cycle</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090c14] border border-slate-800/80">
          <span className="text-slate-500 block text-[11px]">Security Checks Coverage</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
            <span className="text-slate-500 text-xs">({metadata.checksCompleted}/{metadata.totalChecks})</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Full OWASP benchmark executed</span>
        </div>
      </div>

      {/* Top 5 Recommendations */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-cyan-400" />
          Primary Strategic Remediation Priorities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          {topRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#090c14] border border-slate-800/80 text-slate-300"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {rec.id}
              </span>
              <span className="leading-relaxed text-[11px]">{rec.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
