import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success';
  trend?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  trend,
  onClick
}) => {
  const styles = {
    default: {
      border: 'border-slate-800/80 hover:border-slate-700',
      iconBg: 'bg-slate-800/60 text-slate-300',
      valueColor: 'text-white'
    },
    critical: {
      border: 'border-red-900/60 hover:border-red-700/80 bg-gradient-to-b from-red-950/20 to-transparent',
      iconBg: 'bg-red-950/80 text-red-400 border border-red-800/50',
      valueColor: 'text-red-400'
    },
    high: {
      border: 'border-orange-900/60 hover:border-orange-700/80 bg-gradient-to-b from-orange-950/20 to-transparent',
      iconBg: 'bg-orange-950/80 text-orange-400 border border-orange-800/50',
      valueColor: 'text-orange-400'
    },
    medium: {
      border: 'border-amber-900/60 hover:border-amber-700/80 bg-gradient-to-b from-amber-950/20 to-transparent',
      iconBg: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
      valueColor: 'text-amber-400'
    },
    low: {
      border: 'border-cyan-900/60 hover:border-cyan-700/80 bg-gradient-to-b from-cyan-950/20 to-transparent',
      iconBg: 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50',
      valueColor: 'text-cyan-400'
    },
    info: {
      border: 'border-blue-900/60 hover:border-blue-700/80 bg-gradient-to-b from-blue-950/20 to-transparent',
      iconBg: 'bg-blue-950/80 text-blue-400 border border-blue-800/50',
      valueColor: 'text-blue-400'
    },
    success: {
      border: 'border-emerald-900/60 hover:border-emerald-700/80 bg-gradient-to-b from-emerald-950/20 to-transparent',
      iconBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
      valueColor: 'text-emerald-400'
    }
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl bg-[#0f131d]/90 border ${styles.border} transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:translate-y-[-2px] hover:shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className={`text-2xl font-black font-mono tracking-tight ${styles.valueColor}`}>
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-mono text-slate-400">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-400 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
};
