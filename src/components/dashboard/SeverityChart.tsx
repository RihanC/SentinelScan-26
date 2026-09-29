import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Finding, Severity } from '../../types/security';

interface SeverityChartProps {
  findings: Finding[];
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ findings }) => {
  const counts: Record<Severity, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Informational: 0
  };

  findings.forEach((f) => {
    if (counts[f.severity] !== undefined) {
      counts[f.severity]++;
    }
  });

  const data = [
    { name: 'Critical', count: counts.Critical, color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
    { name: 'High', count: counts.High, color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    { name: 'Medium', count: counts.Medium, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { name: 'Low', count: counts.Low, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
    { name: 'Info', count: counts.Informational, color: '#64748b', glow: 'rgba(100, 116, 139, 0.4)' }
  ];

  const total = findings.length;

  return (
    <div className="p-6 rounded-2xl bg-[#0f131d]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Vulnerability Severity Distribution
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Total active issues detected: {total}
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
          OWASP Top 10 Aligned
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#0b0e17] border border-slate-700 p-2 rounded-lg shadow-xl text-xs font-mono">
                      <div className="text-white font-bold">{item.name} Severity</div>
                      <div className="text-slate-300">Count: <strong className="text-cyan-400">{item.count}</strong></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Count Breakdown */}
      <div className="grid grid-cols-5 gap-1 pt-3 mt-2 border-t border-slate-800/80 text-center font-mono">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase">{item.name}</span>
            <span className="text-xs font-bold mt-0.5" style={{ color: item.color }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
