import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  AlertOctagon, 
  Code2, 
  Layers,
  ChevronDown,
  ChevronUp,
  Calculator,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { Finding } from '../../types/security';
import { SeverityBadge, StatusBadge, SimulatedBadge } from '../common/SeverityBadge';
import { SafePoCTerminal } from './SafePoCTerminal';
import { CvssCalculatorWidget } from './CvssCalculatorWidget';
import { cyberAudio } from '../../utils/cyberAudio';

interface FindingDetailModalProps {
  finding: Finding | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: Finding['status']) => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  finding,
  onClose,
  onStatusChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'poc' | 'remediation' | 'cvss'>('overview');
  const [isAiExplanationOpen, setIsAiExplanationOpen] = useState(true);
  const [virtualPatchApplied, setVirtualPatchApplied] = useState(false);

  if (!finding) return null;

  const handleApplyVirtualPatch = () => {
    const nextState = !virtualPatchApplied;
    setVirtualPatchApplied(nextState);
    if (nextState) {
      cyberAudio.playSuccessChime();
      if (onStatusChange) {
        onStatusChange(finding.id, 'Remediated');
      }
    } else {
      cyberAudio.playClick();
      if (onStatusChange) {
        onStatusChange(finding.id, 'Open');
      }
    }
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    cyberAudio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-[#0c101a] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#101524] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 mt-1">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {finding.id}
                </span>
                <SeverityBadge severity={finding.severity} size="sm" showPulse />
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  CVSS {finding.cvss.toFixed(1)}
                </span>
                <StatusBadge status={finding.status} />
                <SimulatedBadge text="Test Environment" />
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {finding.title}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Category: <span className="text-slate-200">{finding.category}</span> • Component: <span className="text-slate-200">{finding.affectedComponent}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-start">
            {/* Quick Virtual Patch Toggle */}
            <button
              onClick={handleApplyVirtualPatch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
                virtualPatchApplied || finding.status === 'Remediated'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
              <span>{virtualPatchApplied || finding.status === 'Remediated' ? 'Virtual Patch Active' : 'Apply Virtual Patch'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-[#0e121f] text-xs font-mono overflow-x-auto">
          <button
            onClick={() => handleTabClick('overview')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Risk
          </button>
          <button
            onClick={() => handleTabClick('poc')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'poc'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Proof of Concept (PoC)
          </button>
          <button
            onClick={() => handleTabClick('evidence')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'evidence'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Evidence Logs
          </button>
          <button
            onClick={() => handleTabClick('remediation')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'remediation'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Remediation & Fix
          </button>
          <button
            onClick={() => handleTabClick('cvss')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'cvss'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            CVSS Calculator
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Technical Description
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {finding.description}
                </p>
                {finding.componentPath && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">Component Source:</span>
                    <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {finding.componentPath}
                    </code>
                  </div>
                )}
              </div>

              {/* AI-Style "Why is this risky?" card */}
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-[#101424] to-cyan-950/30 overflow-hidden">
                <button
                  onClick={() => setIsAiExplanationOpen(!isAiExplanationOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                        AI Security Analyst Insight: Why is this risky?
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Contextual risk reasoning for World Monitor analysts
                      </p>
                    </div>
                  </div>
                  {isAiExplanationOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isAiExplanationOpen && (
                  <div className="px-4 pb-4 text-xs font-mono text-slate-300 leading-relaxed border-t border-indigo-900/30 pt-3">
                    <p className="bg-slate-900/60 p-3 rounded-lg border border-indigo-950">
                      {finding.whyIsThisRisky}
                    </p>
                  </div>
                )}
              </div>

              {/* Impact Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0f1422] border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Confidentiality
                  </div>
                  <div className="text-sm font-bold font-mono text-red-400">
                    {finding.impact.confidentiality} Impact
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk of sensitive watchlist or telemetry data exposure.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1422] border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Integrity
                  </div>
                  <div className="text-sm font-bold font-mono text-amber-400">
                    {finding.impact.integrity} Impact
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Possibility of untrusted mutation or parameter tampering.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1422] border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Availability
                  </div>
                  <div className="text-sm font-bold font-mono text-blue-400">
                    {finding.impact.availability} Impact
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Operational stability and monitor uptime impact.
                  </p>
                </div>
              </div>

              {/* Business Impact Note */}
              <div className="p-4 rounded-xl bg-red-950/15 border border-red-900/40 text-xs font-mono text-red-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Business & Operational Risk
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {finding.impact.businessImpact}
                </p>
              </div>

              {/* Architecture Layer Breakdown */}
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Affected Component Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">API Ingress</span>
                    <span className="text-cyan-300 font-medium">REST API Layer</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Auth Middleware</span>
                    <span className="text-amber-300 font-medium">{finding.category}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Target Entity</span>
                    <span className="text-slate-200 font-medium">{finding.affectedComponent}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'poc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Controlled Proof-of-Concept Validation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {finding.poc.safeValidationDescription}
                </p>
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-900/40 text-[11px] font-mono text-amber-300/90">
                  ⚠ <strong>Safety Guardrail:</strong> This proof of concept is executed strictly against mock test fixtures. Real exploit execution against live production systems is prohibited.
                </div>
              </div>

              {/* Animated Interactive Terminal */}
              <SafePoCTerminal finding={finding} />

              {/* Validation Steps */}
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Deterministic Validation Procedure
                </h4>
                <ol className="space-y-1.5 text-xs font-mono text-slate-300 list-decimal list-inside">
                  {finding.poc.steps.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Evidence Format: {finding.evidence.type}</span>
                <span className="text-cyan-400">Synthetic Test Harness Payload</span>
              </div>

              {finding.evidence.requestSnippet && (
                <div className="rounded-xl border border-slate-800 bg-[#080b12] overflow-hidden">
                  <div className="px-4 py-2 bg-[#0e121e] border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>[REQUEST] Probe Inspection Payload</span>
                    <span className="text-slate-500">Method: HTTP/1.1</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-cyan-300/90 whitespace-pre-wrap overflow-x-auto bg-[#06080e]">
                    {finding.evidence.requestSnippet}
                  </pre>
                </div>
              )}

              {finding.evidence.responseSnippet && (
                <div className="rounded-xl border border-slate-800 bg-[#080b12] overflow-hidden">
                  <div className="px-4 py-2 bg-[#0e121e] border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>[RESPONSE] Observed Target Response</span>
                    <span className="text-amber-400">Captured in Test Environment</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-amber-200/90 whitespace-pre-wrap overflow-x-auto bg-[#06080e]">
                    {finding.evidence.responseSnippet}
                  </pre>
                </div>
              )}

              {finding.evidence.rawLog && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-300">Scanner Audit Log: </strong>
                  {finding.evidence.rawLog}
                </div>
              )}
            </div>
          )}

          {activeTab === 'remediation' && (
            <div className="space-y-6">
              {/* Summary Banner with Virtual Patch Status */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Recommended Remediation Plan
                  </span>
                  <span>Priority: {finding.remediation.priority} • Effort: {finding.remediation.effort}</span>
                </div>
                <p className="text-sm text-slate-200 font-medium">
                  {finding.remediation.summary}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                  <span>Standard: <strong className="text-slate-300">{finding.remediation.cwe}</strong></span>
                  <span>•</span>
                  <span>OWASP: <strong className="text-slate-300">{finding.remediation.owaspCategory}</strong></span>
                </div>
              </div>

              {/* Action Steps */}
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Step-by-Step Implementation Guide
                </h4>
                <ul className="space-y-2">
                  {finding.remediation.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-mono text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Diff Sample */}
              {finding.remediation.codeSample && (
                <div className="rounded-xl border border-slate-800 bg-[#080b12] overflow-hidden space-y-0 shadow-lg">
                  <div className="px-4 py-2.5 bg-[#0e121e] border-b border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <span>Code Fix Reference ({finding.remediation.codeSample.language})</span>
                    </div>

                    <button
                      onClick={handleApplyVirtualPatch}
                      className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold hover:bg-cyan-900 transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Simulate Fix Application</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs">
                    {/* Before / Vulnerable */}
                    <div className="p-3 bg-red-950/10">
                      <div className="text-[11px] font-semibold text-red-400 mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Vulnerable Implementation
                      </div>
                      <pre className="text-red-300/80 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                        {finding.remediation.codeSample.before}
                      </pre>
                    </div>

                    {/* After / Secure */}
                    <div className="p-3 bg-emerald-950/10">
                      <div className="text-[11px] font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Remediated Implementation
                      </div>
                      <pre className="text-emerald-300/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                        {finding.remediation.codeSample.after}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cvss' && (
            <div className="space-y-4">
              <CvssCalculatorWidget
                initialScore={finding.cvss}
                initialVector={finding.cvssVector}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f1422] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Discovered: {finding.discoveredAt}</span>
            <span>•</span>
            <span className="text-amber-400">Authorized Test Scope</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabClick('poc')}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
            >
              Test PoC
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
