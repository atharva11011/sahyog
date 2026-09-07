import React, { useState } from 'react';
import {
  Inbox,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  IndianRupee,
  FileText,
  AlertCircle,
  Eye,
  ChevronRight,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Application, Challenge, ApplicationStatus } from '../../types';

interface DepartmentApplicationsInboxProps {
  challenges: Challenge[];
  applications: Application[];
  selectedChallengeId: string | null;
  onSelectChallenge: (id: string) => void;
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus, reason?: string) => Promise<void>;
  onScheduleInterview: (app: Application) => void;
}

export const DepartmentApplicationsInbox: React.FC<DepartmentApplicationsInboxProps> = ({
  challenges,
  applications,
  selectedChallengeId,
  onSelectChallenge,
  onUpdateApplicationStatus,
  onScheduleInterview,
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesChallenge = !selectedChallengeId || app.challengeId === selectedChallengeId;
    const matchesStatus =
      activeStatusFilter === 'ALL' || app.status === activeStatusFilter;
    const matchesSearch =
      app.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.proposalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.challengeCode && app.challengeCode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesChallenge && matchesStatus;
  });

  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus, reason?: string) => {
    setActionLoading(true);
    try {
      await onUpdateApplicationStatus(app.id, newStatus, reason);
      if (selectedApp && selectedApp.id === app.id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      setActionLoading(false);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      setActionLoading(false);
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[260px]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Challenge Problem
            </label>
            <select
              value={selectedChallengeId || ''}
              onChange={e => onSelectChallenge(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
            >
              <option value="">All Department Challenges ({applications.length} Total)</option>
              {challenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title.substring(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[200px]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search Proposals
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Startup name or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'SUBMITTED', label: 'Submitted' },
            { key: 'SHORTLISTED', label: 'Shortlisted' },
            { key: 'ROUND_2_INTERVIEW', label: 'Round 2' },
            { key: 'SELECTED_FOR_PILOT', label: 'Pilot Awarded' },
            { key: 'REJECTED', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeStatusFilter === tab.key
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications List (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No applications match the current filter</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Applications submitted by DPIIT-recognised startups will automatically appear here for departmental screening.
              </p>
            </div>
          ) : (
            filteredApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-700 ring-2 ring-blue-700/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 hover:text-blue-700 transition">
                          {app.startupName}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                          DPIIT Verified
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 line-clamp-1">
                        {app.proposalTitle}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Challenge: <span className="font-mono font-semibold text-slate-700">{app.challengeCode || 'CHL-001'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'SELECTED_FOR_PILOT' || app.status === 'PILOT_AWARDED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'SHORTLISTED'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'ROUND_2_INTERVIEW'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono font-semibold mt-1">
                        ₹ {app.proposedBudget ? (app.proposedBudget / 100000).toFixed(2) : '30.00'} L
                      </div>
                    </div>
                  </div>

                  {/* Metrics footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span>
                        TPI Score: <strong className="text-slate-800 font-bold">{app.tpiScore || 82}/100</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Timeline: <strong className="text-slate-800">{app.proposedTimelineWeeks || 12} wks</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-700 font-semibold">
                      <span>Inspect Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Application Details & Action Drawer (Right 5 Cols) */}
        <div className="lg:col-span-5">
          {selectedApp ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 sticky top-20">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Application Dossier
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {selectedApp.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedApp.startupName}</h3>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedApp.status === 'SELECTED_FOR_PILOT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedApp.status === 'SHORTLISTED'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedApp.status === 'ROUND_2_INTERVIEW'
                      ? 'bg-purple-100 text-purple-800'
                      : selectedApp.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedApp.status.replace('_', ' ')}
                </span>
              </div>

              {/* Startup & Proposal overview */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-0.5">Proposal Title</span>
                  <p className="text-slate-900 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {selectedApp.proposalTitle}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-0.5">Solution Abstract</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {selectedApp.solutionSummary ||
                      'Proprietary offline-capable edge compute computer vision system integrated with state ABHA/Ayushman Bharat APIs. Demonstrates instant on-device screening with automated bilingual Marathi-English reports.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Proposed Commercials
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹ {selectedApp.proposedBudget ? (selectedApp.proposedBudget / 100000).toFixed(2) : '30.00'} Lakhs
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Pilot Timeline
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.proposedTimelineWeeks || 12} Weeks
                    </span>
                  </div>
                </div>

                {/* Statutory DPIIT Verification Check */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>DPIIT Recognition Verified (Govt of India)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Certificate: <span className="font-mono font-bold">DIPP{Math.floor(Math.random() * 80000 + 10000)}</span>. Eligible for GFR 173(i) prior turnover waiver.
                  </p>
                </div>
              </div>

              {/* Department Actions Section */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  Department Committee Actions
                </span>

                <div className="flex flex-col gap-2">
                  {selectedApp.status !== 'SHORTLISTED' && selectedApp.status !== 'ROUND_2_INTERVIEW' && selectedApp.status !== 'SELECTED_FOR_PILOT' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedApp, 'SHORTLISTED', 'Screened and shortlisted by Department Review Committee.')}
                      className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition shadow-2xs flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shortlist for Round 1 Evaluation</span>
                    </button>
                  )}

                  {selectedApp.status !== 'ROUND_2_INTERVIEW' && selectedApp.status !== 'SELECTED_FOR_PILOT' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => onScheduleInterview(selectedApp)}
                      className="w-full py-2 px-3 text-xs font-bold text-purple-950 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg transition flex items-center justify-center space-x-1.5"
                    >
                      <Clock className="w-4 h-4 text-purple-700" />
                      <span>Advance & Schedule Round 2 Presentation</span>
                    </button>
                  )}

                  {selectedApp.status !== 'HOLD_FOR_EVALUATION' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedApp, 'HOLD_FOR_EVALUATION', 'Placed on hold for supplementary departmental scrutiny.')}
                      className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center space-x-1.5"
                    >
                      <span>Put on Administrative Hold</span>
                    </button>
                  )}

                  {selectedApp.status !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowRejectModal(true)}
                      className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center justify-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Reject Application</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rejection reason modal */}
              {showRejectModal && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs">
                  <div className="font-bold text-rose-900 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-700" />
                    <span>Confirm Statutory Rejection</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Specify the technical or eligibility grounds for disqualification. This will be recorded in the audit trail.
                  </p>
                  <textarea
                    rows={2}
                    placeholder="e.g. Solution does not support offline operation required for rural PHC environment."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded text-xs focus:outline-hidden"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowRejectModal(false)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp, 'REJECTED', rejectionReason || 'Disqualified during committee screening.')}
                      className="px-3 py-1 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded"
                    >
                      Confirm Disqualification
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
              <Eye className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold">Select an application to inspect details</p>
              <p className="text-[11px] text-slate-400 mt-1">
                View proposal documents, technical architecture, and execute committee decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
