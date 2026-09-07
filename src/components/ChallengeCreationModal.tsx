import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Plus,
  IndianRupee,
} from 'lucide-react';
import { Challenge, User, DataSensitivity } from '../types';

interface ChallengeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onChallengeCreated: (newChallenge: Challenge) => void;
}

export const ChallengeCreationModal: React.FC<ChallengeCreationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onChallengeCreated,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(
    currentUser.departmentName || 'Department of Public Health, Maharashtra'
  );
  const [sector, setSector] = useState('Healthcare & MedTech');
  const [problemDescription, setProblemDescription] = useState('');
  const [baselineMetric, setBaselineMetric] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [budgetCeiling, setBudgetCeiling] = useState('3500000');
  const [timelineWeeks, setTimelineWeeks] = useState('12');
  const [dataSensitivity, setDataSensitivity] = useState<DataSensitivity>('MEDIUM_RESTRICTED');
  const [gfrRule173Applied, setGfrRule173Applied] = useState(true);
  const [gfrRule170Applied, setGfrRule170Applied] = useState(true);
  const [tags, setTags] = useState('AI/ML, Edge Computing, Tele-Health, Rural PHCs');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill templates for easy demo testing
  const handleApplyPreset = (type: 'health' | 'water' | 'agri' | 'traffic') => {
    if (type === 'health') {
      setTitle('Point-of-Care Sickle Cell & Anemia Screening in Tribal Ashram Schools');
      setDepartment('Tribal Development & Public Health Dept, Maharashtra');
      setSector('Healthcare & MedTech');
      setProblemDescription(
        'Genetic sickle cell disease affects over 14% of tribal students in Nandurbar and Palghar. Lab chromatography testing takes 3 to 4 weeks to return results from district headquarters, delaying immediate hydroxyurea therapy.'
      );
      setBaselineMetric('Testing cycle 24 days; 30% patient loss to follow-up.');
      setTargetOutcome('Handheld point-of-care microfluidic test delivering results in < 15 minutes with > 95% specificity.');
      setBudgetCeiling('3000000');
      setTimelineWeeks('12');
      setDataSensitivity('HIGH_CONFIDENTIAL');
      setTags('Microfluidics, Point-of-Care, Tribal Health, BioSensors');
    } else if (type === 'water') {
      setTitle('Solar LoRaWAN Arsenic and Fluoride Ground Water Telemetry');
      setDepartment('Water Supply & Sanitation Department, Maharashtra');
      setSector('Clean Tech & Water');
      setProblemDescription(
        'High fluoride concentrations in Chandrapur borehole wells cause widespread dental and skeletal fluorosis. Quarterly manual sampling fails to detect dry-season concentration spikes.'
      );
      setBaselineMetric('Quarterly manual testing (every 90 days); zero real-time alerting.');
      setTargetOutcome('Submersible IoT sensor nodes reporting hourly fluoride parts-per-million to Gram Panchayat dashboards.');
      setBudgetCeiling('2500000');
      setTimelineWeeks('10');
      setDataSensitivity('MEDIUM_RESTRICTED');
      setTags('IoT, LoRaWAN, Water Quality, Fluoride, Jal Jeevan');
    } else if (type === 'agri') {
      setTitle('Hyperlocal Micro-Climate Frost & Pest Warning for Nashik Grape Vineyards');
      setDepartment('Department of Agriculture, Maharashtra');
      setSector('AgriTech & Remote Sensing');
      setProblemDescription(
        'Sudden unseasonal unseasonal frost and downy mildew outbreaks cost Nashik grape exporters over Rs 250 Cr each winter due to delayed ground weather warnings.'
      );
      setBaselineMetric('District-level broad forecasts (50km radius error margin).');
      setTargetOutcome('Canopy-level micro-weather IoT stations with predictive AI alerting farmers 48 hours in advance.');
      setBudgetCeiling('2800000');
      setTimelineWeeks('8');
      setDataSensitivity('LOW_PUBLIC');
      setTags('AgriTech, IoT, Grape Vineyards, Predictive AI, Export Quality');
    } else {
      setTitle('CCTV-Based Automated Pothole & Road Hazard Detection for MMRDA Arterials');
      setDepartment('Urban Development Department & MMRDA');
      setSector('Smart Cities & Mobility');
      setProblemDescription(
        'Monsoon road craters across 420km of Mumbai metropolitan highways cause recurring traffic bottlenecks and fatal two-wheeler accidents, relying solely on citizen Twitter grievances.'
      );
      setBaselineMetric('Citizen grievance response latency of 9.4 days.');
      setTargetOutcome('Automated dashcam and surveillance video inference geolocating potholes within 3 hours of surface rupture.');
      setBudgetCeiling('3800000');
      setTimelineWeeks('14');
      setDataSensitivity('MEDIUM_RESTRICTED');
      setTags('Computer Vision, Road Safety, MMRDA, Smart Cities, GIS');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !problemDescription || !baselineMetric || !targetOutcome) {
      alert('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          department,
          sector,
          problemDescription,
          baselineMetric,
          targetOutcome,
          budgetCeiling: parseFloat(budgetCeiling) || 3000000,
          timelineWeeks: parseInt(timelineWeeks) || 12,
          dataSensitivity,
          gfrRule173Applied,
          gfrRule170Applied,
          tags: tagArray,
          creatorId: currentUser.id,
          creatorName: currentUser.name,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onChallengeCreated(created);
        onClose();
      } else {
        alert('Failed to create challenge');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating challenge');
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
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Stage 1: Challenge Identification
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  GFR 173(i) Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Formulate an outcome-based problem statement with relaxed prior-turnover hurdles for startups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pre-fills for Demo */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-600 font-semibold flex items-center space-x-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Demo Maharashtra Grand Challenge:</span>
          </span>
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <button
              type="button"
              onClick={() => handleApplyPreset('health')}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80 text-slate-700 rounded-full font-medium text-[10px] transition-colors shadow-2xs"
            >
              Tribal Health Sickle Cell
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('water')}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80 text-slate-700 rounded-full font-medium text-[10px] transition-colors shadow-2xs"
            >
              Water Fluoride IoT
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('agri')}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80 text-slate-700 rounded-full font-medium text-[10px] transition-colors shadow-2xs"
            >
              Grape Vineyard AI
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('traffic')}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80 text-slate-700 rounded-full font-medium text-[10px] transition-colors shadow-2xs"
            >
              MMRDA Road Hazard
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Challenge Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AI Automated Early Retinopathy & Cataract Triaging in Rural PHCs"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden font-medium bg-slate-50/40"
              required
            />
          </div>

          {/* Department and Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Issuing Department *
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden bg-slate-50/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Domain Sector *
              </label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden bg-slate-50/40"
              >
                <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                <option value="Clean Tech & Water">Clean Tech & Water (Jal Jeevan)</option>
                <option value="AgriTech & Remote Sensing">AgriTech & Remote Sensing</option>
                <option value="Smart Cities & Mobility">Smart Cities & Mobility</option>
                <option value="Education & Skilling">Education & Skilling</option>
                <option value="Cybersecurity & GovTech">Cybersecurity & GovTech</option>
              </select>
            </div>
          </div>

          {/* Problem Statement Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Problem Description & Citizen Impact *
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="Detail the exact operational or citizen-facing bottleneck faced by the department..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden bg-slate-50/40"
              required
            />
          </div>

          {/* Outcome-Based Specification Bento Box: Baseline Metric vs Target Outcome */}
          <div className="p-4.5 bg-orange-50/50 border border-orange-200/70 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-950">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                ★
              </span>
              <span>Outcome-Based Procurement Specification (Replacing Rigid RFP Specs)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 text-[11px]">
                  1. Current Baseline Metric (Status Quo) *
                </label>
                <input
                  type="text"
                  value={baselineMetric}
                  onChange={e => setBaselineMetric(e.target.value)}
                  placeholder="e.g. Mean turnaround 19 days; 30% sample loss"
                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-orange-200 focus:border-orange-500 outline-hidden"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Measured prior to startup pilot deployment
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 text-[11px]">
                  2. Required Target Outcome (KPI for Payment) *
                </label>
                <input
                  type="text"
                  value={targetOutcome}
                  onChange={e => setTargetOutcome(e.target.value)}
                  placeholder="e.g. Turnaround < 90 secs, > 94% sensitivity"
                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-orange-200 focus:border-orange-500 outline-hidden"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Independently certified by 3rd party in Stage 9
                </span>
              </div>
            </div>
          </div>

          {/* Budget, Timeline, Data Sensitivity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Pilot Budget Ceiling (INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={budgetCeiling}
                  onChange={e => setBudgetCeiling(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden font-mono bg-slate-50/40"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Rs. {(parseInt(budgetCeiling || '0') / 100000).toFixed(1)} Lakhs
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Pilot Timeline (Weeks) *
              </label>
              <input
                type="number"
                value={timelineWeeks}
                onChange={e => setTimelineWeeks(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden font-mono bg-slate-50/40"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Phased: 4w Sandbox + 8w Live
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Data Sensitivity Level
              </label>
              <select
                value={dataSensitivity}
                onChange={e => setDataSensitivity(e.target.value as DataSensitivity)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden bg-slate-50/40"
              >
                <option value="LOW_PUBLIC">Low (Public Open Data)</option>
                <option value="MEDIUM_RESTRICTED">Medium (Restricted Dept Data)</option>
                <option value="HIGH_CONFIDENTIAL">High (Confidential Citizen/Health Data)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Capability & Sector Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-hidden bg-slate-50/40"
            />
          </div>

          {/* Statutory Policy Relaxations (Mandatory GFR Rules) */}
          <div className="p-4.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Statutory Procurement Directives Applied (SIH 26136 Mandates):
            </span>

            <div className="space-y-2 text-xs">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gfrRule173Applied}
                  onChange={e => setGfrRule173Applied(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">
                    GFR 2017 Rule 173(i) Relaxation (Mandatory for Startups)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Waives all requirements for past turnover and prior experience for DPIIT-recognised startups, evaluating purely on technical solution and quality specs.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gfrRule170Applied}
                  onChange={e => setGfrRule170Applied(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <span className="font-semibold text-slate-800">
                    GFR 2017 Rule 170 Bid Security (EMD) Exemption
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zero Earnest Money Deposit required from applying startups to ensure zero barrier to entry.
                  </p>
                </div>
              </label>
            </div>
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
              <span>{isSubmitting ? 'Publishing...' : 'Publish Grand Challenge (Stage 1)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
