import React, { useState } from 'react';
import { 
  Settings, 
  AlertTriangle, 
  Shield, 
  Server, 
  Key, 
  Check, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { AssessmentMetadata } from '../../types/security';

interface SettingsViewProps {
  metadata: AssessmentMetadata;
  onUpdateMetadata: (metadata: AssessmentMetadata) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  metadata,
  onUpdateMetadata,
  onResetData
}) => {
  const [targetUrl, setTargetUrl] = useState(metadata.targetUrl);
  const [environment, setEnvironment] = useState(metadata.environment);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMetadata({
      ...metadata,
      targetUrl,
      environment
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Prominent Warning Banner */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/60 text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-400 font-mono text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>⚠ AUTHORIZED SECURITY ASSESSMENT ONLY</span>
        </div>
        <p className="text-xs font-mono text-slate-300 leading-relaxed">
          SentinelScan is configured to operate in strictly non-destructive evaluation mode. Active exploitation, persistence establishment, data exfiltration, denial-of-service, and credential harvesting are disabled by default. All PoC validations execute against local mock fixtures and synthetic telemetry.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 rounded-2xl bg-[#0f131d] border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            ASSESSMENT ENGINE CONFIGURATION
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Parameters governing target scope, audit boundaries, and mock authentication
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs font-mono">
          {/* Target URL */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">
              Target Application Domain
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1 bg-[#090c14] border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Open Target"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <span className="text-[11px] text-slate-500">
              Reference: World Monitor Application (https://www.worldmonitor.app)
            </span>
          </div>

          {/* Assessment Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">Assessment Mode</label>
              <select
                disabled
                className="w-full bg-[#090c14] border border-slate-700/80 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed"
              >
                <option>Safe / Simulated Validation (Enforced)</option>
              </select>
              <span className="text-[10px] text-emerald-400">
                ✓ Non-destructive test harness active
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">Target Environment</label>
              <input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-[#090c14] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">
                Controlled sandbox instance
              </span>
            </div>
          </div>

          {/* Authentication & Scope */}
          <div className="p-4 rounded-xl bg-[#090c14] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Target Authentication Profile
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Not Configured (Guest + Mock Bearer)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synthetic analyst identity tokens are generated on-the-fly for multi-tenant BOLA/IDOR authorization probes.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Assessment State</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md"
            >
              {savedNotification ? <Check className="w-4 h-4 text-emerald-300" /> : null}
              <span>{savedNotification ? 'Changes Saved' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
