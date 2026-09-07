import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  ArrowRight,
  Send,
  AlertCircle,
  FileText,
  BadgePercent,
  CheckCircle2,
  SlidersHorizontal,
  IndianRupee,
} from 'lucide-react';
import { Challenge, User, Application } from '../types';

interface StartupDiscoveryViewProps {
  challenges: Challenge[];
  currentUser: User;
  onSelectChallengeForApply: (challenge: Challenge) => void;
  applications: Application[];
  onOpenCreateChallenge: () => void;
}

export const StartupDiscoveryView: React.FC<StartupDiscoveryViewProps> = ({
  challenges,
  currentUser,
  onSelectChallengeForApply,
  applications,
  onOpenCreateChallenge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // DPIIT Live Verification Tool
  const [testDpiitNumber, setTestDpiitNumber] = useState('DIPP-MH-2023-77812');
  const [dpiitResult, setDpiitResult] = useState<any>(null);
  const [isVerifyingDpiit, setIsVerifyingDpiit] = useState(false);

  // Auto-run initial verification for user's startup
  useEffect(() => {
    if (currentUser.dpiitNumber) {
      setTestDpiitNumber(currentUser.dpiitNumber);
    }
  }, [currentUser]);

  const handleVerifyDpiit = async () => {
    if (!testDpiitNumber) return;
    setIsVerifyingDpiit(true);
    try {
      const res = await fetch('/api/dpiit/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dpiitNumber: testDpiitNumber,
          startupName: currentUser.startupName || 'Applicant Startup Enterprise',
        }),
      });
      const data = await res.json();
      setDpiitResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifyingDpiit(false);
    }
  };

  const sectors = [
    'ALL',
    'Healthcare & MedTech',
    'Clean Tech & Water',
    'AgriTech & Remote Sensing',
    'Smart Cities & Mobility',
  ];

  // Filtering
  const filteredChallenges = challenges.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'ALL' || c.sector === selectedSector;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Stages 1–3: Grand Challenges & Startup Discovery
            </h2>
            <span className="text-xs bg-orange-50 text-orange-800 font-bold px-2.5 py-0.5 rounded-full border border-orange-200/80 font-mono">
              {filteredChallenges.length} Open Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Outcome-focused procurement challenges with mandatory GFR 173(i) prior-turnover waivers and GFR 170 EMD exemptions.
          </p>
        </div>

        {currentUser.role === 'DEPARTMENT_OFFICIAL' && (
          <button
            onClick={onOpenCreateChallenge}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center space-x-2 self-start md:self-auto hover:scale-[1.02]"
          >
            <span>+ Create Outcome Challenge</span>
          </button>
        )}
      </div>

      {/* Interactive DPIIT Real-Time Verification Drawer (Stage 3 Highlight) styled as Bento Tile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Stage 3: Automated DPIIT Eligibility Verification & GFR 173(i) Gateway
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Verify startup DPIIT registration via Startup India API mock gateway to instantly unlock statutory waivers.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                value={testDpiitNumber}
                onChange={e => setTestDpiitNumber(e.target.value)}
                placeholder="Enter DPIIT No (e.g. DIPP-MH-2023-77812)"
                className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-mono uppercase bg-slate-50/50"
              />
            </div>
            <button
              onClick={handleVerifyDpiit}
              disabled={isVerifyingDpiit}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-xs"
            >
              {isVerifyingDpiit ? 'Verifying...' : 'Check GFR Waiver'}
            </button>
          </div>
        </div>

        {/* DPIIT Verification Result Card styled as inner Bento pill box */}
        {dpiitResult && (
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/90 rounded-2xl p-4 text-xs animate-in fade-in border border-slate-200/60">
            {dpiitResult.verified ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">
                        {dpiitResult.entityName}
                      </span>
                      <span className="bg-emerald-100/80 text-emerald-800 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300/60">
                        RECOGNISED • {dpiitResult.dpiitNumber}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Valid through: {dpiitResult.validUntil} • Sector: {dpiitResult.sector}
                    </p>
                    <p className="text-emerald-700 text-[11px] font-semibold mt-1 flex items-center space-x-1">
                      <span>✓</span>
                      <span>{dpiitResult.exemptionNotice}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full font-mono shadow-2xs">
                    GFR 173(i) Turnover Waived
                  </span>
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full font-mono shadow-2xs">
                    GFR 170 EMD Exempted
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-rose-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{dpiitResult.error || 'Verification failed. Please review the registration code.'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar styled as sleek Bento Pill Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, tech tag, code, or department..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden"
          />
        </div>

        {/* Sector Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {sec === 'ALL' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredChallenges.map(ch => {
          const hasApplied = applications.some(a => a.challengeId === ch.id && a.startupId === currentUser.id);

          return (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Header Tag Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                        {ch.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                        {ch.department}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
                      {ch.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider font-mono ${
                      ch.status === 'APPLICATIONS_OPEN'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ch.status === 'UNDER_EVALUATION'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {ch.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Problem Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ch.problemDescription}
                </p>

                {/* Outcome-Based Specification Bento Inner Duo Box */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Current Baseline Metric:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {ch.baselineMetric}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                      Required Target Outcome (Stage 9 Certification):
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {ch.targetOutcome}
                    </span>
                  </div>
                </div>

                {/* Meta stats Bento mini-grid */}
                <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Grant Ceiling</span>
                    <span className="font-extrabold text-slate-900 font-mono text-xs">
                      ₹{(ch.budgetCeiling / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Timeline</span>
                    <span className="font-extrabold text-slate-900 font-mono text-xs">{ch.timelineWeeks} Weeks</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Sensitivity</span>
                    <span className="font-extrabold text-slate-900 truncate block text-xs">
                      {ch.dataSensitivity.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {ch.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-100/90 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200/60 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px]">
                  {ch.gfrRule173Applied && (
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>GFR 173(i) Turnover Waived</span>
                    </span>
                  )}
                </div>

                {hasApplied ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Proposal Submitted</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectChallengeForApply(ch)}
                    className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 hover:scale-[1.02]"
                  >
                    <span>Apply Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
