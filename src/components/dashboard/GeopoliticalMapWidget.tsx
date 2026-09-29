import React, { useState } from 'react';
import { Globe, Radio, ShieldCheck, ShieldAlert, Wifi, Server } from 'lucide-react';

interface IngestionNode {
  id: string;
  name: string;
  region: string;
  coords: { x: number; y: number }; // percentage coordinates on SVG map
  latency: number;
  status: 'healthy' | 'warning';
  activeFeeds: string[];
  tlsVersion: string;
  inspectedChecks: number;
}

const INGESTION_NODES: IngestionNode[] = [
  {
    id: 'us-east',
    name: 'US-East Edge Gateway (N. Virginia)',
    region: 'North America',
    coords: { x: 26, y: 38 },
    latency: 28,
    status: 'warning',
    activeFeeds: ['Live Conflict Radar', 'OSINT Satellite Feeds'],
    tlsVersion: 'TLS 1.3 / HSTS Missing Preload',
    inspectedChecks: 6
  },
  {
    id: 'eu-west',
    name: 'Frankfurt RSS Aggregator & Parser',
    region: 'Europe',
    coords: { x: 50, y: 32 },
    latency: 34,
    status: 'warning',
    activeFeeds: ['Reuters Geopolitics', 'BBC World News RSS', 'Al Jazeera'],
    tlsVersion: 'TLS 1.3 / Stack Trace Exposure',
    inspectedChecks: 8
  },
  {
    id: 'apac-tokyo',
    name: 'Tokyo Geopolitical Telemetry Node',
    region: 'East Asia',
    coords: { x: 82, y: 40 },
    latency: 76,
    status: 'healthy',
    activeFeeds: ['East Asian Maritime Security', 'Disaster Early Warning'],
    tlsVersion: 'TLS 1.3 / CSP Compliant',
    inspectedChecks: 5
  },
  {
    id: 'apac-singapore',
    name: 'Singapore AIS Vessel & Chokepoint Ingress',
    region: 'Southeast Asia',
    coords: { x: 74, y: 58 },
    latency: 82,
    status: 'healthy',
    activeFeeds: ['Malacca Strait AIS', 'Maritime Dark Vessel Radar'],
    tlsVersion: 'TLS 1.3 / Strict MTLS',
    inspectedChecks: 5
  }
];

export const GeopoliticalMapWidget: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<IngestionNode>(INGESTION_NODES[0]);

  return (
    <div className="p-6 rounded-2xl bg-[#0f131d]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between overflow-hidden relative group">
      {/* Ambient glow & Radar Sweep */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="radar-sweep absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              World Monitor Global Ingestion Nodes & Sensor Pings
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Geopolitical intelligence pipeline endpoints evaluated in simulated test harness
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 2 Secure
          </span>
          <span className="flex items-center gap-1 text-amber-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> 2 Review Required
          </span>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative w-full h-56 rounded-xl bg-[#080b12] border border-slate-800/80 overflow-hidden flex items-center justify-center z-10">
        {/* World Map SVG Silhouette */}
        <svg
          className="w-full h-full opacity-35"
          viewBox="0 0 1000 500"
          fill="none"
          stroke="#334155"
          strokeWidth="1.2"
        >
          {/* North America */}
          <path d="M150,120 Q220,100 280,140 Q320,200 250,260 Q180,240 140,180 Z" fill="#1e293b" />
          {/* South America */}
          <path d="M260,280 Q320,300 300,420 Q250,450 240,340 Z" fill="#1e293b" />
          {/* Europe */}
          <path d="M460,110 Q540,90 560,150 Q500,200 450,170 Z" fill="#1e293b" />
          {/* Africa */}
          <path d="M470,200 Q560,200 550,340 Q480,380 460,260 Z" fill="#1e293b" />
          {/* Asia */}
          <path d="M580,100 Q800,80 840,220 Q750,280 620,220 Z" fill="#1e293b" />
          {/* Australia */}
          <path d="M760,320 Q860,310 840,400 Q750,420 740,360 Z" fill="#1e293b" />

          {/* Grid lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#1e293b" strokeDasharray="4 4" />
        </svg>

        {/* Pulsing Interactive Nodes */}
        {INGESTION_NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          const isWarn = node.status === 'warning';

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
              style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75 ${
                    isWarn ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#080b12] shadow-lg ${
                    isWarn ? 'bg-amber-500' : 'bg-cyan-400'
                  } ${isSelected ? 'ring-2 ring-white scale-125' : ''}`}
                />
              </div>

              {/* Hover Badge */}
              <div className="opacity-0 group-hover/node:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#0a0e18] border border-slate-700 text-[10px] font-mono text-white whitespace-nowrap pointer-events-none shadow-xl z-20">
                {node.name} ({node.latency}ms)
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#090c14] border border-slate-800 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">{selectedNode.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${
              selectedNode.status === 'warning'
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/50'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
            }`}>
              {selectedNode.status === 'warning' ? 'Security Review' : 'Verified'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Active Feeds: <strong className="text-slate-300">{selectedNode.activeFeeds.join(', ')}</strong>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <div>
            <span className="text-slate-500">RTT: </span>
            <span className="text-cyan-400 font-bold">{selectedNode.latency}ms</span>
          </div>
          <div>
            <span className="text-slate-500">Security Layer: </span>
            <span className="text-slate-200">{selectedNode.tlsVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
