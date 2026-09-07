import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PipelineOverview } from './components/PipelineOverview';
import { StartupDiscoveryView } from './components/StartupDiscoveryView';
import { ChallengeCreationModal } from './components/ChallengeCreationModal';
import { ApplicationModal } from './components/ApplicationModal';
import { EvaluationView } from './components/EvaluationView';
import { PilotSandBoxView } from './components/PilotSandBoxView';
import { ValidationAndScaleView } from './components/ValidationAndScaleView';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { TemplateLibraryModal } from './components/TemplateLibraryModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { DepartmentPortalView } from './components/department/DepartmentPortalView';

import {
  INITIAL_USERS,
  INITIAL_CHALLENGES,
  INITIAL_APPLICATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_PILOTS,
  INITIAL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './mockData/initialData';

import {
  User,
  Role,
  Challenge,
  Application,
  Evaluation,
  Pilot,
  Milestone,
  LegalTemplate,
  AuditLogEntry,
  NotificationItem,
  ScaleRecommendation,
} from './types';

export default function App() {
  // 1. Core State
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Starts as Department Official
  const [activeTab, setActiveTab] = useState<string>('department');

  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  const [pilots, setPilots] = useState<Pilot[]>(INITIAL_PILOTS);
  const [templates] = useState<LegalTemplate[]>(INITIAL_TEMPLATES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // 2. Modals state
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedChallengeForApply, setSelectedChallengeForApply] = useState<Challenge | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  // Load from backend if available
  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setChallenges(data);
      })
      .catch(() => {});

    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setApplications(data);
      })
      .catch(() => {});

    fetch('/api/pilots')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPilots(data);
      })
      .catch(() => {});
  }, []);

  // Switch role helper
  const handleSelectRole = (role: Role) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Stage Navigator from Pipeline
  const handleNavigateToStage = (stageStep: number) => {
    if (stageStep >= 1 && stageStep <= 3) {
      setActiveTab('challenges');
    } else if (stageStep === 4) {
      setActiveTab('evaluations');
    } else if (stageStep >= 5 && stageStep <= 8) {
      setActiveTab('pilots');
    } else if (stageStep >= 9) {
      setActiveTab('scale');
    }
  };

  // Application creation trigger
  const handleOpenApplyModal = (challenge: Challenge) => {
    setSelectedChallengeForApply(challenge);
    setIsApplyModalOpen(true);
  };

  // On new challenge created
  const handleChallengeCreated = (newChallenge: Challenge) => {
    setChallenges(prev => [newChallenge, ...prev]);
    // Refresh audit logs
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(() => {});
  };

  // On new application submitted
  const handleApplicationSubmitted = (newApp: Application) => {
    setApplications(prev => [newApp, ...prev]);
    setChallenges(prev =>
      prev.map(c => (c.id === newApp.challengeId ? { ...c, applicationsCount: (c.applicationsCount || 0) + 1 } : c))
    );
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(() => {});
  };

  // On evaluation submitted
  const handleEvaluationSubmitted = (newEval: Evaluation) => {
    setEvaluations(prev => {
      const idx = prev.findIndex(e => e.applicationId === newEval.applicationId && e.evaluatorId === newEval.evaluatorId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newEval;
        return copy;
      }
      return [newEval, ...prev];
    });

    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(() => {});
  };

  // Award Pilot Sandbox (Stage 4 -> Stage 5)
  const handleAwardPilot = async (app: Application, challenge: Challenge) => {
    try {
      const res = await fetch('/api/pilots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          applicationId: app.id,
          totalGrantAmount: app.costBreakdown || challenge.budgetCeiling,
        }),
      });
      if (res.ok) {
        const newPilot = await res.json();
        setPilots(prev => [newPilot, ...prev]);
        setActiveTab('pilots');
        alert(`Pilot Sandbox awarded to ${app.startupName}! Transitioned to Stage 5.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Milestone KPI
  const handleUpdateMilestone = async (
    pilotId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedM = await res.json();
        setPilots(prev =>
          prev.map(p => {
            if (p.id !== pilotId) return p;
            return {
              ...p,
              milestones: p.milestones.map(m => (m.id === milestoneId ? { ...m, ...updatedM } : m)),
            };
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Disburse PFMS Payment Tranche (Stage 8)
  const handleDisbursePayment = async (pilotId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/milestones/${milestoneId}/disburse`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPilots(prev =>
          prev.map(p => {
            if (p.id !== pilotId) return p;
            return {
              ...p,
              disbursedAmount: data.disbursedAmount,
              milestones: p.milestones.map(m => (m.id === milestoneId ? data.milestone : m)),
            };
          })
        );
        fetch('/api/audit-logs')
          .then(r => r.json())
          .then(logs => setAuditLogs(logs));
        alert('PFMS Treasury payment instruction generated and released!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // e-Sign Pilot Agreement (Stage 6)
  const handleSignContract = async (pilotId: string, role: string) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/sign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerRole: role }),
      });
      if (res.ok) {
        const updatedPilot = await res.json();
        setPilots(prev => prev.map(p => (p.id === pilotId ? updatedPilot : p)));
        fetch('/api/audit-logs')
          .then(r => r.json())
          .then(logs => setAuditLogs(logs));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generate Independent Validation Certificate (Stage 9)
  const handleGenerateCertificate = async (
    pilotId: string,
    actualMetric: string,
    scaleRecommendation: ScaleRecommendation,
    notes: string
  ) => {
    try {
      const res = await fetch('/api/validations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId,
          validatorId: currentUser.id,
          validatorName: currentUser.name,
          actualMetricAchieved: actualMetric,
          baselineVerified: 'Pre-pilot baseline turnaround: 19 days',
          targetVerified: 'Exceeded target threshold (< 90 seconds, > 94% sensitivity)',
          scaleRecommendation,
          justificationNotes: notes,
        }),
      });

      if (res.ok) {
        const record = await res.json();
        setPilots(prev =>
          prev.map(p => (p.id === pilotId ? { ...p, validationRecord: record, phase: 'PHASE_2_SCALE_DECISION' } : p))
        );
        fetch('/api/audit-logs')
          .then(r => r.json())
          .then(logs => setAuditLogs(logs));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Push to GeM Startup Runway (Stage 10)
  const handlePushToGeM = async (pilotId: string) => {
    const res = await fetch('/api/gem/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pilotId }),
    });
    if (res.ok) {
      fetch('/api/audit-logs')
        .then(r => r.json())
        .then(logs => setAuditLogs(logs));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col selection:bg-orange-100 selection:text-orange-900 text-slate-900">
      {/* Header Navigation */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        notifications={notifications}
        onOpenCreateChallenge={() => setIsCreateChallengeOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {/* Tab: Department Module (SIH 26136) */}
        {activeTab === 'department' && (
          <DepartmentPortalView
            onOpenContracting={pilotId => setActiveTab('pilots')}
            onOpenAuditTrail={() => setIsAuditLogsOpen(true)}
          />
        )}

        {/* Tab 1: 10-Stage Pipeline Overview */}
        {activeTab === 'pipeline' && (
          <PipelineOverview
            currentUser={currentUser}
            challenges={challenges}
            applications={applications}
            pilots={pilots}
            onNavigateToStage={handleNavigateToStage}
            onOpenCreateChallenge={() => setIsCreateChallengeOpen(true)}
          />
        )}

        {/* Tab 2: Grand Challenges & Startup Discovery (Stages 1, 2, 3) */}
        {activeTab === 'challenges' && (
          <StartupDiscoveryView
            challenges={challenges}
            currentUser={currentUser}
            onSelectChallengeForApply={handleOpenApplyModal}
            applications={applications}
            onOpenCreateChallenge={() => setIsCreateChallengeOpen(true)}
          />
        )}

        {/* Tab 3: Multi-Evaluator Blind Scoring (Stage 4) */}
        {activeTab === 'evaluations' && (
          <EvaluationView
            applications={applications}
            challenges={challenges}
            evaluations={evaluations}
            currentUser={currentUser}
            onEvaluationSubmitted={handleEvaluationSubmitted}
            onAwardPilot={handleAwardPilot}
          />
        )}

        {/* Tab 4: Sandbox Pilots, Milestones & Payments (Stages 5, 6, 7, 8) */}
        {activeTab === 'pilots' && (
          <PilotSandBoxView
            pilots={pilots}
            currentUser={currentUser}
            onUpdateMilestone={handleUpdateMilestone}
            onDisbursePayment={handleDisbursePayment}
            onSignContract={handleSignContract}
            onGoToScale={pilot => setActiveTab('scale')}
          />
        )}

        {/* Tab 5: Independent Validation & Scale-Up (Stages 9, 10) */}
        {activeTab === 'scale' && (
          <ValidationAndScaleView
            pilots={pilots}
            currentUser={currentUser}
            onGenerateCertificate={handleGenerateCertificate}
            onPushToGeM={handlePushToGeM}
          />
        )}

        {/* Tab 6: MSInS Command Center Analytics */}
        {activeTab === 'command-center' && (
          <AdminCommandCenter
            challenges={challenges}
            pilots={pilots}
            applications={applications}
          />
        )}
      </main>

      {/* Footer styled as crisp Bento bar */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 mt-14 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 tracking-tight">सहयोग • Sahayog</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Government of Maharashtra State Innovation Society (MSInS)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px]">
            <span className="bg-slate-100/90 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/60 font-mono">
              GFR 2017 Rule 173(i) & 170 Enforced
            </span>
            <span className="bg-slate-100/90 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/60 font-mono">
              GeM Startup Runway
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-semibold font-mono">
              15-Day PFMS SLA
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChallengeCreationModal
        isOpen={isCreateChallengeOpen}
        onClose={() => setIsCreateChallengeOpen(false)}
        currentUser={currentUser}
        onChallengeCreated={handleChallengeCreated}
      />

      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        challenge={selectedChallengeForApply}
        currentUser={currentUser}
        onApplicationSubmitted={handleApplicationSubmitted}
      />

      <TemplateLibraryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        templates={templates}
      />

      <AuditTrailModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
