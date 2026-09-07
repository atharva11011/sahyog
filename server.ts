import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_CHALLENGES,
  INITIAL_APPLICATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_PILOTS,
  INITIAL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_EVALUATOR_POOL,
  INITIAL_EVALUATOR_ASSIGNMENTS,
  INITIAL_INTERVIEW_MEETINGS,
  INITIAL_FINALIZATIONS,
} from './src/mockData/initialData';
import {
  Challenge,
  Application,
  Evaluation,
  Pilot,
  AuditLogEntry,
  NotificationItem,
  Department,
  DepartmentOfficial,
  DocumentAttachment,
  EvaluatorProfile,
  EvaluatorAssignment,
  InterviewMeeting,
  FinalizationDecision,
} from './src/types';

// In-memory operational store
let users = [...INITIAL_USERS];
let challenges = [...INITIAL_CHALLENGES];
let applications = [...INITIAL_APPLICATIONS];
let evaluations = [...INITIAL_EVALUATIONS];
let pilots = [...INITIAL_PILOTS];
let templates = [...INITIAL_TEMPLATES];
let auditLogs = [...INITIAL_AUDIT_LOGS];
let notifications = [...INITIAL_NOTIFICATIONS];
let departments = [...INITIAL_DEPARTMENTS];
let evaluatorPool = [...INITIAL_EVALUATOR_POOL];
let evaluatorAssignments = [...INITIAL_EVALUATOR_ASSIGNMENTS];
let interviewMeetings = [...INITIAL_INTERVIEW_MEETINGS];
let finalizations = [...INITIAL_FINALIZATIONS];

function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data + Date.now().toString()).digest('hex');
}

function addAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  actorName: string,
  actorRole: any,
  policyBasis: string,
  details: string
) {
  const hashProof = generateHash(`${action}:${entityType}:${entityId}:${actorName}`);
  const log: AuditLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    entityType: entityType as any,
    entityId,
    actorName,
    actorRole,
    policyBasis,
    hashProof,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(log);
  return log;
}

