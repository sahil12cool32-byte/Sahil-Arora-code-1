/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { FormTemplate } from '../types';
import {
  Layers,
  PlusCircle,
  FileCheck2,
  FileText,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Calendar,
  Trash2,
  CheckCircle2,
  ScanSearch,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface TemplateSelectionScreenProps {
  templates: FormTemplate[];
  onSelectTemplate: (template: FormTemplate) => void;
  onOpenCreateTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onPreviewTemplate?: (template: FormTemplate) => void;
  isDevUnlocked?: boolean;
}

export const TemplateSelectionScreen: React.FC<TemplateSelectionScreenProps> = ({
  templates,
  onSelectTemplate,
  onOpenCreateTemplate,
  onDeleteTemplate,
  onPreviewTemplate,
  isDevUnlocked = false,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id || 'default-iti-suitability'
  );

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
      {/* Top Welcome Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>NCSC Certificate & Form Studio</span>
          {isDevUnlocked && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
              Developer Mode
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How would you like to proceed?
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          {isDevUnlocked ? (
            <>
              Choose <strong>Use Template</strong> to fill and print certificates with pre-aligned fields, or <strong>Add Template</strong> to calibrate and mark new forms.
            </>
          ) : (
            <>
              Select a pre-calibrated form template to fill candidate details and export PDF.
            </>
          )}
        </p>
      </div>

      {/* Main Option Cards */}
      <div className={`w-full mb-8 ${isDevUnlocked ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'max-w-xl mx-auto'}`}>
        {/* OPTION 1: USE TEMPLATE */}
        <div className="bg-white rounded-2xl border-2 border-blue-600/30 hover:border-blue-600 shadow-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none -mr-8 -mt-8 transition-transform group-hover:scale-110" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Use</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Use Template
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Select a pre-calibrated form template. The document backdrop and all field positions are already set—simply fill candidate details and export PDF.
            </p>

            {/* Template Selector List */}
            <div className="mt-5 space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Choose a saved template:
              </label>
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                {templates.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {tmpl.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                            <span>{tmpl.pdfFileName ? `Scan: ${tmpl.pdfFileName}` : 'Pre-calibrated'}</span>
                            {tmpl.isDefault && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">Default</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {onPreviewTemplate && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewTemplate(tmpl);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title={`Preview ${tmpl.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!tmpl.isDefault && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete template "${tmpl.name}"?`)) {
                                onDeleteTemplate(tmpl.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete custom template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
            {onPreviewTemplate && activeTemplate && (
              <button
                type="button"
                onClick={() => onPreviewTemplate(activeTemplate)}
                className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
                title="Preview this template"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => activeTemplate && onSelectTemplate(activeTemplate)}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Use Selected Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OPTION 2: ADD / CREATE NEW TEMPLATE (Only visible in Developer Mode) */}
        {isDevUnlocked && (
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative group overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full pointer-events-none -mr-8 -mt-8 transition-transform group-hover:scale-110" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md shadow-slate-900/10">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Designer Mode</span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Add / Create New Template
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Upload a new scanned PDF or image, drag and resize input boxes to perfectly mark field locations, and save it as a permanent reusable template.
              </p>

              <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Template Creation Workflow:</span>
                </div>
                <ol className="space-y-1.5 pl-5 list-decimal text-[12px] text-slate-600">
                  <li>Upload your PDF or scanned blank form</li>
                  <li>Auto-detect or manually drag/resize fillable lines</li>
                  <li>Click <strong>"Save Template"</strong> in the top toolbar</li>
                  <li>Your new template appears immediately under <strong>"Use Template"</strong></li>
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onOpenCreateTemplate}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Start Template Designer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-400">
        National Career Service Centre for Differently Abled (NCSC-DA) • Admission Referral Generator
      </div>
    </div>
  );
};
