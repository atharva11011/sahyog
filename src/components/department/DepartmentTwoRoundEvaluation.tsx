import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  IndianRupee,
  Layers,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Unlock,
  Users,
  Video,
} from 'lucide-react';
import {
  Application,
  Challenge,
  FinalizationDecision,
  InterviewMeeting,
  QualitativeRecommendation,
} from '../../types';

interface DepartmentTwoRoundEvaluationProps {
  challenge: Challenge;
  applications: Application[];
  interviews: InterviewMeeting[];
  onScheduleInterview: (data: any) => Promise<void>;
  onRecordAssessment: (meetingId: string, notes: string, recommendation: QualitativeRecommendation) => Promise<void>;
  onFinalizePilot: (data: any) => Promise<void>;
  onOpenContracting?: (pilotId?: string) => void;
}

export const DepartmentTwoRoundEvaluation: React.FC<DepartmentTwoRoundEvaluationProps> = ({
  challenge,
  applications,
  interviews,
  onScheduleInterview,
  onRecordAssessment,
  onFinalizePilot,
  onOpenContracting,
}) => {
  const [activeTab, setActiveTab] = useState<'ROUND_1' | 'ROUND_2' | 'FINALIZATION'>('ROUND_1');

  // Round 2 schedule form state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [schedDate, setSchedDate] = useState('2026-09-15');
  const [schedTime, setSchedTime] = useState('11:00 AM');
  const [schedMode, setSchedMode] = useState<'ONLINE_LINK' | 'IN_PERSON'>('ONLINE_LINK');
  const [schedLocation, setSchedLocation] = useState('https://meet.gov.in/msins-round2-interview');
  const [schedPanelists, setSchedPanelists] = useState('Dr. Sanjay Deshmukh (Chair), Prof. Milind Sohoni, Amit Patil');

  // Qualitative assessment form state
  const [selectedInterviewForNotes, setSelectedInterviewForNotes] = useState<InterviewMeeting | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [recInput, setRecInput] = useState<QualitativeRecommendation>('STRONGLY_RECOMMEND');

  // Finalization state
  const [selectedAppForFinalize, setSelectedAppForFinalize] = useState<Application | null>(null);
  const [decisionNote, setDecisionNote] = useState(
    'Evaluated thoroughly under the two-round Maharashtra Innovation Society procurement protocol. The solution demonstrated superior on-device offline accuracy (>95%), compliant ABHA integration, and an optimal milestone-linked commercial quote of ₹ 30 Lakhs.'
  );
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizationSuccess, setFinalizationSuccess] = useState<FinalizationDecision | null>(null);

  // Filter applications for this challenge
  const challengeApps = applications.filter(a => a.challengeId === challenge.id);

  // Mock Round 1 scoring breakdown calculations
  const scoredApps = challengeApps.map((app, idx) => {
    const baseScore = app.tpiScore || (88 - idx * 6);
    return {
      ...app,
      technicalScore: Math.min(25, Math.round(baseScore * 0.28)),
      teamScore: Math.min(20, Math.round(baseScore * 0.22)),
      outcomeScore: Math.min(25, Math.round(baseScore * 0.27)),
      commercialScore: Math.min(15, Math.round(baseScore * 0.16)),
      securityScore: Math.min(15, Math.round(baseScore * 0.16)),
      totalScore: baseScore,
      evaluatorCount: 3,
      quorumComplete: true,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    try {
      await onScheduleInterview({
        applicationId: selectedAppForInterview.id,
        startupId: selectedAppForInterview.startupId,
        startupName: selectedAppForInterview.startupName,
        scheduledDate: schedDate,
        scheduledTime: schedTime,
        mode: schedMode,
        meetingLocationOrUrl: schedLocation,
        panelists: schedPanelists.split(',').map(p => p.trim()),
      });
      setShowScheduleModal(false);
      setSelectedAppForInterview(null);
      setActiveTab('ROUND_2');
    } catch (err) {
      alert('Failed to schedule interview');
    }
  };

  const handleSaveAssessment = async (meetingId: string) => {
    if (!notesInput.trim()) {
      alert('Please enter interview assessment notes');
      return;
    }
    try {
      await onRecordAssessment(meetingId, notesInput, recInput);
      setSelectedInterviewForNotes(null);
      setNotesInput('');
    } catch (err) {
      alert('Failed to record assessment');
    }
  };

  const handleConfirmFinalization = async () => {
    if (!selectedAppForFinalize) return;
    if (!decisionNote.trim() || decisionNote.length < 15) {
      alert('Mandatory statutory decision note required for the public procurement audit trail.');
      return;
    }

    setIsFinalizing(true);
    try {
      const topScored = scoredApps.find(a => a.id === selectedAppForFinalize.id);
      const meeting = interviews.find(m => m.applicationId === selectedAppForFinalize.id);

      const payload = {
        applicationId: selectedAppForFinalize.id,
        startupId: selectedAppForFinalize.startupId,
        startupName: selectedAppForFinalize.startupName,
        round1Score: topScored?.totalScore || 88,
        round2Recommendation: meeting?.recommendation || 'STRONGLY_RECOMMEND',
        decisionNote: decisionNote.trim(),
        decidedBy: 'Dr. Sanjay Deshmukh (Admin Official)',
      };

      await onFinalizePilot(payload);
      setIsFinalizing(false);
      setFinalizationSuccess({
        id: `fin_${Date.now()}`,
        challengeId: challenge.id,
        applicationId: selectedAppForFinalize.id,
        startupId: selectedAppForFinalize.startupId,
        startupName: selectedAppForFinalize.startupName,
        round1Score: payload.round1Score,
        round2Recommendation: payload.round2Recommendation as QualitativeRecommendation,
        decisionNote: payload.decisionNote,
        decidedBy: payload.decidedBy,
        decidedAt: new Date().toISOString(),
        status: 'SELECTED_FOR_PILOT',
        handoffStatus: 'CONTRACTING_PENDING',
      });
    } catch (err) {
      setIsFinalizing(false);
      alert('Failed to finalize pilot selection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('ROUND_1')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'ROUND_1'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Round 1: Blind Scoring & Rubric</span>
          </button>

          <button
            onClick={() => setActiveTab('ROUND_2')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'ROUND_2'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Round 2: Presentation & Interviews ({interviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('FINALIZATION')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'FINALIZATION'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Final Pilot Selection & Handoff</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium pr-3">
          <span>Challenge:</span>
          <span className="font-mono font-bold text-slate-800">{challenge.code}</span>
        </div>
      </div>

      {/* TAB 1: ROUND 1 BLIND SCORING */}
      {activeTab === 'ROUND_1' && (
        <div className="space-y-4">
          {/* Blind Lock Quorum Card */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-start justify-between bg-emerald-50/30">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-emerald-950">
                    Blind Scoring Quorum Unlocked
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    3/3 Evaluators Submitted
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Evaluators scored proposals independently without seeing peer submissions or startup commercial identity. The committee unblinded aggregate scores based on the weighted 5-pillar rubric.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-500 block">Weighted Rubric</span>
              <span className="text-xs font-mono font-bold text-slate-800">100 Pts Total</span>
            </div>
          </div>

          {/* Aggregated Ranked Shortlist Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Round 1 Technical & Outcome Scoring Rankings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top evaluated DPIIT startups ranked by mean committee score across 5 statutory pillars.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {scoredApps.length} Shortlisted Proposals
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Startup & Proposal</th>
                    <th className="px-3 py-3 text-center">Tech (25)</th>
                    <th className="px-3 py-3 text-center">Team (20)</th>
                    <th className="px-3 py-3 text-center">Outcome (25)</th>
                    <th className="px-3 py-3 text-center">Cost (15)</th>
                    <th className="px-3 py-3 text-center">Security (15)</th>
                    <th className="px-4 py-3 text-right">Total Score</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scoredApps.map((app, rankIdx) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-bold text-slate-800">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          rankIdx === 0 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{rankIdx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{app.startupName}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">{app.proposalTitle}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">{app.technicalScore}/25</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">{app.teamScore}/20</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700 font-semibold text-blue-800">{app.outcomeScore}/25</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">{app.commercialScore}/15</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">{app.securityScore}/15</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-sm text-slate-900 font-mono">
                          {app.totalScore}
                        </span>
                        <span className="text-slate-400 text-[10px]"> / 100</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAppForInterview(app);
                            setShowScheduleModal(true);
                          }}
                          className="px-3 py-1 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          Schedule Round 2
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROUND 2 PRESENTATIONS & INTERVIEWS */}
      {activeTab === 'ROUND_2' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Round 2 Technical Presentation & Committee Interviews
              </h3>
              <p className="text-xs text-slate-500">
                Qualitative evaluation of live prototype demonstrations and department field operational viability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (scoredApps.length > 0) {
                  setSelectedAppForInterview(scoredApps[0]);
                  setShowScheduleModal(true);
                }
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition shadow-2xs flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule New Interview</span>
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-2 text-xs text-slate-500">
              <Video className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold">No interviews scheduled yet</p>
              <p className="text-[11px] text-slate-400">
                Select a top-ranked startup from Round 1 to schedule a video or in-person technical review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map(meet => (
                <div
                  key={meet.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        Round 2 Presentation
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{meet.startupName}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {meet.scheduledDate} at {meet.scheduledTime}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        meet.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {meet.status}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Mode:</span>
                      <span className="text-slate-800">{meet.mode === 'ONLINE_LINK' ? 'Online Video Link' : 'In-Person (Mantralaya)'}</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Panelists:</span>
                      <span className="text-[11px] text-slate-700">{meet.panelists.join(', ')}</span>
                    </div>
                  </div>

                  {meet.status === 'COMPLETED' ? (
                    <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs space-y-1 text-emerald-950">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Committee Recommendation:</span>
                        <span className="font-bold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2 py-0.2 rounded">
                          {meet.recommendation?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 italic mt-1 leading-relaxed">
                        "{meet.notes}"
                      </p>
                      <div className="text-[10px] text-slate-500 pt-1">
                        Assessed by: {meet.assessedBy}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInterviewForNotes(meet);
                          setNotesInput(meet.notes || '');
                          setRecInput(meet.recommendation || 'STRONGLY_RECOMMEND');
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Record Committee Assessment & Notes</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Assessment Modal */}
          {selectedInterviewForNotes && (
            <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-md space-y-4 max-w-xl">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-blue-700" />
                <span>Log Assessment for {selectedInterviewForNotes.startupName}</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qualitative Recommendation *
                </label>
                <select
                  value={recInput}
                  onChange={e => setRecInput(e.target.value as QualitativeRecommendation)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
                >
                  <option value="STRONGLY_RECOMMEND">Strongly Recommend for Pilot</option>
                  <option value="RECOMMEND">Recommend with Minor Conditions</option>
                  <option value="NOT_RECOMMEND">Do Not Recommend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interview Assessment Notes & Technical Observations *
                </label>
                <textarea
                  rows={3}
                  placeholder="Record observations regarding live demo accuracy, hardware ruggedness for rural clinics, offline capabilities..."
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedInterviewForNotes(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveAssessment(selectedInterviewForNotes.id)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                >
                  Save Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FINAL PILOT SELECTION & CONTRACTING HANDOFF */}
      {activeTab === 'FINALIZATION' && (
        <div className="space-y-6">
          {finalizationSuccess ? (
            <div className="bg-white rounded-xl border border-emerald-300 shadow-sm p-6 space-y-6">
              <div className="flex items-center space-x-3 text-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                    Order Resolution Issued
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Startup Finalized for Milestone Pilot Deployment
                  </h3>
                  <p className="text-xs text-slate-600">
                    Resolution Ref: <span className="font-mono font-bold text-slate-800">MH-MSINS-RES-{finalizationSuccess.id}</span>
                  </p>
                </div>
              </div>

              {/* Resolution briefing card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Selected Startup Entity</span>
                    <span className="font-bold text-slate-900 text-sm">{finalizationSuccess.startupName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Round 1 Mean Score</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">{finalizationSuccess.round1Score}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Round 2 Qualitative Finding</span>
                    <span className="font-semibold text-emerald-800">{finalizationSuccess.round2Recommendation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Authorized Official</span>
                    <span className="font-semibold text-slate-800">{finalizationSuccess.decidedBy}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block font-semibold mb-0.5">Statutory Decision Note</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    "{finalizationSuccess.decisionNote}"
                  </p>
                </div>
              </div>

              {/* Contracting Handoff Section */}
              <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 font-bold text-sm text-blue-950">
                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                    <span>Handoff to Milestone Contracting & GFR 173(i) Waiver</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-900">
                    Pilot Budget: ₹ 35 Lakhs
                  </span>
                </div>

                <p className="text-xs text-blue-900/90 leading-relaxed">
                  The finalization resolution has been written to the irreversible audit trail. The legal module is now unlocked with pre-configured milestone disbursement schedules:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                    <span className="font-bold text-slate-800 block">Milestone 1 (20%)</span>
                    <span className="text-slate-500">Requirement Sign-off</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                    <span className="font-bold text-slate-800 block">Milestone 2 (30%)</span>
                    <span className="text-slate-500">Deployment in 5 PHCs</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                    <span className="font-bold text-slate-800 block">Milestone 3 (30%)</span>
                    <span className="text-slate-500">Field Validation Metric</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                    <span className="font-bold text-slate-800 block">Milestone 4 (20%)</span>
                    <span className="text-slate-500">Outcome Certification</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenContracting) onOpenContracting();
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition flex items-center space-x-1.5"
                  >
                    <span>Proceed to Milestone Contracting & Pilot Sandbox</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Winner & Finalize Pilot Deployment Order
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synthesizes Round 1 objective rubric rankings with Round 2 qualitative presentation findings to issue the pilot order.
                </p>
              </div>

              {/* Startup Selection Radios */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Candidate Startups (Evaluated Across 2 Rounds)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scoredApps.slice(0, 4).map(app => {
                    const isSelected = selectedAppForFinalize?.id === app.id;
                    const meeting = interviews.find(m => m.applicationId === app.id);

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppForFinalize(app)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-800 ring-2 ring-blue-800/10'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">{app.startupName}</span>
                            <span className="text-xs text-slate-500 line-clamp-1">{app.proposalTitle}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-xs text-blue-900 block">
                              Score: {app.totalScore}/100
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            Round 2 Rec: <strong className="text-slate-800">{meeting?.recommendation || 'Evaluated'}</strong>
                          </span>
                          <span className="font-semibold text-blue-800 font-mono">
                            ₹ {app.proposedBudget ? (app.proposedBudget / 100000).toFixed(2) : '30.00'} L
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory Statutory Decision Note */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-800">
                    Statutory Pilot Award Justification Note *
                  </label>
                  <span className="text-[11px] text-slate-500">Recorded for State Vigilance & Audit</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize the core technical, clinical, and commercial grounds why this startup solution best meets the department's outcome goals under GFR Rule 173(i)..."
                  value={decisionNote}
                  onChange={e => setDecisionNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Acting Signatory: <span className="font-semibold text-slate-800">Dr. Sanjay Deshmukh (Admin Official)</span>
                </div>

                <button
                  type="button"
                  disabled={!selectedAppForFinalize || isFinalizing}
                  onClick={handleConfirmFinalization}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition disabled:opacity-50 flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>{isFinalizing ? 'Recording Resolution...' : 'Finalize & Issue Pilot Selection Order'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Schedule Round 2 Presentation</span>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Startup</label>
                <input
                  type="text"
                  disabled
                  value={selectedAppForInterview.startupName}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={schedDate}
                    onChange={e => setSchedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="11:00 AM"
                    value={schedTime}
                    onChange={e => setSchedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode *</label>
                  <select
                    value={schedMode}
                    onChange={e => setSchedMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="ONLINE_LINK">Online Video Link</option>
                    <option value="IN_PERSON">In-Person (Mantralaya Office)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Meeting URL *</label>
                  <input
                    type="text"
                    required
                    value={schedLocation}
                    onChange={e => setSchedLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluation Committee Panelists *</label>
                <input
                  type="text"
                  required
                  value={schedPanelists}
                  onChange={e => setSchedPanelists(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                >
                  Confirm & Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