function addNotification(
  title: string,
  message: string,
  targetRole: any,
  category: any
) {
  const notif: NotificationItem = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    message,
    targetRole,
    category,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notif);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Sahayog MSInS Procurement Engine',
      policy: 'Maharashtra Startup Policy 2025 / GFR 2017 Rule 173(i)',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Users
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(users);
  });

  // 3. Challenge Identification & Listing
  app.get('/api/challenges', (req: Request, res: Response) => {
    const { sector, department, status, query } = req.query;
    let result = [...challenges];

    if (sector && typeof sector === 'string') {
      result = result.filter(c => c.sector.toLowerCase().includes(sector.toLowerCase()));
    }
    if (department && typeof department === 'string') {
      result = result.filter(c => c.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (status && typeof status === 'string') {
      result = result.filter(c => c.status === status);
    }
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.problemDescription.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json(result);
  });

  app.get('/api/challenges/:id', (req: Request, res: Response) => {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    const challengeApps = applications.filter(a => a.challengeId === challenge.id);
    const challengePilots = pilots.filter(p => p.challengeId === challenge.id);
    res.json({
      ...challenge,
      applications: challengeApps,
      pilots: challengePilots,
    });
  });

  app.post('/api/challenges', (req: Request, res: Response) => {
    const body = req.body;
    const count = challenges.length + 1;
    const prefix = body.sector?.includes('Health')
      ? 'HLTH'
      : body.sector?.includes('Water')
      ? 'WAT'
      : body.sector?.includes('Agri')
      ? 'AGRI'
      : 'URB';
    const code = `MSINS-2025-${prefix}-00${count}`;

    const newChallenge: Challenge = {
      id: `chl_${Date.now()}`,
      code,
      title: body.title,
      department: body.department || 'Department of Public Health, Government of Maharashtra',
      departmentId: body.departmentId || 'dept_health_01',
      sector: body.sector || 'GovTech & Innovation',
      problemDescription: body.problemDescription,
      outcomeGoal: body.outcomeGoal || body.targetOutcome,
      baselineMetric: body.baselineMetric,
      targetOutcome: body.targetOutcome,
      budgetCeiling: Number(body.budgetCeiling) || 3000000,
      timelineWeeks: Number(body.timelineWeeks) || 12,
      dataSensitivity: body.dataSensitivity || 'MEDIUM_RESTRICTED',
      gfrRule173Applied: body.gfrRule173Applied ?? true,
      gfrRule170Applied: body.gfrRule170Applied ?? true,
      eligibilityCustomRequirements: body.eligibilityCustomRequirements || '',
      allowNonOfficialEvaluators: body.allowNonOfficialEvaluators ?? true,
      minEvaluatorsRequired: Number(body.minEvaluatorsRequired) || 3,
      status: body.status || 'SUBMITTED_FOR_REVIEW',
      tags: body.tags || ['Innovation', 'MSInS', 'GovTech'],
      minTpiScore: Number(body.minTpiScore) || 65,
      publishedAt: new Date().toISOString(),
      applicationDeadline: body.applicationDeadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      creatorId: body.creatorId || 'usr_dept_01',
      creatorName: body.creatorName || 'Department Official',
      creatorRoleInDept: body.creatorRoleInDept || 'ADMIN',
      applicationsCount: 0,
      pilotsCount: 0,
      attachments: body.attachments || [],
    };

    challenges.unshift(newChallenge);

    addAuditLog(
      newChallenge.status === 'DRAFT' ? 'CHALLENGE_DRAFT_CREATED' : 'CHALLENGE_SUBMITTED_FOR_REVIEW',
      'Challenge',
      newChallenge.id,
      newChallenge.creatorName || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Maharashtra Startup Policy 2025 & GFR Rule 173(i)',
      `Challenge ${newChallenge.code}: "${newChallenge.title}" saved as ${newChallenge.status} with ${newChallenge.budgetCeiling} INR budget ceiling.`
    );

    addNotification(
      'New Challenge Published for Review',
      `Challenge ${newChallenge.code}: "${newChallenge.title}" was submitted by ${newChallenge.department}.`,
      'MSINS_ADMIN',
      'CHALLENGE'
    );

    res.status(201).json(newChallenge);
  });

  // 4. DPIIT Startup Verification Integration (Stubbed / Mockable service interface)
  app.post('/api/dpiit/verify', (req: Request, res: Response) => {
    const { dpiitNumber, startupName } = req.body;
    if (!dpiitNumber) {
      return res.status(400).json({ error: 'DPIIT registration number required' });
    }

    // Normalized lookup simulator
    const isCleanFormat = /^DIPP/i.test(dpiitNumber) || dpiitNumber.length >= 6;
    if (isCleanFormat) {
      const responsePayload = {
        verified: true,
        dpiitNumber: dpiitNumber.toUpperCase(),
        entityName: startupName || 'DPIIT Recognised Startup Enterprise',
        incorporationDate: '2022-06-15',
        recognitionDate: '2022-09-20',
        validUntil: '2032-06-14',
        sector: 'Information & Communication Technology / MedTech',
        state: 'Maharashtra',
        gfrRule173Eligible: true,
        gfrRule170Eligible: true,
        exemptionNotice:
          'Pursuant to Ministry of Finance Notification and GFR 2017 Rule 173(i), this entity qualifies for mandatory waiver of prior turnover and prior experience criteria.',
        verifiedAt: new Date().toISOString(),
        gatewaySignature: generateHash(dpiitNumber),
      };
      return res.json(responsePayload);
    } else {
      return res.status(422).json({
        verified: false,
        error: 'Invalid DPIIT registration number or expired recognition certificate.',
      });
    }
  });

  // 5. Semantic Capability-to-Challenge Matching
  app.get('/api/discovery/match', (req: Request, res: Response) => {
    const { startupSector, startupTags, challengeId } = req.query;

    const matched = challenges.map(ch => {
      let matchScore = 50; // base
      const tagsList = typeof startupTags === 'string' ? startupTags.split(',') : [];

      if (startupSector && typeof startupSector === 'string') {
        if (ch.sector.toLowerCase().includes(startupSector.toLowerCase())) {
          matchScore += 30;
        }
      }

      // Check tag overlaps
      const overlap = ch.tags.filter(t =>
        tagsList.some(st => st.toLowerCase().trim() === t.toLowerCase().trim())
      );
      matchScore += Math.min(overlap.length * 10, 20);

      return {
        challenge: ch,
        matchScore: Math.min(matchScore, 98),
        matchingTags: overlap,
        gfrRule173Applies: ch.gfrRule173Applied,
        gfrRule170Applies: ch.gfrRule170Applied,
      };
    });

    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matched);
  });

  // 6. Applications (Eligibility Screening)
  app.get('/api/applications', (req: Request, res: Response) => {
    const { challengeId, startupId } = req.query;
    let result = [...applications];
    if (challengeId && typeof challengeId === 'string') {
      result = result.filter(a => a.challengeId === challengeId);
    }
    if (startupId && typeof startupId === 'string') {
      result = result.filter(a => a.startupId === startupId);
    }
    res.json(result);
  });

  app.post('/api/applications', (req: Request, res: Response) => {
    const body = req.body;
    const challenge = challenges.find(c => c.id === body.challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Referenced challenge does not exist' });
    }

    const isDpiit = Boolean(body.dpiitCertificate && body.dpiitCertificate.trim().length > 3);

    const newApp: Application = {
      id: `app_${Date.now()}`,
      challengeId: body.challengeId,
      challengeCode: challenge.code,
      challengeTitle: challenge.title,
      startupId: body.startupId || 'usr_startup_01',
      startupName: body.startupName || 'Innovative Tech Startup',
      proposalTitle: body.proposalTitle,
      executiveSummary: body.executiveSummary,
      technicalSpecs: body.technicalSpecs,
      teamCapability: body.teamCapability,
      costBreakdown: Number(body.costBreakdown) || challenge.budgetCeiling * 0.9,
      timelineCommitment: Number(body.timelineCommitment) || challenge.timelineWeeks,
      dpiitCertificate: body.dpiitCertificate || 'DIPP-MH-2023-AUTO',
      isDpiitVerified: isDpiit,
      gfrTurnoverRelaxed: challenge.gfrRule173Applied && isDpiit,
      gfrEmdRelaxed: challenge.gfrRule170Applied && isDpiit,
      dataSecurityPlan: body.dataSecurityPlan || 'Standard local DPDP 2023 compliance & AES-256 encryption.',
      status: 'SUBMITTED',
      scoreAverage: 0,
      submittedAt: new Date().toISOString(),
    };

    applications.unshift(newApp);

    // Update challenge count
    challenge.applicationsCount = (challenge.applicationsCount || 0) + 1;

    addAuditLog(
      'APPLICATION_SUBMITTED',
      'Application',
      newApp.id,
      newApp.startupName,
      'STARTUP',
      'GFR 2017 Rule 173(i) Eligibility Check',
      `Application for ${challenge.code} submitted. DPIIT Status: ${isDpiit ? 'VERIFIED (Turnover requirement waived)' : 'MANUAL REVIEW REQUIRED'}.`
    );

    addNotification(
      'New Proposal Submitted',
      `Startup "${newApp.startupName}" applied for challenge ${challenge.code}.`,
      'DEPARTMENT_OFFICIAL',
      'APPLICATION'
    );

    res.status(201).json(newApp);
  });

  // 7. Expert Evaluation (Blind & Weighted scoring)
  app.get('/api/evaluations', (req: Request, res: Response) => {
    const { applicationId, evaluatorId } = req.query;
    let result = [...evaluations];
    if (applicationId && typeof applicationId === 'string') {
      result = result.filter(e => e.applicationId === applicationId);
    }
    if (evaluatorId && typeof evaluatorId === 'string') {
      result = result.filter(e => e.evaluatorId === evaluatorId);
    }
    res.json(result);
  });

  app.post('/api/evaluations', (req: Request, res: Response) => {
    const body = req.body;
    const {
      applicationId,
      challengeId,
      evaluatorId,
      evaluatorName,
      evaluatorType,
      technicalFeasibility,
      teamCapability,
      outcomeAlignment,
      costEfficiency,
      dataSecurityReadiness,
      qualitativeRemarks,
    } = body;

    // Weights: Tech 25, Team 20, Outcome 25, Cost 15, Security 15 = 100
    const weightedTotal =
      (Number(technicalFeasibility) || 0) +
      (Number(teamCapability) || 0) +
      (Number(outcomeAlignment) || 0) +
      (Number(costEfficiency) || 0) +
      (Number(dataSecurityReadiness) || 0);

    const newEval: Evaluation = {
      id: `eval_${Date.now()}`,
      applicationId,
      challengeId,
      evaluatorId: evaluatorId || 'usr_eval_01',
      evaluatorName: evaluatorName || 'Technical Evaluator',
      evaluatorType: evaluatorType || 'DOMAIN_EXPERT',
      technicalFeasibility: Number(technicalFeasibility) || 0,
      teamCapability: Number(teamCapability) || 0,
      outcomeAlignment: Number(outcomeAlignment) || 0,
      costEfficiency: Number(costEfficiency) || 0,
      dataSecurityReadiness: Number(dataSecurityReadiness) || 0,
      weightedTotal,
      isBlind: false,
      finalized: true,
      qualitativeRemarks: qualitativeRemarks || 'Scored against MSInS rubric.',
      evaluatedAt: new Date().toISOString(),
    };

    // Replace if already exists from this evaluator, else push
    const existingIndex = evaluations.findIndex(
      e => e.applicationId === applicationId && e.evaluatorId === newEval.evaluatorId
    );
    if (existingIndex >= 0) {
      evaluations[existingIndex] = newEval;
    } else {
      evaluations.unshift(newEval);
    }

    // Recompute app average score
    const allForApp = evaluations.filter(e => e.applicationId === applicationId);
    const avgScore = allForApp.reduce((acc, curr) => acc + curr.weightedTotal, 0) / allForApp.length;
    const targetApp = applications.find(a => a.id === applicationId);
    if (targetApp) {
      targetApp.scoreAverage = Number(avgScore.toFixed(1));
      if (avgScore >= 80) {
        targetApp.status = 'SHORTLISTED';
      }
    }

    addAuditLog(
      'EVALUATION_SCORED',
      'Evaluation',
      newEval.id,
      newEval.evaluatorName,
      'EVALUATOR',
      'CVC Guidelines & MSInS Scoring Rubric',
      `Evaluation score ${weightedTotal}/100 recorded for Application ${applicationId}.`
    );

    res.status(201).json(newEval);
  });

  // 8. Pilots & Milestone Contracting
  app.get('/api/pilots', (req: Request, res: Response) => {
    res.json(pilots);
  });

  app.post('/api/pilots', (req: Request, res: Response) => {
    const body = req.body;
    const appRecord = applications.find(a => a.id === body.applicationId);
    const challengeRecord = challenges.find(c => c.id === body.challengeId);

    const newPilot: Pilot = {
      id: `plt_${Date.now()}`,
      challengeId: body.challengeId,
      challengeTitle: challengeRecord?.title || 'GovTech Challenge',
      applicationId: body.applicationId,
      startupId: appRecord?.startupId || 'usr_startup_01',
      startupName: appRecord?.startupName || 'Contracted Startup',
      departmentName: challengeRecord?.department || 'Government of Maharashtra',
      phase: 'PHASE_0_FEASIBILITY',
      status: 'DRAFTING_CONTRACT',
      totalGrantAmount: Number(body.totalGrantAmount) || 3000000,
      disbursedAmount: 0,
      contractTemplateVer: 'MSINS-PA-V2.1-IP-OPTION-A',
      eSignedByDepartment: false,
      eSignedByStartup: false,
      contractHash: generateHash(`PILOT:${body.challengeId}:${body.applicationId}`),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 86400000).toISOString(),
      milestones: [
        {
          id: `mls_${Date.now()}_1`,
          pilotId: `plt_${Date.now()}`,
          orderIndex: 1,
          title: 'Phase 0 Feasibility Sandbox Calibration',
          description: 'Deploy prototype in isolated sandbox with dummy/bounded dataset for 4 weeks.',
          baselineMetric: challengeRecord?.baselineMetric || 'Baseline',
          targetMetric: 'Achieve initial accuracy criteria in safe sandbox environment',
          currentMetric: 'Calibrating test datasets',
          kpiProgressPct: 20,
          trancheAmount: (Number(body.totalGrantAmount) || 3000000) * 0.25,
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          status: 'IN_PROGRESS',
        },
        {
          id: `mls_${Date.now()}_2`,
          pilotId: `plt_${Date.now()}`,
          orderIndex: 2,
          title: 'Phase 1 Bounded Live Pilot Deployment',
          description: 'Deploy across selected pilot locations with real operational data for 8 weeks.',
          baselineMetric: challengeRecord?.baselineMetric || 'Baseline',
          targetMetric: challengeRecord?.targetOutcome || 'Target Outcome',
          currentMetric: 'Preparing hardware and user onboarding',
          kpiProgressPct: 0,
          trancheAmount: (Number(body.totalGrantAmount) || 3000000) * 0.45,
          dueDate: new Date(Date.now() + 65 * 86400000).toISOString(),
          status: 'PENDING',
        },
        {
          id: `mls_${Date.now()}_3`,
          pilotId: `plt_${Date.now()}`,
          orderIndex: 3,
          title: 'Phase 2 Scale Decision & Outcome Certification',
          description: 'Independent validation audit and formulation of GFR 173 scaled procurement dossier.',
          baselineMetric: challengeRecord?.baselineMetric || 'Baseline',
          targetMetric: 'Independent confirmation of target outcome',
          currentMetric: 'Pending completion of Phase 1',
          kpiProgressPct: 0,
          trancheAmount: (Number(body.totalGrantAmount) || 3000000) * 0.3,
          dueDate: new Date(Date.now() + 90 * 86400000).toISOString(),
          status: 'PENDING',
        },
      ],
    };

    pilots.unshift(newPilot);

    if (appRecord) {
      appRecord.status = 'SELECTED_FOR_PILOT';
    }
    if (challengeRecord) {
      challengeRecord.status = 'PILOT_AWARDED';
      challengeRecord.pilotsCount = (challengeRecord.pilotsCount || 0) + 1;
    }

    addAuditLog(
      'PILOT_AWARDED',
      'Contract',
      newPilot.id,
      'MSInS Nodal Committee',
      'MSINS_ADMIN',
      'Maharashtra Startup Policy 2025, Section 5',
      `Pilot agreement drafted for ${newPilot.startupName} under ${newPilot.challengeTitle}.`
    );

    res.status(201).json(newPilot);
  });

  // e-Sign Pilot Agreement
  app.patch('/api/pilots/:id/sign', (req: Request, res: Response) => {
    const { signerRole } = req.body;
    const pilot = pilots.find(p => p.id === req.params.id);
    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    if (signerRole === 'DEPARTMENT_OFFICIAL') {
      pilot.eSignedByDepartment = true;
    } else if (signerRole === 'STARTUP') {
      pilot.eSignedByStartup = true;
    } else {
      pilot.eSignedByDepartment = true;
      pilot.eSignedByStartup = true;
    }

    if (pilot.eSignedByDepartment && pilot.eSignedByStartup) {
      pilot.status = 'CONTRACT_SIGNED';
      pilot.eSignedAt = new Date().toISOString();
      pilot.phase = 'PHASE_1_PILOT';

      addAuditLog(
        'PILOT_CONTRACT_E_SIGNED',
        'Contract',
        pilot.id,
        'Joint e-Signoff (Dept & Startup)',
        'DEPARTMENT_OFFICIAL',
        'Information Technology Act 2000',
        `Contract ${pilot.id} fully executed and transitioned to Phase 1 Pilot.`
      );
    }

    res.json(pilot);
  });

  // Update Milestone KPI & Status
  app.patch('/api/pilots/:pilotId/milestones/:milestoneId', (req: Request, res: Response) => {
    const { currentMetric, kpiProgressPct, status, auditNotes } = req.body;
    const pilot = pilots.find(p => p.id === req.params.pilotId);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const milestone = pilot.milestones.find(m => m.id === req.params.milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    if (currentMetric !== undefined) milestone.currentMetric = currentMetric;
    if (kpiProgressPct !== undefined) milestone.kpiProgressPct = Number(kpiProgressPct);
    if (status !== undefined) milestone.status = status;
    if (auditNotes !== undefined) milestone.auditNotes = auditNotes;

    res.json(milestone);
  });

  // PFMS / Treasury Tranche Disbursement Trigger
  app.post('/api/pilots/:pilotId/milestones/:milestoneId/disburse', (req: Request, res: Response) => {
    const pilot = pilots.find(p => p.id === req.params.pilotId);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const milestone = pilot.milestones.find(m => m.id === req.params.milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = 'DISBURSED';
    milestone.verifiedAt = new Date().toISOString();
    milestone.disbursedAt = new Date().toISOString();
    milestone.pfmsRefId = `PFMS-MH-TREASURY-${Date.now()}`;

    pilot.disbursedAmount = (pilot.disbursedAmount || 0) + milestone.trancheAmount;

    addAuditLog(
      'PFMS_TRANCHE_DISBURSED',
      'Payment',
      milestone.id,
      'Treasury & Accounts Officer, Finance Dept',
      'MSINS_ADMIN',
      'Maharashtra Finance Department GR / Treasury Code',
      `Disbursed INR ${milestone.trancheAmount} for milestone "${milestone.title}" via ref ${milestone.pfmsRefId}.`
    );

    addNotification(
      'Milestone Payment Disbursed',
      `INR ${milestone.trancheAmount.toLocaleString('en-IN')} released to ${pilot.startupName} under ${milestone.pfmsRefId}.`,
      'STARTUP',
      'PAYMENT'
    );

    res.json({ success: true, milestone, disbursedAmount: pilot.disbursedAmount });
  });

  // 9. Independent Validation Certificate (Stage 9)
  app.post('/api/validations', (req: Request, res: Response) => {
    const {
      pilotId,
      validatorId,
      validatorName,
      actualMetricAchieved,
      baselineVerified,
      targetVerified,
      scaleRecommendation,
      justificationNotes,
      outcomeCertified,
    } = req.body;

    const pilot = pilots.find(p => p.id === pilotId);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const certNumber = `MSINS-CERT-2025-${Math.floor(100 + Math.random() * 900)}`;
    const certHash = generateHash(`${certNumber}:${pilotId}:${actualMetricAchieved}`);

    const validationRecord = {
      id: `val_${Date.now()}`,
      pilotId,
      validatorId: validatorId || 'usr_val_01',
      validatorName: validatorName || 'Independent STQC Quality Certifier',
      outcomeCertified: outcomeCertified ?? true,
      actualMetricAchieved,
      baselineVerified,
      targetVerified,
      certificationNumber: certNumber,
      certificateHash: certHash,
      scaleRecommendation: scaleRecommendation || 'DIRECT_DEPARTMENT_PROCUREMENT',
      justificationNotes,
      gemCatalogReady: true,
      issuedAt: new Date().toISOString(),
    };

    pilot.validationRecord = validationRecord;
    pilot.status = 'COMPLETED';
    pilot.phase = 'PHASE_2_SCALE_DECISION';

    addAuditLog(
      'INDEPENDENT_VALIDATION_CERTIFIED',
      'Validation',
      validationRecord.id,
      validationRecord.validatorName,
      'INDEPENDENT_VALIDATOR',
      'GFR 2017 Rule 173(i) Post-Pilot Certification',
      `Certificate ${certNumber} issued with hash ${certHash.substring(0, 16)}... Recommendation: ${validationRecord.scaleRecommendation}.`
    );

    addNotification(
      'Independent Validation Certified',
      `Validation certificate issued for ${pilot.startupName}. Eligible for GFR 173 direct scale procurement.`,
      'DEPARTMENT_OFFICIAL',
      'VALIDATION'
    );

    res.status(201).json(validationRecord);
  });

  // 10. GeM Startup Runway Push (Mockable service)
  app.post('/api/gem/push', (req: Request, res: Response) => {
    const { pilotId, catalogPrice, warrantyMonths } = req.body;
    const pilot = pilots.find(p => p.id === pilotId);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const listingRef = `GEM-RUNWAY-MH-${Date.now()}`;

    addAuditLog(
      'GEM_RUNWAY_CATALOGED',
      'Contract',
      pilot.id,
      'GeM Integration Gateway',
      'MSINS_ADMIN',
      'Government e-Marketplace Startup Runway Framework',
      `Solution cataloged onto GeM Startup Runway under listing ID ${listingRef} backed by MSInS certificate.`
    );

    res.json({
      success: true,
      listingRef,
      status: 'PUBLISHED_TO_GEM_STARTUP_RUNWAY',
      startupName: pilot.startupName,
      pilotCertification: pilot.validationRecord?.certificationNumber,
      catalogPrice: catalogPrice || pilot.totalGrantAmount,
      publishedAt: new Date().toISOString(),
    });
  });

  // 11. Templates Library
  app.get('/api/templates', (req: Request, res: Response) => {
    res.json(templates);
  });

  // ═══════════════════════════════════════════════════════════
  // DEPARTMENT MODULE API ENDPOINTS (SIH 26136)
  // ═══════════════════════════════════════════════════════════

  // List all departments with filter
  app.get('/api/departments', (req: Request, res: Response) => {
    const { status, type } = req.query;
    let result = [...departments];
    if (status && typeof status === 'string') {
      result = result.filter(d => d.verificationStatus === status);
    }
    if (type && typeof type === 'string') {
      result = result.filter(d => d.departmentType === type);
    }
    res.json(result);
  });

  // Get department detail by id
  app.get('/api/departments/:id', (req: Request, res: Response) => {
    const dept = departments.find(d => d.id === req.params.id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    const deptChallenges = challenges.filter(c => c.departmentId === dept.id || c.department.toLowerCase().includes(dept.name.toLowerCase()));
    res.json({
      ...dept,
      challenges: deptChallenges,
    });
  });

  // Register new department (gated access, document verification required)
  app.post('/api/departments/register', (req: Request, res: Response) => {
    const body = req.body;
    const {
      name,
      departmentType,
      address,
      district,
      nodalOfficialName,
      nodalOfficialDesignation,
      nodalEmail,
      nodalPhone,
      otpVerified,
      documents,
    } = body;

    if (!name || !nodalOfficialName || !nodalEmail) {
      return res.status(400).json({ error: 'Department name, nodal official name, and official email are required.' });
    }

    // Email domain validation
    const isGovEmail = /@(maharashtra\.gov\.in|gov\.in|nic\.in|.*\.gov\.in)$/i.test(nodalEmail.trim());
    if (!isGovEmail) {
      return res.status(400).json({
        error: 'Access restricted: Email must be an authorized government domain (@maharashtra.gov.in, @gov.in, @nic.in).',
      });
    }

    // Document requirement check
    const docs = Array.isArray(documents) ? documents : [];
    const hasGovtId = docs.some(d => d.docType === 'GOVT_ID_PROOF');
    const hasAuthLetter = docs.some(d => d.docType === 'AUTHORIZATION_LETTER');
    const hasGazette = docs.some(d => d.docType === 'ESTABLISHMENT_GAZETTE');

    if (!hasGovtId || !hasAuthLetter || !hasGazette) {
      return res.status(400).json({
        error: 'All 3 mandatory verification documents must be uploaded: Government ID Proof, Department Authorization Letter, and Department Establishment Gazette/Order.',
      });
    }

    const deptId = `dept_${Date.now()}`;
    const initialOfficialId = `usr_dept_${Date.now()}`;

    const uploadedDocs: DocumentAttachment[] = docs.map((d: any, idx: number) => ({
      id: `doc_${deptId}_${idx + 1}`,
      ownerType: 'DEPARTMENT',
      ownerId: deptId,
      title: d.title || d.fileName,
      docType: d.docType,
      fileName: d.fileName || `document_${idx + 1}.pdf`,
      fileSize: d.fileSize || '2.4 MB',
      verificationStatus: 'PENDING',
      uploadedAt: new Date().toISOString(),
    }));

    const initialOfficial: DepartmentOfficial = {
      id: initialOfficialId,
      departmentId: deptId,
      departmentName: name,
      name: nodalOfficialName,
      designation: nodalOfficialDesignation || 'Nodal Official',
      email: nodalEmail,
      phone: nodalPhone || '',
      roleInDept: 'ADMIN',
      verificationStatus: 'PENDING',
      govtIdDocName: uploadedDocs.find(d => d.docType === 'GOVT_ID_PROOF')?.fileName,
      createdAt: new Date().toISOString(),
    };

    const newDepartment: Department = {
      id: deptId,
      name,
      departmentType: departmentType || 'STATE_DEPARTMENT',
      address: address || '',
      district: district || 'Mumbai',
      state: 'Maharashtra',
      nodalOfficialName,
      nodalOfficialDesignation: nodalOfficialDesignation || 'Nodal Officer',
      nodalEmail,
      nodalPhone: nodalPhone || '',
      isEmailVerified: true,
      isPhoneVerified: Boolean(otpVerified),
      verificationStatus: 'UNDER_REVIEW',
      verificationNotes: 'Submitted for MSInS Admin identity verification and gazette validation.',
      badgeIssued: false,
      officials: [initialOfficial],
      documents: uploadedDocs,
      createdAt: new Date().toISOString(),
    };

    departments.unshift(newDepartment);

    // Also register user into users list
    users.push({
      id: initialOfficialId,
      name: nodalOfficialName,
      email: nodalEmail,
      role: 'DEPARTMENT_OFFICIAL',
      departmentId: deptId,
      departmentName: name,
      designation: nodalOfficialDesignation,
      officialRoleInDept: 'ADMIN',
      phone: nodalPhone,
      isVerified: false,
    });

    addAuditLog(
      'DEPARTMENT_REGISTRATION_SUBMITTED',
      'Department',
      newDepartment.id,
      nodalOfficialName,
      'DEPARTMENT_OFFICIAL',
      'Maharashtra Innovation Society Department Empanelment Protocol',
      `Department "${newDepartment.name}" submitted for verification with 3 statutory documents. Nodal: ${nodalOfficialName} (${nodalEmail}).`
    );

    addNotification(
      'New Department Registration Pending Review',
      `${newDepartment.name} submitted registration dossier. 3 verification documents awaiting MSInS signoff.`,
      'MSINS_ADMIN',
      'VALIDATION'
    );

    res.status(201).json({
      success: true,
      message: 'Registration dossier received successfully. Your application is under MSInS review.',
      department: newDepartment,
    });
  });

  // MSInS Admin decision on department verification
  app.patch('/api/departments/:id/verification', (req: Request, res: Response) => {
    const { status, reason, adminName } = req.body;
    const dept = departments.find(d => d.id === req.params.id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (!['APPROVED', 'REJECTED', 'NEEDS_MORE_INFO'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    dept.verificationStatus = status;
    dept.verificationNotes = reason || `Verification status transitioned to ${status} by MSInS Admin.`;
    
    if (status === 'APPROVED') {
      dept.badgeIssued = true;
      dept.approvedAt = new Date().toISOString();
      dept.approvedBy = adminName || 'MSInS Super Admin';
      
      // Approve all officials and documents
      dept.officials.forEach(o => { o.verificationStatus = 'VERIFIED'; });
      dept.documents.forEach(d => { d.verificationStatus = 'VERIFIED'; });

      // Update in users table
      users.forEach(u => {
        if (u.departmentId === dept.id) {
          u.isVerified = true;
        }
      });
    } else {
      dept.badgeIssued = false;
      if (status === 'REJECTED') {
        dept.officials.forEach(o => { o.verificationStatus = 'REJECTED'; });
      }
    }

    addAuditLog(
      `DEPARTMENT_VERIFICATION_${status}`,
      'Department',
      dept.id,
      adminName || 'Nidhi More, MSInS Admin',
      'MSINS_ADMIN',
      'Maharashtra State Innovation Society Gated Access Framework',
      `Department "${dept.name}" verification set to ${status}. Remarks: ${dept.verificationNotes}`
    );

    addNotification(
      `Department Verification ${status}`,
      `Your department registration has been ${status.toLowerCase().replace('_', ' ')}. ${reason || ''}`,
      'DEPARTMENT_OFFICIAL',
      'VALIDATION'
    );

    res.json({
      success: true,
      department: dept,
    });
  });

  // Officials under a department
  app.get('/api/departments/:id/officials', (req: Request, res: Response) => {
    const dept = departments.find(d => d.id === req.params.id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(dept.officials);
  });

  // Add official under an approved department
  app.post('/api/departments/:id/officials', (req: Request, res: Response) => {
    const dept = departments.find(d => d.id === req.params.id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const { name, designation, email, phone, roleInDept, govtIdDocName, registeredBy } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and official email are required' });
    }

    const isGovEmail = /@(maharashtra\.gov\.in|gov\.in|nic\.in|.*\.gov\.in)$/i.test(email.trim());
    if (!isGovEmail) {
      return res.status(400).json({ error: 'Official email must be a valid government domain (@maharashtra.gov.in, @gov.in, @nic.in)' });
    }

    const newOfficial: DepartmentOfficial = {
      id: `usr_dept_${Date.now()}`,
      departmentId: dept.id,
      departmentName: dept.name,
      name,
      designation: designation || 'Officer',
      email,
      phone: phone || '',
      roleInDept: roleInDept === 'ADMIN' ? 'ADMIN' : 'MEMBER',
      verificationStatus: dept.verificationStatus === 'APPROVED' ? 'VERIFIED' : 'PENDING',
      govtIdDocName: govtIdDocName || 'Govt_Employee_Card.pdf',
      createdAt: new Date().toISOString(),
    };

    dept.officials.push(newOfficial);

    users.push({
      id: newOfficial.id,
      name: newOfficial.name,
      email: newOfficial.email,
      role: 'DEPARTMENT_OFFICIAL',
      departmentId: dept.id,
      departmentName: dept.name,
      designation: newOfficial.designation,
      officialRoleInDept: newOfficial.roleInDept,
      phone: newOfficial.phone,
      isVerified: newOfficial.verificationStatus === 'VERIFIED',
    });

    addAuditLog(
      'DEPARTMENT_OFFICIAL_ADDED',
      'Department',
      dept.id,
      registeredBy || 'Department Admin',
      'DEPARTMENT_OFFICIAL',
      'Department Multi-Tier Access Control',
      `Added official ${newOfficial.name} (${newOfficial.roleInDept}) to ${dept.name}.`
    );

    res.status(201).json(newOfficial);
  });

  // Evaluators pool
  app.get('/api/evaluators/pool', (req: Request, res: Response) => {
    res.json(evaluatorPool);
  });

  // Evaluator assignments for a challenge
  app.get('/api/challenges/:id/evaluators', (req: Request, res: Response) => {
    const list = evaluatorAssignments.filter(a => a.challengeId === req.params.id);
    res.json(list);
  });

  // Assign evaluator to challenge
  app.post('/api/challenges/:id/evaluators', (req: Request, res: Response) => {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const { evaluatorId, assignedBy } = req.body;
    const profile = evaluatorPool.find(e => e.id === evaluatorId);
    if (!profile) {
      return res.status(404).json({ error: 'Evaluator profile not found' });
    }

    // Check if already assigned
    const exists = evaluatorAssignments.some(a => a.challengeId === challenge.id && a.evaluatorId === profile.id);
    if (exists) {
      return res.status(400).json({ error: 'Evaluator is already assigned to this challenge' });
    }

    // Check non-official evaluator rules
    if (!profile.isOfficial && !challenge.allowNonOfficialEvaluators) {
      return res.status(400).json({
        error: 'Non-official evaluators are disabled for this challenge. Please enable the non-official evaluator toggle first.',
      });
    }

    const newAssignment: EvaluatorAssignment = {
      id: `asn_${Date.now()}`,
      challengeId: challenge.id,
      evaluatorId: profile.id,
      evaluatorName: profile.name,
      evaluatorEmail: profile.email,
      evaluatorOrganization: profile.organization,
      evaluatorType: profile.type,
      isOfficial: profile.isOfficial,
      departmentApproved: true,
      status: 'INVITED',
      assignedAt: new Date().toISOString(),
    };

    evaluatorAssignments.push(newAssignment);

    addAuditLog(
      'EVALUATOR_ASSIGNED_TO_CHALLENGE',
      'Challenge',
      challenge.id,
      assignedBy || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Maharashtra Startup Policy 2025 Multi-Tier Evaluation Protocol',
      `Assigned ${profile.name} (${profile.isOfficial ? 'Official Govt Expert' : 'Independent Expert'}) to ${challenge.code}.`
    );

    addNotification(
      'Evaluation Invitation Received',
      `You have been invited to evaluate proposals for challenge ${challenge.code}: "${challenge.title}".`,
      'EVALUATOR',
      'EVALUATION'
    );

    res.status(201).json(newAssignment);
  });

  // Toggle department approval or status of evaluator assignment
  app.patch('/api/challenges/:id/evaluators/:assignmentId', (req: Request, res: Response) => {
    const assignment = evaluatorAssignments.find(a => a.id === req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const { departmentApproved, status, actorName } = req.body;
    if (typeof departmentApproved === 'boolean') {
      assignment.departmentApproved = departmentApproved;
    }
    if (status) {
      assignment.status = status;
    }

    addAuditLog(
      'EVALUATOR_ASSIGNMENT_UPDATED',
      'Challenge',
      assignment.challengeId,
      actorName || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Evaluator Panel Oversight',
      `Updated assignment for ${assignment.evaluatorName}: Approved=${assignment.departmentApproved}, Status=${assignment.status}`
    );

    res.json(assignment);
  });

  // Application status management by department (Shortlist, Reject, Hold)
  app.patch('/api/challenges/:id/applications/:appId/status', (req: Request, res: Response) => {
    const appRecord = applications.find(a => a.id === req.params.appId);
    if (!appRecord) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { status, actorName, reason } = req.body;
    appRecord.status = status;

    addAuditLog(
      `APPLICATION_${status}`,
      'Application',
      appRecord.id,
      actorName || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Application Screening Protocol',
      `Startup "${appRecord.startupName}" application set to ${status}. Note: ${reason || 'Processed by Department Committee'}`
    );

    addNotification(
      `Application Status Update: ${status}`,
      `Your application for challenge has been moved to ${status}.`,
      'STARTUP',
      'APPLICATION'
    );

    res.json(appRecord);
  });

  // Round 2 Interview Meetings for challenge
  app.get('/api/challenges/:id/interviews', (req: Request, res: Response) => {
    const list = interviewMeetings.filter(m => m.challengeId === req.params.id);
    res.json(list);
  });

  // Schedule a Round 2 Interview
  app.post('/api/challenges/:id/interviews', (req: Request, res: Response) => {
    const {
      applicationId,
      startupId,
      startupName,
      scheduledDate,
      scheduledTime,
      mode,
      meetingLocationOrUrl,
      panelists,
      scheduledBy,
    } = req.body;

    const newMeeting: InterviewMeeting = {
      id: `meet_${Date.now()}`,
      challengeId: req.params.id,
      applicationId,
      startupId,
      startupName,
      scheduledDate,
      scheduledTime,
      mode: mode || 'ONLINE_LINK',
      meetingLocationOrUrl: meetingLocationOrUrl || 'https://meet.gov.in/msins-round2-interview',
      panelists: Array.isArray(panelists) ? panelists : ['Department Committee'],
      status: 'SCHEDULED',
    };

    interviewMeetings.push(newMeeting);

    // Update application status
    const appRecord = applications.find(a => a.id === applicationId);
    if (appRecord) {
      appRecord.status = 'ROUND_2_INTERVIEW' as any;
    }

    addAuditLog(
      'INTERVIEW_MEETING_SCHEDULED',
      'Application',
      applicationId,
      scheduledBy || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Two-Round Startup Procurement Evaluation Framework',
      `Scheduled Round 2 presentation for "${startupName}" on ${scheduledDate} at ${scheduledTime} (${newMeeting.mode}).`
    );

    addNotification(
      'Round 2 Presentation & Interview Scheduled',
      `Your startup "${startupName}" has advanced to Round 2. Meeting on ${scheduledDate} at ${scheduledTime}.`,
      'STARTUP',
      'APPLICATION'
    );

    res.status(201).json(newMeeting);
  });

  // Record interview qualitative assessment & recommendation
  app.patch('/api/challenges/:id/interviews/:interviewId', (req: Request, res: Response) => {
    const meeting = interviewMeetings.find(m => m.id === req.params.interviewId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const { notes, recommendation, assessedBy } = req.body;
    meeting.notes = notes;
    meeting.recommendation = recommendation;
    meeting.status = 'COMPLETED';
    meeting.assessedAt = new Date().toISOString();
    meeting.assessedBy = assessedBy || 'Department Evaluation Panel';

    addAuditLog(
      'INTERVIEW_ASSESSMENT_COMPLETED',
      'Application',
      meeting.applicationId,
      assessedBy || 'Department Evaluation Panel',
      'DEPARTMENT_OFFICIAL',
      'Round 2 Qualitative Review Standard',
      `Assessment for "${meeting.startupName}" completed with recommendation: ${recommendation}. Notes: ${notes?.substring(0, 100)}...`
    );

    res.json(meeting);
  });

  // Finalize challenge and select startup for pilot
  app.post('/api/challenges/:id/finalize', (req: Request, res: Response) => {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const {
      applicationId,
      startupId,
      startupName,
      round1Score,
      round2Recommendation,
      decisionNote,
      decidedBy,
    } = req.body;

    if (!decisionNote || decisionNote.trim().length < 10) {
      return res.status(400).json({
        error: 'Statutory decision note is required for the public procurement audit trail.',
      });
    }

    const decision: FinalizationDecision = {
      id: `fin_${Date.now()}`,
      challengeId: challenge.id,
      applicationId,
      startupId,
      startupName,
      round1Score: Number(round1Score) || 85,
      round2Recommendation,
      decisionNote,
      decidedBy: decidedBy || 'Department Official (Admin)',
      decidedAt: new Date().toISOString(),
      status: 'SELECTED_FOR_PILOT',
      handoffStatus: 'CONTRACTING_PENDING',
    };

    finalizations.unshift(decision);

    // Update challenge and application
    challenge.status = 'FINALIZED';
    const appRecord = applications.find(a => a.id === applicationId);
    if (appRecord) {
      appRecord.status = 'PILOT_AWARDED';
    }

    addAuditLog(
      'PILOT_SELECTION_FINALIZED',
      'Challenge',
      challenge.id,
      decidedBy || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'GFR 2017 Rule 173(i) Milestone Pilot Selection Order',
      `Startup "${startupName}" finalized for pilot under Challenge ${challenge.code}. Score: ${decision.round1Score}/100. Rec: ${decision.round2Recommendation}.`
    );

    addNotification(
      'Selected for Government Pilot!',
      `Congratulations! Your solution has been selected by ${challenge.department} for Pilot Deployment. Proceeding to Milestone Contract.`,
      'STARTUP',
      'CONTRACT'
    );

    addNotification(
      'Challenge Finalized & Pilot Selected',
      `${challenge.code} completed 2-round evaluation. Selected startup: ${startupName}. Contracting stage opened.`,
      'MSINS_ADMIN',
      'EVALUATION'
    );

    res.json({
      success: true,
      decision,
      challenge,
      message: 'Challenge finalized successfully. Decision note recorded in compliance audit log.',
    });
  });

  // Update challenge status (Draft -> Submit for Review -> Live -> Closed)
  app.patch('/api/challenges/:id/status', (req: Request, res: Response) => {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const { status, actorName, notes } = req.body;
    challenge.status = status;

    addAuditLog(
      `CHALLENGE_STATUS_${status}`,
      'Challenge',
      challenge.id,
      actorName || 'Department Official',
      'DEPARTMENT_OFFICIAL',
      'Challenge Lifecycle Management',
      `Challenge ${challenge.code} transitioned to status ${status}. Remarks: ${notes || 'Updated via portal'}`
    );

    res.json(challenge);
  });

  // 12. Audit Logs & Compliance Trail
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json(auditLogs);
  });

  // 13. Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  // 14. MSInS Admin / Command Center Metrics
  app.get('/api/stats', (req: Request, res: Response) => {
    const totalChallenges = challenges.length;
    const totalApplications = applications.length;
    const activePilots = pilots.filter(p => p.status === 'IN_PROGRESS' || p.status === 'CONTRACT_SIGNED').length;
    const totalDisbursed = pilots.reduce((sum, p) => sum + (p.disbursedAmount || 0), 0);
    const totalCommitted = pilots.reduce((sum, p) => sum + (p.totalGrantAmount || 0), 0);
    const certifiedPilots = pilots.filter(p => p.validationRecord?.outcomeCertified).length;
    const successRate = pilots.length > 0 ? Math.round((certifiedPilots / pilots.length) * 100) : 100;
    const departments = new Set(challenges.map(c => c.department)).size;

    res.json({
      totalChallenges,
      totalApplications,
      activePilots,
      certifiedPilots,
      totalDisbursed,
      totalCommitted,
      successRate,
      departmentsEngaged: departments,
      avgTimeToPaymentDays: 4.8, // benchmark vs conventional 180 days
      gfr173ExemptionsGranted: applications.filter(a => a.gfrTurnoverRelaxed).length,
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahayog MSInS Procurement Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
