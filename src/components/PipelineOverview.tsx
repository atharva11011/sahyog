import React from 'react';
import {
  FileCode,
  Search,
  CheckCircle,
  Award,
  Box,
  FileSignature,
  Activity,
  CreditCard,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { User, Challenge, Pilot, Application } from '../types';

interface PipelineOverviewProps {
  currentUser: User;
  challenges: Challenge[];
  applications: Application[];
  pilots: Pilot[];
  onNavigateToStage: (stageIndex: number) => void;
  onOpenCreateChallenge: () => void;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({
  currentUser,
  challenges,
  applications,
  pilots,
  onNavigateToStage,
  onOpenCreateChallenge,
}) => {
  const stages = [
    {
      step: 1,
      name: 'Challenge Identification',
      sub: 'Outcome-based problem definition',
      legalBasis: 'Maharashtra Startup Policy 2025',
      icon: FileCode,
      color: 'from-amber-500 to-orange-600',
      activeCount: `${challenges.length} Challenges`,
      details: 'Department defines measurable baseline metric, target outcome, budget ceiling, data sensitivity.',
      tab: 'challenges',
    },
    {
      step: 2,
      name: 'Startup Discovery',
      sub: 'Capability & sector tag matching',
      legalBasis: 'Open Grand Challenge portal',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      activeCount: 'Active Matching',
      details: 'Startups browse open challenges with semantic capability scoring based on sector and tech tags.',
      tab: 'challenges',
    },
    {
      step: 3,
      name: 'Eligibility Screening',
      sub: 'DPIIT auto-check & GFR 173 waiver',
      legalBasis: 'GFR 2017 Rule 173(i) & Rule 170',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      activeCount: `${applications.filter(a => a.gfrTurnoverRelaxed).length} GFR Waivers`,
      details: 'Automated lookup against DPIIT registry; waives prior turnover and experience; waives EMD deposit.',
      tab: 'challenges',
    },
    {
      step: 4,
      name: 'Expert Evaluation',
      sub: 'Multi-evaluator blind scoring',
      legalBasis: 'CVC Procurement Matrix (5 params)',
      icon: Award,
      color: 'from-purple-500 to-violet-600',
      activeCount: '3-Way Blind Rubric',
      details: 'Weighted scoring across Tech (25%), Team (20%), Outcome (25%), Cost (15%), Security (15%).',
      tab: 'evaluations',
    },
    {
      step: 5,
      name: 'Sandbox / Pilot Design',
      sub: 'Phased risk-bounded structure',
      legalBasis: 'Phase 0 (4-6w) → Phase 1 (8-12w)',
      icon: Box,
      color: 'from-cyan-500 to-blue-600',
      activeCount: `${pilots.length} Active Sandboxes`,
      details: 'Controlled sandbox with synthetic/bounded data and fixed grant before live field rollout.',
      tab: 'pilots',
    },
    {
      step: 6,
      name: 'Milestone Contracting',
      sub: 'Auto-generated agreement & e-sign',
      legalBasis: 'Indian Contract Act & IT Act 2000',
      icon: FileSignature,
      color: 'from-rose-500 to-pink-600',
      activeCount: 'Tripartite Agrmt',
      details: 'Auto-generates pilot agreement from versioned templates with IP configurations and e-signoff.',
      tab: 'pilots',
    },
    {
      step: 7,
      name: 'Performance Measurement',
      sub: 'Live KPI telemetry vs baseline',
      legalBasis: 'Stage-1 baseline tracking',
      icon: Activity,
      color: 'from-amber-500 to-yellow-600',
      activeCount: 'Real-time KPIs',
      details: 'Live status flags (On-Track, At-Risk, Breached) comparing ongoing field results to baseline.',
      tab: 'pilots',
    },
    {
      step: 8,
      name: 'Milestone Payment',
      sub: 'Treasury / PFMS disbursement',
      legalBasis: '15-Day Treasury SLA',
      icon: CreditCard,
      color: 'from-emerald-600 to-green-700',
      activeCount: 'PFMS Direct Credit',
      details: 'Automated payment triggers linked to officer verification, eliminating 180-day bill pendency.',
      tab: 'pilots',
    },
    {
      step: 9,
      name: 'Independent Validation',
      sub: 'Third-party STQC outcome audit',
      legalBasis: 'Independent Certifier',
      icon: BadgeCheck,
      color: 'from-indigo-600 to-blue-800',
      activeCount: 'SHA-256 Cert',
      details: 'Separate reviewer not part of the pilot certifies actual metric delivery with cryptographic proof.',
      tab: 'scale',
    },
    {
      step: 10,
      name: 'Scale-Up Decision',
      sub: 'GFR 173 direct procurement / GeM',
      legalBasis: 'GFR 173(i) & GeM Runway',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-700',
      activeCount: 'Fast-Track Procurement',
      details: 'Direct departmental scale-up without repeat tendering or national listing on GeM Startup Runway.',
      tab: 'scale',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bento Hero Banner with Policy Badges & Asymmetric Stat Modules */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full font-mono text-[11px] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>SIH Problem 26136</span>
              </span>
              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full font-mono text-[11px] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>GFR 2017 Rule 173(i) Relaxations Enforced</span>
              </span>
              <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 px-3 py-0.5 rounded-full font-mono text-[11px]">
                MSInS Policy 2025
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              End-to-End Startup Procurement Pathway
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Demolishing the 18-month government procurement bottleneck for innovative startups.
              Outcome-based challenges, automatic DPIIT eligibility waivers, multi-evaluator blind scoring,
              structured sandbox grants, milestone-triggered PFMS disbursements, and direct scale transitions.
            </p>

            {/* Micro-Metrics Bento Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Cycle Time</span>
                <span className="text-sm font-bold text-amber-300 font-mono">15-Day SLA</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">EMD Required</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">₹0 (Rule 170)</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Prior Turnover</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">Waived (173-i)</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Fast-Track</span>
                <span className="text-sm font-bold text-indigo-300 font-mono">GeM Runway</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[230px] shrink-0">
            {currentUser.role === 'DEPARTMENT_OFFICIAL' ? (
              <button
                onClick={onOpenCreateChallenge}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm hover:scale-[1.02]"
              >
                <span>+ Post New Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onNavigateToStage(1)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm hover:scale-[1.02]"
              >
                <span>Browse Grand Challenges</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center space-x-3 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-white block text-[11px] uppercase tracking-wider">Active Persona</span>
                <span className="text-slate-300 font-medium truncate block">{currentUser.name}</span>
                <span className="text-[10px] text-amber-300/80 font-mono block">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Stage Pipeline Bento Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                The 10-Stage Procurement Highway
              </h2>
              <span className="text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200/80 px-2 py-0.5 rounded-full">
                Interactive Modules
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any stage below to inspect live data, role workflows, and legal compliance artifacts
            </p>
          </div>
          <div className="text-[11px] font-mono font-medium bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-xs hidden sm:block">
            Stages 1 → 10 Pipeline
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stages.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                onClick={() => onNavigateToStage(s.step)}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-4.5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-orange-100 text-slate-800 group-hover:text-orange-700 font-bold text-xs flex items-center justify-center transition-colors font-mono">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                      {s.legalBasis}
                    </span>
                  </div>

                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {s.name}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {s.sub}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {s.details}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-mono">
                    {s.activeCount}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statutory Directives Bento Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 text-xs text-amber-900 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                Statutory Procurement Directives Baked Into Engine
              </span>
              <span className="bg-amber-200/60 text-amber-900 font-mono font-bold text-[10px] px-2 py-0.2 rounded-full">
                Legally Binding
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-amber-900/90 text-xs">
              <div className="bg-white/60 rounded-xl p-2.5 border border-amber-200/60">
                <span className="font-bold text-amber-950 block text-[11px]">GFR 2017 Rule 173(i)</span>
                <span className="text-[11px] text-amber-800">Prior turnover and prior experience criteria automatically waived for DPIIT-recognised startups.</span>
              </div>
              <div className="bg-white/60 rounded-xl p-2.5 border border-amber-200/60">
                <span className="font-bold text-amber-950 block text-[11px]">GFR 2017 Rule 170</span>
                <span className="text-[11px] text-amber-800">Earnest Money Deposit (EMD) / Bid security 100% exempt for all verified startups.</span>
              </div>
              <div className="bg-white/60 rounded-xl p-2.5 border border-amber-200/60">
                <span className="font-bold text-amber-950 block text-[11px]">Maharashtra Policy 2025</span>
                <span className="text-[11px] text-amber-800">Safe harbor indemnity for departmental officers deploying outcome sandbox pilots.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
