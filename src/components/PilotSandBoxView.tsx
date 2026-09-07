import React, { useState } from 'react';
import {
  Box,
  FileSignature,
  Activity,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  IndianRupee,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Pilot, Milestone, User } from '../types';

interface PilotSandBoxViewProps {
  pilots: Pilot[];
  currentUser: User;
  onUpdateMilestone: (pilotId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  onDisbursePayment: (pilotId: string, milestoneId: string) => void;
  onSignContract: (pilotId: string, role: string) => void;
  onGoToScale: (pilot: Pilot) => void;
}

export const PilotSandBoxView: React.FC<PilotSandBoxViewProps> = ({
  pilots,
  currentUser,
  onUpdateMilestone,
  onDisbursePayment,
  onSignContract,
  onGoToScale,
}) => {
  const [selectedPilotId, setSelectedPilotId] = useState<string>(
    pilots[0]?.id || ''
  );

  const selectedPilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'PHASE_0_FEASIBILITY':
        return (
          <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded">
            Phase 0: Feasibility Sandbox (4-6w)
          </span>
        );
      case 'PHASE_1_PILOT':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
            Phase 1: Bounded Live Pilot (8-12w)
          </span>
        );
      case 'PHASE_2_SCALE_DECISION':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
            Phase 2: Scale Transition
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISBURSED':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Disbursed via PFMS</span>
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>KPI On-Track</span>
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>At Risk</span>
          </span>
        );
      case 'BREACHED':
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
            KPI Breached
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
            Pending Execution
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Stages 5–8: Sandbox Pilot Execution & Milestone Payments
            </h2>
            <span className="text-xs bg-cyan-50 text-cyan-800 font-bold px-3 py-0.5 rounded-full border border-cyan-200/80 font-mono">
              Phased Grants & 15-Day PFMS SLA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stage 5 Sandbox Design → Stage 6 Tripartite Contracting → Stage 7 Live KPI Telemetry → Stage 8 Treasury Disbursements.
          </p>
        </div>
      </div>

      {/* Main Container Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Pilots Bento Box */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Active Pilot Deployments ({pilots.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Select Pilot</span>
          </div>

          <div className="space-y-2.5">
            {pilots.map(p => {
              const isSelected = p.id === selectedPilot?.id;
              const completedCount = p.milestones.filter(m => m.status === 'DISBURSED').length;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPilotId(p.id)}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50/60 border-cyan-400 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-cyan-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {getPhaseBadge(p.phase)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {p.contractTemplateVer}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 tracking-tight">
                    {p.challengeTitle}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {p.startupName}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px] font-mono">
                      Milestones: {completedCount}/{p.milestones.length}
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      ₹{(p.disbursedAmount / 100000).toFixed(1)} / ₹{(p.totalGrantAmount / 100000).toFixed(1)}L Disbursed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Pilot Details Bento Card */}
        <div className="lg:col-span-8 space-y-5">
          {selectedPilot && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              {/* Pilot Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    {getPhaseBadge(selectedPilot.phase)}
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedPilot.departmentName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedPilot.challengeTitle}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Awarded Startup: <strong className="text-slate-900">{selectedPilot.startupName}</strong>
                  </div>
                </div>

                {/* Transition to Stage 9/10 if all milestones or ready */}
                <button
                  onClick={() => onGoToScale(selectedPilot)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto hover:scale-[1.02]"
                >
                  <span>Stage 9: Validation & Scale Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stage 6: Tripartite Pilot Agreement Status & E-Sign Bento Inner Module */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4.5 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileSignature className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Stage 6: Tripartite Pilot Agreement & IP Terms
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Hash: {selectedPilot.contractHash?.substring(0, 16)}...
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Legally binding agreement incorporating <strong>IP Configuration Option A</strong> (Startup retains algorithm IP; State receives perpetual non-exclusive use license) and safe-harbor indemnification for technical innovation failure.
                </p>

                {/* E-Sign Controls Bento Submodules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">Department E-Sign:</span>
                      <span className="text-[10px] text-slate-500">Principal Secretary (Public Health)</span>
                    </div>
                    {selectedPilot.eSignedByDepartment ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Signed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onSignContract(selectedPilot.id, 'DEPARTMENT_OFFICIAL')}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                      >
                        Sign as Dept
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">Startup E-Sign:</span>
                      <span className="text-[10px] text-slate-500">Founder & CEO</span>
                    </div>
                    {selectedPilot.eSignedByStartup ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Signed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onSignContract(selectedPilot.id, 'STARTUP')}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                      >
                        Sign as Startup
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stage 7 & 8: Milestones & Payment Tranches Bento Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Stage 7 & 8: Live Milestones, KPI Tracking & PFMS Payments
                    </h4>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-3 py-0.5 rounded-full font-mono">
                    Total Grant: ₹{(selectedPilot.totalGrantAmount / 100000).toFixed(1)} Lakhs
                  </div>
                </div>

                {/* Milestone Bento Cards */}
                <div className="space-y-3">
                  {selectedPilot.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-4.5 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-3.5 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center font-mono shadow-2xs">
                            M{m.orderIndex}
                          </span>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900 tracking-tight">{m.title}</h5>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Tranche: ₹{(m.trancheAmount / 100000).toFixed(1)} Lakhs • Due: {new Date(m.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div>{getStatusBadge(m.status)}</div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>

                      {/* KPI Telemetry vs Baseline Box */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs space-y-2 shadow-2xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">
                            <strong>Baseline:</strong> {m.baselineMetric}
                          </span>
                          <span className="text-slate-500">
                            <strong>Target:</strong> {m.targetMetric}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-800">
                              Current Telemetry:
                            </span>
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono text-[11px]">
                              {m.currentMetric || 'In Progress'}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-700">
                            {m.kpiProgressPct}% Achieved
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${m.kpiProgressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Payment Disbursement Trigger (Stage 8) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="text-slate-500 text-[11px]">
                          {m.pfmsRefId ? (
                            <span className="font-mono text-emerald-700 font-medium">
                              PFMS Ref: {m.pfmsRefId} (Disbursed: {new Date(m.disbursedAt || '').toLocaleDateString()})
                            </span>
                          ) : (
                            <span>Awaiting departmental milestone sign-off for automated PFMS release</span>
                          )}
                        </div>

                        {m.status !== 'DISBURSED' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                onUpdateMilestone(selectedPilot.id, m.id, {
                                  kpiProgressPct: 100,
                                  status: 'ON_TRACK',
                                  currentMetric: 'Verified by Field Inspector',
                                });
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 rounded-xl font-medium text-[11px] transition-colors shadow-2xs"
                            >
                              Update Telemetry
                            </button>

                            {(currentUser.role === 'DEPARTMENT_OFFICIAL' || currentUser.role === 'MSINS_ADMIN') && (
                              <button
                                onClick={() => onDisbursePayment(selectedPilot.id, m.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] shadow-xs transition-colors flex items-center space-x-1 hover:scale-[1.02]"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Release PFMS Tranche</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
