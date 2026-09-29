import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Layers, 
  Terminal, 
  Wrench, 
  FileSpreadsheet, 
  Play, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Command,
  ArrowRight
} from 'lucide-react';
import { Finding } from '../../types/security';
import { TabId } from './Sidebar';
import { cyberAudio } from '../../utils/cyberAudio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onNavigate: (tab: TabId) => void;
  onRunScan: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  findings,
  onSelectFinding,
  onNavigate,
  onRunScan,
  audioEnabled,
  onToggleAudio
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const matchingFindings = findings.filter(
    (f) =>
      f.id.toLowerCase().includes(query.toLowerCase()) ||
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    {
      id: 'act-scan',
      type: 'action',
      title: 'Run Automated Security Assessment',
      sub: 'Initiate non-destructive 24-check suite',
      icon: Play,
      run: () => {
        onRunScan();
        onClose();
      }
    },
    {
      id: 'act-attack',
      type: 'nav',
      title: 'Open Attack Surface Topology',
      sub: 'View interactive infrastructure graph',
      icon: Layers,
      run: () => {
        onNavigate('attack-surface');
        onClose();
      }
    },
    {
      id: 'act-evidence',
      type: 'nav',
      title: 'Open Evidence Center',
      sub: 'Inspect HTTP traces, headers & PoC logs',
      icon: Terminal,
      run: () => {
        onNavigate('evidence');
        onClose();
      }
    },
    {
      id: 'act-remedy',
      type: 'nav',
      title: 'Open Remediation Roadmap',
      sub: 'Prioritized patch list with virtual mitigations',
      icon: Wrench,
      run: () => {
        onNavigate('remediation');
        onClose();
      }
    },
    {
      id: 'act-reports',
      type: 'nav',
      title: 'Generate Executive Security Report',
      sub: 'Export JSON or printable executive PDF',
      icon: FileSpreadsheet,
      run: () => {
        onNavigate('reports');
        onClose();
      }
    },
    {
      id: 'act-audio',
      type: 'action',
      title: audioEnabled ? 'Mute Cyber Audio Effects' : 'Enable Cyber Audio Effects',
      sub: 'Toggle synthesized terminal sounds & alert chimes',
      icon: audioEnabled ? VolumeX : Volume2,
      run: () => {
        onToggleAudio();
      }
    }
  ].filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.sub.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0c101a] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#0f1422] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, vulnerability ID (VULN-001), or module..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 font-mono text-xs">
          {actions.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Quick Actions & Navigation
            </div>
          )}
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={act.run}
                className="p-2.5 rounded-lg flex items-center justify-between hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-transparent cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-white">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{act.sub}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            );
          })}

          {matchingFindings.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-2">
              Vulnerability Findings ({matchingFindings.length})
            </div>
          )}
          {matchingFindings.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                onSelectFinding(f);
                onClose();
              }}
              className="p-2.5 rounded-lg flex items-center justify-between hover:bg-slate-900/60 border border-transparent hover:border-slate-800 cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {f.id}
                </span>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white font-sans text-xs">
                    {f.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {f.category} • CVSS {f.cvss} • {f.affectedComponent}
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                {f.severity}
              </span>
            </div>
          ))}

          {actions.length === 0 && matchingFindings.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              No matching commands or findings found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↵</kbd> to execute</span>
            <span>•</span>
            <span>Target: worldmonitor.app</span>
          </div>
          <span className="text-cyan-400 font-semibold">SentinelScan SOC v3.4</span>
        </div>
      </div>
    </div>
  );
};
