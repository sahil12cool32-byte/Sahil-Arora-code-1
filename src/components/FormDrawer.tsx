/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ReferralFormData } from '../types';
import {
  User,
  FileText,
  Calendar,
  Building,
  Award,
  Upload,
  Trash2,
  Sparkles,
  RotateCcw,
  BookOpen,
  PenTool,
  Settings2,
  Plus,
  ListPlus,
} from 'lucide-react';

export const DEFAULT_DISABILITY_OPTIONS: string[] = [
  'orthopaedically Divyang',
  'Visually Impaired',
  'Hearing Impaired',
  'Multiple Disability',
  'Intellectual Disability',
];

export const DEFAULT_COURSE_OPTIONS: string[] = [
  'English',
  'Computer',
  'IT',
  'Electronics',
];

// Backward-compatible exports
export const DISABILITY_OPTIONS = DEFAULT_DISABILITY_OPTIONS;
export const COURSE_OPTIONS = DEFAULT_COURSE_OPTIONS.map((val, idx) => ({
  id: String(idx + 1),
  label: `${idx + 1}. ${val}`,
  value: val,
}));

interface FormDrawerProps {
  data: ReferralFormData;
  onChange: (field: keyof ReferralFormData, value: any) => void;
  onLoadSample: () => void;
  onReset: () => void;
  disabilityOptions?: string[];
  onChangeDisabilityOptions?: (options: string[]) => void;
  courseOptions?: string[];
  onChangeCourseOptions?: (options: string[]) => void;
}

