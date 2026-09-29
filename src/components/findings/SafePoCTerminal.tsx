import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { Finding } from '../../types/security';

interface SafePoCTerminalProps {
  finding: Finding;
}

export const SafePoCTerminal: React.FC<SafePoCTerminalProps> = ({ finding }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  const runSafePoC = () => {
    if (isRunning) return;

    setIsRunning(true);
    setHasCompleted(false);
    setDisplayedLogs([
      `> [INIT] Initializing controlled test environment...`,
      `> [TARGET] Simulated Local Sandbox for ${finding.affectedComponent}`,
      `> [DISCLAIMER] Safe validation probe only. No production endpoints or live user sessions touched.`
    ]);

    const steps = finding.poc.logs;
    let index = 0;

    const interval = setInterval(() => {
      if (index >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setHasCompleted(true);
        setDisplayedLogs(prev => [
          ...prev,
          `> --------------------------------------------------`,
          `> [VALIDATION COMPLETE] Result: ${finding.poc.observedBehavior}`
        ]);
        return;
      }

      setDisplayedLogs(prev => [...prev, `> ${steps[index]}`]);
      index++;
    }, 350);
  };

  const resetTerminal = () => {
    setIsRunning(false);
    setHasCompleted(false);
    setDisplayedLogs([]);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#080b12] overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1422] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Safe Validation Sandbox — {finding.poc.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {displayedLogs.length > 0 && (
            <button
              onClick={resetTerminal}
              disabled={isRunning}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          <button
            onClick={runSafePoC}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              isRunning
                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 cursor-wait'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Executing Safe Probe...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                Run Safe PoC
              </>
            )}
          </button>
        </div>
      </div>

      {/* Synthetic Command Banner */}
      <div className="px-4 py-2 bg-[#0b0e17] border-b border-slate-900 text-xs font-mono text-cyan-300/90 flex items-center justify-between">
        <div className="truncate">
          <span className="text-slate-500">$ </span>
          {finding.poc.syntheticCommand}
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/40 text-blue-300 uppercase tracking-wider flex-shrink-0 ml-2">
          Synthetic Test
        </span>
      </div>

      {/* Terminal Screen */}
      <div className="p-4 font-mono text-xs text-slate-300 min-h-[160px] max-h-[260px] overflow-y-auto space-y-1.5 bg-[#07090f]">
        {displayedLogs.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <ShieldCheck className="w-7 h-7 text-slate-600" />
            <p className="text-xs">Click <strong className="text-cyan-400 font-semibold">"Run Safe PoC"</strong> to launch controlled non-destructive validation test.</p>
            <p className="text-[11px] text-slate-600">Strictly contained to mock sandbox • Zero production impact</p>
          </div>
        ) : (
          displayedLogs.map((log, i) => {
            const isCritical = log.includes('[CRITICAL]') || log.includes('[FAIL]');
            const isWarn = log.includes('[WARN]');
            const isComplete = log.includes('[VALIDATION COMPLETE]');

            return (
              <div
                key={i}
                className={`leading-relaxed ${
                  isCritical
                    ? 'text-red-400 font-medium'
                    : isWarn
                    ? 'text-amber-300'
                    : isComplete
                    ? 'text-emerald-300 font-semibold bg-emerald-950/20 p-1 rounded'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Details */}
      {hasCompleted && (
        <div className="p-3 bg-[#0d121f] border-t border-slate-800 text-xs font-mono space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Safe Validation Output Verified
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
            <div>
              <span className="text-slate-500">Expected: </span>
              {finding.poc.expectedBehavior}
            </div>
            <div>
              <span className="text-amber-400">Observed: </span>
              {finding.poc.observedBehavior}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
