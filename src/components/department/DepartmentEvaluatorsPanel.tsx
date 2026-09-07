import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building,
  GraduationCap,
  Clock,
  Send,
  Plus,
} from 'lucide-react';
import {
  Challenge,
  EvaluatorAssignment,
  EvaluatorProfile,
  EvaluatorType,
} from '../../types';

interface DepartmentEvaluatorsPanelProps {
  challenges: Challenge[];
  selectedChallengeId: string;
  onSelectChallenge: (id: string) => void;
  assignments: EvaluatorAssignment[];
  evaluatorPool: EvaluatorProfile[];
  onAssignEvaluator: (evaluatorId: string) => Promise<void>;
  onToggleApproval: (assignmentId: string, approved: boolean) => Promise<void>;
  onToggleNonOfficialAllowed: (challengeId: string, allowed: boolean) => Promise<void>;
}

export const DepartmentEvaluatorsPanel: React.FC<DepartmentEvaluatorsPanelProps> = ({
  challenges,
  selectedChallengeId,
  onSelectChallenge,
  assignments,
  evaluatorPool,
  onAssignEvaluator,
  onToggleApproval,
  onToggleNonOfficialAllowed,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAssigning, setIsAssigning] = useState(false);

  const activeChallenge = challenges.find(c => c.id === selectedChallengeId) || challenges[0];
  const challengeAssignments = assignments.filter(a => a.challengeId === activeChallenge?.id);

  const officialCount = challengeAssignments.filter(a => a.isOfficial).length;
  const nonOfficialCount = challengeAssignments.filter(a => !a.isOfficial).length;
  const minRequired = activeChallenge?.minEvaluatorsRequired || 3;
  const hasOfficialMandateSatisfied = officialCount >= 1;
  const meetsQuorum = challengeAssignments.length >= minRequired;

  const handleAssign = async (evaluatorId: string) => {
    setIsAssigning(true);
    try {
      await onAssignEvaluator(evaluatorId);
      setIsAssigning(false);
    } catch (err: any) {
      setIsAssigning(false);
      alert(err.message || 'Failed to assign evaluator');
    }
  };

  const filteredPool = evaluatorPool.filter(e => {
    if (filterType === 'OFFICIAL') return e.isOfficial;
    if (filterType === 'NON_OFFICIAL') return !e.isOfficial;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Challenge Selector & Rules Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Evaluation Panel Oversight
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Evaluator Committee Panel & Multi-Tier Quorum
            </h3>
          </div>

          <div className="w-full md:w-80">
            <select
              value={activeChallenge?.id || ''}
              onChange={e => onSelectChallenge(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
            >
              {challenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title.substring(0, 40)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quorum and Statutory Compliance Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              hasOfficialMandateSatisfied
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Official Govt Mandate
              </span>
              <span className="text-sm font-bold text-slate-900">
                {officialCount} Official Evaluator{officialCount !== 1 ? 's' : ''}
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {hasOfficialMandateSatisfied ? 'Statutory requirement met' : 'Min 1 official required'}
              </p>
            </div>
            {hasOfficialMandateSatisfied ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>

          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              meetsQuorum ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Committee Quorum
              </span>
              <span className="text-sm font-bold text-slate-900">
                {challengeAssignments.length} / {minRequired} Minimum
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {meetsQuorum ? 'Quorum satisfied' : `${minRequired - challengeAssignments.length} more needed`}
              </p>
            </div>
            <Users className="w-5 h-5 text-blue-700" />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Non-Official Evaluators
              </span>
              <span className="text-sm font-bold text-slate-900">
                {activeChallenge?.allowNonOfficialEvaluators ? 'Enabled' : 'Disabled'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {nonOfficialCount} independent experts assigned
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeChallenge?.allowNonOfficialEvaluators ?? true}
                onChange={e => onToggleNonOfficialAllowed(activeChallenge.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid: Assigned Evaluators vs Evaluator Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Evaluators (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-blue-700" />
              <span>Assigned Committee Panel ({challengeAssignments.length})</span>
            </h4>
            <span className="text-[11px] text-slate-500">Must be empanelled before scoring</span>
          </div>

          {challengeAssignments.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center space-y-2 text-slate-500 text-xs">
              <Users className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold">No evaluators assigned yet</p>
              <p className="text-[11px] text-slate-400">
                Select vetted experts from the MSInS pool on the right to build your evaluation committee.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {challengeAssignments.map(asgn => (
                <div
                  key={asgn.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{asgn.evaluatorName}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.2 rounded text-[10px] font-bold ${
                            asgn.isOfficial
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {asgn.isOfficial ? (
                            <>
                              <ShieldCheck className="w-3 h-3 mr-1 text-blue-700" />
                              Official Govt Expert
                            </>
                          ) : (
                            'External Specialist'
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{asgn.evaluatorOrganization}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{asgn.evaluatorEmail}</p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        asgn.status === 'SCORING_COMPLETE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : asgn.status === 'SCORING_IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : asgn.status === 'ACCEPTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {asgn.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={asgn.departmentApproved}
                        onChange={e => onToggleApproval(asgn.id, e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-800 focus:ring-blue-700"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">
                        Department Committee Approval
                      </span>
                    </label>

                    <span className="text-[11px] text-slate-400">
                      Assigned: {new Date(asgn.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MSInS Vetted Evaluator Pool (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Building className="w-4 h-4 text-slate-600" />
              <span>MSInS Empanelled Evaluator Pool</span>
            </h4>

            {/* Filter pills */}
            <div className="flex items-center space-x-1">
              {['ALL', 'OFFICIAL', 'NON_OFFICIAL'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    filterType === type
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type === 'OFFICIAL' ? 'Govt Officials' : 'External'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredPool.map(expert => {
              const isAlreadyAssigned = challengeAssignments.some(a => a.evaluatorId === expert.id);

              return (
                <div
                  key={expert.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{expert.name}</span>
                        {expert.isOfficial ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <ShieldCheck className="w-3 h-3 mr-0.5 text-blue-700" />
                            Official
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {expert.type === 'ACADEMIC' ? 'Academic' : 'Industry Specialist'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{expert.designation}</p>
                      <p className="text-[11px] text-slate-500">{expert.organization}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyAssigned || isAssigning}
                      onClick={() => handleAssign(expert.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
                        isAlreadyAssigned
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xs'
                      }`}
                    >
                      {isAlreadyAssigned ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Assigned</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Assign to Panel</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {expert.specialization.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