export const FormDrawer: React.FC<FormDrawerProps> = ({
  data,
  onChange,
  onLoadSample,
  onReset,
  disabilityOptions,
  onChangeDisabilityOptions,
  courseOptions,
  onChangeCourseOptions,
}) => {
  const [internalDisabilityOptions, setInternalDisabilityOptions] = useState<string[]>(DEFAULT_DISABILITY_OPTIONS);
  const [internalCourseOptions, setInternalCourseOptions] = useState<string[]>(DEFAULT_COURSE_OPTIONS);

  const activeDisabilityOptions = disabilityOptions || internalDisabilityOptions;
  const setDisabilityList = onChangeDisabilityOptions || setInternalDisabilityOptions;

  const activeCourseOptions = courseOptions || internalCourseOptions;
  const setCourseList = onChangeCourseOptions || setInternalCourseOptions;

  const [isEditingDisability, setIsEditingDisability] = useState<boolean>(false);
  const [newDisabilityInput, setNewDisabilityInput] = useState<string>('');

  const [isEditingCourse, setIsEditingCourse] = useState<boolean>(false);
  const [newCourseInput, setNewCourseInput] = useState<string>('');

  const handleAddDisability = () => {
    const trimmed = newDisabilityInput.trim();
    if (!trimmed) return;
    if (activeDisabilityOptions.includes(trimmed)) {
      setNewDisabilityInput('');
      return;
    }
    setDisabilityList([...activeDisabilityOptions, trimmed]);
    setNewDisabilityInput('');
  };

  const handleUpdateDisability = (index: number, newText: string) => {
    const updated = [...activeDisabilityOptions];
    updated[index] = newText;
    setDisabilityList(updated);
  };

  const handleDeleteDisability = (index: number) => {
    if (activeDisabilityOptions.length <= 1) return;
    const updated = activeDisabilityOptions.filter((_, i) => i !== index);
    setDisabilityList(updated);
  };

  const handleResetDisability = () => {
    setDisabilityList(DEFAULT_DISABILITY_OPTIONS);
  };

  const handleAddCourse = () => {
    const trimmed = newCourseInput.trim();
    if (!trimmed) return;
    if (activeCourseOptions.includes(trimmed)) {
      setNewCourseInput('');
      return;
    }
    setCourseList([...activeCourseOptions, trimmed]);
    setNewCourseInput('');
  };

  const handleUpdateCourse = (index: number, newText: string) => {
    const updated = [...activeCourseOptions];
    updated[index] = newText;
    setCourseList(updated);
  };

  const handleDeleteCourse = (index: number) => {
    if (activeCourseOptions.length <= 1) return;
    const updated = activeCourseOptions.filter((_, i) => i !== index);
    setCourseList(updated);
  };

  const handleResetCourse = () => {
    setCourseList(DEFAULT_COURSE_OPTIONS);
  };
  const setTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    onChange('dated', `${dd}/${mm}/${yyyy}`);
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for native input type="date"
  const getIsoDate = (d: string) => {
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) {
      onChange('dated', '');
      return;
    }
    const [yyyy, mm, dd] = val.split('-');
    onChange('dated', `${dd}/${mm}/${yyyy}`);
  };

  const handleDisabilityChip = (cat: string) => {
    onChange('disabilityCategory', cat);
    onChange('otherDisabilityDetail', cat);
  };

  const handleCourseSelect = (course: string) => {
    onChange('courseOrAdmissionDetails', course);
  };

  return (
    <div className="bg-white border-l border-slate-200 h-full flex flex-col shadow-sm text-slate-800">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-[15px] flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Form Field Editor
          </h3>
          <p className="text-[12px] text-slate-500">
            Fill fields here or click directly on document lines
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onLoadSample}
            id="btn-load-sample"
            className="text-[12px] px-2.5 py-1 font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition-colors"
            title="Populate with sample information"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>
          <button
            type="button"
            onClick={onReset}
            id="btn-reset-form"
            className="text-[12px] px-2.5 py-1 font-semibold rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1 transition-colors"
            title="Reset to blank"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
        {/* Handwriting Style Selector Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-blue-600" />
              <span>Filled Text Writing Style</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
              {data.fontStyle === 'print' ? 'Print Serif' : 'Handwritten'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange('fontStyle', 'handwritten')}
              className={`px-2.5 py-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                data.fontStyle !== 'print'
                  ? 'border-blue-500 bg-white ring-2 ring-blue-200 shadow-2xs'
                  : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
              }`}
            >
              <span className="text-sm font-bold font-handwriting text-blue-900 leading-none">
                Handwritten
              </span>
              <span className="text-[10px] text-slate-500">Realistic ballpoint pen</span>
            </button>

            <button
              type="button"
              onClick={() => onChange('fontStyle', 'print')}
              className={`px-2.5 py-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                data.fontStyle === 'print'
                  ? 'border-blue-500 bg-white ring-2 ring-blue-200 shadow-2xs'
                  : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
              }`}
            >
              <span className="text-xs font-bold font-doc-serif leading-none">
                Print Serif
              </span>
              <span className="text-[10px] text-slate-500">Official typewriter font</span>
            </button>
          </div>

          {data.fontStyle !== 'print' && (
            <div className="pt-1 flex items-center justify-between border-t border-slate-200 text-xs">
              <span className="text-slate-600 text-[11px] font-medium">Pen Ink Color:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange('inkColor', 'blue')}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold border transition-all ${
                    data.inkColor !== 'black'
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
                  <span>Blue Ink</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange('inkColor', 'black')}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold border transition-all ${
                    data.inkColor === 'black'
                      ? 'bg-slate-100 border-slate-400 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                  <span>Black Ink</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Date & Reference */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date & Reference
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700">
                Date (Dated:) *
              </label>
              <button
                type="button"
                onClick={setTodayDate}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                Use Today
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                id="drawer-native-date-picker"
                value={getIsoDate(data.dated)}
                onChange={handleNativeDateChange}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                id="drawer-dated-text"
                value={data.dated}
                onChange={(e) => onChange('dated', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              File / Reference No.
            </label>
            <input
              type="text"
              id="drawer-file-no"
              value={data.fileNo}
              onChange={(e) => onChange('fileNo', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Candidate Particulars */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-blue-600" /> Candidate Information
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Prefix
              </label>
              <select
                id="drawer-prefix"
                value={data.prefix}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange('prefix', val);
                  if (val === 'Shri') {
                    onChange('pronounGender', 'He');
                    onChange('possessivePronoun', 'His');
                  } else if (val === 'Miss' || val === 'Mrs.') {
                    onChange('pronounGender', 'She');
                    onChange('possessivePronoun', 'Her');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Shri/Miss/Mrs.">Shri/Miss/Mrs.</option>
                <option value="Shri">Shri</option>
                <option value="Miss">Miss</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Candidate Full Name *
              </label>
              <input
                type="text"
                id="drawer-candidate-name"
                value={data.candidateName}
                onChange={(e) => onChange('candidateName', e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Disability Category Option Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Disability Category</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                  {activeDisabilityOptions.length}
                </span>
              </label>
              <button
                type="button"
                id="btn-edit-disability-options"
                onClick={() => setIsEditingDisability((v) => !v)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                  isEditingDisability
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title={isEditingDisability ? 'Done editing options' : 'Edit, add, or remove disability options'}
              >
                <Settings2 className="w-3 h-3" />
                <span>{isEditingDisability ? 'Done' : 'Edit Options'}</span>
              </button>
            </div>

            {/* Sidebar Inline Option Manager for Disability */}
            {isEditingDisability && (
              <div className="mb-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-blue-700" />
                    <span>Edit Category Options & Text</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDisability}
                    className="text-[10px] text-blue-700 hover:underline font-semibold"
                    title="Restore default disability categories"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* List of current options with editable text & delete button */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {activeDisabilityOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 w-3.5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateDisability(idx, e.target.value)}
                        placeholder="Category text..."
                        className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={activeDisabilityOptions.length <= 1}
                        onClick={() => handleDeleteDisability(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete this option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new option */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-blue-200/60">
                  <input
                    type="text"
                    value={newDisabilityInput}
                    onChange={(e) => setNewDisabilityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDisability();
                      }
                    }}
                    placeholder="Add category (e.g. Cerebral Palsy)..."
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDisability}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Select Dropdown */}
            <select
              id="drawer-disability-select"
              value={data.disabilityCategory || data.otherDisabilityDetail}
              onChange={(e) => handleDisabilityChip(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-medium mb-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Choose Disability Category --</option>
              {activeDisabilityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              <option value="other">other (Custom)</option>
            </select>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {activeDisabilityOptions.map((opt) => {
                const isSelected =
                  data.otherDisabilityDetail === opt || data.disabilityCategory === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleDisabilityChip(opt)}
                    className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              id="drawer-disability-other"
              value={data.otherDisabilityDetail}
              onChange={(e) => {
                onChange('otherDisabilityDetail', e.target.value);
                onChange('disabilityCategory', e.target.value);
              }}
              placeholder="Or type custom category detail..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Intake No & Roll No */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Intake No. *
              </label>
              <input
                type="text"
                id="drawer-intake-no"
                value={data.intakeNo}
                onChange={(e) => onChange('intakeNo', e.target.value)}
                placeholder="e.g. VRC/2025/110"
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Application / Roll No.
              </label>
              <input
                type="text"
                id="drawer-roll-no"
                value={data.applicationRollNo}
                onChange={(e) => onChange('applicationRollNo', e.target.value)}
                placeholder="e.g. ITI-ROLL-7890"
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Course Selection */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Course Seeking Admission In
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Select Course / Subject</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                  {activeCourseOptions.length}
                </span>
              </label>
              <button
                type="button"
                id="btn-edit-course-options"
                onClick={() => setIsEditingCourse((v) => !v)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                  isEditingCourse
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title={isEditingCourse ? 'Done editing options' : 'Edit, add, or remove courses/subjects'}
              >
                <Settings2 className="w-3 h-3" />
                <span>{isEditingCourse ? 'Done' : 'Edit Options'}</span>
              </button>
            </div>

            {/* Sidebar Inline Course Option Manager */}
            {isEditingCourse && (
              <div className="mb-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-blue-700" />
                    <span>Edit Courses / Subjects & Number of Options</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetCourse}
                    className="text-[10px] text-blue-700 hover:underline font-semibold"
                    title="Restore default course options"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* List of current courses with editable text & delete button */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {activeCourseOptions.map((course, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 w-3.5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => handleUpdateCourse(idx, e.target.value)}
                        placeholder="Course/Subject name..."
                        className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={activeCourseOptions.length <= 1}
                        onClick={() => handleDeleteCourse(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete this option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new course */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-blue-200/60">
                  <input
                    type="text"
                    value={newCourseInput}
                    onChange={(e) => setNewCourseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCourse();
                      }
                    }}
                    placeholder="Add subject (e.g. Welder, Fitter)..."
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Course Selection Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {activeCourseOptions.map((course, idx) => {
                const isSelected = data.courseOrAdmissionDetails === course;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCourseSelect(course)}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-lg border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {course}</span>
                    {isSelected && <span className="text-[10px] shrink-0 ml-1">✓</span>}
                  </button>
                );
              })}
            </div>

            <label className="block text-[11px] text-slate-500 mb-1">
              Course Details on Underline:
            </label>
            <input
              type="text"
              id="drawer-course-admission"
              value={data.courseOrAdmissionDetails}
              onChange={(e) => onChange('courseOrAdmissionDetails', e.target.value)}
              placeholder="e.g. English / Computer / IT / Electronics"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Attestation & Recipient */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-600" /> Signatory
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Signatory Designation
            </label>
            <input
              type="text"
              id="drawer-signatory-designation"
              value={data.signatoryDesignation}
              onChange={(e) => onChange('signatoryDesignation', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
