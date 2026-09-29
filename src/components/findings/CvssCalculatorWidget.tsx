import React, { useState } from 'react';
import { Calculator, ShieldAlert, RotateCcw } from 'lucide-react';
import { cyberAudio } from '../../utils/cyberAudio';

interface CvssCalculatorWidgetProps {
  initialScore?: number;
  initialVector?: string;
  onScoreCalculated?: (score: number, vector: string) => void;
}

export const CvssCalculatorWidget: React.FC<CvssCalculatorWidgetProps> = ({
  initialScore = 7.5,
  initialVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N',
  onScoreCalculated
}) => {
  const [av, setAv] = useState<'N' | 'A' | 'L' | 'P'>('N');
  const [ac, setAc] = useState<'L' | 'H'>('L');
  const [pr, setPr] = useState<'N' | 'L' | 'H'>('N');
  const [ui, setUi] = useState<'N' | 'R'>('R');
  const [scope, setScope] = useState<'U' | 'C'>('U');
  const [c, setC] = useState<'N' | 'L' | 'H'>('H');
  const [i, setI] = useState<'N' | 'L' | 'H'>('N');
  const [a, setA] = useState<'N' | 'L' | 'H'>('N');

  // CVSS v3.1 approximate deterministic calculation
  const calculateScore = () => {
    const avVal = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[av];
    const acVal = { L: 0.77, H: 0.44 }[ac];
    const prVal = { N: 0.85, L: 0.62, H: 0.27 }[pr];
    const uiVal = { N: 0.85, R: 0.62 }[ui];

    const cVal = { N: 0, L: 0.22, H: 0.56 }[c];
    const iVal = { N: 0, L: 0.22, H: 0.56 }[i];
    const aVal = { N: 0, L: 0.22, H: 0.56 }[a];

    const iss = 1 - (1 - cVal) * (1 - iVal) * (1 - aVal);
    let impact = 0;
    if (scope === 'U') {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    const exploitability = 8.22 * avVal * acVal * prVal * uiVal;

    let score = 0;
    if (impact <= 0) {
      score = 0;
    } else if (scope === 'U') {
      score = Math.min(10, Math.ceil(Math.min(impact + exploitability, 10) * 10) / 10);
    } else {
      score = Math.min(10, Math.ceil(Math.min(1.08 * (impact + exploitability), 10) * 10) / 10);
    }

    return Math.max(0, Math.min(10, score));
  };

  const currentScore = calculateScore();
  const vectorString = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${scope}/C:${c}/I:${i}/A:${a}`;

  const getSeverity = (score: number) => {
    if (score >= 9.0) return { label: 'CRITICAL', color: 'text-red-400 bg-red-950/80 border-red-800' };
    if (score >= 7.0) return { label: 'HIGH', color: 'text-orange-400 bg-orange-950/80 border-orange-800' };
    if (score >= 4.0) return { label: 'MEDIUM', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    if (score > 0) return { label: 'LOW', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800' };
    return { label: 'NONE', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const severity = getSeverity(currentScore);

  const handleSelect = (setter: any, value: any) => {
    setter(value);
    cyberAudio.playClick();
  };

  return (
    <div className="p-4 rounded-xl bg-[#0c101a] border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            Interactive CVSS v3.1 Dynamic Calculator
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-bold border ${severity.color}`}>
            {currentScore.toFixed(1)} {severity.label}
          </span>
        </div>
      </div>

      {/* Vector readout */}
      <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-300 select-all">
        {vectorString}
      </div>

      {/* Parameter Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Attack Vector */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Attack Vector (AV)</span>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'N', label: 'Net' },
              { id: 'A', label: 'Adj' },
              { id: 'L', label: 'Loc' },
              { id: 'P', label: 'Phy' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(setAv, item.id)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  av === item.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Complexity */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Attack Complexity (AC)</span>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'L', label: 'Low' },
              { id: 'H', label: 'High' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(setAc, item.id)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  ac === item.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Privileges Required */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Privileges (PR)</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'N', label: 'None' },
              { id: 'L', label: 'Low' },
              { id: 'H', label: 'High' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(setPr, item.id)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  pr === item.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Interaction */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">User Interaction (UI)</span>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'N', label: 'None' },
              { id: 'R', label: 'Req' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(setUi, item.id)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  ui === item.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Scope (S)</span>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'U', label: 'Unch' },
              { id: 'C', label: 'Chg' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(setScope, item.id)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  scope === item.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Confidentiality (C)</span>
          <div className="grid grid-cols-3 gap-1">
            {['N', 'L', 'H'].map(val => (
              <button
                key={val}
                onClick={() => handleSelect(setC, val)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  c === val ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Integrity (I)</span>
          <div className="grid grid-cols-3 gap-1">
            {['N', 'L', 'H'].map(val => (
              <button
                key={val}
                onClick={() => handleSelect(setI, val)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  i === val ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Availability (A)</span>
          <div className="grid grid-cols-3 gap-1">
            {['N', 'L', 'H'].map(val => (
              <button
                key={val}
                onClick={() => handleSelect(setA, val)}
                className={`py-1 rounded text-[11px] font-bold transition-colors ${
                  a === val ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
