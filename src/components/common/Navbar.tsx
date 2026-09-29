import React from 'react';
import { 
  Shield, 
  Play, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Volume2, 
  VolumeX, 
  Search,
  Command
} from 'lucide-react';
import { AssessmentMetadata } from '../../types/security';
import { cyberAudio } from '../../utils/cyberAudio';

interface NavbarProps {
  metadata: AssessmentMetadata;
  onRunScan: () => void;
  onGenerateReport: () => void;
  isScanning: boolean;
  onOpenCommandPalette: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  metadata,
  onRunScan,
  onGenerateReport,
  isScanning,
  onOpenCommandPalette,
  audioEnabled,
  onToggleAudio
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#090c14]/95 backdrop-blur-md px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand & Target Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base tracking-wider text-white">
                  SENTINEL<span className="text-cyan-400">SCAN</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  SOC v3.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Security Assessment Suite
              </p>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-slate-800" />

          {/* Target Application Badge */}
          <div className="flex items-center gap-2 bg-[#0f1422] border border-slate-800 rounded-lg px-3 py-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Target:</span>
              <a
                href={metadata.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 font-medium hover:underline flex items-center gap-1"
                title="View target application"
              >
                worldmonitor.app
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={metadata.targetRepo}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 hover:underline flex items-center gap-1 text-[11px]"
                title="View GitHub repository"
              >
                koala73/worldmonitor
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Assessment Status Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Status: {metadata.status}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              {metadata.lastScanTimestamp}
            </span>
          </div>
        </div>

        {/* Action Controls & Command Palette */}
        <div className="flex items-center gap-2.5 self-end lg:self-center">
          {/* Quick Search / Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e121d] border border-slate-700/80 text-xs font-mono text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Command Palette</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-cyan-500/40">
              ⌘K
            </kbd>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
            }}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
              audioEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={audioEnabled ? 'Mute Cyber Audio Effects' : 'Enable Cyber Audio Effects'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={onRunScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              isScanning
                ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)] active:scale-95'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Target...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Assessment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
