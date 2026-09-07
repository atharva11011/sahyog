import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  EyeOff,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Evaluation, Application, Challenge, User } from '../types';

interface EvaluationViewProps {
  applications: Application[];
  challenges: Challenge[];
  evaluations: Evaluation[];
  currentUser: User;
  onEvaluationSubmitted: (newEval: Evaluation) => void;
  onAwardPilot: (application: Application, challenge: Challenge) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  applications,
  challenges,
  evaluations,
  currentUser,
  onEvaluationSubmitted,
  onAwardPilot,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || ''
  );

  // Rubric Scoring State (default to balanced scores)
  const [techScore, setTechScore] = useState<number>(22); // max 25
  const [teamScore, setTeamScore] = useState<number>(18); // max 20
  const [outcomeScore, setOutcomeScore] = useState<number>(23); // max 25
  const [costScore, setCostScore] = useState<number>(13); // max 15
  const [securityScore, setSecurityScore] = useState<number>(14); // max 15
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const selectedChallenge = challenges.find(c => c.id === selectedApp?.challengeId);
  const appEvaluations = evaluations.filter(e => e.applicationId === selectedAppId);

  const currentTotal = techScore + teamScore + outcomeScore + costScore + securityScore;

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !selectedChallenge) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          challengeId: selectedChallenge.id,
          evaluatorId: currentUser.id,
          evaluatorName: currentUser.name,
          evaluatorType:
            currentUser.role === 'DEPARTMENT_OFFICIAL'
              ? 'DEPARTMENT_OFFICIAL'
              : currentUser.role === 'MSINS_ADMIN'
              ? 'MSINS_REP'
              : 'DOMAIN_EXPERT',
          technicalFeasibility: techScore,
          teamCapability: teamScore,
          outcomeAlignment: outcomeScore,
          costEfficiency: costScore,
          dataSecurityReadiness: securityScore,
          qualitativeRemarks: remarks || 'Evaluated against CVC/MSInS rubric guidelines.',
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        onEvaluationSubmitted(saved);
        alert('Blind evaluation score finalized and recorded in immutable audit log.');
      } else {
        alert('Failed to save evaluation.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Stage 4: Multi-Evaluator Blind Scoring Room
            </h2>
            <span className="text-xs bg-purple-50 text-purple-800 font-bold px-3 py-0.5 rounded-full border border-purple-200/80 font-mono">
              3-Way Quorum (Dept + Domain + MSInS)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independent blind evaluation eliminating subjective bias. Evaluators score across 5 objective parameters with strict confidentiality until committee unblinding.
          </p>
        </div>
      </div>

      {/* Main Scoring Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications List Bento Box */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Proposals Under Review ({applications.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Select to Score</span>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto">
            {applications.map(app => {
              const isSelected = app.id === selectedAppId;
              const evalsForThis = evaluations.filter(e => e.applicationId === app.id);
              const avg = evalsForThis.length > 0
                ? (evalsForThis.reduce((s, e) => s + e.weightedTotal, 0) / evalsForThis.length).toFixed(1)
                : null;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-purple-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-purple-800 font-bold bg-purple-100/80 border border-purple-200/60 px-2 py-0.5 rounded-full text-[10px]">
                      {app.challengeCode}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {evalsForThis.length}/3 Evaluated
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 tracking-tight">
                    {app.proposalTitle}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {app.startupName}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>GFR 173 Verified</span>
                    </span>
                    {avg ? (
                      <span className="font-bold text-purple-900 bg-purple-100/90 border border-purple-200/80 px-2.5 py-0.5 rounded-full font-mono text-xs">
                        Avg: {avg}/100
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-mono">Unrated</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Proposal Details & Rubric Scoring */}
        <div className="lg:col-span-8 space-y-5">
          {selectedApp && selectedChallenge ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              {/* Proposal Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {selectedApp.challengeCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedChallenge.department}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedApp.proposalTitle}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">
                      By: {selectedApp.startupName}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                      DPIIT: {selectedApp.dpiitCertificate} (GFR 173 Qualified)
                    </span>
                  </div>
                </div>

                {/* Award Sandbox Button if short-listed or admin/dept */}
                {(currentUser.role === 'MSINS_ADMIN' || currentUser.role === 'DEPARTMENT_OFFICIAL') && (
                  <button
                    onClick={() => onAwardPilot(selectedApp, selectedChallenge)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 shrink-0 hover:scale-[1.02]"
                  >
                    <span>Award Pilot Sandbox (Stage 5)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Proposal Content Snippet Bento Duo Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Technical Specification
                  </span>
                  <p className="text-slate-700 leading-relaxed line-clamp-4">
                    {selectedApp.technicalSpecs}
                  </p>
                </div>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Team Pedigree & Capability
                  </span>
                  <p className="text-slate-700 leading-relaxed line-clamp-4">
                    {selectedApp.teamCapability}
                  </p>
                </div>
              </div>

              {/* Rubric Evaluation Form */}
              <form onSubmit={handleScoreSubmit} className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      CVC / MSInS Weighted Rubric (Current Evaluator: {currentUser.name})
                    </span>
                  </div>
                  <div className="text-xs font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full font-mono border border-purple-200/80">
                    Total Score: {currentTotal} / 100
                  </div>
                </div>

                {/* 5 Parameters Sliders inside Bento Modules */}
                <div className="space-y-3 text-xs">
                  {/* Param 1: Technical Feasibility (25%) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                      <span>1. Technical Feasibility & Innovation (Weight: 25%)</span>
                      <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{techScore} / 25</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={techScore}
                      onChange={e => setTechScore(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Unproven concept</span>
                      <span>Patent/TRL-6 ready</span>
                      <span>Field validated</span>
                    </div>
                  </div>

                  {/* Param 2: Team Capability (20%) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                      <span>2. Team & Execution Capability (Weight: 20%)</span>
                      <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{teamScore} / 20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={teamScore}
                      onChange={e => setTeamScore(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Incomplete team</span>
                      <span>Relevant GovTech background</span>
                      <span>Proven deployment pedigree</span>
                    </div>
                  </div>

                  {/* Param 3: Outcome Alignment (25%) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                      <span>3. Outcome Alignment with Baseline (Weight: 25%)</span>
                      <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{outcomeScore} / 25</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={outcomeScore}
                      onChange={e => setOutcomeScore(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Marginal delta</span>
                      <span>Meets target outcome</span>
                      <span>Exceeds baseline threshold</span>
                    </div>
                  </div>

                  {/* Param 4: Cost Efficiency (15%) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                      <span>4. Cost Efficiency & Scalability (Weight: 15%)</span>
                      <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{costScore} / 15</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      value={costScore}
                      onChange={e => setCostScore(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>High unit cost</span>
                      <span>Standard public budget</span>
                      <span>Substantial cost savings</span>
                    </div>
                  </div>

                  {/* Param 5: Data Security Readiness (15%) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                      <span>5. Data Privacy & Cybersecurity (Weight: 15%)</span>
                      <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{securityScore} / 15</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      value={securityScore}
                      onChange={e => setSecurityScore(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Inadequate security</span>
                      <span>DPDP Act compliant</span>
                      <span>CERT-In audit ready</span>
                    </div>
                  </div>
                </div>

                {/* Qualitative Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Qualitative Assessment & Sandbox Recommendations
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter formal justification for audit and compliance defensibility..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-hidden bg-slate-50/50"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 hover:scale-[1.02]"
                  >
                    <span>{isSubmitting ? 'Recording...' : 'Finalize Blind Score for Application'}</span>
                  </button>
                </div>
              </form>

              {/* Committee Consensus Table */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
                  Multi-Evaluator Committee Scores ({appEvaluations.length} Submitted):
                </span>
                <div className="space-y-2">
                  {appEvaluations.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{ev.evaluatorName}</span>
                          <span className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono">
                            {ev.evaluatorType}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 italic">
                          "{ev.qualitativeRemarks}"
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Weighted Score</span>
                          <span className="font-extrabold text-purple-900 text-sm font-mono">
                            {ev.weightedTotal} / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select an application on the left to evaluate
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
