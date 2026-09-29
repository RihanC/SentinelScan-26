import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Pause, 
  Trash2, 
  Radio, 
  ShieldCheck, 
  Activity,
  Maximize2
} from 'lucide-react';
import { cyberAudio } from '../../utils/cyberAudio';

const SYNTHETIC_TELEMETRY_STREAM = [
  '[TLS_INGRESS] Handshake completed: TLS_AES_256_GCM_SHA384 (ECDH x25519) -> worldmonitor.app:443',
  '[EDGE_CACHE] Cloudflare CDN Cache-Control verified: max-age=60, s-maxage=300, stale-while-revalidate',
  '[RSS_PIPE] Polling news source: /api/v1/ingest/reuters_world (Response: 200 OK, 142ms, 48 items)',
  '[GEO_TILES] Leaflet map vector tiles requested: /tiles/osm_bright/6/32/21.pbf -> Verified safe origin',
  '[AUTH_GUARD] Validated ambient session token: wm_session_id=s%3A7a9b1... (HttpOnly check flagged)',
  '[API_MONITOR] Telemetry ingest /api/telemetry/events (Payload size: 1.2KB, Status: 204 No Content)',
  '[CORS_CHECK] Evaluated preflight Origin: https://worldmonitor.app -> Matched allowed origin regex',
  '[INSPECTION] Static Analysis of bundle chunk /assets/feedParser-v3.js -> Zero hardcoded private keys',
  '[WS_SIGNAL] WebSocket heartbeat to wss://stream.worldmonitor.app/live-conflicts -> Ping/Pong delta 28ms',
  '[RATE_LIMIT] Client token bucket audit: 24/100 requests in current 60s sliding window (Healthy)',
  '[AUDIT_PASS] Security.txt RFC 9116 verification: /.well-known/security.txt located with valid PGP key'
];

export const LiveSocStreamDrawer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toISOString().substring(11, 19)}] [SYSTEM] SentinelScan Real-Time Audit Telemetry Active...`,
    `[${new Date().toISOString().substring(11, 19)}] [TARGET] https://www.worldmonitor.app (Synthetic Test Harness)`
  ]);
  const streamBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStreaming) return;

    let index = 0;
    const interval = setInterval(() => {
      const now = new Date().toISOString().substring(11, 19);
      const nextLog = `[${now}] ${SYNTHETIC_TELEMETRY_STREAM[index % SYNTHETIC_TELEMETRY_STREAM.length]}`;
      
      setLogs((prev) => [...prev.slice(-40), nextLog]);
      cyberAudio.playScanBeep();
      index++;
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (isExpanded) {
      streamBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-300">
      {/* Collapsed Bar / Trigger */}
      <div className="bg-[#0a0d16]/95 border-t border-cyan-500/30 backdrop-blur-md px-6 py-2 flex items-center justify-between text-xs font-mono shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>LIVE SOC TELEMETRY STREAM</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <span className="hidden sm:inline-block text-slate-600">|</span>

          {/* Latest stream ticker snippet */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 max-w-xl truncate">
            <span className="text-emerald-400">● REAL-TIME</span>
            <span className="text-slate-300 truncate">
              {logs[logs.length - 1]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isStreaming ? 'Pause Telemetry' : 'Resume Telemetry'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Clear Stream Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle Stream Height"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Stream Panel */}
      {isExpanded && (
        <div className="h-60 bg-[#07090f]/98 border-t border-slate-800 p-4 font-mono text-xs overflow-y-auto space-y-1.5 selection:bg-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2">
            <span>AUDIT LOG BUFFER • TOTAL INGESTED: {logs.length} ENTRIES</span>
            <span className="text-cyan-400">TARGET: worldmonitor.app (Synthetic Sensor Probe)</span>
          </div>

          {logs.map((log, index) => {
            const isWarn = log.includes('flagged') || log.includes('WARN');
            const isTls = log.includes('TLS');
            const isRss = log.includes('RSS');

            return (
              <div
                key={index}
                className={`leading-relaxed ${
                  isWarn
                    ? 'text-amber-400'
                    : isTls
                    ? 'text-cyan-300'
                    : isRss
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })}
          <div ref={streamBottomRef} />
        </div>
      )}
    </div>
  );
};
