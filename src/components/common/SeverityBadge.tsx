import React from 'react';
import { Severity, FindingStatus } from '../../types/security';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showPulse = false
}) => {
  const styles = {
    Critical: 'bg-red-950/70 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
    High: 'bg-orange-950/70 border-orange-500/40 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
    Medium: 'bg-amber-950/70 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.18)]',
    Low: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]',
    Informational: 'bg-slate-900 border-slate-700 text-slate-300'
  }[severity];

  const dotColors = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-amber-400',
    Low: 'bg-cyan-400',
    Informational: 'bg-slate-400'
  }[severity];

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wider'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border uppercase font-mono ${styles} ${sizeStyles}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (severity === 'Critical' || severity === 'High') && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors}`} />
      </span>
      {severity}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: FindingStatus }> = ({ status }) => {
  const styles = {
    Open: 'bg-red-950/50 text-red-400 border-red-800/40',
    'In Review': 'bg-amber-950/50 text-amber-300 border-amber-800/40',
    Remediated: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40',
    'Accepted Risk': 'bg-slate-900 text-slate-400 border-slate-700'
  }[status];

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-mono ${styles}`}>
      {status}
    </span>
  );
};

export const SimulatedBadge: React.FC<{ text?: string }> = ({ text = 'SIMULATED / TEST ENV' }) => {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
      {text}
    </span>
  );
};
