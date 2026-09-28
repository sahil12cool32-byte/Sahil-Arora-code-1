/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ReferralFormData,
  INITIAL_FORM_DATA,
  SAMPLE_FORM_DATA,
  DEFAULT_FIELD_POSITIONS,
  FieldPositions,
  FieldBox,
  FormTemplate,
  DEFAULT_TEMPLATES,
} from './types';
import { DocumentView } from './components/DocumentView';
import {
  FormDrawer,
  DEFAULT_DISABILITY_OPTIONS,
  DEFAULT_COURSE_OPTIONS,
} from './components/FormDrawer';
import { HeaderBar } from './components/HeaderBar';
import { UploadWelcomeScreen } from './components/UploadWelcomeScreen';
import { TemplateSelectionScreen } from './components/TemplateSelectionScreen';
import { SaveTemplateModal } from './components/SaveTemplateModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { ExtractPromptModal } from './components/ExtractPromptModal';
import { convertAndAnalyzePdf } from './utils/pdfHelper';
import { downloadFormAsPdf, downloadFormAsImage } from './utils/exportPdf';
import {
  Printer,
  Download,
  Upload,
  CheckCircle2,
  MousePointerClick,
  FileUp,
  MoveVertical,
  RotateCcw,
  Move,
  Check,
  Image as ImageIcon,
  Loader2,
  BookmarkPlus,
  Eye,
  PenTool,
  Terminal,
} from 'lucide-react';

const STORAGE_KEY = 'ncsc_admission_referral_form_v6';
const TEMPLATES_STORAGE_KEY = 'ncsc_referral_templates_list_v1';

