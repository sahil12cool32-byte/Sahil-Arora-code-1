/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { FieldPositions } from '../types';
import {
  X,
  Copy,
  Check,
  Code2,
  Terminal,
  FileCode,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ExtractPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: FieldPositions;
  verticalOffset?: number;
  pdfFileName?: string | null;
  templateName?: string;
}

export const ExtractPromptModal: React.FC<ExtractPromptModalProps> = ({
  isOpen,
  onClose,
  positions,
  verticalOffset = 0,
  pdfFileName = 'ITI suitability.pdf',
  templateName = 'ITI Suitability Certificate',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'typescript' | 'table'>('prompt');

  if (!isOpen) return null;

  // Format positions cleanly with 1 decimal place
  const formatBox = (b: { top: number; left: number; width: number; height: number }) => ({
    top: Number(b.top.toFixed(2)),
    left: Number(b.left.toFixed(2)),
    width: Number(b.width.toFixed(2)),
    height: Math.round(b.height),
  });

  const formattedPositions = {
    dated: formatBox(positions.dated),
    candidateName: formatBox(positions.candidateName),
    otherDisability: formatBox(positions.otherDisability),
    intakeNo: formatBox(positions.intakeNo),
    course: formatBox(positions.course),
    photo: formatBox(positions.photo),
    rollNo: formatBox(positions.rollNo),
    signature: formatBox(positions.signature),
  };

  const tsSnippet = `export const ITI_SUITABILITY_POSITIONS: FieldPositions = {
  dated: { top: ${formattedPositions.dated.top}, left: ${formattedPositions.dated.left}, width: ${formattedPositions.dated.width}, height: ${formattedPositions.dated.height} },
  candidateName: { top: ${formattedPositions.candidateName.top}, left: ${formattedPositions.candidateName.left}, width: ${formattedPositions.candidateName.width}, height: ${formattedPositions.candidateName.height} },
  otherDisability: { top: ${formattedPositions.otherDisability.top}, left: ${formattedPositions.otherDisability.left}, width: ${formattedPositions.otherDisability.width}, height: ${formattedPositions.otherDisability.height} },
  intakeNo: { top: ${formattedPositions.intakeNo.top}, left: ${formattedPositions.intakeNo.left}, width: ${formattedPositions.intakeNo.width}, height: ${formattedPositions.intakeNo.height} },
  course: { top: ${formattedPositions.course.top}, left: ${formattedPositions.course.left}, width: ${formattedPositions.course.width}, height: ${formattedPositions.course.height} },
  photo: { top: ${formattedPositions.photo.top}, left: ${formattedPositions.photo.left}, width: ${formattedPositions.photo.width}, height: ${formattedPositions.photo.height} },
  rollNo: { top: ${formattedPositions.rollNo.top}, left: ${formattedPositions.rollNo.left}, width: ${formattedPositions.rollNo.width}, height: ${formattedPositions.rollNo.height} },
  signature: { top: ${formattedPositions.signature.top}, left: ${formattedPositions.signature.left}, width: ${formattedPositions.signature.width}, height: ${formattedPositions.signature.height} },
};`;

  const fullChatPrompt = `Please update the default ITI suitability certificate template coordinates with my newly calibrated positions:

Template: ${templateName}
Document File: ${pdfFileName || 'ITI suitability.pdf'}
Vertical Offset: ${verticalOffset}px

\`\`\`typescript
${tsSnippet}
\`\`\`

Please set these coordinates as the default ITI_SUITABILITY_POSITIONS in types.ts so all new documents use these exact calibrated field positions.`;

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Clipboard copy error', err);
    }
  };

  const getActiveContentToCopy = () => {
    if (activeTab === 'typescript') return tsSnippet;
    return fullChatPrompt;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2 text-white">
                <span>Extract Calibration Prompt</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready to Copy
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Copy and paste this prompt directly into the AI Studio chat to make your calibrated coordinates permanent.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between text-xs text-blue-900 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>How it works:</strong> Copy this prompt, paste it in the chat, and the coding assistant will permanently update the default code.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(getActiveContentToCopy())}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-200 flex items-center gap-2 bg-slate-50 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Chat Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typescript')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'typescript'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>TypeScript Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Coordinates Table</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-sm bg-slate-900">
          {activeTab === 'prompt' && (
            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap select-all leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {fullChatPrompt}
            </pre>
          )}

          {activeTab === 'typescript' && (
            <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap select-all leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {tsSnippet}
            </pre>
          )}

          {activeTab === 'table' && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <th className="p-2.5">Field</th>
                    <th className="p-2.5">Top %</th>
                    <th className="p-2.5">Left %</th>
                    <th className="p-2.5">Width %</th>
                    <th className="p-2.5">Height (px)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {Object.entries(formattedPositions).map(([key, box]) => (
                    <tr key={key} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-semibold text-blue-400">{key}</td>
                      <td className="p-2.5">{box.top}%</td>
                      <td className="p-2.5">{box.left}%</td>
                      <td className="p-2.5">{box.width}%</td>
                      <td className="p-2.5">{box.height}px</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>8 calibrated fields ready</span>
            <span>•</span>
            <span className="text-slate-700 font-medium">Vertical Offset: {verticalOffset}px</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              id="modal-btn-copy-prompt"
              onClick={() => handleCopy(getActiveContentToCopy())}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
