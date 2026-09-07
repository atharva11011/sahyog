export type Role = 
  | 'DEPARTMENT_OFFICIAL'
  | 'STARTUP'
  | 'EVALUATOR'
  | 'MSINS_ADMIN'
  | 'INDEPENDENT_VALIDATOR';

export type OfficialRoleInDept = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  officialRoleInDept?: OfficialRoleInDept; // Admin vs Member in department
  startupName?: string;
  dpiitNumber?: string;
  dpiitVerified?: boolean;
  gemSellerId?: string;
  phone?: string;
  isVerified?: boolean;
}

export type DepartmentType = 
  | 'STATE_DEPARTMENT'
  | 'DISTRICT_OFFICE'
  | 'AUTONOMOUS_BODY'
  | 'PSU'
  | 'OTHER';

export type DepartmentVerificationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_MORE_INFO';

export type DocumentType = 
  | 'GOVT_ID_PROOF'
  | 'AUTHORIZATION_LETTER'
  | 'ESTABLISHMENT_GAZETTE'
  | 'CHALLENGE_SPEC'
  | 'DPIIT_CERTIFICATE'
  | 'PROPOSAL_DECK'
  | 'OTHER';

export interface DocumentAttachment {
  id: string;
  ownerType: 'DEPARTMENT' | 'OFFICIAL' | 'EVALUATOR' | 'STARTUP' | 'CHALLENGE';
  ownerId: string;
  title: string;
  docType: DocumentType;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
}

export interface DepartmentOfficial {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  roleInDept: OfficialRoleInDept; // ADMIN has full access, MEMBER cannot approve officials
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  govtIdDocId?: string;
  govtIdDocName?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  departmentType: DepartmentType;
  address: string;
  district: string;
  state: string;
  nodalOfficialName: string;
  nodalOfficialDesignation: string;
  nodalEmail: string;
  nodalPhone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationStatus: DepartmentVerificationStatus;
  verificationNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  badgeIssued: boolean;
  officials: DepartmentOfficial[];
  documents: DocumentAttachment[];
  createdAt: string;
}

export type ChallengeStatus = 
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'LIVE'
  | 'APPLICATIONS_OPEN'
  | 'UNDER_EVALUATION'
  | 'EVALUATION_IN_PROGRESS'
  | 'FINALIZED'
  | 'PILOT_AWARDED'
  | 'CLOSED'
  | 'WITHDRAWN';

export type DataSensitivity = 'LOW_PUBLIC' | 'MEDIUM_RESTRICTED' | 'HIGH_CONFIDENTIAL';

export interface Challenge {
  id: string;
  code: string; // e.g. "MSINS-2025-HLTH-001"
  title: string;
  department: string;
  departmentId?: string;
  sector: string;
  problemDescription: string;
  outcomeGoal?: string; // What success looks like (required outcome framing)
  baselineMetric: string;
  targetOutcome: string;
  budgetCeiling: number; // in INR (e.g. 2,500,000)
  timelineWeeks: number;
  dataSensitivity: DataSensitivity;
  gfrRule173Applied: boolean; // relaxation of prior turnover/experience for DPIIT startups
  gfrRule170Applied: boolean; // relaxation of EMD/bid security
  eligibilityCustomRequirements?: string; // custom sector experience, team size, tech constraints
  allowNonOfficialEvaluators?: boolean; // toggle for non-official evaluators
  minEvaluatorsRequired?: number; // default 3
  status: ChallengeStatus;
  tags: string[];
  minTpiScore?: number;
  publishedAt: string;
  applicationDeadline: string;
  creatorId: string;
  creatorName?: string;
  creatorRoleInDept?: OfficialRoleInDept;
  applicationsCount?: number;
  pilotsCount?: number;
  attachments?: DocumentAttachment[];
}

export type EvaluatorType = 'OFFICIAL_GOVT' | 'NON_OFFICIAL_EXPERT' | 'ACADEMIC';

export type EvaluatorAssignmentStatus = 
  | 'INVITED' 
  | 'ACCEPTED' 
  | 'SCORING_IN_PROGRESS' 
  | 'SCORING_COMPLETE';

export interface EvaluatorProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  designation: string;
  type: EvaluatorType;
  isOfficial: boolean; // verified government or department expert
  verificationDoc?: string;
  specialization: string[];
  availableForAssignment: boolean;
}

export interface EvaluatorAssignment {
  id: string;
  challengeId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorEmail: string;
  evaluatorOrganization: string;
  evaluatorType: EvaluatorType;
  isOfficial: boolean;
  departmentApproved: boolean; // Required if non-official
  status: EvaluatorAssignmentStatus;
  assignedAt: string;
  completedAt?: string;
}

export type MeetingMode = 'ONLINE_LINK' | 'IN_PERSON';
export type QualitativeRecommendation = 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'NOT_RECOMMEND';

export interface InterviewMeeting {
  id: string;
  challengeId: string;
  applicationId: string;
  startupId: string;
  startupName: string;
  scheduledDate: string;
  scheduledTime: string;
  mode: MeetingMode;
  meetingLocationOrUrl: string;
  panelists: string[];
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  recommendation?: QualitativeRecommendation;
  assessedAt?: string;
  assessedBy?: string;
}

