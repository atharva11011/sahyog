import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Target,
  Inbox,
  Users,
  Award,
  FileCheck,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Layers,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Eye,
  FileText,
  UserCheck,
  IndianRupee,
  Lock,
  ArrowRight,
} from 'lucide-react';
import {
  Challenge,
  Application,
  Department,
  EvaluatorAssignment,
  EvaluatorProfile,
  InterviewMeeting,
  OfficialRoleInDept,
  ApplicationStatus,
  QualitativeRecommendation,
} from '../../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_CHALLENGES,
  INITIAL_APPLICATIONS,
  INITIAL_EVALUATOR_POOL,
  INITIAL_EVALUATOR_ASSIGNMENTS,
  INITIAL_INTERVIEW_MEETINGS,
} from '../../mockData/initialData';
import { DepartmentRegistrationModal } from './DepartmentRegistrationModal';
import { MsinsRegistrationReviewModal } from './MsinsRegistrationReviewModal';
import { DepartmentChallengeBuilder } from './DepartmentChallengeBuilder';
import { DepartmentApplicationsInbox } from './DepartmentApplicationsInbox';
import { DepartmentEvaluatorsPanel } from './DepartmentEvaluatorsPanel';
import { DepartmentTwoRoundEvaluation } from './DepartmentTwoRoundEvaluation';
import { DepartmentOfficialsTeam } from './DepartmentOfficialsTeam';

interface DepartmentPortalViewProps {
  onOpenContracting?: (pilotId?: string) => void;
  onOpenAuditTrail?: () => void;
}

