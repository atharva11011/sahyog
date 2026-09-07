import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Department } from '../../types';

interface MsinsRegistrationReviewModalProps {
  isOpen: boolean;
  department: Department | null;
  onClose: () => void;
  onDecision: (deptId: string, status: 'APPROVED' | 'REJECTED' | 'NEEDS_MORE_INFO', reason: string) => Promise<void>;
}

export const MsinsRegistrationReviewModal: React.FC<MsinsRegistrationReviewModalProps> = ({
  isOpen,
  department,
  onClose,
  onDecision,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'APPROVED' | 'REJECTED' | 'NEEDS_MORE_INFO'>('APPROVED');
  const [reasonNotes, setReasonNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDocPreview, setActiveDocPreview] = useState<string | null>(null);

  if (!isOpen || !department) return null;

  const handleSubmitDecision = async () => {
    if (selectedStatus !== 'APPROVED' && !reasonNotes.trim()) {
      alert('Please provide a reason or clarification request for this decision.');
      return;
    }

    setIsProcessing(true);
    try {
      await onDecision(department.id, selectedStatus, reasonNotes);
      setIsProcessing(false);
      onClose();
    } catch (err) {
      setIsProcessing(false);
      alert('Failed to record verification decision.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-800 border border-blue-600 flex items-center justify-center font-bold text-amber-300 text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                MSInS Super Admin Oversight • Verification Queue
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Review Department Registration Dossier
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Department Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-1">
                  {department.departmentType.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900">{department.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  District: <span className="font-semibold text-slate-700">{department.district}</span> • State: {department.state}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    department.verificationStatus === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : department.verificationStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {department.verificationStatus.replace('_', ' ')}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  Logged: {new Date(department.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Nodal Officer</span>
                <span className="font-semibold text-slate-800">{department.nodalOfficialName}</span>
                <span className="text-slate-500 block text-[11px]">{department.nodalOfficialDesignation}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Govt Email</span>
                <span className="font-mono text-slate-800 font-medium break-all">{department.nodalEmail}</span>
                <span className="text-emerald-700 font-semibold block text-[11px]">Domain Validated</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Mobile</span>
                <span className="font-mono text-slate-800 font-medium">{department.nodalPhone}</span>
                <span className="text-emerald-700 font-semibold block text-[11px]">OTP Authenticated</span>
              </div>
            </div>
          </div>

          {/* Uploaded Verification Documents Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-slate-500" />
                <span>Submitted Verification Dossier ({department.documents?.length || 0} Documents)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Click preview to inspect credentials</span>
            </div>

            <div className="space-y-2">
              {department.documents && department.documents.length > 0 ? (
                department.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{doc.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="font-mono">{doc.fileName}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" /> PDF Signed
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDocPreview(doc.fileName)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition"
                    >
                      <span>Preview Doc</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  No documents found in dossier
                </div>
              )}
            </div>

            {/* Document Preview Drawer/Modal simulator */}
            {activeDocPreview && (
              <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 font-mono">{activeDocPreview}</span>
                    <span className="text-slate-400">(Encrypted Government Repository Preview)</span>
                  </div>
                  <button
                    onClick={() => setActiveDocPreview(null)}
                    className="text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
                <div className="p-3 bg-slate-800 rounded font-mono text-[11px] text-slate-300 space-y-1">
                  <p className="text-emerald-400 font-semibold">✓ Document Authenticity Signature: VALID</p>
                  <p>Issuer: Government of Maharashtra Mantralaya General Administration Dept</p>
                  <p>Certificate Serial: MH-MSINS-DOC-{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                  <p className="text-slate-400">Timestamp: {new Date().toISOString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Decision Section */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              MSInS Administrative Decision
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedStatus('APPROVED')}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedStatus === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approve & Grant Verified Badge</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Grants full access to publish challenges and manage public procurement pilots.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('NEEDS_MORE_INFO')}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedStatus === 'NEEDS_MORE_INFO'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Request More Information</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Requests official letterhead clarification or additional gazette orders.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('REJECTED')}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedStatus === 'REJECTED'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-xs text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Registration</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Disallows access due to invalid credentials, private domains, or duplicate entities.
                </p>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Verification Notes / Feedback Remarks *
              </label>
              <textarea
                rows={3}
                required={selectedStatus !== 'APPROVED'}
                placeholder={
                  selectedStatus === 'APPROVED'
                    ? 'Verified against official Government of Maharashtra Mantralaya personnel records. Department verified badge granted.'
                    : 'Detail the statutory grounds for rejection or the specific additional documents required from the nodal officer...'
                }
                value={reasonNotes}
                onChange={e => setReasonNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This note is permanently recorded in the public procurement audit trail and notified to the department nodal officer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Actor: Nidhi More, Joint CEO (MSInS Super Admin)
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitDecision}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition flex items-center space-x-1.5 ${
                selectedStatus === 'APPROVED'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : selectedStatus === 'REJECTED'
                  ? 'bg-rose-700 hover:bg-rose-800'
                  : 'bg-amber-700 hover:bg-amber-800'
              }`}
            >
              {isProcessing ? (
                <span>Writing Audit Log...</span>
              ) : (
                <span>Confirm {selectedStatus.replace('_', ' ')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
