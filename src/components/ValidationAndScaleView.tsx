import React, { useState } from 'react';
import {
  BadgeCheck,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Award,
  ExternalLink,
  Share2,
  CheckCircle2,
  Lock,
  Building,
  Sparkles,
  QrCode,
  Download,
} from 'lucide-react';
import { Pilot, User, ScaleRecommendation } from '../types';

interface ValidationAndScaleViewProps {
  pilots: Pilot[];
  currentUser: User;
  onGenerateCertificate: (
    pilotId: string,
    actualMetric: string,
    recommendation: ScaleRecommendation,
    notes: string
  ) => void;
  onPushToGeM: (pilotId: string) => void;
}

export const ValidationAndScaleView: React.FC<ValidationAndScaleViewProps> = ({
  pilots,
  currentUser,
  onGenerateCertificate,
  onPushToGeM,
}) => {
  const [selectedPilotId, setSelectedPilotId] = useState<string>(
    pilots[0]?.id || ''
  );
  const [actualMetric, setActualMetric] = useState(
    'Triage turnaround reduced to 68 seconds; 95.8% clinical concordance with AIIMS panel.'
  );
  const [scaleRecommendation, setScaleRecommendation] = useState<ScaleRecommendation>(
    'DIRECT_DEPARTMENT_PROCUREMENT'
  );
  const [notes, setNotes] = useState(
    'Field pilot conducted across 6 tribal PHCs with 1,620 patients. Solution demonstrated superior accuracy with zero downtime. Clean CERT-In data compliance. Meets all criteria for statewide scale-up.'
  );
  const [isPushingGeM, setIsPushingGeM] = useState(false);
  const [gemPushSuccess, setGemPushSuccess] = useState(false);

  const selectedPilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const handleCertify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPilot) return;
    onGenerateCertificate(selectedPilot.id, actualMetric, scaleRecommendation, notes);
    alert('Stage 9: Formal Independent Validation Certificate issued with SHA-256 cryptographic seal!');
  };

  const handleGeMPush = async () => {
    if (!selectedPilot) return;
    setIsPushingGeM(true);
    try {
      await onPushToGeM(selectedPilot.id);
      setGemPushSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPushingGeM(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Stages 9 & 10: Independent Outcome Validation & Scale-Up Gateway
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-0.5 rounded-full border border-emerald-200/80 font-mono">
              GFR 173(i) Scale Direct Transition
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independent third-party certification of Stage-1 outcome KPIs, authorizing direct department procurement or GeM Startup Runway listing.
          </p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pilot Selector Bento Box */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Completed & Scale-Ready Pilots</span>
          </div>

          <div className="space-y-2.5">
            {pilots.map(p => {
              const isSelected = p.id === selectedPilot?.id;
              const hasCert = Boolean(p.validationRecord?.outcomeCertified);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPilotId(p.id)}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-400 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold text-indigo-900 bg-indigo-100/80 border border-indigo-200/60 px-2.5 py-0.5 rounded-full text-[10px]">
                      {hasCert ? 'CERTIFIED' : 'PENDING AUDIT'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Phase: {p.phase.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 tracking-tight">
                    {p.challengeTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {p.startupName}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {p.departmentName}
                    </span>
                    {hasCert && (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ready for Scale</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Bento Box */}
        <div className="lg:col-span-8 space-y-5">
          {selectedPilot && (
            <div className="space-y-5">
              {/* Stage 9: Independent Validation Certificate Card Styled as Bento Artifact */}
              {selectedPilot.validationRecord?.outcomeCertified ? (
                <div className="bg-gradient-to-b from-white via-amber-50/20 to-amber-50/40 rounded-3xl border-2 border-amber-300/90 p-6 sm:p-8 shadow-md relative overflow-hidden">
                  {/* Watermark / Seal */}
                  <div className="absolute top-4 right-4 text-amber-500/15 font-serif font-black text-8xl pointer-events-none select-none">
                    प्रमाणित
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                          सं
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-950 uppercase tracking-widest block">
                            Government of Maharashtra • MSInS
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            SIH 26136 Form 12-A Statutory Certificate
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                        {selectedPilot.validationRecord.certificationNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        Issued: {new Date(selectedPilot.validationRecord.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-b border-amber-200/80 py-5 space-y-4 relative z-10">
                    <div className="text-center space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                        INDEPENDENT OUTCOME VALIDATION CERTIFICATE
                      </h3>
                      <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                        This is to formally certify that the technology solution deployed by{' '}
                        <strong className="text-slate-900">{selectedPilot.startupName}</strong> under Grand Challenge{' '}
                        <strong className="text-slate-900">{selectedPilot.challengeTitle}</strong> has undergone independent third-party empirical testing and successfully exceeded all contracted outcome thresholds.
                      </p>
                    </div>

                    {/* Verified Metrics comparison Bento Duo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/90 rounded-2xl p-4 border border-amber-200/80 text-xs shadow-2xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Pre-Pilot Baseline (Verified)
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                          {selectedPilot.validationRecord.baselineVerified}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          Actual Empirical Metric Achieved
                        </span>
                        <span className="font-bold text-emerald-900 text-xs mt-0.5 block">
                          {selectedPilot.validationRecord.actualMetricAchieved}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <span className="font-bold text-slate-800">
                        Independent Auditor Certification Findings:
                      </span>
                      <p className="text-slate-600 leading-relaxed italic bg-white/80 p-3.5 rounded-xl border border-amber-200/60">
                        "{selectedPilot.validationRecord.justificationNotes}"
                      </p>
                    </div>
                  </div>

                  {/* Footer & Digital Fingerprint */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 relative z-10">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">
                        Auditor Signoff:
                      </span>
                      <span className="font-bold text-slate-900">
                        {selectedPilot.validationRecord.validatorName}
                      </span>
                    </div>

                    <div className="text-right font-mono text-[10px] text-slate-400">
                      <span>SHA-256 Fingerprint: </span>
                      <span className="text-slate-700 font-bold bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
                        {selectedPilot.validationRecord.certificateHash.substring(0, 24)}...
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Auditor Certification Form for Independent Validator role */
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <BadgeCheck className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        Stage 9: Issue Formal Independent Outcome Certificate
                      </h3>
                    </div>
                    <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-full font-mono border border-indigo-200">
                      Auditor: {currentUser.name}
                    </span>
                  </div>

                  <form onSubmit={handleCertify} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Empirical Metric Achieved in Sandbox / Field *
                      </label>
                      <input
                        type="text"
                        value={actualMetric}
                        onChange={e => setActualMetric(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden font-medium bg-slate-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Scale Recommendation
                      </label>
                      <select
                        value={scaleRecommendation}
                        onChange={e => setScaleRecommendation(e.target.value as ScaleRecommendation)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-white"
                      >
                        <option value="DIRECT_DEPARTMENT_PROCUREMENT">
                          Direct Department Procurement (GFR 173(i) Fast-Track without repeat RFP)
                        </option>
                        <option value="STATE_WIDE_EXPANSION">
                          State-Wide Maharashtra Adoption (All 36 Districts)
                        </option>
                        <option value="GEM_RUNWAY_LISTING">
                          Push to GeM Startup Runway (National Public Listing)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Independent Validation Remarks & Compliance Audit *
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/50"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 hover:scale-[1.02]"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span>Sign & Issue Formal Validation Certificate</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Stage 10: Scale-Up Pathways Bento Section */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Stage 10: Scaled Procurement Execution Pathways
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pathway 1: GFR 173(i) Direct Procurement */}
                  <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3 text-xs shadow-2xs">
                    <span className="font-bold text-emerald-950 flex items-center space-x-1.5 text-xs">
                      <Building className="w-4 h-4 text-emerald-700" />
                      <span>Pathway A: Direct Department Purchase</span>
                    </span>
                    <p className="text-emerald-800 leading-relaxed text-[11px]">
                      Under <strong>GFR 2017 Rule 173(i)</strong> and Maharashtra Startup Policy 2025 Section 5.3, the department is legally empowered to place direct commercial procurement orders without repeat tendering, citing the validated outcome certificate.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => alert('Scale dossier with GFR 173(i) justification generated for Department Standing Finance Committee.')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs transition-all hover:scale-[1.02]"
                      >
                        Generate GFR 173 Scale Dossier
                      </button>
                    </div>
                  </div>

                  {/* Pathway 2: GeM Startup Runway Push */}
                  <div className="p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-3 text-xs shadow-2xs">
                    <span className="font-bold text-blue-950 flex items-center space-x-1.5 text-xs">
                      <Share2 className="w-4 h-4 text-blue-700" />
                      <span>Pathway B: GeM Startup Runway Integration</span>
                    </span>
                    <p className="text-blue-800 leading-relaxed text-[11px]">
                      Push product catalog specification directly to <strong>Government e-Marketplace (GeM) Startup Runway</strong>, enabling all Central ministries and other state governments to buy the validated innovation.
                    </p>
                    <div className="pt-2">
                      {gemPushSuccess ? (
                        <div className="p-2.5 bg-blue-100 text-blue-900 rounded-xl text-center font-bold text-[11px] font-mono border border-blue-200">
                          ✓ Published to GeM Startup Runway (ID: GEM-RUNWAY-MH-2025)
                        </div>
                      ) : (
                        <button
                          onClick={handleGeMPush}
                          disabled={isPushingGeM}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs transition-all hover:scale-[1.02]"
                        >
                          {isPushingGeM ? 'Publishing to GeM...' : 'Push to GeM Startup Runway'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
