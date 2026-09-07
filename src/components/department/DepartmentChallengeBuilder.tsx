import React, { useState } from 'react';
import {
  FileText,
  Target,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle,
  Clock,
  IndianRupee,
  Users,
  Send,
  Save,
  Check,
} from 'lucide-react';
import { Challenge, ChallengeStatus, DataSensitivity, Department } from '../../types';

interface DepartmentChallengeBuilderProps {
  department: Department;
  onChallengeCreated: (challenge: Challenge) => void;
  onCancel: () => void;
}

const SECTOR_OPTIONS = [
  'Healthcare & MedTech',
  'Clean Tech & Water',
  'AgriTech & Remote Sensing',
  'Urban Governance & Smart Mobility',
  'Education & Skilling',
  'Cybersecurity & GovTech',
  'Renewable Energy & Power',
  'Rural Development & Panchayati Raj',
];

export const DepartmentChallengeBuilder: React.FC<DepartmentChallengeBuilderProps> = ({
  department,
  onChallengeCreated,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Healthcare & MedTech');
  const [problemDescription, setProblemDescription] = useState('');
  const [outcomeGoal, setOutcomeGoal] = useState('');
  const [baselineMetric, setBaselineMetric] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [budgetCeiling, setBudgetCeiling] = useState('3500000');
  const [timelineWeeks, setTimelineWeeks] = useState('12');
  const [dataSensitivity, setDataSensitivity] = useState<DataSensitivity>('MEDIUM_RESTRICTED');
  const [gfrRule173Applied, setGfrRule173Applied] = useState(true);
  const [gfrRule170Applied, setGfrRule170Applied] = useState(true);
  const [eligibilityCustomRequirements, setEligibilityCustomRequirements] = useState(
    'Demonstrated working edge prototype with local Marathi language UI support. ABDM compliance.'
  );
  const [allowNonOfficialEvaluators, setAllowNonOfficialEvaluators] = useState(true);
  const [minEvaluatorsRequired, setMinEvaluatorsRequired] = useState(3);
  const [tagsInput, setTagsInput] = useState('AI/ML, Edge Computing, Public Health, Rural Health');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([
    'PHC_Field_Operation_Specifications_2025.pdf',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatLakhs = (val: string) => {
    const num = Number(val);
    if (isNaN(num)) return '₹ 0';
    return `₹ ${(num / 100000).toFixed(2)} Lakhs (INR ${num.toLocaleString('en-IN')})`;
  };

  const handleAddAttachment = () => {
    const docName = `Reference_Technical_Guidance_${attachedFiles.length + 1}.pdf`;
    setAttachedFiles([...attachedFiles, docName]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (submitStatus: ChallengeStatus) => {
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Challenge title is required.');
      return;
    }
    if (!problemDescription.trim()) {
      setErrorMsg('Problem description is required.');
      return;
    }
    if (!outcomeGoal.trim()) {
      setErrorMsg('Outcome-based goal statement ("What success looks like") is required.');
      return;
    }
    if (!baselineMetric.trim() || !targetOutcome.trim()) {
      setErrorMsg('Both baseline metric (current state) and target outcome (desired state) are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        department: department.name,
        departmentId: department.id,
        sector,
        problemDescription: problemDescription.trim(),
        outcomeGoal: outcomeGoal.trim(),
        baselineMetric: baselineMetric.trim(),
        targetOutcome: targetOutcome.trim(),
        budgetCeiling: Number(budgetCeiling) || 3500000,
        timelineWeeks: Number(timelineWeeks) || 12,
        dataSensitivity,
        gfrRule173Applied,
        gfrRule170Applied,
        eligibilityCustomRequirements: eligibilityCustomRequirements.trim(),
        allowNonOfficialEvaluators,
        minEvaluatorsRequired,
        status: submitStatus,
        tags,
        creatorId: department.officials?.[0]?.id || 'usr_dept_01',
        creatorName: department.officials?.[0]?.name || department.nodalOfficialName,
        creatorRoleInDept: department.officials?.[0]?.roleInDept || 'ADMIN',
        attachments: attachedFiles.map((f, i) => ({
          id: `att_${Date.now()}_${i}`,
          ownerType: 'CHALLENGE',
          ownerId: 'new_challenge',
          title: f.replace('.pdf', ''),
          docType: 'CHALLENGE_SPEC',
          fileName: f,
          fileSize: '1.8 MB',
          verificationStatus: 'VERIFIED',
          uploadedAt: new Date().toISOString(),
        })),
      };

      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create challenge');
      }

      const createdChallenge = await res.json();
      setIsSubmitting(false);
      onChallengeCreated(createdChallenge);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error publishing challenge');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-800 border border-blue-600 flex items-center justify-center text-amber-300">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Department Problem Statement Publisher
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Guided Challenge Builder (GFR Rule 173(i) Milestone Framework)
            </h2>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Guidance banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">
              Outcome-Based Problem Statement Guidance
            </p>
            <p className="mt-0.5 leading-relaxed text-slate-600">
              Under Maharashtra Startup Procurement guidelines, challenges must be framed around{' '}
              <span className="font-semibold text-slate-800">measurable field outcomes</span> rather than rigid technological specifications. This permits startups to propose creative solutions while guaranteeing quantifiable improvements for the state.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2.5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Core Problem & Sector */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Challenge Title & Thematic Category
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI Automated Early Diabetic Retinopathy Screening in Rural PHCs"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sector / Thematic Domain *
                </label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                >
                  {SECTOR_OPTIONS.map(sec => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issuing Department
                </label>
                <input
                  type="text"
                  disabled
                  value={department.name}
                  className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Problem Description (The Real-World Operational Challenge) *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail the operational pain points in rural/urban field offices, historical impediments, why standard solutions have not succeeded..."
                value={problemDescription}
                onChange={e => setProblemDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Outcome-Based Goal Statement & Metrics */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-700" />
              <span>2. Outcome Goal & Performance Metrics</span>
            </h3>
            <span className="text-[11px] text-blue-700 font-semibold">Statutory GFR 173 Requirement</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Outcome-Based Goal Statement ("What Success Looks Like") *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Field-portable diagnostic triaging under 90 seconds with >94% sensitivity without requiring persistent internet or specialized ophthalmologists on site."
                value={outcomeGoal}
                onChange={e => setOutcomeGoal(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-blue-50/40 border border-blue-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700 leading-relaxed font-medium text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Frame what the department needs solved rather than specifying brand names or specific hardware architectures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Baseline Metric (Current State) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mean turnaround 19 days; 1.2 ophthalmologists per 100k residents"
                  value={baselineMetric}
                  onChange={e => setBaselineMetric(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Outcome Metric (Desired State) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Point-of-care triaging < 90 secs, > 94% clinical sensitivity, 100% offline"
                  value={targetOutcome}
                  onChange={e => setTargetOutcome(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Budget, Timeline & Data Sensitivity */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              3. Commercial Ceiling & Security Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Budget Ceiling (INR) *
                </label>
              </div>
              <input
                type="number"
                step={50000}
                required
                value={budgetCeiling}
                onChange={e => setBudgetCeiling(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 font-semibold"
              />
              <p className="text-[11px] text-blue-700 font-bold mt-1">
                {formatLakhs(budgetCeiling)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilot Timeline Expectation *
              </label>
              <select
                value={timelineWeeks}
                onChange={e => setTimelineWeeks(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
              >
                <option value="8">8 Weeks (2 Months Rapid Prototype)</option>
                <option value="12">12 Weeks (3 Months Standard Pilot)</option>
                <option value="16">16 Weeks (4 Months Extensive Field Test)</option>
                <option value="24">24 Weeks (6 Months Multi-District)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data Sensitivity Classification *
              </label>
              <select
                value={dataSensitivity}
                onChange={e => setDataSensitivity(e.target.value as DataSensitivity)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
              >
                <option value="LOW_PUBLIC">Public Data (No Personal Info)</option>
                <option value="MEDIUM_RESTRICTED">Internal / Restricted (Department Use)</option>
                <option value="HIGH_CONFIDENTIAL">Highly Confidential (DPDP / Health / Identity)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Eligibility & GFR Relaxations */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              4. Eligibility Criteria & Statutory Waivers
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold">GFR Rule 173(i) Active</span>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-3">
            <div className="flex items-center space-x-2 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Mandatory GFR Exemptions Applied for DPIIT Recognised Startups:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gfrRule173Applied}
                  onChange={e => setGfrRule173Applied(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="font-semibold text-slate-900">GFR Rule 173(i) Waiver</span>
                  <p className="text-[11px] text-slate-500">
                    Exemption from prior turnover and prior experience criteria for certified DPIIT startups.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gfrRule170Applied}
                  onChange={e => setGfrRule170Applied(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="font-semibold text-slate-900">GFR Rule 170 Waiver</span>
                  <p className="text-[11px] text-slate-500">
                    100% Earnest Money Deposit (EMD / Bid Security) waiver for DPIIT startups.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-emerald-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Sector Qualifications / Team & Technical Constraints (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Must have working edge AI prototype, minimum 3 core engineering team members, ABDM compliance..."
                value={eligibilityCustomRequirements}
                onChange={e => setEligibilityCustomRequirements(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Evaluator Panel Setup */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span>5. Evaluator Panel Configuration</span>
            </h3>
            <span className="text-[11px] text-amber-700 font-semibold">Min 1 Official Evaluator Mandated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowNonOfficialEvaluators}
                  onChange={e => setAllowNonOfficialEvaluators(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-800 focus:ring-blue-700"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Allow Non-Official Evaluators (Optional)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Allows empanelling external industry specialists or academic reviewers (e.g. IIT/COEP/Industry CTOs). Each non-official evaluator requires explicit department toggle approval.
                  </p>
                </div>
              </label>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Minimum Committee Panel Size
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quorum requirement before unblinding Round 1 scores.
                </p>
              </div>
              <select
                value={minEvaluatorsRequired}
                onChange={e => setMinEvaluatorsRequired(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg"
              >
                <option value={2}>2 Evaluators</option>
                <option value={3}>3 Evaluators (Recommended)</option>
                <option value={4}>4 Evaluators</option>
                <option value={5}>5 Evaluators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 6: Tags & Attachments */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              6. Semantic Discovery Tags & Technical Attachments
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search & Matching Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Attached Reference Specifications & Problem Background Docs ({attachedFiles.length})
              </label>
              <button
                type="button"
                onClick={handleAddAttachment}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center"
              >
                <Paperclip className="w-3.5 h-3.5 mr-1" />
                Attach PDF Specification
              </button>
            </div>

            <div className="space-y-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="font-mono text-slate-800">{file}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">1.8 MB PDF</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel & Discard
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('DRAFT')}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('SUBMITTED_FOR_REVIEW')}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for MSInS Review</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('APPLICATIONS_OPEN')}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publish Challenge Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
