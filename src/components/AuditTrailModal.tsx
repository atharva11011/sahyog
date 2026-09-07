import React, { useState } from 'react';
import {
  X,
  History,
  ShieldCheck,
  Search,
  Lock,
  ExternalLink,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'ALL' || log.entityType === filterType;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.policyBasis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hashProof.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col">
        {/* Header */}
        <div className="p-5.5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Immutable Compliance Audit Trail
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                  SHA-256 Tamper-Evident
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Timestamped cryptographic proof for CVC, CAG, and Maharashtra State Vigilance defensibility
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

        {/* Filter bar */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search action, actor, or hash proof..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200/80 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Challenge', 'Application', 'Evaluation', 'Contract', 'Payment', 'Validation'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  filterType === t
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Logs List Bento entries */}
        <div className="p-5 overflow-y-auto max-h-[560px] space-y-3">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-4 bg-slate-50/50 hover:bg-slate-50/90 rounded-2xl border border-slate-200/70 transition-all space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-md text-[11px] shadow-2xs">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full font-mono">
                    {log.entityType}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-slate-700 font-medium leading-relaxed">
                {log.details}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/50">
                <div>
                  Actor: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole})
                  {log.policyBasis && (
                    <span className="ml-2 text-emerald-700 font-mono text-[10px] bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      Basis: {log.policyBasis}
                    </span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs bg-white px-2 py-0.5 rounded border border-slate-200/60">
                  Proof: {log.hashProof}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
