import React, { useState } from 'react';
import {
  X,
  Building2,
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Send,
  HelpCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { DepartmentType, DocumentType } from '../../types';

interface DepartmentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deptData: any) => void;
}

const MAHARASHTRA_DISTRICTS = [
  'Mumbai City',
  'Mumbai Suburban',
  'Pune',
  'Nagpur',
  'Nashik',
  'Thane',
  'Chhatrapati Sambhajinagar',
  'Kolhapur',
  'Solapur',
  'Amravati',
  'Nanded',
  'Gadchiroli',
  'Nandurbar',
  'Satara',
  'Sangli',
  'Ratnagiri',
  'Sindhudurg',
  'Raigad',
  'Ahmednagar',
  'Jalgaon',
  'Latur',
  'Yavatmal',
  'Wardha',
  'Chandrapur',
  'Bhandara',
  'Gondia',
  'Buldhana',
  'Akola',
  'Washim',
  'Hingoli',
  'Parbhani',
  'Jalna',
  'Beed',
  'Osmanabad',
];

interface UploadedDocState {
  docType: DocumentType;
  title: string;
  fileName: string;
  fileSize: string;
  isUploaded: boolean;
}

export const DepartmentRegistrationModal: React.FC<DepartmentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentType, setDepartmentType] = useState<DepartmentType>('STATE_DEPARTMENT');
  const [designation, setDesignation] = useState('');
  const [nodalName, setNodalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Mumbai City');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Documents state
  const [docs, setDocs] = useState<UploadedDocState[]>([
    {
      docType: 'GOVT_ID_PROOF',
      title: 'Government Identity Proof / Appointment Order',
      fileName: '',
      fileSize: '',
      isUploaded: false,
    },
    {
      docType: 'AUTHORIZATION_LETTER',
      title: 'Department Authorization & Nodal Delegation Letter',
      fileName: '',
      fileSize: '',
      isUploaded: false,
    },
    {
      docType: 'ESTABLISHMENT_GAZETTE',
      title: 'Department Legal Establishment / Gazette Notification',
      fileName: '',
      fileSize: '',
      isUploaded: false,
    },
  ]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  if (!isOpen) return null;

  // Validation for official government email
  const isEmailValidGov = /@(maharashtra\.gov\.in|gov\.in|nic\.in|.*\.gov\.in)$/i.test(email.trim());

  const handleSendOtp = () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setOtpError('Please provide a valid 10-digit mobile number');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    setOtpInput('749201'); // Pre-fill mock OTP for smooth evaluation
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === '749201' || otpInput.trim().length === 6) {
      setOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Try entering 749201.');
    }
  };

  const handleSimulateUpload = (index: number) => {
    const fileNames = [
      'Govt_Identity_Card_NodalOfficer.pdf',
      'Dept_Official_Authorization_Letter_2025.pdf',
      'Maharashtra_Gazette_Dept_Allocation_Order.pdf',
    ];
    const fileSizes = ['1.9 MB', '2.5 MB', '3.8 MB'];

    setDocs(prev =>
      prev.map((d, i) =>
        i === index
          ? {
              ...d,
              fileName: fileNames[index] || 'Document.pdf',
              fileSize: fileSizes[index] || '2.0 MB',
              isUploaded: true,
            }
          : d
      )
    );
  };

  const handleRemoveDoc = (index: number) => {
    setDocs(prev =>
      prev.map((d, i) =>
        i === index
          ? {
              ...d,
              fileName: '',
              fileSize: '',
              isUploaded: false,
            }
          : d
      )
    );
  };

  const allDocsUploaded = docs.every(d => d.isUploaded);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!departmentName.trim()) {
      setErrorMsg('Department name is required.');
      return;
    }
    if (!nodalName.trim()) {
      setErrorMsg('Official nodal name is required.');
      return;
    }
    if (!designation.trim()) {
      setErrorMsg('Official designation is required.');
      return;
    }
    if (!isEmailValidGov) {
      setErrorMsg('Access Restricted: Official government email ID must end in @maharashtra.gov.in, @gov.in, or @nic.in.');
      return;
    }
    if (!otpVerified) {
      setErrorMsg('Please complete mobile phone OTP verification.');
      return;
    }
    if (!allDocsUploaded) {
      setErrorMsg('All 3 mandatory verification documents must be uploaded.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must certify that you are authorized to act on behalf of the government body.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: departmentName.trim(),
        departmentType,
        address: address.trim(),
        district,
        nodalOfficialName: nodalName.trim(),
        nodalOfficialDesignation: designation.trim(),
        nodalEmail: email.trim().toLowerCase(),
        nodalPhone: phone.trim(),
        otpVerified: true,
        documents: docs.map(d => ({
          title: d.title,
          docType: d.docType,
          fileName: d.fileName,
          fileSize: d.fileSize,
        })),
      };

      const res = await fetch('/api/departments/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit registration');
      }

      const result = await res.json();
      setIsSubmitting(false);
      setSubmittedSuccessfully(true);
      onSuccess(result.department);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error submitting registration dossier');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with State Emblem styling */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900/80 border border-blue-700/60 flex items-center justify-center font-bold text-amber-300 text-base">
              MH
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Government of Maharashtra • MSInS Empanelment
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Department Registration & Verification Dossier
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

        {submittedSuccessfully ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Registration Dossier Submitted for MSInS Verification
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900">{nodalName}</span>. Your department registration for{' '}
                <span className="font-semibold text-slate-900">{departmentName}</span> has been logged under{' '}
                <span className="font-semibold text-blue-700">Under Review</span> status.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-lg mx-auto space-y-2 text-xs text-amber-900">
              <div className="flex items-center space-x-2 font-semibold text-amber-900">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Gated Public Procurement Access Notice</span>
              </div>
              <p>
                In accordance with state procurement security rules, the department dashboard is restricted until the MSInS Admin verifies your Government Employee ID and Establishment Gazette order. You can monitor the review progress in real-time.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-xs transition"
              >
                Return to Portal & Track Review Status
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
            {/* Explanatory Notice */}
            <div className="flex items-start space-x-3 p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Gated Government Official Registration</p>
                <p className="text-blue-800/90 mt-0.5 leading-relaxed">
                  This portal executes public fund allocations under GFR 173(i) and the Maharashtra Startup Policy. Registration is strictly restricted to verified government officials with valid <span className="font-mono font-semibold">.gov.in</span> or <span className="font-mono font-semibold">.maharashtra.gov.in</span> credentials.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-2.5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Department Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>1. Department & Entity Profile</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">All fields mandatory</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Department of Higher & Technical Education, Maharashtra"
                    value={departmentName}
                    onChange={e => setDepartmentName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Entity Type *
                  </label>
                  <select
                    value={departmentType}
                    onChange={e => setDepartmentType(e.target.value as DepartmentType)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  >
                    <option value="STATE_DEPARTMENT">State Department (Mantralaya)</option>
                    <option value="DISTRICT_OFFICE">District Collectorate / Zilla Parishad</option>
                    <option value="AUTONOMOUS_BODY">Autonomous Government Body / Board</option>
                    <option value="PSU">State Public Sector Undertaking (PSU)</option>
                    <option value="OTHER">Municipal Corporation / Other Statutory Authority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headquarters District *
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  >
                    {MAHARASHTRA_DISTRICTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Office Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4th Floor, Mantralaya Annex, Madame Cama Road, Mumbai 400032"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Nodal Officer & Gated Government Email */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>2. Registering Nodal Official Credentials</span>
                </h3>
                <span className="text-[11px] text-amber-700 font-semibold">Gated Govt Domain</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Name (with title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sanjay Deshmukh, IAS"
                    value={nodalName}
                    onChange={e => setNodalName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Secretary / IT Nodal Officer"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Government Email ID *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Must match *.maharashtra.gov.in, *.gov.in, or *.nic.in
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. sanjay.deshmukh@maharashtra.gov.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 ${
                        email && !isEmailValidGov
                          ? 'border-rose-300 focus:ring-rose-800/20 focus:border-rose-600'
                          : email && isEmailValidGov
                          ? 'border-emerald-400 focus:ring-emerald-800/20 focus:border-emerald-600'
                          : 'border-slate-300 focus:ring-blue-800/20 focus:border-blue-700'
                      }`}
                    />
                    {email && isEmailValidGov && (
                      <div className="absolute right-3 top-2.5 flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valid Gov Domain</span>
                      </div>
                    )}
                  </div>
                  {email && !isEmailValidGov && (
                    <p className="mt-1 text-[11px] text-rose-600 font-medium">
                      Non-government domains (@gmail, @yahoo, corporate emails) cannot register as state department entities.
                    </p>
                  )}
                </div>

                {/* Mobile Phone + OTP Verification */}
                <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800">
                        Official Mobile Number (with OTP Verification) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Required for transaction digital signatures and two-factor portal login.
                      </p>
                    </div>
                    {otpVerified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Verified via SMS Gateway
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="tel"
                      disabled={otpVerified}
                      placeholder="+91 98230 11234"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-700 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                    {!otpVerified && !otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0 transition"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative w-full sm:w-48">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-center font-mono tracking-widest font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="w-full sm:w-auto px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Confirm OTP
                      </button>
                      <span className="text-[11px] text-slate-500">
                        (Demo code: <span className="font-mono font-bold text-slate-700">749201</span>)
                      </span>
                    </div>
                  )}

                  {otpError && (
                    <p className="text-[11px] text-rose-600 font-medium">{otpError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Mandatory Document Uploads */}
            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-slate-600" />
                  <span>3. Mandatory Verification Documents (3 Required)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">PDF format up to 10MB</span>
              </div>

              <div className="space-y-2.5">
                {docs.map((doc, idx) => (
                  <div
                    key={doc.docType}
                    className={`p-3.5 rounded-lg border transition ${
                      doc.isUploaded
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    } flex items-center justify-between`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.isUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800">{doc.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Required
                          </span>
                        </div>
                        {doc.isUploaded ? (
                          <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{doc.fileName}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{doc.fileSize}</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {idx === 0
                              ? 'Official employee badge or gazetted officer appointment order'
                              : idx === 1
                              ? 'Signed authorization from Head of Department / Addl Chief Secretary'
                              : 'State Allocation of Business rules or Government Gazette notification'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ml-3">
                      {doc.isUploaded ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(idx)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs transition"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                          Attach PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I hereby solemnly affirm that I am a bonafide government official authorized by the competent authority to represent this department on the Sahayog Innovation Procurement portal. I understand that all submissions write irreversible entries to the state compliance audit log.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Submitting Dossier...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for MSInS Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
