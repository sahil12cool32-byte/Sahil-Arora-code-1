/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { BookmarkPlus, X, Check, FileCheck, Layers } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  defaultName: string;
  hasBackground: boolean;
  pdfFileName?: string | null;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultName,
  hasBackground,
  pdfFileName,
}) => {
  const [templateName, setTemplateName] = useState(defaultName || 'Custom Referral Form');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    onSave(templateName.trim(), description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Save as Reusable Template</h3>
              <p className="text-xs text-slate-300">Create a template for quick daily filling</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Template Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., NCSC Admission Form 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden text-sm font-medium text-slate-800 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Calibrated for Delhi center standard print"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden text-sm text-slate-800 transition-all"
            />
          </div>

          {/* Configuration Snapshot Card */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2 text-slate-600">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Included in this template:</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] text-slate-600">
              <li>
                <strong>Background Backdrop:</strong>{' '}
                {hasBackground ? (
                  <span className="text-emerald-700 font-medium">{pdfFileName || 'Custom Scan Attached'}</span>
                ) : (
                  <span className="text-slate-500 italic">No custom scan attached</span>
                )}
              </li>
              <li>
                <strong>Calibrated Positions:</strong> Exact locations for 8 fillable boxes (Date, Candidate, Disability, Intake, Course, Photo, Roll No, Signature)
              </li>
              <li>
                <strong>Reuse anytime:</strong> Available directly under <strong>"Use Template"</strong> on the home page.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>Save & Add to Templates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
