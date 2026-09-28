/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ReferralFormData } from '../types';
import { DocumentView } from './DocumentView';
import {
  X,
  Download,
  Printer,
  Eye,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferralFormData;
  onDownloadPdf: () => void;
  onPrint: () => void;
  verticalOffset?: number;
  templateName?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  onDownloadPdf,
  onPrint,
  verticalOffset = 0,
  templateName,
}) => {
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Top Action Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Document Preview
              </h2>
              {templateName && (
                <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  {templateName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact replica of how the certificate looks when printed or exported as PDF.
            </p>
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 text-slate-600 text-xs mr-2">
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom out preview"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-xs font-semibold text-slate-700">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom in preview"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrint();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          {/* Primary Save PDF Button */}
          <button
            type="button"
            onClick={() => {
              onDownloadPdf();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>

          {/* Close / Return Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-2"
            title="Close preview and return to editing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Body */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-900/60">
        <div
          className="transition-transform duration-150 origin-top self-start shadow-2xl rounded-sm"
          style={{
            transform: `scale(${previewZoom})`,
            transformOrigin: 'top center',
          }}
        >
          <DocumentView
            data={data}
            onChange={() => {}}
            showFieldGuides={false}
            verticalOffset={verticalOffset}
            isAdjustMode={false}
            isPreview={true}
            zoomLevel={previewZoom}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="bg-slate-900 text-slate-400 text-center py-2 text-xs border-t border-slate-800 shrink-0 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>All field guide outlines and editing handles are hidden in the final preview.</span>
      </div>
    </div>
  );
};
