import React, { useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  Server, 
  Globe, 
  Lock, 
  Key, 
  Code,
  ArrowRight,
  Info,
  Radio,
  Zap
} from 'lucide-react';
import { mockAttackSurfaceNodes } from '../../data/mockSecurityData';
import { AttackSurfaceNode, Finding } from '../../types/security';
import { cyberAudio } from '../../utils/cyberAudio';

interface AttackSurfaceViewProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

export const AttackSurfaceView: React.FC<AttackSurfaceViewProps> = ({
  findings,
  onSelectFinding
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');

  const selectedNode = mockAttackSurfaceNodes.find(n => n.id === selectedNodeId) || mockAttackSurfaceNodes[0];

  const rootNode = mockAttackSurfaceNodes.find(n => n.id === 'root')!;
  const layerNodes = mockAttackSurfaceNodes.filter(n => n.parentId === 'root');
  const componentNodes = mockAttackSurfaceNodes.filter(n => n.parentId && n.parentId !== 'root');

  const getNodeIcon = (node: AttackSurfaceNode) => {
    switch (node.id) {
      case 'root': return Globe;
      case 'web-client': return Layers;
      case 'api-layer': return Server;
      case 'auth-layer': return Lock;
      case 'client-headers': return ShieldCheck;
      case 'client-deps': return Code;
      case 'api-auth': return ShieldAlert;
      case 'api-telemetry': return Network;
      case 'auth-cookies': return Key;
      default: return Layers;
    }
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    cyberAudio.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-[#0f131d] border border-slate-800">
        <div>
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            ATTACK SURFACE & COMPONENT TOPOLOGY
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Interactive structural decomposition of World Monitor architecture with live exposure vector tracing
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Warning
          </span>
          <span className="flex items-center gap-1.5 text-red-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Critical Risk
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Diagram + Node Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Topology Diagram */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0b0e17] border border-slate-800/90 shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

          {/* SVG Canvas for Animated Particle Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="redLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Pulsing light circles */}
            <circle cx="50%" cy="110" r="3" fill="#06b6d4">
              <animate attributeName="cy" values="70;140" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="25%" cy="180" r="3" fill="#f59e0b">
              <animate attributeName="cy" values="140;220" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50%" cy="180" r="3.5" fill="#ef4444">
              <animate attributeName="cy" values="140;220" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="75%" cy="180" r="3" fill="#ef4444">
              <animate attributeName="cy" values="140;220" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Tier 1: Target Root */}
          <div className="z-10 w-full max-w-sm">
            <div
              onClick={() => handleSelectNode('root')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center relative ${
                selectedNodeId === 'root'
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400'
                  : 'bg-[#121624] border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Globe className="w-4 h-4 text-cyan-400" />
                {rootNode.label}
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-[11px] font-mono">
                <span className="text-slate-400">Checks: <strong className="text-white">{rootNode.checksCount}</strong></span>
                <span className="text-emerald-400">Passed: <strong>{rootNode.passedCount}</strong></span>
                <span className="text-red-400">Findings: <strong>{rootNode.findingsCount}</strong></span>
              </div>
            </div>

            {/* Connecting Stem with Particle Glow */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-slate-700 mx-auto" />
            <div className="w-3/4 h-0.5 bg-slate-700 mx-auto" />
          </div>

          {/* Tier 2: Core Architecture Layers */}
          <div className="z-10 grid grid-cols-3 gap-4 w-full mt-4">
            {layerNodes.map((layer) => {
              const Icon = getNodeIcon(layer);
              const isSelected = selectedNodeId === layer.id;
              const statusColor = layer.status === 'critical' ? 'border-red-800/80 bg-red-950/30' : 'border-amber-800/80 bg-amber-950/30';

              return (
                <div key={layer.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-700" />
                  <div
                    onClick={() => handleSelectNode(layer.id)}
                    className={`w-full p-3 rounded-xl border transition-all cursor-pointer text-center relative ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400'
                        : `${statusColor} hover:border-slate-500`
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs font-mono font-bold text-slate-200 truncate">
                      {layer.label}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] font-mono">
                      <span className="text-emerald-400">{layer.passedCount} pass</span>
                      <span className="text-red-400 font-bold">{layer.findingsCount} vuln</span>
                    </div>
                  </div>
                  <div className="w-0.5 h-4 bg-slate-700" />
                </div>
              );
            })}
          </div>

          {/* Tier 3: Subcomponents & Endpoints */}
          <div className="z-10 grid grid-cols-3 gap-4 w-full mt-1">
            {/* Web Client Children */}
            <div className="space-y-2">
              {componentNodes
                .filter(c => c.parentId === 'web-client')
                .map(comp => {
                  const isSelected = selectedNodeId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleSelectNode(comp.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#101422] border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold truncate">{comp.label}</div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{comp.passedCount} pass</span>
                        <span className="text-red-400">{comp.findingsCount} vuln</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* API Layer Children */}
            <div className="space-y-2">
              {componentNodes
                .filter(c => c.parentId === 'api-layer')
                .map(comp => {
                  const isSelected = selectedNodeId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleSelectNode(comp.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#101422] border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold truncate">{comp.label}</div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{comp.passedCount} pass</span>
                        <span className="text-red-400 font-bold">{comp.findingsCount} vuln</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Auth Layer Children */}
            <div className="space-y-2">
              {componentNodes
                .filter(c => c.parentId === 'auth-layer')
                .map(comp => {
                  const isSelected = selectedNodeId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleSelectNode(comp.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#101422] border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold truncate">{comp.label}</div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{comp.passedCount} pass</span>
                        <span className="text-red-400 font-bold">{comp.findingsCount} vuln</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Selected Component Inspection Pane */}
        <div className="p-6 rounded-2xl bg-[#0f131d] border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Selected Target Node
            </span>
            <h3 className="text-base font-bold font-mono text-cyan-300 mt-0.5">
              {selectedNode.label}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {selectedNode.details}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500">Audited</span>
              <span className="text-base font-bold text-white">{selectedNode.checksCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-center">
              <span className="block text-[10px] text-emerald-400">Passed</span>
              <span className="text-base font-bold text-emerald-300">{selectedNode.passedCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-center">
              <span className="block text-[10px] text-red-400">Findings</span>
              <span className="text-base font-bold text-red-300">{selectedNode.findingsCount}</span>
            </div>
          </div>

          {/* Identified Technologies */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              Technology Stack Fingerprint
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Findings linked to this surface */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Associated Security Findings</span>
              <span className="text-[11px] text-red-400">{selectedNode.findingsCount} Items</span>
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {findings
                .filter(f => f.affectedComponent.toLowerCase().includes(selectedNode.label.toLowerCase()) || selectedNode.id === 'root')
                .slice(0, 3)
                .map(f => (
                  <div
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    className="p-2.5 rounded-lg bg-[#0a0d16] border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-cyan-400">{f.id}</span>
                      <span className="text-[10px] text-amber-400">CVSS {f.cvss}</span>
                    </div>
                    <p className="text-xs text-slate-300 group-hover:text-white truncate font-sans mt-0.5">
                      {f.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
