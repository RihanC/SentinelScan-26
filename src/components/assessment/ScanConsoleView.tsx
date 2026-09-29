import React, { useState } from 'react';
import { 
  SearchCode, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { Finding, SecurityCheck, AssessmentMetadata } from '../../types/security';
import { mockSecurityChecks } from '../../data/mockSecurityData';
import { SCAN_STAGES } from '../../services/securityScanner';

interface ScanConsoleViewProps {
  metadata: AssessmentMetadata;
  findings: Finding[];
  onTriggerScan: () => void;
  isScanning: boolean;
  onSelectFinding: (finding: Finding) => void;
}

export const ScanConsoleView: React.FC<ScanConsoleViewProps> = ({
  metadata,
  findings,
  onTriggerScan,
  isScanning,
  onSelectFinding
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'full' | 'api' | 'client' | 'headers'>('full');

  const passedChecksCount = mockSecurityChecks.filter(c => c.status === 'passed').length;
  const failedChecksCount = mockSecurityChecks.filter(c => c.status === 'failed').length;
  const warningChecksCount = mockSecurityChecks.filter(c => c.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f1422] to-[#12192b] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>INTERACTIVE SCAN ORCHESTRATOR</span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white mt-1">
            SentinelScan Automated Audit Suite
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active Target: <span className="text-cyan-300 font-semibold">{metadata.targetUrl}</span> ({metadata.environment})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              isScanning
                ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Target...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Security Assessment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profiles & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { id: 'full', title: 'Full Assessment', desc: 'All 7 categories, 24 security checks', checks: 24 },
          { id: 'api', title: 'API & Auth Probes', desc: 'BOLA, IDOR, session cookies, rate limits', checks: 9 },
          { id: 'client', title: 'Client & CSP Audit', desc: 'CSP, HSTS, XSS tooltips, SCA audit', checks: 8 },
          { id: 'headers', title: 'Edge Headers Check', desc: 'RFC 9110 and OWASP headers verification', checks: 4 }
        ].map((prof) => (
          <div
            key={prof.id}
            onClick={() => setSelectedProfile(prof.id as any)}
            className={`p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              selectedProfile === prof.id
                ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500'
                : 'bg-[#0f131d] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-200">{prof.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                {prof.checks} checks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {prof.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Security Checks Timeline / Registry */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-xl space-y-0">
        <div className="p-4 bg-[#0f1422] border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Automated Check Verification Register
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Deterministic security verification checks run against World Monitor test harness
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400">Passed: {passedChecksCount}</span>
            <span className="text-red-400">Failed: {failedChecksCount}</span>
            <span className="text-amber-400">Warning: {warningChecksCount}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-[480px] overflow-y-auto">
          {mockSecurityChecks.map((chk) => {
            const linkedFinding = chk.findingId
              ? findings.find(f => f.id === chk.findingId)
              : null;

            return (
              <div
                key={chk.id}
                className="p-3.5 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5 ${
                      chk.status === 'passed'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                        : chk.status === 'failed'
                        ? 'bg-red-950/80 text-red-400 border border-red-700/50'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                    }`}
                  >
                    {chk.status === 'passed' ? '✓' : chk.status === 'failed' ? '✕' : '!'}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{chk.name}</span>
                      <span className="text-slate-500">[{chk.id}]</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {chk.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {chk.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {chk.executionTimeMs}ms
                  </span>

                  {linkedFinding ? (
                    <button
                      onClick={() => onSelectFinding(linkedFinding)}
                      className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <span>{linkedFinding.id}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      SECURE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
