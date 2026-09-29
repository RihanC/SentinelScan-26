import React from 'react';
import { 
  KeyRound, 
  Lock, 
  FileCheck2, 
  Server, 
  ShieldCheck, 
  Radio, 
  Database,
  LucideIcon
} from 'lucide-react';
import { CategorySummary, Category } from '../../types/security';

interface CategoryGridProps {
  summaries: CategorySummary[];
  onSelectCategory?: (category: Category) => void;
}

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  'Authentication & Sessions': KeyRound,
  'Authorization': Lock,
  'Input Validation': FileCheck2,
  'API Security': Server,
  'Client-Side Security': ShieldCheck,
  'Secure Communication': Radio,
  'Data Protection': Database
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  summaries,
  onSelectCategory
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Security Test Category Performance
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Audit results across 7 core defensive domains
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {summaries.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.category] || ShieldCheck;

          const riskBadgeStyles = {
            'CRITICAL RISK': 'bg-red-950/80 text-red-300 border-red-800/60',
            'HIGH RISK': 'bg-orange-950/80 text-orange-300 border-orange-800/60',
            'MEDIUM RISK': 'bg-amber-950/80 text-amber-300 border-amber-800/60',
            'LOW RISK': 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
          }[cat.riskLevel];

          const progressColor = {
            'CRITICAL RISK': 'bg-red-500',
            'HIGH RISK': 'bg-orange-500',
            'MEDIUM RISK': 'bg-amber-400',
            'LOW RISK': 'bg-emerald-500'
          }[cat.riskLevel];

          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory && onSelectCategory(cat.category)}
              className="p-4 rounded-xl bg-[#0f131d]/90 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#121724] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-slate-800/70 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${riskBadgeStyles}`}>
                    {cat.riskLevel}
                  </span>
                </div>

                <h4 className="text-xs font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                  {cat.category}
                </h4>

                <div className="grid grid-cols-3 gap-1.5 mt-3 text-[11px] font-mono text-slate-400">
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800/60 text-center">
                    <span className="block text-[10px] text-slate-500">Checks</span>
                    <span className="font-bold text-slate-200">{cat.totalChecks}</span>
                  </div>
                  <div className="bg-emerald-950/20 p-1.5 rounded border border-emerald-900/30 text-center">
                    <span className="block text-[10px] text-emerald-500">Passed</span>
                    <span className="font-bold text-emerald-400">{cat.passedChecks}</span>
                  </div>
                  <div className="bg-red-950/20 p-1.5 rounded border border-red-900/30 text-center">
                    <span className="block text-[10px] text-red-500">Findings</span>
                    <span className="font-bold text-red-400">{cat.failedChecks + cat.warningChecks}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Coverage Pass Rate</span>
                  <span className="font-bold text-slate-200">{cat.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: `${cat.score}%` }}
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
