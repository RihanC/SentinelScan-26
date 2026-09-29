import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Shield, 
  Activity, 
  ArrowRight,
  Flame,
  KeyRound,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Finding, CategorySummary, AssessmentMetadata } from '../../types/security';
import { MetricCard } from '../common/MetricCard';
import { SecurityScoreGauge } from '../common/SecurityScoreGauge';
import { SeverityChart } from './SeverityChart';
import { CategoryGrid } from './CategoryGrid';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { GeopoliticalMapWidget } from './GeopoliticalMapWidget';
import { ComplianceRadarCard } from './ComplianceRadarCard';
import { FindingTable } from '../findings/FindingTable';

interface DashboardViewProps {
  metadata: AssessmentMetadata;
  findings: Finding[];
  categorySummaries: CategorySummary[];
  onSelectFinding: (finding: Finding) => void;
  onOpenPoC: (finding: Finding) => void;
  onViewAllFindings: () => void;
  onViewRemediation: () => void;
  onViewReport: () => void;
  onSelectCategory: (cat: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metadata,
  findings,
  categorySummaries,
  onSelectFinding,
  onOpenPoC,
  onViewAllFindings,
  onViewRemediation,
  onViewReport,
  onSelectCategory
}) => {
  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;
  const mediumCount = findings.filter(f => f.severity === 'Medium').length;
  const lowCount = findings.filter(f => f.severity === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Title & Scope Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>GLOBAL THREAT RADAR • SOC POSTURE ANALYSIS</span>
          </div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-white mt-1">
            Security Assessment <span className="text-cyan-400">— World Monitor Application</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Target: <span className="text-slate-200">worldmonitor.app</span> • Environment: <span className="text-cyan-300">Controlled Test Environment</span>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded bg-[#0f1422] border border-slate-800">
            Scope: <strong className="text-slate-200">5 Architecture Layers</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            Continuous Testing: <strong className="text-emerald-400">ACTIVE</strong>
          </span>
        </div>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Security Score"
          value={`${metadata.securityScore}/100`}
          subtext="+4 from previous audit"
          icon={ShieldCheck}
          variant="success"
        />
        <MetricCard
          label="Critical"
          value={criticalCount}
          subtext="Immediate action"
          icon={Flame}
          variant="critical"
          onClick={onViewAllFindings}
        />
        <MetricCard
          label="High Risk"
          value={highCount}
          subtext="48h SLA response"
          icon={ShieldAlert}
          variant="high"
          onClick={onViewAllFindings}
        />
        <MetricCard
          label="Medium Risk"
          value={mediumCount}
          subtext="Next sprint release"
          icon={AlertTriangle}
          variant="medium"
          onClick={onViewAllFindings}
        />
        <MetricCard
          label="Low Risk"
          value={lowCount}
          subtext="Routine maintenance"
          icon={Shield}
          variant="low"
          onClick={onViewAllFindings}
        />
        <MetricCard
          label="Tests Executed"
          value={`${metadata.checksCompleted}/${metadata.totalChecks}`}
          subtext="100% check coverage"
          icon={Activity}
          variant="default"
        />
      </div>

      {/* Security Score Gauge + Severity Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SecurityScoreGauge
            score={metadata.securityScore}
            previousScore={metadata.previousScore}
            scoreDelta={metadata.scoreDelta}
          />
        </div>
        <div className="lg:col-span-2">
          <SeverityChart findings={findings} />
        </div>
      </div>

      {/* Interactive Geopolitical Sensor & Ingestion Map */}
      <GeopoliticalMapWidget />

      {/* Executive Summary Card */}
      <ExecutiveSummaryCard
        metadata={metadata}
        findings={findings}
        onViewRemediation={onViewRemediation}
        onViewReport={onViewReport}
      />

      {/* OWASP Top 10 & Compliance Radar */}
      <ComplianceRadarCard findings={findings} />

      {/* Security Test Categories Grid */}
      <CategoryGrid
        summaries={categorySummaries}
        onSelectCategory={onSelectCategory}
      />

      {/* High-Risk Findings Table Preview */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Security Findings Register
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Select any finding to review evidence, launch safe PoC, or inspect code remediation
            </p>
          </div>

          <button
            onClick={onViewAllFindings}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All ({findings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <FindingTable
          findings={findings}
          onSelectFinding={onSelectFinding}
          onOpenPoC={onOpenPoC}
        />
      </div>
    </div>
  );
};