export const DepartmentPortalView: React.FC<DepartmentPortalViewProps> = ({
  onOpenContracting,
  onOpenAuditTrail,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'BUILDER' | 'APPLICATIONS' | 'EVALUATORS' | 'TWO_ROUND' | 'OFFICIALS' | 'DOSSIER' | 'ADMIN_QUEUE'
  >('DASHBOARD');

  // Persona switching (Admin Official, Member Official, Pending Official, MSInS Super Admin)
  const [currentPersona, setCurrentPersona] = useState<
    'ADMIN_OFFICIAL' | 'MEMBER_OFFICIAL' | 'PENDING_OFFICIAL' | 'MSINS_ADMIN'
  >('ADMIN_OFFICIAL');

  // Core Data State (initialized with mock data so activeDepartment and challenges are immediately available)
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [evaluatorPool, setEvaluatorPool] = useState<EvaluatorProfile[]>(INITIAL_EVALUATOR_POOL);
  const [evaluatorAssignments, setEvaluatorAssignments] = useState<EvaluatorAssignment[]>(INITIAL_EVALUATOR_ASSIGNMENTS);
  const [interviews, setInterviews] = useState<InterviewMeeting[]>(INITIAL_INTERVIEW_MEETINGS);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(INITIAL_CHALLENGES[0]?.id || '');

  // Modals state
  const [showRegModal, setShowRegModal] = useState(false);
  const [reviewDeptTarget, setReviewDeptTarget] = useState<Department | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load all initial data from server
  const loadData = async () => {
    try {
      const [deptRes, chalRes, appRes, poolRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/challenges'),
        fetch('/api/applications'),
        fetch('/api/evaluators/pool'),
      ]);

      const [deptData, chalData, appData, poolData] = await Promise.all([
        deptRes.json(),
        chalRes.json(),
        appRes.json(),
        poolRes.json(),
      ]);

      if (Array.isArray(deptData) && deptData.length > 0) setDepartments(deptData);
      if (Array.isArray(chalData) && chalData.length > 0) setChallenges(chalData);
      if (Array.isArray(appData)) setApplications(appData);
      if (Array.isArray(poolData)) setEvaluatorPool(poolData);

      if (chalData.length > 0 && !selectedChallengeId) {
        setSelectedChallengeId(chalData[0].id);
      }

      // If challenge selected, load its assignments and interviews
      const activeChlId = selectedChallengeId || (chalData[0]?.id ?? '');
      if (activeChlId) {
        const [asgnRes, meetRes] = await Promise.all([
          fetch(`/api/challenges/${activeChlId}/evaluators`),
          fetch(`/api/challenges/${activeChlId}/interviews`),
        ]);
        const asgnData = await asgnRes.json();
        const meetData = await meetRes.json();
        if (Array.isArray(asgnData)) setEvaluatorAssignments(asgnData);
        if (Array.isArray(meetData)) setInterviews(meetData);
      }
    } catch (err) {
      console.error('Error fetching department module data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedChallengeId]);

  // Fallback guaranteed department
  const fallbackDept: Department = INITIAL_DEPARTMENTS[0] || {
    id: 'dept_health_01',
    name: 'Department of Public Health, Maharashtra',
    departmentType: 'STATE_DEPARTMENT',
    address: 'GT Hospital Complex, Mantralaya, Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    nodalOfficialName: 'Dr. Sanjay Deshmukh',
    nodalOfficialDesignation: 'Joint Director of Health Services (Procurement)',
    nodalEmail: 'sanjay.deshmukh@maharashtra.gov.in',
    nodalPhone: '+91 98201 12345',
    isEmailVerified: true,
    isPhoneVerified: true,
    verificationStatus: 'APPROVED',
    badgeIssued: true,
    approvedAt: '2025-01-15T10:00:00Z',
    approvedBy: 'MSInS Super Admin',
    officials: [],
    documents: [],
    createdAt: '2025-01-10T10:00:00Z',
  };

  // Derive current department based on persona (never undefined)
  const activeDepartment: Department =
    (currentPersona === 'PENDING_OFFICIAL'
      ? departments.find(d => d.verificationStatus === 'UNDER_REVIEW') || departments[1]
      : departments.find(d => d.id === 'dept_health_01')) ||
    departments[0] ||
    fallbackDept;

  const currentOfficialRole: OfficialRoleInDept =
    currentPersona === 'MEMBER_OFFICIAL' ? 'MEMBER' : 'ADMIN';

  const isVerified = activeDepartment?.verificationStatus === 'APPROVED';

  // Filter challenges for active department safely
  const deptChallenges = challenges.filter(c => {
    if (!activeDepartment) return true;
    if (c.departmentId && c.departmentId === activeDepartment.id) return true;
    if (c.department && activeDepartment.name) {
      return c.department.toLowerCase().includes(activeDepartment.name.toLowerCase());
    }
    return false;
  });

  const activeChallenge =
    challenges.find(c => c.id === selectedChallengeId) || deptChallenges[0] || challenges[0];

  // Actions handlers
  const handleChallengeCreated = (newChallenge: Challenge) => {
    setChallenges([newChallenge, ...challenges]);
    setSelectedChallengeId(newChallenge.id);
    setActiveTab('DASHBOARD');
  };

  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus, reason?: string) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        actorName: currentPersona === 'MEMBER_OFFICIAL' ? 'Pooja Sawant (Member)' : 'Dr. Sanjay Deshmukh (Admin)',
        reason,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setApplications(applications.map(a => (a.id === appId ? updated : a)));
    }
  };

  const handleAssignEvaluator = async (evaluatorId: string) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/evaluators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluatorId,
        assignedBy: 'Dr. Sanjay Deshmukh (Admin Official)',
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign evaluator');
    }
    const newAsgn = await res.json();
    setEvaluatorAssignments([...evaluatorAssignments, newAsgn]);
  };

  const handleToggleApproval = async (assignmentId: string, approved: boolean) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/evaluators/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        departmentApproved: approved,
        actorName: 'Dr. Sanjay Deshmukh (Admin Official)',
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setEvaluatorAssignments(evaluatorAssignments.map(a => (a.id === assignmentId ? updated : a)));
    }
  };

  const handleToggleNonOfficialAllowed = async (challengeId: string, allowed: boolean) => {
    // Local toggle update
    setChallenges(challenges.map(c => (c.id === challengeId ? { ...c, allowNonOfficialEvaluators: allowed } : c)));
  };

  const handleScheduleInterview = async (data: any) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        scheduledBy: 'Dr. Sanjay Deshmukh (Admin Official)',
      }),
    });
    if (res.ok) {
      const newMeet = await res.json();
      setInterviews([...interviews, newMeet]);
      // Update application status
      setApplications(applications.map(a => (a.id === data.applicationId ? { ...a, status: 'ROUND_2_INTERVIEW' as any } : a)));
    }
  };

  const handleRecordAssessment = async (meetingId: string, notes: string, recommendation: QualitativeRecommendation) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/interviews/${meetingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes,
        recommendation,
        assessedBy: 'Department Committee (Deshmukh / Sohoni)',
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setInterviews(interviews.map(m => (m.id === meetingId ? updated : m)));
    }
  };

  const handleFinalizePilot = async (data: any) => {
    if (!activeChallenge) return;
    const res = await fetch(`/api/challenges/${activeChallenge.id}/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to finalize pilot');
    }
    const result = await res.json();
    // Update local challenge & application
    setChallenges(challenges.map(c => (c.id === activeChallenge.id ? { ...c, status: 'FINALIZED' } : c)));
    setApplications(applications.map(a => (a.id === data.applicationId ? { ...a, status: 'PILOT_AWARDED' as any } : a)));
  };

  const handleAddOfficial = async (newOfficialData: any) => {
    if (!activeDepartment) return;
    const res = await fetch(`/api/departments/${activeDepartment.id}/officials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newOfficialData,
        registeredBy: 'Dr. Sanjay Deshmukh (Admin Official)',
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add official');
    }
    const newOfficial = await res.json();
    setDepartments(
      departments.map(d =>
        d.id === activeDepartment.id
          ? { ...d, officials: [...(d.officials || []), newOfficial] }
          : d
      )
    );
  };

  const handleAdminVerificationDecision = async (
    deptId: string,
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_MORE_INFO',
    reason: string
  ) => {
    const res = await fetch(`/api/departments/${deptId}/verification`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        reason,
        adminName: 'Nidhi More, Joint CEO (MSInS Super Admin)',
      }),
    });
    if (!res.ok) throw new Error('Failed to update verification status');
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* AUTHORITATIVE OFFICIAL HEADER (Deep Navy & Government Emblem) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl bg-blue-900/90 border-2 border-blue-700 flex flex-col items-center justify-center font-bold text-amber-300 shrink-0 shadow-xs">
              <span className="text-xs tracking-widest text-slate-400">MH</span>
              <span className="text-sm font-extrabold text-white">MSInS</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Government of Maharashtra • Startup Innovation Procurement
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-amber-400 font-medium">SIH 26136 Standard</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>{activeDepartment?.name || 'Department of Public Health, Maharashtra'}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-300">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-semibold text-[11px]">
                  {activeDepartment?.departmentType ? activeDepartment.departmentType.replace(/_/g, ' ') : 'STATE DEPARTMENT'}
                </span>
                <span>District: <strong className="text-white">{activeDepartment?.district || 'Mumbai City'}</strong></span>
                <span>•</span>
                <span>Nodal: <strong className="text-white">{activeDepartment?.nodalOfficialName || 'Nodal Officer'}</strong></span>
              </div>
            </div>
          </div>

          {/* Verification Badge & Persona Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status Badge */}
            <div className="shrink-0">
              {activeDepartment?.verificationStatus === 'APPROVED' ? (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 flex items-center space-x-2 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      MSInS Verified Department
                    </div>
                    <div className="text-xs font-bold text-white">
                      Full Procurement Access Granted
                    </div>
                  </div>
                </div>
              ) : activeDepartment?.verificationStatus === 'UNDER_REVIEW' ? (
                <div className="px-3.5 py-2 rounded-xl bg-amber-950/80 border border-amber-600 text-amber-300 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      Verification Under Review
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Access Gated by MSInS Admin
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                      Registration Rejected
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Resubmit with Gazette Order
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <label className="block text-[10px] uppercase font-bold text-slate-400 px-2 pb-1">
                Active User Persona
              </label>
              <select
                value={currentPersona}
                onChange={e => setCurrentPersona(e.target.value as any)}
                className="w-full sm:w-auto bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-hidden"
              >
                <option value="ADMIN_OFFICIAL">Dr. Sanjay Deshmukh (Admin Official, Health Dept)</option>
                <option value="MEMBER_OFFICIAL">Pooja Sawant (Member Official, Health Dept)</option>
                <option value="PENDING_OFFICIAL">Rajesh Khadse (Admin, Water Dept — Under Review)</option>
                <option value="MSINS_ADMIN">Nidhi More (MSInS Super Admin — Review Queue)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Warning Banner if not verified */}
        {!isVerified && currentPersona !== 'MSINS_ADMIN' && (
          <div className="p-4 bg-amber-900/40 border border-amber-700/60 rounded-xl flex items-start space-x-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300 text-sm">
                Statutory Gated Access Notice: Document Verification in Progress
              </span>
              <p className="leading-relaxed text-slate-300">
                Your department registration for <span className="text-white font-semibold">{activeDepartment?.name || 'your department'}</span> is currently pending review by the Maharashtra State Innovation Society admin. Live publishing of challenges and release of pilot orders are locked until your submitted Government Employee ID and Establishment Gazette order are validated.
              </p>
              <div className="pt-1 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('DOSSIER')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                >
                  View Submitted Dossier Documents
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPersona('MSINS_ADMIN')}
                  className="text-xs font-semibold text-slate-300 hover:text-white underline"
                >
                  Switch to MSInS Admin Persona to Approve Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Challenge Progress Tracker */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Procurement Lifecycle Stages</span>
            <span className="text-amber-400 font-mono">Active Challenge: {activeChallenge?.code || 'CHL-001'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            {[
              { num: '1', title: 'Problem Published', desc: 'GFR 173(i) Outcome Framing', active: true, done: true },
              { num: '2', title: 'Applications Inbox', desc: 'DPIIT Startup Proposals', active: true, done: true },
              { num: '3', title: 'Round 1 Scoring', desc: 'Blind Rubric Quorum', active: true, done: true },
              { num: '4', title: 'Round 2 Interview', desc: 'Technical Demos', active: true, done: activeChallenge?.status === 'FINALIZED' },
              { num: '5', title: 'Pilot Award Order', desc: 'Statutory Resolution', active: activeChallenge?.status === 'FINALIZED', done: activeChallenge?.status === 'FINALIZED' },
              { num: '6', title: 'Milestone Contracting', desc: 'Disbursement & Pilot Sandbox', active: activeChallenge?.status === 'FINALIZED', done: false },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition ${
                  step.done
                    ? 'bg-blue-950/70 border-blue-700 text-blue-200'
                    : step.active
                    ? 'bg-slate-800/80 border-amber-500/80 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    step.done ? 'bg-blue-700 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {step.num}
                  </span>
                  <span className="truncate">{step.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'DASHBOARD'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('BUILDER')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'BUILDER'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Guided Challenge Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'APPLICATIONS'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Applications Inbox ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EVALUATORS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'EVALUATORS'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Evaluators Committee ({evaluatorAssignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('TWO_ROUND')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'TWO_ROUND'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>2-Round Evaluation & Finalization</span>
          </button>

          <button
            onClick={() => setActiveTab('OFFICIALS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'OFFICIALS'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Officials Team ({activeDepartment?.officials?.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('DOSSIER')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'DOSSIER'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Verification Dossier</span>
          </button>

          {/* Admin Queue shortcut tab */}
          <button
            onClick={() => setActiveTab('ADMIN_QUEUE')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'ADMIN_QUEUE'
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>MSInS Approval Queue ({departments.filter(d => d.verificationStatus === 'UNDER_REVIEW').length})</span>
          </button>
        </div>

        {/* Register New Department Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowRegModal(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-800" />
            <span>Register New Department</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW SWITCHER */}

      {/* 1. DASHBOARD & CHALLENGES LIST */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* High-level metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Challenges
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{deptChallenges.length}</span>
                <span className="text-xs text-blue-700 font-semibold">Published</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Under GFR Rule 173(i)</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Applications Received
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{applications.length}</span>
                <span className="text-xs text-emerald-700 font-semibold">DPIIT Verified</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Screened for TPI Index</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Assigned Evaluators
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{evaluatorAssignments.length}</span>
                <span className="text-xs text-purple-700 font-semibold">Committee Pool</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Min 1 Official Evaluator Active</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Pilot Grant Ceilings
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">₹ 65 L</span>
                <span className="text-xs text-slate-600 font-semibold">Total</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Milestone Disbursed</p>
            </div>
          </div>

          {/* Department Challenges Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Published Problem Statements & Challenges
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Challenges initiated by {activeDepartment?.name}. Click to review applications or manage evaluation panels.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('BUILDER')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-2xs transition flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Problem</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Code & Title</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3">Outcome Goal</th>
                    <th className="px-4 py-3">Budget Ceiling</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {deptChallenges.map(chl => {
                    const isSelected = chl.id === selectedChallengeId;
                    return (
                      <tr
                        key={chl.id}
                        onClick={() => setSelectedChallengeId(chl.id)}
                        className={`transition cursor-pointer ${
                          isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-mono font-bold text-blue-900">{chl.code}</div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">{chl.title}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {chl.sector}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600 max-w-xs">
                          <div className="line-clamp-2 text-[11px] leading-relaxed">
                            {chl.outcomeGoal || chl.targetOutcome || chl.problemDescription}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          ₹ {(chl.budgetCeiling / 100000).toFixed(2)} Lakhs
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              chl.status === 'FINALIZED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : chl.status === 'APPLICATIONS_OPEN'
                                ? 'bg-blue-100 text-blue-800'
                                : chl.status === 'SUBMITTED_FOR_REVIEW'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {chl.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedChallengeId(chl.id);
                              setActiveTab('APPLICATIONS');
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-white border border-slate-300 hover:bg-blue-50 rounded-lg transition shadow-2xs"
                          >
                            View Applications
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. GUIDED CHALLENGE BUILDER */}
      {activeTab === 'BUILDER' && (
        <DepartmentChallengeBuilder
          department={activeDepartment}
          onChallengeCreated={handleChallengeCreated}
          onCancel={() => setActiveTab('DASHBOARD')}
        />
      )}

      {/* 3. APPLICATIONS INBOX */}
      {activeTab === 'APPLICATIONS' && (
        <DepartmentApplicationsInbox
          challenges={challenges}
          applications={applications}
          selectedChallengeId={selectedChallengeId}
          onSelectChallenge={setSelectedChallengeId}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onScheduleInterview={app => {
            setSelectedChallengeId(app.challengeId);
            setActiveTab('TWO_ROUND');
          }}
        />
      )}

      {/* 4. EVALUATORS PANEL */}
      {activeTab === 'EVALUATORS' && (
        <DepartmentEvaluatorsPanel
          challenges={challenges}
          selectedChallengeId={selectedChallengeId || challenges[0]?.id || ''}
          onSelectChallenge={setSelectedChallengeId}
          assignments={evaluatorAssignments}
          evaluatorPool={evaluatorPool}
          onAssignEvaluator={handleAssignEvaluator}
          onToggleApproval={handleToggleApproval}
          onToggleNonOfficialAllowed={handleToggleNonOfficialAllowed}
        />
      )}

      {/* 5. TWO-ROUND EVALUATION & FINALIZATION */}
      {activeTab === 'TWO_ROUND' && activeChallenge && (
        <DepartmentTwoRoundEvaluation
          challenge={activeChallenge}
          applications={applications}
          interviews={interviews}
          onScheduleInterview={handleScheduleInterview}
          onRecordAssessment={handleRecordAssessment}
          onFinalizePilot={handleFinalizePilot}
          onOpenContracting={onOpenContracting}
        />
      )}

      {/* 6. OFFICIALS TEAM */}
      {activeTab === 'OFFICIALS' && activeDepartment && (
        <DepartmentOfficialsTeam
          department={activeDepartment}
          currentOfficialRole={currentOfficialRole}
          onAddOfficial={handleAddOfficial}
        />
      )}

      {/* 7. VERIFICATION DOSSIER VIEW */}
      {activeTab === 'DOSSIER' && activeDepartment && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Department Verification Dossier
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Statutory Documents & Identity Verification Records
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeDepartment.verificationStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {activeDepartment.verificationStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Submitted Mandatory Documents (3 Required)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeDepartment.documents && activeDepartment.documents.length > 0 ? (
                activeDepartment.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center space-x-2 text-blue-800">
                      <FileText className="w-5 h-5" />
                      <span className="font-bold text-xs">{doc.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      File: {doc.fileName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                      <span className="text-slate-500">{doc.fileSize}</span>
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 col-span-3">No documents attached.</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <span className="font-bold text-slate-800 block">MSInS Verification Remarks</span>
            <p className="text-slate-600 leading-relaxed italic">
              "{activeDepartment.verificationNotes || 'Dossier successfully verified by MSInS Super Admin. Gated procurement access unlocked.'}"
            </p>
          </div>
        </div>
      )}

      {/* 8. MSInS ADMIN REGISTRATION REVIEW QUEUE */}
      {activeTab === 'ADMIN_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                MSInS Administrative Oversight
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Department Empanelment Verification Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect statutory registration dossiers and issue verified badges to government entities.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              {departments.filter(d => d.verificationStatus === 'UNDER_REVIEW').length} Awaiting Verification
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Department Name & Type</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Nodal Officer & Email</th>
                    <th className="px-4 py-3">Documents</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {departments.map(dept => (
                    <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-900">{dept.name}</div>
                        <div className="text-[11px] text-slate-500">{dept.departmentType.replace('_', ' ')}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">{dept.district}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{dept.nodalOfficialName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{dept.nodalEmail}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {dept.documents?.length || 3} Files Attached
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            dept.verificationStatus === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : dept.verificationStatus === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {dept.verificationStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setReviewDeptTarget(dept)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-2xs"
                        >
                          Inspect & Decide
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

      {/* REGISTRATION MODAL */}
      <DepartmentRegistrationModal
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        onSuccess={newDept => {
          setDepartments([newDept, ...departments]);
          loadData();
        }}
      />

      {/* MSINS REVIEW MODAL */}
      <MsinsRegistrationReviewModal
        isOpen={Boolean(reviewDeptTarget)}
        department={reviewDeptTarget}
        onClose={() => setReviewDeptTarget(null)}
        onDecision={handleAdminVerificationDecision}
      />
    </div>
  );
};
