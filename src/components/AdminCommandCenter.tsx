import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Challenge, Pilot, Application } from '../types';

interface AdminCommandCenterProps {
  challenges: Challenge[];
  pilots: Pilot[];
  applications: Application[];
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  challenges,
  pilots,
  applications,
}) => {
  const totalGrantCommitted = pilots.reduce((acc, p) => acc + p.totalGrantAmount, 0);
  const totalDisbursed = pilots.reduce((acc, p) => acc + p.disbursedAmount, 0);
  const certifiedCount = pilots.filter(p => p.validationRecord?.outcomeCertified).length;
  const successRate = pilots.length > 0 ? Math.round((certifiedCount / pilots.length) * 100) : 100;
  const uniqueDepartments = Array.from(new Set(challenges.map(c => c.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              MSInS State Innovation Command Center
            </h2>
            <span className="text-xs bg-slate-900 text-amber-300 font-bold px-3 py-0.5 rounded-full font-mono shadow-2xs">
              Nodal Authority Oversight
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cross-department pilot tracker, procurement velocity benchmarks, and statutory GFR compliance telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Benchmark SLA:</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full font-mono text-[11px]">
            4.8 Days Avg Payment (vs 180 Days Conventional)
          </span>
        </div>
      </div>

      {/* Top Metric Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Grant Committed Bento Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">Pilot Sandbox Grants</span>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                Active
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ₹{(totalGrantCommitted / 100000).toFixed(1)} Lakhs
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span>Disbursed:</span>
            <span className="font-mono font-bold text-slate-800">
              ₹{(totalDisbursed / 100000).toFixed(1)}L ({Math.round((totalDisbursed / (totalGrantCommitted || 1)) * 100)}%)
            </span>
          </div>
        </div>

        {/* Metric 2: GFR 173 Waivers Bento Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">GFR 173(i) Exemptions</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
              {applications.filter(a => a.gfrTurnoverRelaxed).length} Startups
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 font-medium">
            100% DPIIT Turnovers Waived
          </div>
        </div>

        {/* Metric 3: Outcome Success Rate Bento Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">Independent Validation Rate</span>
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {successRate}%
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
            {certifiedCount} of {pilots.length} Formally Certified
          </div>
        </div>

        {/* Metric 4: Departments Engaged Bento Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">Departments Engaged</span>
              <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {uniqueDepartments.length} Departments
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
            Across 36 Maharashtra Districts
          </div>
        </div>
      </div>

      {/* Cross-Department Tracker Table Bento Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Cross-Department Outcome Tracker & Procurement Pipeline
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Stage Updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/70 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5 font-semibold">Challenge & Code</th>
                <th className="py-3 px-3.5 font-semibold">Department</th>
                <th className="py-3 px-3.5 font-semibold">Sector</th>
                <th className="py-3 px-3.5 font-semibold">Grant Budget</th>
                <th className="py-3 px-3.5 font-semibold">Current Stage</th>
                <th className="py-3 px-3.5 font-semibold">GFR Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {challenges.map(ch => {
                const pilotForThis = pilots.find(p => p.challengeId === ch.id);
                return (
                  <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3.5 font-semibold text-slate-900">
                      <div className="font-mono text-[10px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded w-fit mb-0.5">{ch.code}</div>
                      <div className="line-clamp-1">{ch.title}</div>
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600">{ch.department}</td>
                    <td className="py-3.5 px-3.5">
                      <span className="bg-slate-100/80 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                        {ch.sector}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900">
                      ₹{(ch.budgetCeiling / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono border border-slate-200/60">
                        {pilotForThis ? pilotForThis.phase.replace('_', ' ') : ch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-emerald-700 font-semibold text-[11px]">
                      {ch.gfrRule173Applied ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-mono text-[10px]">
                          ✓ GFR 173(i) Active
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
