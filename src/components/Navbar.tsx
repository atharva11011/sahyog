import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Rocket,
  Award,
  FileText,
  History,
  Bell,
  CheckCircle2,
  ChevronDown,
  Layers,
  Scale,
  Plus,
  TrendingUp,
  X,
  ExternalLink,
} from 'lucide-react';
import { User, Role, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTemplates: () => void;
  onOpenAuditLogs: () => void;
  notifications: NotificationItem[];
  onOpenCreateChallenge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  activeTab,
  setActiveTab,
  onOpenTemplates,
  onOpenAuditLogs,
  notifications,
  onOpenCreateChallenge,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { role: Role; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      role: 'DEPARTMENT_OFFICIAL',
      label: 'Department Official',
      sub: 'Public Health Dept, Govt of Maharashtra',
      icon: Building2,
    },
    {
      role: 'STARTUP',
      label: 'DPIIT Startup',
      sub: 'NetraAI Health Systems Pvt Ltd',
      icon: Rocket,
    },
    {
      role: 'EVALUATOR',
      label: 'Domain Evaluator',
      sub: 'IIT Bombay / Health AI Center',
      icon: Award,
    },
    {
      role: 'MSINS_ADMIN',
      label: 'MSInS Nodal Lead',
      sub: 'Maharashtra State Innovation Society',
      icon: ShieldCheck,
    },
    {
      role: 'INDEPENDENT_VALIDATOR',
      label: 'Independent Validator',
      sub: 'STQC Certified Quality Auditor',
      icon: Scale,
    },
  ];

  const currentRoleConfig = roles.find(r => r.role === currentUser.role);
  const RoleIcon = currentRoleConfig ? currentRoleConfig.icon : Building2;

  const navTabs = [
    { id: 'pipeline', label: '10-Stage Pipeline', icon: Layers, stage: 'Overview' },
    { id: 'department', label: 'Department Module', icon: Building2, stage: 'SIH 26136' },
    { id: 'challenges', label: 'Grand Challenges', icon: Rocket, stage: 'Stages 1-3' },
    { id: 'evaluations', label: 'Blind Evaluation', icon: Award, stage: 'Stage 4' },
    { id: 'pilots', label: 'Sandboxes & Pilots', icon: CheckCircle2, stage: 'Stages 5-8' },
    { id: 'scale', label: 'Validation & Scale-Up', icon: TrendingUp, stage: 'Stages 9-10' },
    { id: 'command-center', label: 'Command Center', icon: ShieldCheck, stage: 'Nodal Oversight' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Top Gov Ribbon - Official Govt of Maharashtra Banner */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="flex items-center space-x-2 font-semibold text-amber-400 text-[11px] sm:text-xs shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-tight">महाराष्ट्र शासन • Govt of Maharashtra</span>
          </div>
          <span className="text-slate-700 hidden md:inline shrink-0">/</span>
          <span className="text-slate-400 hidden md:inline text-[11px] font-medium truncate">
            Maharashtra State Innovation Society (MSInS) • SIH Problem Statement 26136
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] shrink-0">
          <span className="inline-flex items-center space-x-1.5 bg-emerald-950/90 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700/60 font-mono text-[10px] font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>GFR 173(i) & 170 Active</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">v2.5 GovTech</span>
        </div>
      </div>

      {/* Main Brand & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Emblem & Portal Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('pipeline')}
            title="Navigate to 10-Stage Pipeline Overview"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-xs font-bold text-lg tracking-wider border border-orange-400/60 group-hover:scale-105 transition-transform shrink-0">
              सं
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2 pt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-normal">
                  सहयोग • Sahayog
                </span>
                <span className="text-[10px] bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded-full border border-orange-200/80 uppercase tracking-wider font-mono">
                  MSInS GovTech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block leading-tight">
                Transparent Outcome-Based Startup Procurement Mechanism
              </p>
            </div>
          </div>

          {/* Right Utilities & Role Persona Switcher */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Create Challenge Quick Action for Dept Official */}
            {currentUser.role === 'DEPARTMENT_OFFICIAL' && (
              <button
                onClick={onOpenCreateChallenge}
                className="inline-flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all hover:scale-[1.02]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Post Challenge</span>
                <span className="sm:hidden">Post</span>
              </button>
            )}

            {/* Template Library */}
            <button
              onClick={onOpenTemplates}
              title="Versioned Model Templates & Legal Frameworks"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 rounded-xl text-xs font-semibold border border-slate-200/80 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Templates</span>
            </button>

            {/* Audit Trail */}
            <button
              onClick={onOpenAuditLogs}
              title="Immutable GFR & Compliance Audit Trail"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 rounded-xl text-xs font-semibold border border-slate-200/80 transition-colors shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                }}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 rounded-xl border border-slate-200/80 relative transition-colors shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Procurement Alerts
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {notifications.length} updates
                        </span>
                        <button
                          onClick={() => setShowNotifMenu(false)}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2">
                      {notifications.map(n => (
                        <div key={n.id} className="py-2.5 px-1 text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Active Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center space-x-2 sm:space-x-2.5 bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 text-xs transition-all shadow-2xs"
                title="Switch Demo Role Persona"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="font-bold text-slate-900 text-xs whitespace-nowrap">
                    {currentRoleConfig?.label || currentUser.role}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                    {currentUser.name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        Switch Persona (5 Demo Roles)
                      </span>
                      <button
                        onClick={() => setShowRoleMenu(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="py-1.5">
                      {roles.map(r => {
                        const Icon = r.icon;
                        const isCurrent = currentUser.role === r.role;
                        return (
                          <button
                            key={r.role}
                            onClick={() => {
                              onSelectRole(r.role);
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 transition-colors ${
                              isCurrent
                                ? 'bg-orange-50/80 text-orange-950 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isCurrent ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs flex items-center justify-between">
                                <span className="font-bold">{r.label}</span>
                                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">{r.sub}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation: Bento Workflow Stages & Tabs */}
      <div className="border-t border-slate-200/70 bg-slate-50/70 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? tab.id === 'command-center'
                        ? 'bg-slate-900 text-amber-300 shadow-xs border border-slate-800 font-bold'
                        : 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? tab.id === 'command-center' ? 'text-amber-300' : 'text-orange-600'
                      : 'text-slate-400'
                  }`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full hidden md:inline-block ${
                    isActive
                      ? tab.id === 'command-center'
                        ? 'bg-slate-800 text-amber-300'
                        : 'bg-orange-100 text-orange-800'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {tab.stage}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
