/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  ScanSearch,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface UploadWelcomeScreenProps {
  onUploadFile: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadWelcomeScreen: React.FC<UploadWelcomeScreenProps> = ({
  onUploadFile,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-400 mb-4 shadow-inner">
            <ScanSearch className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Upload NCSC Admission Referral Form
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
            Upload your PDF or scanned document. The smart analyzer will convert page 1 into a high-resolution backdrop and auto-detect the exact fillable blanks.
          </p>
        </div>

        {/* Dropzone Body */}
        <div className="p-6 sm:p-10">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-blue-600 bg-blue-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 text-base">
                    Smart Analyzing PDF...
                  </p>
                  <p className="text-xs text-slate-500">
                    Converting page 1 to 300 DPI image & auto-locating fillable fields
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-slate-800">
                    Click to browse or drag & drop your PDF here
                  </p>
                  <p className="text-xs text-slate-500">
                    Accepts official NCSC Referral Form PDF or scanned screenshot
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Choose PDF File</span>
                </button>
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-slate-600 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Exact Original Backdrop</strong>
                <span>Preserves original government emblems, logos, and typography identically.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Smart Anchor Locator</strong>
                <span>Auto-locates blanks for Date, Name, Category, Intake No., Photo, and Roll No.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Print & PDF Export</strong>
                <span>One-click high-clarity print ready for submission.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