export interface FinalizationDecision {
  id: string;
  challengeId: string;
  applicationId: string;
  startupId: string;
  startupName: string;
  round1Score: number;
  round2Recommendation: QualitativeRecommendation;
  decisionNote: string; // Stored for transparency & compliance audit trail
  decidedBy: string;
  decidedAt: string;
  status: 'SELECTED_FOR_PILOT';
  handoffStatus: 'CONTRACTING_PENDING';
}

export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'ELIGIBILITY_VERIFIED'
  | 'ELIGIBILITY_REJECTED'
  | 'SHORTLISTED'
  | 'HOLD_FOR_EVALUATION'
  | 'ROUND_2_INTERVIEW'
  | 'SELECTED_FOR_PILOT'
  | 'PILOT_AWARDED'
  | 'REJECTED';

export interface Application {
  id: string;
  challengeId: string;
  challengeCode?: string;
  challengeTitle?: string;
  startupId: string;
  startupName: string;
  proposalTitle: string;
  executiveSummary: string;
  technicalSpecs: string;
  teamCapability: string;
  costBreakdown: number;
  timelineCommitment: number; // weeks
  dpiitCertificate: string;
  isDpiitVerified: boolean;
  gfrTurnoverRelaxed: boolean;
  gfrEmdRelaxed: boolean;
  dataSecurityPlan?: string;
  status: ApplicationStatus;
  scoreAverage?: number;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  challengeId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorType: 'DEPARTMENT_OFFICIAL' | 'DOMAIN_EXPERT' | 'MSINS_REP';
  // Rubric Scoring (0 to 20 each, weighted total out of 100)
  technicalFeasibility: number; // 25% weight
  teamCapability: number; // 20% weight
  outcomeAlignment: number; // 25% weight
  costEfficiency: number; // 15% weight
  dataSecurityReadiness: number; // 15% weight
  weightedTotal: number;
  isBlind: boolean;
  finalized: boolean;
  qualitativeRemarks: string;
  evaluatedAt: string;
}

export type PilotPhase = 
  | 'PHASE_0_FEASIBILITY'    // Small fixed grant, sandboxed/dummy data, 4-6 weeks
  | 'PHASE_1_PILOT'          // Milestone-based, bounded live data, 8-12 weeks
  | 'PHASE_2_SCALE_DECISION'; // Scale decision & direct procurement

export type PilotStatus = 
  | 'DRAFTING_CONTRACT'
  | 'CONTRACT_SIGNED'
  | 'IN_PROGRESS'
  | 'MILESTONES_REVIEW'
  | 'COMPLETED'
  | 'TERMINATED'
  | 'SCALED';

export type MilestoneStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'BREACHED'
  | 'VERIFIED'
  | 'DISBURSED';

export interface Milestone {
  id: string;
  pilotId: string;
  orderIndex: number;
  title: string;
  description: string;
  baselineMetric: string;
  targetMetric: string;
  currentMetric?: string;
  kpiProgressPct: number;
  trancheAmount: number; // in INR
  dueDate: string;
  status: MilestoneStatus;
  deliverableUrl?: string;
  auditNotes?: string;
  verifiedAt?: string;
  disbursedAt?: string;
  pfmsRefId?: string;
}

export interface Pilot {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  applicationId: string;
  startupId: string;
  startupName: string;
  departmentName: string;
  phase: PilotPhase;
  status: PilotStatus;
  totalGrantAmount: number;
  disbursedAmount: number;
  contractTemplateVer: string;
  eSignedByDepartment: boolean;
  eSignedByStartup: boolean;
  eSignedAt?: string;
  contractHash?: string;
  startDate?: string;
  endDate?: string;
  milestones: Milestone[];
  validationRecord?: ValidationRecord;
}

export type ScaleRecommendation = 
  | 'DIRECT_DEPARTMENT_PROCUREMENT'
  | 'STATE_WIDE_EXPANSION'
  | 'GEM_RUNWAY_LISTING'
  | 'PIVOT_REQUIRED'
  | 'UNSATISFACTORY';

export interface ValidationRecord {
  id: string;
  pilotId: string;
  validatorId: string;
  validatorName: string;
  outcomeCertified: boolean;
  actualMetricAchieved: string;
  baselineVerified: string;
  targetVerified: string;
  certificationNumber: string; // e.g. "MSINS-CERT-2025-089"
  certificateHash: string; // SHA-256 fingerprint
  scaleRecommendation: ScaleRecommendation;
  justificationNotes: string;
  gemCatalogReady: boolean;
  issuedAt: string;
}

export interface LegalTemplate {
  id: string;
  code: string;
  category: 
    | 'PROBLEM_STATEMENT'
    | 'EVALUATION_RUBRIC'
    | 'PILOT_AGREEMENT'
    | 'DATA_IP_CLAUSE'
    | 'CYBERSECURITY_CHECKLIST'
    | 'RISK_EXIT_CLAUSE'
    | 'PROCUREMENT_TRANSITION';
  title: string;
  version: string;
  description: string;
  legalReference: string;
  clausesSummary: string[];
  contentSnippet: string;
  downloadFormat: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: 'Challenge' | 'Application' | 'Evaluation' | 'Contract' | 'Payment' | 'Validation';
  entityId: string;
  actorName: string;
  actorRole: Role;
  policyBasis: string;
  hashProof: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole: Role | 'ALL';
  createdAt: string;
  read: boolean;
  category: 'CHALLENGE' | 'APPLICATION' | 'EVALUATION' | 'MILESTONE' | 'PAYMENT' | 'VALIDATION';
}
