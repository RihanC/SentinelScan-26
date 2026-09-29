import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface SecurityScoreGaugeProps {
  score: number;
  previousScore?: number;
  scoreDelta?: number;
}

export const SecurityScoreGauge: React.FC<SecurityScoreGaugeProps> = ({
  score,
  previousScore = 68,
  scoreDelta = +4
}) => {
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  let colorScheme = {
    ring: '#10b981', // green
    glow: 'rgba(16, 185, 129, 0.3)',
    text: 'text-emerald-400',
    status: 'MODERATE-STRONG POSTURE',
    icon: ShieldCheck
  };

  if (score < 60) {
    colorScheme = {
      ring: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.35)',
      text: 'text-red-400',
      status: 'HIGH ATTACK RISK',
      icon: ShieldAlert
    };
  } else if (score < 80) {
    colorScheme = {
      ring: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.3)',
      text: 'text-amber-400',
      status: 'ATTENTION REQUIRED',
      icon: Shield
    };
  }

  const StatusIcon = colorScheme.icon;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#0f131d]/90 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden group">
      {/* Ambient background glow */}
      <div 
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: colorScheme.glow }}
      />
      
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-300">
          <StatusIcon className="w-4 h-4 text-cyan-400" />
          Overall Security Score
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
          CVSS Weighted
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 170 170">
          {/* Background Track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke="#1b2233"
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
          />
          {/* Active Progress Ring */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke={colorScheme.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${colorScheme.ring})`
            }}
          />
        </svg>

        {/* Inner Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mt-0.5">
            / 100 PTS
          </span>
          <span className={`text-[10px] font-mono font-bold tracking-wider mt-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 ${colorScheme.text}`}>
            {colorScheme.status}
          </span>
        </div>
      </div>

      {/* Delta & Baseline Readout */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[11px]">Previous Scan</span>
          <span className="text-slate-200 font-semibold">{previousScore}/100</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 text-[11px]">Score Delta</span>
          <span className={`flex items-center gap-1 font-semibold ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {scoreDelta >= 0 ? (
              <>
                <TrendingUp className="w-3.5 h-3.5" /> +{scoreDelta} pts
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5" /> {scoreDelta} pts
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
