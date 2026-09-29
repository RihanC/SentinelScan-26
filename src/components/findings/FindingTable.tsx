import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Terminal, 
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { Finding, Severity, Category, FindingStatus } from '../../types/security';
import { SeverityBadge, StatusBadge, SimulatedBadge } from '../common/SeverityBadge';

interface FindingTableProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onOpenPoC: (finding: Finding) => void;
}

export const FindingTable: React.FC<FindingTableProps> = ({
  findings,
  onSelectFinding,
  onOpenPoC
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'cvss' | 'severity' | 'id'>('cvss');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredFindings = findings
    .filter((f) => {
      const matchesSearch =
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.affectedComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === 'All' || f.severity === severityFilter;
      const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'cvss') {
        comparison = a.cvss - b.cvss;
      } else if (sortBy === 'severity') {
        const order: Record<Severity, number> = {
          Critical: 5,
          High: 4,
          Medium: 3,
          Low: 2,
          Informational: 1
        };
        comparison = order[a.severity] - order[b.severity];
      } else {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const categories = Array.from(new Set(findings.map((f) => f.category)));

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-xl">
      {/* Table Controls & Filter Bar */}
      <div className="p-4 border-b border-slate-800 bg-[#0f1422] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search findings by ID, title, or component..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080b12] border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Showing <strong className="text-cyan-400">{filteredFindings.length}</strong> of {findings.length}
          </span>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#080b12] border border-slate-700/80 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Severities</option>
              <option value="Critical" className="bg-slate-900">Critical</option>
              <option value="High" className="bg-slate-900">High</option>
              <option value="Medium" className="bg-slate-900">Medium</option>
              <option value="Low" className="bg-slate-900">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080b12] border border-slate-700/80 rounded-lg px-2.5 py-1">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080b12] border border-slate-700/80 rounded-lg px-2.5 py-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="Open" className="bg-slate-900">Open</option>
              <option value="In Review" className="bg-slate-900">In Review</option>
              <option value="Remediated" className="bg-slate-900">Remediated</option>
              <option value="Accepted Risk" className="bg-slate-900">Accepted Risk</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (sortBy === 'cvss') {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              } else {
                setSortBy('cvss');
                setSortOrder('desc');
              }
            }}
            className="flex items-center gap-1 bg-[#080b12] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300 hover:text-white"
            title="Sort by CVSS score"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>CVSS {sortBy === 'cvss' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}</span>
          </button>
        </div>
      </div>

      {/* Disclaimed Prototype Banner */}
      <div className="px-4 py-2 bg-blue-950/20 border-b border-slate-800 text-[11px] font-mono text-blue-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>All records labeled as <strong className="text-white">Simulated / Prototype Findings</strong> validated in local test harness.</span>
        </div>
        <span className="hidden sm:inline text-slate-500">
          Target: worldmonitor.app
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0e121d] text-slate-400 uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Vulnerability Finding</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4 text-center">CVSS</th>
              <th className="py-3 px-4">Affected Component</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No findings match current filter criteria.
                </td>
              </tr>
            ) : (
              filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectFinding(finding)}
                >
                  <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">
                    {finding.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors font-sans">
                      {finding.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                      {finding.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {finding.category}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <SeverityBadge severity={finding.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold font-mono ${
                        finding.cvss >= 9.0
                          ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                          : finding.cvss >= 7.0
                          ? 'bg-orange-950/80 text-orange-300 border border-orange-800/60'
                          : finding.cvss >= 4.0
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                      }`}
                    >
                      {finding.cvss.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap max-w-[200px] truncate">
                    {finding.affectedComponent}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={finding.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenPoC(finding)}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
                        title="Run Safe Validation PoC"
                      >
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>PoC</span>
                      </button>
                      <button
                        onClick={() => onSelectFinding(finding)}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
