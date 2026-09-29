import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { AssessmentMetadata, Finding } from '../../types/security';

interface ReportViewProps {
  metadata: AssessmentMetadata;
  findings: Finding[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  metadata,
  findings
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const downloadJsonReport = () => {
    const reportData = {
      reportTitle: 'SECURITY ASSESSMENT REPORT — WORLD MONITOR',
      assessmentType: metadata.assessmentType,
      targetUrl: metadata.targetUrl,
      targetRepository: metadata.targetRepo,
      timestamp: metadata.lastScanTimestamp,
      securityScore: metadata.securityScore,
      summary: {
        totalFindings: findings.length,
        critical: findings.filter(f => f.severity === 'Critical').length,
        high: findings.filter(f => f.severity === 'High').length,
        medium: findings.filter(f => f.severity === 'Medium').length,
        low: findings.filter(f => f.severity === 'Low').length
      },
      findings: findings.map(f => ({
        id: f.id,
        title: f.title,
        severity: f.severity,
        cvss: f.cvss,
        category: f.category,
        affectedComponent: f.affectedComponent,
        description: f.description,
        remediation: f.remediation.summary,
        status: f.status
      })),
      disclaimer: 'This prototype uses simulated findings and controlled proof-of-concept demonstrations. It does not represent a confirmed security assessment of the production World Monitor application.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinelscan-worldmonitor-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const copySummary = () => {
    const text = `SECURITY ASSESSMENT REPORT — WORLD MONITOR\nTarget: ${metadata.targetUrl}\nSecurity Score: ${metadata.securityScore}/100\nTotal Findings: ${findings.length} (Critical: ${findings.filter(f => f.severity === 'Critical').length}, High: ${findings.filter(f => f.severity === 'High').length}, Medium: ${findings.filter(f => f.severity === 'Medium').length}, Low: ${findings.filter(f => f.severity === 'Low').length})\nStatus: Completed (Simulated Test Harness)`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;
  const mediumCount = findings.filter(f => f.severity === 'Medium').length;
  const lowCount = findings.filter(f => f.severity === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Report Action Bar */}
      <div className="p-4 rounded-xl bg-[#0f131d] border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            SECURITY AUDIT REPORT GENERATOR
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Export ready-to-share executive audit documentation for engineering leadership
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Brief'}</span>
          </button>

          <button
            onClick={printReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={downloadJsonReport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-semibold transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Report</span>
          </button>
        </div>
      </div>

      {/* Formatted Report Sheet */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#0d101a] border border-slate-800 text-slate-200 font-sans space-y-8 shadow-2xl print:border-none print:bg-white print:text-black">
        {/* Report Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              CONFIDENTIAL SECURITY DOCUMENT
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white print:text-black mt-1">
              SECURITY ASSESSMENT REPORT
            </h1>
            <p className="text-sm text-slate-400 font-mono mt-0.5">
              Application: World Monitor (worldmonitor.app)
            </p>
          </div>

          <div className="text-left md:text-right text-xs font-mono text-slate-400 space-y-1">
            <div>Audit Date: <strong className="text-slate-200 print:text-black">{metadata.lastScanTimestamp}</strong></div>
            <div>Assessment Suite: <span className="text-cyan-400 font-bold">SentinelScan v3.4</span></div>
            <div>Framework: <span className="text-slate-300">OWASP Top 10 / NIST 800-115</span></div>
          </div>
        </div>

        {/* Mandatory Limitations Alert */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/50 text-xs font-mono text-amber-200/90 space-y-1.5 print:border-amber-700">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>ASSESSMENT LIMITATIONS & AUTHORIZATION NOTICE</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300 print:text-black">
            “This prototype uses simulated findings and controlled proof-of-concept demonstrations. It does not represent a confirmed security assessment of the production World Monitor application.”
          </p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            1. Executive Summary & Posture Score
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-black">
            An authorized security assessment of the World Monitor application architecture was executed across seven defensive domains including Authentication, Authorization, Input Validation, API Security, and Data Protection. The assessment concluded with an overall <strong>Security Score of {metadata.securityScore}/100</strong>, indicating an <strong>Elevated Risk Posture</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center font-mono">
            <div className="p-3 rounded-lg bg-[#111624] border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Security Score</span>
              <div className="text-2xl font-bold text-cyan-400">{metadata.securityScore}/100</div>
            </div>
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40">
              <span className="text-[10px] text-red-400 uppercase">Critical</span>
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-900/40">
              <span className="text-[10px] text-orange-400 uppercase">High</span>
              <div className="text-2xl font-bold text-orange-400">{highCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
              <span className="text-[10px] text-amber-400 uppercase">Medium</span>
              <div className="text-2xl font-bold text-amber-400">{mediumCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
              <span className="text-[10px] text-cyan-400 uppercase">Low</span>
              <div className="text-2xl font-bold text-cyan-400">{lowCount}</div>
            </div>
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            2. Detailed Findings Register
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Vulnerability</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">CVSS</th>
                  <th className="py-2.5 px-3">CWE Mapping</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {findings.map((f) => (
                  <tr key={f.id} className="text-slate-300">
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{f.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-white print:text-black">{f.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{f.category}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold ${
                        f.severity === 'Critical' ? 'text-red-400' :
                        f.severity === 'High' ? 'text-orange-400' :
                        f.severity === 'Medium' ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">{f.cvss}</td>
                    <td className="py-2.5 px-3 text-slate-400">{f.remediation.cwe.split(' ')[0]}</td>
                    <td className="py-2.5 px-3 text-slate-400">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proof of Concept Evidence Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            3. Safe Validation & PoC Methodology
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-black">
            All security weaknesses identified were validated utilizing deterministic, non-destructive simulation fixtures in an isolated test environment. Below is a representative proof-of-concept record:
          </p>
          <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-cyan-400 font-bold">
              [PoC-ID: VULN-003] Insufficient API Authorization Validation
            </div>
            <div className="text-slate-400 text-[11px]">
              Command: $ sentinelscan api bola-verify --endpoint /api/v1/feeds/custom/{'{id}'} --safe-mode
            </div>
            <div className="text-emerald-400 text-[11px]">
              Observation: Insecure Direct Object Reference allowed cross-tenant reading of intelligence feeds without 403 Forbidden enforcement.
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            4. Strategic Remediation Roadmap
          </h2>
          <ol className="space-y-2 text-xs font-mono text-slate-300 list-decimal list-inside">
            <li>
              <strong className="text-white">Authorization Boundary Enforcement:</strong> Enforce strict server-side resource ownership checks on all API endpoints handling feeds and workspace layouts.
            </li>
            <li>
              <strong className="text-white">Session Cookie Hardening:</strong> Mandate <code className="text-cyan-300">HttpOnly; Secure; SameSite=Lax</code> on all session tokens to defend against credential leakage.
            </li>
            <li>
              <strong className="text-white">Centralized Query Sanitization:</strong> Escape special regex characters in the search and filtering pipeline to prevent client-side ReDoS.
            </li>
            <li>
              <strong className="text-white">Information Exposure Prevention:</strong> Replace raw 500 error stack traces and internal hostnames with opaque correlation IDs.
            </li>
            <li>
              <strong className="text-white">Edge Security Headers:</strong> Deploy Content-Security-Policy (CSP) and HSTS Preload directives at the edge reverse proxy.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
