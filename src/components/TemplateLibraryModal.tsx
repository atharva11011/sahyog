import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  Filter,
} from 'lucide-react';
import { LegalTemplate } from '../types';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: LegalTemplate[];
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
}) => {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate>(
    templates[0]
  );
  const [copied, setCopied] = useState(false);

  const categories = [
    'ALL',
    'PROBLEM_STATEMENT',
    'EVALUATION_RUBRIC',
    'PILOT_AGREEMENT',
    'DATA_IP_CLAUSE',
    'CYBERSECURITY_CHECKLIST',
    'RISK_EXIT_CLAUSE',
    'PROCUREMENT_TRANSITION',
  ];

  const filtered = selectedCategory === 'ALL'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleCopy = () => {
    if (!selectedTemplate) return;
    navigator.clipboard.writeText(selectedTemplate.contentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (tpl: LegalTemplate) => {
    const blob = new Blob([tpl.contentSnippet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tpl.code}-${tpl.version}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col">
        {/* Header */}
        <div className="p-5.5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Official Model Template Library
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Versioned, legally vetted contracts, evaluation matrices, and IP governance clauses
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

        {/* Categories Bar */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-xs shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium text-[11px] transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* List */}
          <div className="md:col-span-5 border-r border-slate-100 p-4 space-y-2.5 overflow-y-auto max-h-[520px]">
            {filtered.map(tpl => {
              const isSelected = tpl.id === selectedTemplate?.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-orange-50/70 border-orange-300/80 shadow-2xs ring-1 ring-orange-200'
                      : 'bg-white border-slate-200/80 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded-full text-[10px]">
                      {tpl.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{tpl.version}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{tpl.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">{tpl.description}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Preview */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[520px] space-y-4 text-xs">
            {selectedTemplate ? (
              <>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                      {selectedTemplate.code} • {selectedTemplate.version}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 tracking-tight">
                      {selectedTemplate.title}
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      Legal Basis: <strong>{selectedTemplate.legalReference}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 border border-slate-200/80 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors shadow-2xs"
                      title="Copy snippet"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDownload(selectedTemplate)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5 hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Key Clauses Bento submodule */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Vetted Structural Clauses:
                  </span>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {selectedTemplate.clausesSummary.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Text Snippet Bento submodule */}
                <div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Standard Contract Text Snippet:
                  </span>
                  <pre className="p-3.5 bg-slate-950 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                    {selectedTemplate.contentSnippet}
                  </pre>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400 py-12">Select a template to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
