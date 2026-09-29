import React, { useState } from 'react';
import { 
  FileTerminal, 
  Search, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  Layers, 
  Activity, 
  Terminal, 
  FileCode,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Finding, SecurityCheck } from '../../types/security';
import { mockSecurityChecks } from '../../data/mockSecurityData';

interface EvidenceCenterViewProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

export const EvidenceCenterView: React.FC<EvidenceCenterViewProps> = ({
  findings,
  onSelectFinding
}) => {
  const [activeTab, setActiveTab] = useState<'HTTP' | 'Headers' | 'API' | 'Config' | 'PoC' | 'Results'>('HTTP');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const httpEvidence = findings.filter(f => f.evidence.type === 'HTTP' || f.evidence.requestSnippet);
  const headerEvidence = findings.filter(f => f.evidence.type === 'Header');
  const apiEvidence = findings.filter(f => f.evidence.type === 'API');
  const configEvidence = findings.filter(f => f.evidence.type === 'Config' || f.evidence.type === 'Client');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#0f131d] border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <FileTerminal className="w-4 h-4 text-cyan-400" />
            CONTROLLED EVIDENCE & FORENSIC ARTIFACTS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Synthetic HTTP requests, response headers, PoC audit logs, and test execution traces
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded bg-blue-950/60 border border-blue-600/40 text-blue-300">
          Synthetic Test Harness Data Only
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto text-xs font-mono pb-1">
        {[
          { id: 'HTTP', label: 'HTTP Evidence', count: httpEvidence.length },
          { id: 'Headers', label: 'Security Headers', count: headerEvidence.length },
          { id: 'API', label: 'API Responses', count: apiEvidence.length },
          { id: 'Config', label: 'Configuration & SCA', count: configEvidence.length },
          { id: 'PoC', label: 'PoC Execution Logs', count: findings.length },
          { id: 'Results', label: 'Automated Test Results', count: mockSecurityChecks.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#121624] text-cyan-300 border-t border-x border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content depending on tab */}
      {activeTab === 'HTTP' && (
        <div className="space-y-4">
          {httpEvidence.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-[#0c101a] overflow-hidden">
              <div className="p-3 bg-[#0f1422] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{f.id}</span>
                  <span className="text-xs font-mono text-slate-300">{f.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(f.id, `${f.evidence.requestSnippet}\n\n${f.evidence.responseSnippet}`)}
                    className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 flex items-center gap-1"
                  >
                    {copiedId === f.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === f.id ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                  <button
                    onClick={() => onSelectFinding(f)}
                    className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs">
                <div className="p-3 bg-[#07090e]">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1.5">
                    Synthetic Probe Request
                  </span>
                  <pre className="text-cyan-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {f.evidence.requestSnippet}
                  </pre>
                </div>
                <div className="p-3 bg-[#07090e]">
                  <span className="text-[10px] uppercase text-amber-500 font-bold block mb-1.5">
                    Captured Target Response
                  </span>
                  <pre className="text-amber-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {f.evidence.responseSnippet}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Headers' && (
        <div className="space-y-4">
          {headerEvidence.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-[#0c101a] p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 mr-2">{f.id}</span>
                  <span className="text-xs text-white">{f.title}</span>
                </div>
                <button
                  onClick={() => onSelectFinding(f)}
                  className="text-xs text-cyan-300 hover:underline"
                >
                  Inspect Finding
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                  {f.evidence.responseSnippet}
                </pre>
              </div>
              <p className="text-xs text-slate-400">
                Audit note: {f.evidence.rawLog}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'API' && (
        <div className="space-y-4">
          {apiEvidence.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-[#0c101a] overflow-hidden">
              <div className="p-3 bg-[#0f1422] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold">{f.id}: {f.affectedComponent}</span>
                <button
                  onClick={() => onSelectFinding(f)}
                  className="text-cyan-300 hover:underline"
                >
                  Inspect
                </button>
              </div>
              <div className="p-4 bg-[#07090e] font-mono text-xs">
                <pre className="text-emerald-300/90 whitespace-pre-wrap">
                  {f.evidence.responseSnippet}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Config' && (
        <div className="space-y-4">
          {configEvidence.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-[#0c101a] p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{f.id} — {f.title}</span>
                <span className="text-xs text-slate-400">Component: {f.affectedComponent}</span>
              </div>
              <div className="p-3 rounded bg-[#07090e] border border-slate-800 text-xs text-slate-300">
                <pre className="whitespace-pre-wrap text-cyan-300">{f.evidence.requestSnippet}</pre>
                <div className="mt-2 text-amber-300">{f.evidence.responseSnippet}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'PoC' && (
        <div className="space-y-4">
          {findings.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-[#0c101a] p-4 space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">{f.poc.name}</span>
                </div>
                <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {f.id}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800 space-y-1 text-xs text-slate-300">
                {f.poc.logs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Results' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c101a] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0f1422] text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Check ID</th>
                <th className="py-3 px-4">Test Check</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockSecurityChecks.map((chk) => (
                <tr key={chk.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-4 text-cyan-400 font-bold">{chk.id}</td>
                  <td className="py-2.5 px-4 text-slate-200">{chk.name}</td>
                  <td className="py-2.5 px-4 text-slate-400">{chk.category}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        chk.status === 'passed'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : chk.status === 'failed'
                          ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {chk.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">
                    {chk.executionTimeMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
