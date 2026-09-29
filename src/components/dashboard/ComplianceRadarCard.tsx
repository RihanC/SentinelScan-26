import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { Finding } from '../../types/security';

interface ComplianceRadarCardProps {
  findings: Finding[];
}

export const ComplianceRadarCard: React.FC<ComplianceRadarCardProps> = ({ findings }) => {
  const activeFindings = findings.filter(f => f.status === 'Open' || f.status === 'In Review');

  const complianceStandards = [
    {
      id: 'A01:2021',
      name: 'Broken Access Control',
      benchmark: 'OWASP Top 10',
      flawsCount: activeFindings.filter(f => f.category === 'Authorization').length,
      status: 'HIGH RISK',
      passRate: 40
    },
    {
      id: 'A02:2021',
      name: 'Cryptographic Failures',
      benchmark: 'OWASP Top 10',
      flawsCount: 0,
      status: 'COMPLIANT',
      passRate: 100
    },
    {
      id: 'A03:2021',
      name: 'Injection & Input Sanitization',
      benchmark: 'OWASP Top 10',
      flawsCount: activeFindings.filter(f => f.category === 'Input Validation').length,
      status: 'MEDIUM RISK',
      passRate: 75
    },
    {
      id: 'A04:2021',
      name: 'Insecure Design & Exposure',
      benchmark: 'OWASP Top 10',
      flawsCount: activeFindings.filter(f => f.category === 'Data Protection').length,
      status: 'MEDIUM RISK',
      passRate: 70
    },
    {
      id: 'A05:2021',
      name: 'Security Misconfiguration & CSP',
      benchmark: 'OWASP Top 10',
      flawsCount: activeFindings.filter(f => f.id === 'VULN-001' || f.id === 'VULN-007').length,
      status: 'MEDIUM RISK',
      passRate: 60
    },
    {
      id: 'A07:2021',
      name: 'Identification & Auth Failures',
      benchmark: 'OWASP Top 10',
      flawsCount: activeFindings.filter(f => f.category === 'Authentication & Sessions').length,
      status: 'HIGH RISK',
      passRate: 50
    }
  ];

  const overallComplianceRate = Math.round(
    complianceStandards.reduce((acc, c) => acc + c.passRate, 0) / complianceStandards.length
  );

  return (
    <div className="p-6 rounded-2xl bg-[#0f131d]/90 border border-slate-800/80 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              OWASP Top 10 & Regulatory Compliance Index
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Audit benchmark alignment against OWASP 2021 & NIST SP 800-53 controls
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Compliance Score</span>
            <span className="text-lg font-bold text-cyan-400">{overallComplianceRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid of compliance items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {complianceStandards.map((item) => {
          const isCompliant = item.flawsCount === 0;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#090c14] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-cyan-400 font-bold">{item.id}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isCompliant
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                        : item.status === 'HIGH RISK'
                        ? 'bg-red-950 text-red-400 border border-red-800/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                    }`}
                  >
                    {isCompliant ? 'PASS' : `${item.flawsCount} FLAWS`}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {item.name}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Pass Rate</span>
                  <span className="font-bold text-white">{item.passRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.passRate >= 80
                        ? 'bg-emerald-400'
                        : item.passRate >= 60
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${item.passRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
