import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar, TabId } from './components/common/Sidebar';
import { ScanModal } from './components/common/ScanModal';
import { FindingDetailModal } from './components/findings/FindingDetailModal';
import { CommandPalette } from './components/common/CommandPalette';
import { LiveSocStreamDrawer } from './components/common/LiveSocStreamDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScanConsoleView } from './components/assessment/ScanConsoleView';
import { FindingTable } from './components/findings/FindingTable';
import { AttackSurfaceView } from './components/attackSurface/AttackSurfaceView';
import { EvidenceCenterView } from './components/evidence/EvidenceCenterView';
import { RemediationCenterView } from './components/remediation/RemediationCenterView';
import { ReportView } from './components/reports/ReportView';
import { SettingsView } from './components/settings/SettingsView';

import { 
  mockFindings as initialFindings, 
  initialAssessmentMetadata, 
  mockSecurityChecks 
} from './data/mockSecurityData';
import { Finding, AssessmentMetadata } from './types/security';
import { SecurityScannerService } from './services/securityScanner';
import { cyberAudio } from './utils/cyberAudio';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [metadata, setMetadata] = useState<AssessmentMetadata>(initialAssessmentMetadata);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Dynamic cursor coordinates for subtle spotlight glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Recalculate score and category summaries dynamically based on findings state
  const securityScore = useMemo(() => {
    return SecurityScannerService.calculateSecurityScore(findings);
  }, [findings]);

  const categorySummaries = useMemo(() => {
    return SecurityScannerService.calculateCategorySummaries(findings, mockSecurityChecks);
  }, [findings]);

  const currentMetadata = useMemo(() => ({
    ...metadata,
    securityScore
  }), [metadata, securityScore]);

  // Handlers
  const handleTriggerScan = () => {
    cyberAudio.playScanLaunch();
    setIsScanModalOpen(true);
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    cyberAudio.playSuccessChime();
    setIsScanning(false);
    setMetadata(prev => ({
      ...prev,
      lastScanTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'Completed',
      scoreDelta: +4
    }));
  };

  const handleSelectFinding = (finding: Finding) => {
    cyberAudio.playClick();
    setSelectedFinding(finding);
  };

  const handleOpenPoC = (finding: Finding) => {
    cyberAudio.playClick();
    setSelectedFinding(finding);
  };

  const handleStatusChange = (id: string, newStatus: Finding['status']) => {
    setFindings(prev =>
      prev.map(f => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFinding && selectedFinding.id === id) {
      setSelectedFinding(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleResetData = () => {
    cyberAudio.playClick();
    setFindings(initialFindings);
    setMetadata(initialAssessmentMetadata);
  };

  const handleToggleAudio = () => {
    const nextState = cyberAudio.toggle();
    setAudioEnabled(nextState);
  };

  const handleTabChange = (tab: TabId) => {
    cyberAudio.playClick();
    setActiveTab(tab);
  };

  const openFindingsCount = findings.filter(f => f.status === 'Open' || f.status === 'In Review').length;
  const urgentRemediationsCount = findings.filter(f => f.remediation.priority === 'Urgent' && f.status !== 'Remediated').length;

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 80%)`
        }}
      />

      {/* Top SOC Navbar */}
      <Navbar
        metadata={currentMetadata}
        onRunScan={handleTriggerScan}
        onGenerateReport={() => handleTabChange('reports')}
        isScanning={isScanning}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          openFindingsCount={openFindingsCount}
          urgentRemediationsCount={urgentRemediationsCount}
        />

        {/* Content View Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-61px)] pb-16">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                metadata={currentMetadata}
                findings={findings}
                categorySummaries={categorySummaries}
                onSelectFinding={handleSelectFinding}
                onOpenPoC={handleOpenPoC}
                onViewAllFindings={() => handleTabChange('findings')}
                onViewRemediation={() => handleTabChange('remediation')}
                onViewReport={() => handleTabChange('reports')}
                onSelectCategory={() => handleTabChange('findings')}
              />
            )}

            {activeTab === 'assessment' && (
              <ScanConsoleView
                metadata={currentMetadata}
                findings={findings}
                onTriggerScan={handleTriggerScan}
                isScanning={isScanning}
                onSelectFinding={handleSelectFinding}
              />
            )}

            {activeTab === 'findings' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0f131d] border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-mono font-bold text-white">
                      COMPREHENSIVE FINDINGS REGISTER
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      All identified vulnerabilities, weaknesses, and configuration recommendations
                    </p>
                  </div>
                  <div className="text-xs font-mono text-cyan-400">
                    Total Findings: <strong>{findings.length}</strong>
                  </div>
                </div>

                <FindingTable
                  findings={findings}
                  onSelectFinding={handleSelectFinding}
                  onOpenPoC={handleOpenPoC}
                />
              </div>
            )}

            {activeTab === 'attack-surface' && (
              <AttackSurfaceView
                findings={findings}
                onSelectFinding={handleSelectFinding}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceCenterView
                findings={findings}
                onSelectFinding={handleSelectFinding}
              />
            )}

            {activeTab === 'remediation' && (
              <RemediationCenterView
                findings={findings}
                onSelectFinding={handleSelectFinding}
                onUpdateStatus={handleStatusChange}
              />
            )}

            {activeTab === 'reports' && (
              <ReportView
                metadata={currentMetadata}
                findings={findings}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                metadata={currentMetadata}
                onUpdateMetadata={setMetadata}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Collapsible Bottom SOC Telemetry Stream Drawer */}
      <LiveSocStreamDrawer />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        findings={findings}
        onSelectFinding={handleSelectFinding}
        onNavigate={handleTabChange}
        onRunScan={handleTriggerScan}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Live Scanning Simulation Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onComplete={handleScanComplete}
        findings={findings}
      />

      {/* Vulnerability Detail Modal with CVSS Calculator, PoC runner & Virtual Patch */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default App;
