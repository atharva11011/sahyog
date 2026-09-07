import React, { useState } from 'react';
import {
  X,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles,
  IndianRupee,
  Lock,
} from 'lucide-react';
import { Challenge, User, Application } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  currentUser: User;
  onApplicationSubmitted: (newApp: Application) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentUser,
  onApplicationSubmitted,
}) => {
  if (!isOpen || !challenge) return null;

  const [proposalTitle, setProposalTitle] = useState('');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [technicalSpecs, setTechnicalSpecs] = useState('');
  const [teamCapability, setTeamCapability] = useState('');
  const [costBreakdown, setCostBreakdown] = useState(
    Math.round(challenge.budgetCeiling * 0.85).toString()
  );
  const [timelineCommitment, setTimelineCommitment] = useState(
    challenge.timelineWeeks.toString()
  );
  const [dpiitCertificate, setDpiitCertificate] = useState(
    currentUser.dpiitNumber || 'DIPP-MH-2023-77812'
  );
  const [dataSecurityPlan, setDataSecurityPlan] = useState(
    'Indian sovereign cloud residency (MeitY empaneled). AES-256 encryption at rest, TLS 1.3 in transit. Zero raw citizen data egress.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo Auto-fill
  const handleAutoFillDemo = () => {
    setProposalTitle(`Autonomous Edge AI Solution for ${challenge.sector}`);
    setExecutiveSummary(
      `An offline-first, edge-computed solution engineered specifically for high-throughput public deployment under the ${challenge.department}. Demonstrated on over 10,000 real-world Indian operational cycles with zero downtime.`
    );
    setTechnicalSpecs(
      `Proprietary quantized neural pipeline (under 25MB footprint) running on standard low-cost Android/Raspberry Pi hardware. Supports multi-lingual audio/visual UI (Marathi, Hindi, English). Fully compatible with National Digital Public Infrastructure (DPI) specifications.`
    );
    setTeamCapability(
      `Founding team comprised of alumni from IIT Bombay and VJTI Mumbai with 8+ years experience in GovTech and embedded systems. Holds 2 Indian patents filed in precision telemetry.`
    );
    setCostBreakdown(Math.round(challenge.budgetCeiling * 0.88).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !executiveSummary || !technicalSpecs) {
      alert('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          startupId: currentUser.id,
          startupName: currentUser.startupName || currentUser.name,
          proposalTitle,
          executiveSummary,
          technicalSpecs,
          teamCapability,
          costBreakdown: parseFloat(costBreakdown) || challenge.budgetCeiling * 0.85,
          timelineCommitment: parseInt(timelineCommitment) || challenge.timelineWeeks,
          dpiitCertificate,
          dataSecurityPlan,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onApplicationSubmitted(created);
        onClose();
      } else {
        alert('Failed to submit proposal');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center font-bold shadow-2xs">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Submit Grand Challenge Proposal
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded text-[10px]">{challenge.code}</span>
                <span>•</span>
                <span className="truncate max-w-[280px] font-medium">{challenge.title}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GFR 173(i) Statutory Exemption Ribbon */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/70 px-6 py-3 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-[11px]">
              Statutory Exemption Verified: Prior Turnover & Experience WAIVED (GFR 173(i))
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="px-3 py-1 bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300/80 rounded-full font-bold text-[10px] transition-colors flex items-center space-x-1 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pre-fill Sample Proposal</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Proposal Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Proposal Solution Title *
            </label>
            <input
              type="text"
              value={proposalTitle}
              onChange={e => setProposalTitle(e.target.value)}
              placeholder="e.g. NetraDrishti Edge: Offline-First Smartphone AI Triage"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-medium bg-slate-50/40"
              required
            />
          </div>

          {/* DPIIT Number Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                DPIIT Startup India Registration No. *
              </label>
              <input
                type="text"
                value={dpiitCertificate}
                onChange={e => setDpiitCertificate(e.target.value)}
                placeholder="DIPP-MH-2023-XXXXX"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-mono uppercase bg-slate-50/40"
                required
              />
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                ✓ Validated against Startup India Central Registry
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Startup Entity Name
              </label>
              <input
                type="text"
                disabled
                value={currentUser.startupName || currentUser.name}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-700 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Executive Summary & Proposed Methodology *
            </label>
            <textarea
              rows={3}
              value={executiveSummary}
              onChange={e => setExecutiveSummary(e.target.value)}
              placeholder="Provide a concise summary of how your technology directly achieves the target outcome..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden bg-slate-50/40"
              required
            />
          </div>

          {/* Technical Specs */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Technical Specifications & Architecture *
            </label>
            <textarea
              rows={3}
              value={technicalSpecs}
              onChange={e => setTechnicalSpecs(e.target.value)}
              placeholder="Detail hardware, algorithm, edge requirements, deployment architecture, and field readiness..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden bg-slate-50/40"
              required
            />
          </div>

          {/* Team Capability */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Team Capability & Domain Track Record *
            </label>
            <textarea
              rows={2}
              value={teamCapability}
              onChange={e => setTeamCapability(e.target.value)}
              placeholder="Key founders, technical competencies, patents, and pilot deployment experience..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden bg-slate-50/40"
              required
            />
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Proposed Grant Budget (INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={costBreakdown}
                  onChange={e => setCostBreakdown(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-mono bg-slate-50/40"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Ceiling: ₹{(challenge.budgetCeiling / 100000).toFixed(1)} Lakhs
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Timeline Commitment (Weeks) *
              </label>
              <input
                type="number"
                value={timelineCommitment}
                onChange={e => setTimelineCommitment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-mono bg-slate-50/40"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Recommended: {challenge.timelineWeeks} Weeks
              </span>
            </div>
          </div>

          {/* Data Security & DPDP Plan */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Data Security & DPDP Compliance Plan
            </label>
            <input
              type="text"
              value={dataSecurityPlan}
              onChange={e => setDataSecurityPlan(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden bg-slate-50/40"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 hover:scale-[1.02]"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Proposal for Blind Evaluation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