export default function App() {
  const [formData, setFormData] = useState<ReferralFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_FORM_DATA,
          ...parsed,
          backgroundImageUrl: parsed.backgroundImageUrl || INITIAL_FORM_DATA.backgroundImageUrl,
          pdfFileName: parsed.pdfFileName || INITIAL_FORM_DATA.pdfFileName,
        };
      }
    } catch (e) {
      console.error('Error loading saved form data', e);
    }
    return INITIAL_FORM_DATA;
  });

  // Templates list (saved in localStorage, no IndexedDB)
  const [templates, setTemplates] = useState<FormTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customTemplates = parsed.filter(
            (t: FormTemplate) => !t.isDefault && t.id !== 'default-ncsc-referral' && t.id !== 'default-iti-suitability'
          );
          return [...DEFAULT_TEMPLATES, ...customTemplates];
        }
      }
    } catch (e) {
      console.error('Error loading templates', e);
    }
    return DEFAULT_TEMPLATES;
  });

  // Current page view: defaults to 'use-template' for immediate certificate filling, with 'home' for choosing other templates
  const [currentView, setCurrentView] = useState<'home' | 'use-template' | 'create-template'>('use-template');
  const [activeTemplate, setActiveTemplate] = useState<FormTemplate | null>(() => DEFAULT_TEMPLATES[0]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ReferralFormData | null>(null);
  const [previewTemplateName, setPreviewTemplateName] = useState<string | undefined>(undefined);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showFieldGuides, setShowFieldGuides] = useState<boolean>(true);
  const [isAdjustMode, setIsAdjustMode] = useState<boolean>(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [verticalOffset, setVerticalOffset] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Developer mode: In-memory state only (not in localStorage, resets on refresh).
  // When locked (default), only "Use Template" is shown on the main screen.
  // When unlocked by typing 'developer' + Enter, "Add / Create New Template" appears.
  const [isDevUnlocked, setIsDevUnlocked] = useState<boolean>(false);

  // Secret background keydown listener: typing 'developer' + Enter unlocks developer mode
  // The typed keyword is NEVER displayed anywhere on screen
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input, textarea, select, or editable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Enter') {
        if (keyBuffer.toLowerCase().endsWith('developer')) {
          setIsDevUnlocked(true);
          showToast('Developer mode unlocked: Add / Create New Template is now visible.');
          keyBuffer = '';
        }
      } else if (e.key === 'Backspace') {
        keyBuffer = keyBuffer.slice(0, -1);
      } else if (e.key === 'Escape') {
        keyBuffer = '';
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Collect characters invisibly, keeping buffer small
        keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-20);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Customizable select options (Disability Categories and Course/Subject) - configured via sidebar
  const [disabilityOptions, setDisabilityOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncsc_disability_options_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading disability options', e);
    }
    return DEFAULT_DISABILITY_OPTIONS;
  });

  const [courseOptions, setCourseOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncsc_course_options_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading course options', e);
    }
    return DEFAULT_COURSE_OPTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ncsc_disability_options_v2', JSON.stringify(disabilityOptions));
    } catch (e) {
      console.error('Error saving disability options', e);
    }
  }, [disabilityOptions]);

  useEffect(() => {
    try {
      localStorage.setItem('ncsc_course_options_v2', JSON.stringify(courseOptions));
    } catch (e) {
      console.error('Error saving course options', e);
    }
  }, [courseOptions]);

  // Save form data to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving form data', e);
    }
  }, [formData]);

  // Save templates list to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (e: any) {
      console.warn('localStorage quota warning while syncing templates:', e);
    }
  }, [templates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Select and use a pre-calibrated template
  const handleSelectTemplate = (template: FormTemplate) => {
    setActiveTemplate(template);
    setFormData((prev) => ({
      ...prev,
      backgroundImageUrl: template.backgroundImageUrl || prev.backgroundImageUrl,
      pdfFileName: template.pdfFileName || prev.pdfFileName,
      fieldPositions: template.fieldPositions || DEFAULT_FIELD_POSITIONS,
    }));
    setVerticalOffset(template.verticalOffset ?? 0);
    setIsAdjustMode(false);
    setCurrentView('use-template');
    showToast(`Loaded "${template.name}". Ready to fill candidate details!`);
  };

  // Start creating / designing a new template
  const handleOpenCreateTemplate = () => {
    setCurrentView('create-template');
    setIsAdjustMode(true);
    showToast('Template Designer active: upload your background form and calibrate fields.');
  };

  // Delete a custom template
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== templateId);
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving deleted state to localStorage:', err);
      }
      return updated;
    });
    showToast('Template deleted.');
  };

  // Preview current filled document cleanly
  const handleOpenPreview = () => {
    setPreviewData(formData);
    setPreviewTemplateName(activeTemplate?.name);
    setIsPreviewModalOpen(true);
  };

  // Preview a specific template with sample data from template selection screen
  const handlePreviewTemplate = (template: FormTemplate) => {
    setPreviewData({
      ...SAMPLE_FORM_DATA,
      backgroundImageUrl: template.backgroundImageUrl || formData.backgroundImageUrl,
      pdfFileName: template.pdfFileName || formData.pdfFileName,
      fieldPositions: template.fieldPositions || DEFAULT_FIELD_POSITIONS,
    });
    setPreviewTemplateName(template.name);
    setIsPreviewModalOpen(true);
  };

  // Save current background & field positions as a new template directly to localStorage
  const handleSaveTemplate = (name: string, description: string) => {
    const newTemplate: FormTemplate = {
      id: `tmpl_${Date.now()}`,
      name,
      description: description || undefined,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      isDefault: false,
      backgroundImageUrl: formData.backgroundImageUrl || null,
      pdfFileName: formData.pdfFileName || 'Custom Scan',
      fieldPositions: formData.fieldPositions || DEFAULT_FIELD_POSITIONS,
      verticalOffset: verticalOffset,
    };

    setTemplates((prev) => {
      const updated = [newTemplate, ...prev.filter((t) => t.id !== newTemplate.id)];
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err: any) {
        // If image is too large for 5MB localStorage limit, save positions and retain image in current session
        console.warn('LocalStorage limit reached for large image. Saving template metadata & positions:', err);
        try {
          const lightweightList = updated.map((t, idx) =>
            idx === 0
              ? t
              : { ...t, backgroundImageUrl: t.backgroundImageUrl?.length && t.backgroundImageUrl.length > 500000 ? null : t.backgroundImageUrl }
          );
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(lightweightList));
        } catch (e2) {
          console.error('Failed to save to localStorage:', e2);
        }
      }
      return updated;
    });

    setActiveTemplate(newTemplate);
    showToast(`Template "${name}" saved to local storage! It is now available under "Use Template".`);
  };

  const handleFieldChange = (field: keyof ReferralFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateFieldBox = (fieldKey: keyof FieldPositions, newBox: FieldBox) => {
    setFormData((prev) => ({
      ...prev,
      fieldPositions: {
        ...(prev.fieldPositions || DEFAULT_FIELD_POSITIONS),
        [fieldKey]: newBox,
      },
    }));
  };

  const handleResetPositions = () => {
    if (window.confirm('Reset all field positions to default locations?')) {
      setFormData((prev) => ({
        ...prev,
        fieldPositions: { ...DEFAULT_FIELD_POSITIONS },
      }));
      setVerticalOffset(0);
      showToast('Field positions reset to default.');
    }
  };

  const handleLoadSample = () => {
    setFormData((prev) => ({
      ...SAMPLE_FORM_DATA,
      backgroundImageUrl: prev.backgroundImageUrl,
      pdfFileName: prev.pdfFileName,
      fieldPositions: prev.fieldPositions,
    }));
    showToast('Loaded sample candidate admission data.');
  };

  const handleReset = () => {
    if (window.confirm('Clear all form fields?')) {
      setFormData((prev) => ({
        ...INITIAL_FORM_DATA,
        backgroundImageUrl: prev.backgroundImageUrl,
        pdfFileName: prev.pdfFileName,
        fieldPositions: prev.fieldPositions,
      }));
      setVerticalOffset(0);
      showToast('Form fields cleared.');
    }
  };

  const handleDownloadPdf = async () => {
    if (isAdjustMode) setIsAdjustMode(false);
    setIsExporting(true);
    try {
      showToast('Generating high-resolution PDF file...');
      const candidateClean = formData.candidateName ? `_${formData.candidateName.trim().replace(/\s+/g, '_')}` : '';
      const filename = `NCSC_Admission_Referral${candidateClean}.pdf`;
      await downloadFormAsPdf(formData, verticalOffset, filename);
      showToast('PDF file downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed', err);
      showToast('Export error. Downloading as image fallback...');
      await handleDownloadImage();
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (isAdjustMode) setIsAdjustMode(false);
    setIsExporting(true);
    try {
      showToast('Generating 300 DPI image...');
      const candidateClean = formData.candidateName ? `_${formData.candidateName.trim().replace(/\s+/g, '_')}` : '';
      const filename = `NCSC_Admission_Referral${candidateClean}.png`;
      await downloadFormAsImage(formData, verticalOffset, filename);
      showToast('Image downloaded successfully!');
    } catch (err) {
      console.error('Image export failed', err);
      showToast('Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (isAdjustMode) setIsAdjustMode(false);
    try {
      // In sandboxed iframes, window.print() may trigger a security restriction.
      window.print();
    } catch (err) {
      console.warn('window.print() error inside preview iframe, downloading PDF directly', err);
      showToast('Browser blocked print dialog inside preview iframe. Downloading PDF file...');
      handleDownloadPdf();
    }
  };

  const handleUploadBackground = async (file: File) => {
    setIsAnalyzing(true);
    try {
      showToast(`Analyzing "${file.name}"... Converting to 300 DPI canvas.`);
      const result = await convertAndAnalyzePdf(file);

      setFormData((prev) => ({
        ...prev,
        backgroundImageUrl: result.dataUrl,
        pdfFileName: file.name,
        fieldPositions: result.positions,
      }));

      if (result.anchorsFound > 0) {
        showToast(`Smart analysis complete! Detected ${result.anchorsFound} anchor fields. You can also click "Drag / Move" to adjust.`);
      } else {
        showToast('Converted PDF to high-resolution backdrop! Calibrated fields are active.');
      }
    } catch (err: any) {
      console.error('Background upload failed', err);
      showToast('Failed to process file. Please ensure it is a valid PDF or image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveBackground = () => {
    if (window.confirm('Close current document and upload a new PDF?')) {
      setFormData((prev) => ({
        ...INITIAL_FORM_DATA,
        backgroundImageUrl: null,
        pdfFileName: null,
      }));
      setVerticalOffset(0);
      setIsAdjustMode(false);
      showToast('Document closed.');
    }
  };

  // Global Drag & Drop for PDF or image background
  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingFile) setIsDraggingFile(true);
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFile(false);
  };

  const handlePageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleUploadBackground(file);
    }
  };

  // Global Paste handler (Ctrl+V) for image screenshots
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            await handleUploadBackground(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col font-sans"
      onDragOver={handlePageDragOver}
      onDragLeave={handlePageDragLeave}
      onDrop={handlePageDrop}
    >
      {/* 1. Top Header Bar */}
      <HeaderBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onDownloadImage={handleDownloadImage}
        isExporting={isExporting}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        hasBackground={Boolean(formData.backgroundImageUrl)}
        pdfFileName={formData.pdfFileName}
        onUploadBackground={handleUploadBackground}
        onRemoveBackground={handleRemoveBackground}
        showFieldGuides={showFieldGuides}
        onToggleFieldGuides={() => setShowFieldGuides((prev) => !prev)}
        isAdjustMode={isAdjustMode}
        onToggleAdjustMode={() => {
          setIsAdjustMode((prev) => !prev);
          setSelectedFieldId(null);
        }}
        onGoHome={() => setCurrentView('home')}
        activeMode={currentView}
        activeTemplateName={activeTemplate?.name}
        onSaveTemplate={currentView === 'create-template' ? () => setIsSaveModalOpen(true) : undefined}
        onOpenPreview={handleOpenPreview}
        fontStyle={formData.fontStyle || 'handwritten'}
        inkColor={formData.inkColor || 'blue'}
        onToggleFontStyle={() => {
          const next = formData.fontStyle === 'print' ? 'handwritten' : 'print';
          setFormData((prev) => ({ ...prev, fontStyle: next }));
          showToast(
            next === 'handwritten'
              ? 'Handwritten ballpoint pen style enabled for filled text!'
              : 'Print serif style enabled.'
          );
        }}
        onToggleInkColor={() => {
          const next = formData.inkColor === 'black' ? 'blue' : 'black';
          setFormData((prev) => ({ ...prev, inkColor: next }));
          showToast(
            next === 'blue'
              ? 'Ballpoint Blue Pen ink selected!'
              : 'Deep Black Pen ink selected!'
          );
        }}
        onExtractPrompt={() => setIsExtractModalOpen(true)}
        onReturnToForm={() => setCurrentView('use-template')}
      />

      {/* 2. Calibration & Guidance Bar (Shown in Drag/Move mode or Designer mode) */}
      {(isAdjustMode || currentView === 'create-template') && formData.backgroundImageUrl && (
        <div className="no-print bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {isAdjustMode ? (
            <div className="flex items-center gap-2 text-amber-300">
              <Move className="w-4 h-4 shrink-0 animate-pulse text-amber-400" />
              <span>
                <strong>Manual Drag & Resize Mode:</strong> Click and drag any box or handle to position it right over your scanned line. Drag the bottom-right handle to resize width/height.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Click directly on any blank on your PDF to type. If any field is misaligned on your scan, click <strong>"Drag / Move"</strong> to position it manually.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Extract Prompt Button for AI Studio Chat */}
            <button
              type="button"
              id="bar-btn-extract-prompt"
              onClick={() => setIsExtractModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
              title="Extract ready-to-copy chat prompt with coordinates to make these positions default in code"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Extract Prompt</span>
            </button>

            {/* Quick Save Template button */}
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
              title="Save current background and field positions as a reusable template"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save Template</span>
            </button>

            {isAdjustMode ? (
              <>
                <button
                  type="button"
                  onClick={handleResetPositions}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                >
                  Reset Positions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdjustMode(false);
                    setSelectedFieldId(null);
                    showToast('Field positions saved!');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done Moving</span>
                </button>
              </>
            ) : (
              /* Global Nudge Controls */
              <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-slate-400" />
                  All Fields:
                </span>
                <button
                  type="button"
                  onClick={() => setVerticalOffset((v) => v - 1)}
                  className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-white font-mono text-[10px]"
                  title="Nudge all inputs Up by 1px"
                >
                  ▲ Up
                </button>
                <span className="font-mono text-[11px] text-amber-300 w-7 text-center">
                  {verticalOffset > 0 ? `+${verticalOffset}` : verticalOffset}px
                </span>
                <button
                  type="button"
                  onClick={() => setVerticalOffset((v) => v + 1)}
                  className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-white font-mono text-[10px]"
                  title="Nudge all inputs Down by 1px"
                >
                  ▼ Down
                </button>
                {verticalOffset !== 0 && (
                  <button
                    type="button"
                    onClick={() => setVerticalOffset(0)}
                    className="text-slate-400 hover:text-white ml-1"
                    title="Reset offset"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Drag overlay notice */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-blue-600/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-blue-600 pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <FileUp className="w-12 h-12 text-blue-600 animate-bounce" />
            <p className="text-base font-bold text-slate-900">
              Drop your PDF here to auto-analyze and locate fields!
            </p>
          </div>
        </div>
      )}

      {/* 4. Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {currentView === 'home' ? (
          /* FIRST PAGE: Use Template vs Add Template */
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-100">
            <TemplateSelectionScreen
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
              onOpenCreateTemplate={handleOpenCreateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              isDevUnlocked={isDevUnlocked}
            />
          </main>
        ) : formData.backgroundImageUrl ? (
          /* When PDF is uploaded: Show Document Sheet Canvas */
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center print:p-0 print:overflow-visible print:bg-white bg-slate-300">
            {/* Zoom Wrapper */}
            <div
              className="w-full flex justify-center transition-transform duration-200 origin-top print:transform-none"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
              }}
            >
              <DocumentView
                data={formData}
                onChange={handleFieldChange}
                showFieldGuides={showFieldGuides}
                verticalOffset={verticalOffset}
                isAdjustMode={currentView === 'create-template' && isAdjustMode}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
                onUpdateFieldBox={handleUpdateFieldBox}
                zoomLevel={zoomLevel}
                disabilityOptions={disabilityOptions}
                courseOptions={courseOptions}
              />
            </div>

            {/* Quick Export Bar at bottom - only shown in Template Designer */}
            {currentView === 'create-template' && (
              <div className="no-print mt-8 mb-12 flex flex-wrap items-center justify-center gap-3 text-slate-700 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="font-medium text-slate-600">Export completed referral certificate:</span>

                {/* Handwriting Pen Style Toggle */}
                <button
                  type="button"
                  id="footer-btn-font-toggle"
                  onClick={() => {
                    const next = formData.fontStyle === 'print' ? 'handwritten' : 'print';
                    setFormData((prev) => ({ ...prev, fontStyle: next }));
                    showToast(
                      next === 'handwritten'
                        ? 'Handwritten ballpoint pen style enabled!'
                        : 'Print serif style enabled.'
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border font-semibold shadow-2xs transition-colors ${
                    formData.fontStyle !== 'print'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Switch between handwritten pen and print font for filled text"
                >
                  <PenTool className="w-4 h-4 text-blue-600" />
                  <span>{formData.fontStyle !== 'print' ? 'Handwritten Pen' : 'Print Serif'}</span>
                  {formData.fontStyle !== 'print' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = formData.inkColor === 'black' ? 'blue' : 'black';
                        setFormData((prev) => ({ ...prev, inkColor: next }));
                        showToast(
                          next === 'blue'
                            ? 'Ballpoint Blue Pen ink selected!'
                            : 'Deep Black Pen ink selected!'
                        );
                      }}
                      className={`w-2.5 h-2.5 rounded-full border border-white ml-0.5 cursor-pointer shadow-2xs ${
                        formData.inkColor === 'black' ? 'bg-zinc-900' : 'bg-blue-700'
                      }`}
                      title={formData.inkColor === 'black' ? 'Black Ink (click for blue)' : 'Blue Ink (click for black)'}
                    />
                  )}
                </button>

                {/* Extract Prompt Button */}
                <button
                  type="button"
                  id="footer-btn-extract-prompt"
                  onClick={() => setIsExtractModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-2xs transition-colors"
                  title="Extract ready-to-copy chat prompt with all 8 coordinates"
                >
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Extract Prompt</span>
                </button>

                {/* Clean Preview Button */}
                <button
                  type="button"
                  id="footer-btn-preview"
                  onClick={handleOpenPreview}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold shadow-2xs transition-colors"
                  title="Preview clean document without any guide boxes"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Preview Document</span>
                </button>

                {/* Primary Direct PDF Download */}
                <button
                  type="button"
                  id="footer-btn-download-pdf"
                  disabled={isExporting}
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Save PDF</span>
                </button>

                {/* PNG Download */}
                <button
                  type="button"
                  id="footer-btn-download-png"
                  disabled={isExporting}
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>Download High-Res PNG</span>
                </button>

                {/* Print Dialog */}
                <button
                  type="button"
                  id="footer-btn-print"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Browser Print</span>
                </button>
              </div>
            )}
          </main>
        ) : (
          /* When NO PDF uploaded yet in Create/Use mode: Show Clean Upload Dropzone Screen */
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-100">
            <UploadWelcomeScreen
              onUploadFile={handleUploadBackground}
              isAnalyzing={isAnalyzing}
            />
          </main>
        )}

        {/* Side Form Drawer (Available when document is active and not in home view) */}
        {currentView !== 'home' && formData.backgroundImageUrl && isSidebarOpen && (
          <aside className="no-print w-80 md:w-96 shrink-0 h-[calc(100vh-85px)] z-20 transition-all border-l border-slate-200">
            <FormDrawer
              data={formData}
              onChange={handleFieldChange}
              onLoadSample={handleLoadSample}
              onReset={handleReset}
              disabilityOptions={disabilityOptions}
              onChangeDisabilityOptions={setDisabilityOptions}
              courseOptions={courseOptions}
              onChangeCourseOptions={setCourseOptions}
            />
          </aside>
        )}
      </div>

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTemplate}
        defaultName={formData.pdfFileName ? `${formData.pdfFileName.replace(/\.[^/.]+$/, '')} Template` : 'NCSC Referral Template'}
        hasBackground={Boolean(formData.backgroundImageUrl)}
        pdfFileName={formData.pdfFileName}
      />

      {/* Extract Calibration Prompt Modal */}
      <ExtractPromptModal
        isOpen={isExtractModalOpen}
        onClose={() => setIsExtractModalOpen(false)}
        positions={formData.fieldPositions || DEFAULT_FIELD_POSITIONS}
        verticalOffset={verticalOffset}
        pdfFileName={formData.pdfFileName}
        templateName={activeTemplate?.name || 'ITI Suitability Certificate'}
      />

      {/* Clean Document Preview Modal */}
      {previewData && (
        <DocumentPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          data={previewData}
          onDownloadPdf={() => {
            setIsPreviewModalOpen(false);
            handleDownloadPdf();
          }}
          onPrint={handlePrint}
          verticalOffset={verticalOffset}
          templateName={previewTemplateName}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUploadBackground(f);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
