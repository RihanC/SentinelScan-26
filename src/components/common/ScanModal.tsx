import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SCAN_STAGES } from '../../services/securityScanner';
import { mockSecurityChecks } from '../../data/mockSecurityData';
import { Finding } from '../../types/security';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  findings: Finding[];
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  findings
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStageIndex(0);
      setLogs([]);
      setIsFinished(false);
      return;
    }

    setLogs([
      `[${new Date().toISOString().substring(11, 19)}] [INIT] Initializing SentinelScan Assessment Engine v3.4...`,
      `[${new Date().toISOString().substring(11, 19)}] [TARGET] https://www.worldmonitor.app (Synthetic Test Harness)`,
      `[${new Date().toISOString().substring(11, 19)}] [SCOPE] Web Client, Ingestion APIs, Auth Tokens, CSP Headers, RSS Parser`
    ]);

    let step = 0;
    const totalSteps = mockSecurityChecks.length;

    const interval = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(interval);
        setProgress(100);
        setIsFinished(true);
        setLogs((prev) => [
          ...prev,
          `[${new Date().toISOString().substring(11, 19)}] [COMPLETE] Assessment complete. 24 checks executed.`,
          `[${new Date().toISOString().substring(11, 19)}] [SUMMARY] Discovered 8 findings (1 Critical, 2 High, 3 Medium, 2 Low).`,
          `[${new Date().toISOString().substring(11, 19)}] [STATUS] Security Score calculated: 72/100.`
        ]);
        return;
      }

      const check = mockSecurityChecks[step];
      const stageIdx = Math.min(
        SCAN_STAGES.length - 1,
        Math.floor((step / totalSteps) * SCAN_STAGES.length)
      );
      setCurrentStageIndex(stageIdx);

      const percent = Math.round(((step + 1) / totalSteps) * 100);
      setProgress(percent);

      const statusTag = check.status === 'passed' ? '[PASS]' : check.status === 'failed' ? '[FAIL]' : '[WARN]';
      const newLog = `[${new Date().toISOString().substring(11, 19)}] ${statusTag} Executed: ${check.name} (${check.executionTimeMs}ms)`;
      
      setLogs((prev) => [...prev.slice(-30), newLog]);
      step++;
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const criticalAndHighCount = findings.filter(f => f.severity === 'Critical' || f.severity === 'High').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0d111a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#111624] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                SENTINELSCAN ASSESSMENT ENGINE
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Target: worldmonitor.app • Mode: Safe Simulated Validation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                {!isFinished ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {!isFinished ? 'Executing Security Verification Checks...' : 'Security Assessment Finalized'}
              </span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {SCAN_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex || isFinished;
              const isCurrent = idx === currentStageIndex && !isFinished;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all ${
                    isPast
                      ? 'bg-slate-900/50 border-emerald-900/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 animate-pulse'
                      : 'bg-slate-900/20 border-slate-800 text-slate-500'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className="truncate">{stage.name}</span>
                </div>
              );
            })}
          </div>

          {/* Terminal Output */}
          <div className="rounded-xl border border-slate-800 bg-[#07090e] p-3.5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Audit Output Stream</span>
              </div>
              <span className="text-[10px] text-slate-400">Buffer: {logs.length} entries</span>
            </div>
            <div className="h-44 overflow-y-auto space-y-1 font-mono text-xs pr-1">
              {logs.map((log, index) => {
                const isFail = log.includes('[FAIL]');
                const isWarn = log.includes('[WARN]');
                const isPass = log.includes('[PASS]');
                const isComplete = log.includes('[COMPLETE]');

                return (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      isFail
                        ? 'text-red-400 font-semibold'
                        : isWarn
                        ? 'text-amber-400'
                        : isPass
                        ? 'text-emerald-400/90'
                        : isComplete
                        ? 'text-cyan-300 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
              <div ref={terminalBottomRef} />
            </div>
          </div>

          {/* Completion summary badge */}
          {isFinished && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#121828] border border-cyan-500/30 flex items-center justify-between animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Assessment Complete
                  </h4>
                  <p className="text-xs text-slate-300 font-mono">
                    24 checks executed • 8 findings discovered • {criticalAndHighCount} high-risk findings
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onComplete();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
