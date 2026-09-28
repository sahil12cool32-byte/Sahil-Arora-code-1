/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Sparkles,
  SlidersHorizontal,
  Upload,
  Eye,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Check,
  Loader2,
  Home,
  BookmarkPlus,
  Layers,
  PenTool,
  Terminal,
  ArrowRight,
} from 'lucide-react';

interface HeaderBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDownloadImage: () => void;
  isExporting: boolean;
  onLoadSample: () => void;
  onReset: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  hasBackground: boolean;
  pdfFileName?: string | null;
  onUploadBackground: (file: File) => void;
  onRemoveBackground: () => void;
  showFieldGuides: boolean;
  onToggleFieldGuides: () => void;
  isAdjustMode: boolean;
  onToggleAdjustMode: () => void;
  onGoHome?: () => void;
  activeMode?: 'home' | 'use-template' | 'create-template';
  activeTemplateName?: string;
  onSaveTemplate?: () => void;
  onOpenPreview?: () => void;
  fontStyle?: 'handwritten' | 'print';
  inkColor?: 'blue' | 'black';
  onToggleFontStyle?: () => void;
  onToggleInkColor?: () => void;
  onExtractPrompt?: () => void;
  onReturnToForm?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onPrint,
  onDownloadPdf,
  onDownloadImage,
  isExporting,
  onLoadSample,
  zoomLevel,
  onZoomChange,
  hasBackground,
  pdfFileName,
  onUploadBackground,
  onRemoveBackground,
  showFieldGuides,
  onToggleFieldGuides,
  isAdjustMode,
  onToggleAdjustMode,
  onGoHome,
  activeMode,
  activeTemplateName,
  onSaveTemplate,
  onOpenPreview,
  fontStyle = 'handwritten',
  inkColor = 'blue',
  onToggleFontStyle,
  onToggleInkColor,
  onExtractPrompt,
  onReturnToForm,
}) => {
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadBackground(file);
      e.target.value = '';
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Home button & Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onGoHome && activeMode !== 'home' && (
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-semibold transition-colors shadow-2xs"
              title="Return to Templates Home Page"
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Templates</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-[14px] sm:text-[15px] leading-tight flex items-center gap-1.5">
                <span>NCSC Referral Form</span>
                {activeMode === 'use-template' && (
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded hidden sm:inline-flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{activeTemplateName || 'Template Active'}</span>
                  </span>
                )}
                {activeMode === 'create-template' && (
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded hidden sm:inline-flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Template Designer</span>
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-sm">
                {pdfFileName || 'Auto-calibrated fillable blanks & instant PDF download'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        {activeMode === 'use-template' ? (
          /* Simple Menu: exactly 3 options: small button (Sidebar) + 2 large clear big size buttons (Preview & Save PDF) */
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. Small button: Sidebar */}
            <button
              type="button"
              id="header-btn-toggle-editor"
              onClick={onToggleSidebar}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isSidebarOpen
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
              }`}
              title={isSidebarOpen ? 'Close Side Form panel' : 'Open Side Form panel for easy field entry'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Sidebar</span>
            </button>

            {/* 2. Large clear big size button: Preview */}
            {onOpenPreview && (
              <button
                type="button"
                id="header-btn-preview"
                onClick={onOpenPreview}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-sm sm:text-base font-bold shadow-xs hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer"
                title="Preview clean document without any guidelines"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span>Preview</span>
              </button>
            )}

            {/* 3. Large clear big size button: Save PDF */}
            <button
              type="button"
              id="header-btn-download-pdf"
              disabled={isExporting}
              onClick={onDownloadPdf}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              title="Save completed certificate as PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save PDF</span>
                </>
              )}
            </button>
          </div>
        ) : activeMode === 'create-template' ? (
          /* Full Menu: Only in Template Designer Mode */
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* File picker for PDF / Image background (only for designer mode) */}
            <input
              ref={bgFileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* SAVE TEMPLATE BUTTON: Exclusively in create-template mode */}
            {onSaveTemplate && (
              <button
                type="button"
                id="header-btn-save-template"
                onClick={onSaveTemplate}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                title="Save current layout & background as reusable template"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Template</span>
              </button>
            )}

            {/* DRAG / MOVE CALIBRATION: Available whenever background is loaded */}
            {hasBackground && (
              <button
                type="button"
                id="btn-toggle-adjust-mode"
                onClick={onToggleAdjustMode}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all shadow-2xs ${
                  isAdjustMode
                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
                title={isAdjustMode ? 'Click to finish adjusting positions' : 'Click to drag and resize fields anywhere on the form'}
              >
                {isAdjustMode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Done Moving</span>
                  </>
                ) : (
                  <>
                    <Move className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Drag / Move</span>
                  </>
                )}
              </button>
            )}

            {/* EXTRACT PROMPT BUTTON */}
            {hasBackground && onExtractPrompt && (
              <button
                type="button"
                id="header-btn-extract-prompt"
                onClick={onExtractPrompt}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                title="Extract ready-to-copy chat prompt with all 8 coordinates"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Extract Prompt</span>
              </button>
            )}

            {/* Replace / Change PDF in create-template mode */}
            {hasBackground && (
              <button
                type="button"
                onClick={() => bgFileInputRef.current?.click()}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                title="Upload a different PDF or scan"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Change PDF</span>
              </button>
            )}

            {/* Toggle Highlighted Field Guides */}
            {hasBackground && !isAdjustMode && (
              <button
                type="button"
                id="btn-toggle-field-guides"
                onClick={onToggleFieldGuides}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors shadow-2xs ${
                  showFieldGuides
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Toggle highlighted guide boxes over fields"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Guides</span>
              </button>
            )}

            {/* Handwriting / Pen Style Toggle */}
            {hasBackground && !isAdjustMode && onToggleFontStyle && (
              <div className="flex items-center">
                <button
                  type="button"
                  id="header-btn-toggle-font"
                  onClick={onToggleFontStyle}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-l-lg border transition-colors shadow-2xs ${
                    fontStyle !== 'print'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title={
                    fontStyle !== 'print'
                      ? 'Handwritten font active. Click to switch to official print font.'
                      : 'Print font active. Click to switch to handwritten pen.'
                  }
                >
                  <PenTool className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">
                    {fontStyle !== 'print' ? 'Handwritten' : 'Print Serif'}
                  </span>
                </button>
                {fontStyle !== 'print' && onToggleInkColor && (
                  <button
                    type="button"
                    id="header-btn-toggle-ink"
                    onClick={onToggleInkColor}
                    className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 border-y border-r border-blue-300 rounded-r-lg flex items-center gap-1 text-[11px] font-semibold text-blue-950 transition-colors shadow-2xs"
                    title={inkColor === 'black' ? 'Black Ink active. Click for Blue' : 'Blue Ink active. Click for Black'}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full border border-white shadow-2xs ${
                        inkColor === 'black' ? 'bg-zinc-900' : 'bg-blue-700'
                      }`}
                    />
                    <span className="hidden md:inline">{inkColor === 'black' ? 'Black' : 'Blue'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Zoom controls (allowed in both modes for accessibility) */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 text-slate-600 text-xs">
              <button
                type="button"
                onClick={() => onZoomChange(Math.max(0.7, zoomLevel - 0.1))}
                className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] font-semibold text-slate-700">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => onZoomChange(Math.min(1.3, zoomLevel + 0.1))}
                className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sample Data Filler for Quick Testing */}
            <button
              type="button"
              id="header-btn-sample"
              onClick={onLoadSample}
              className="hidden xl:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              title="Populate sample candidate data"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sample Data</span>
            </button>

            {/* Side Editor Toggle (For typing data) */}
            <button
              type="button"
              id="header-btn-toggle-editor"
              onClick={onToggleSidebar}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                isSidebarOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Side Editor Panel for data entry"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side Form</span>
            </button>

            {/* Reset/Clear File (Only in designer mode) */}
            <button
              type="button"
              onClick={onRemoveBackground}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Close current PDF and return to upload screen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Preview Button */}
            {hasBackground && onOpenPreview && (
              <button
                type="button"
                id="header-btn-preview"
                onClick={onOpenPreview}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                title="Preview clean document without any guide outlines or editing tools"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Preview</span>
              </button>
            )}

            {/* Print Button */}
            <button
              type="button"
              id="header-btn-print"
              onClick={onPrint}
              className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              title="Open browser print preview"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            {/* Primary Action: Save / Download PDF */}
            <button
              type="button"
              id="header-btn-download-pdf"
              disabled={isExporting}
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs disabled:opacity-50"
              title="Download completed form as a PDF file"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save PDF</span>
                </>
              )}
            </button>
          </div>
        ) : onReturnToForm ? (
          <div className="flex items-center">
            <button
              type="button"
              id="header-btn-return-to-form"
              onClick={onReturnToForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Go to Certificate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
