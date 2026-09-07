import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Department, DepartmentOfficial, OfficialRoleInDept } from '../../types';

interface DepartmentOfficialsTeamProps {
  department: Department;
  currentOfficialRole: OfficialRoleInDept;
  onAddOfficial: (newOfficialData: any) => Promise<void>;
}

export const DepartmentOfficialsTeam: React.FC<DepartmentOfficialsTeamProps> = ({
  department,
  currentOfficialRole,
  onAddOfficial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleInDept, setRoleInDept] = useState<OfficialRoleInDept>('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const officials = department.officials || [];
  const isAdmin = currentOfficialRole === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const isGovEmail = /@(maharashtra\.gov\.in|gov\.in|nic\.in|.*\.gov\.in)$/i.test(email.trim());
    if (!isGovEmail) {
      setErrorMsg('Access Restricted: Official email ID must belong to an approved government domain (@maharashtra.gov.in, @gov.in, @nic.in).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddOfficial({
        name: name.trim(),
        designation: designation.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        roleInDept,
        govtIdDocName: 'Govt_Officer_EmpID_Proof.pdf',
      });
      setIsSubmitting(false);
      setShowAddModal(false);
      setName('');
      setDesignation('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to add official');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Access Level Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Department Personnel & Role-Based Access Control
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Registered Government Officials ({officials.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-tier access management for challenge publishing and evaluation panels.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition flex items-center space-x-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Department Official</span>
          </button>
        )}
      </div>

      {/* Role Permissions Matrix Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Department Admin (Nodal Authority)</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Authorized to approve and publish live challenges, empanel external evaluators, manage departmental officers, and execute statutory pilot finalization resolutions.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <Shield className="w-4 h-4 text-slate-600" />
            <span>Department Member (Officer / Specialist)</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Authorized to draft new problem statements, inspect incoming startup application dossiers, participate in Round 1/2 committee evaluations, and log qualitative assessment notes.
          </p>
        </div>
      </div>

      {/* Officials List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Official Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Govt Email & Contact</th>
                <th className="px-4 py-3">Department Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {officials.map(off => (
                <tr key={off.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{off.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">ID: {off.id}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {off.designation}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-mono text-slate-800 flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{off.email}</span>
                    </div>
                    {off.phone && (
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{off.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        off.roleInDept === 'ADMIN'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {off.roleInDept === 'ADMIN' ? 'Admin Official' : 'Member Official'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        off.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : off.verificationStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {off.verificationStatus === 'VERIFIED' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Verified
                        </>
                      ) : (
                        off.verificationStatus
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Official Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold">
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>Empanel Department Official</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Sawant"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deputy Secretary"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role in Department *
                  </label>
                  <select
                    value={roleInDept}
                    onChange={e => setRoleInDept(e.target.value as OfficialRoleInDept)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                  >
                    <option value="MEMBER">Member (Reviewer / Drafter)</option>
                    <option value="ADMIN">Admin (Signatory & Manager)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Government Email ID *
                </label>
                <input
                  type="email"
                  required
                  placeholder="pooja.sawant@maharashtra.gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Must end with @maharashtra.gov.in, @gov.in, or @nic.in
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for 2FA)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 55432"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition"
                >
                  {isSubmitting ? 'Registering...' : 'Register Official'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
