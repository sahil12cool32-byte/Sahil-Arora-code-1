/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef, useState } from 'react';
import { ReferralFormData, DEFAULT_FIELD_POSITIONS, FieldBox, FieldPositions } from '../types';
import { DraggableFieldWrapper } from './DraggableFieldWrapper';
import { DISABILITY_OPTIONS, COURSE_OPTIONS } from './FormDrawer';
import { DatePickerDropdown } from './DatePickerDropdown';
import { Upload, Trash2, Calendar, ChevronDown, Check } from 'lucide-react';

interface DocumentViewProps {
  data: ReferralFormData;
  onChange: (field: keyof ReferralFormData, value: any) => void;
  showFieldGuides?: boolean;
  verticalOffset?: number;
  isAdjustMode?: boolean;
  selectedFieldId?: string | null;
  onSelectField?: (id: string | null) => void;
  onUpdateFieldBox?: (fieldKey: keyof FieldPositions, newBox: FieldBox) => void;
  zoomLevel?: number;
  isPreview?: boolean;
  disabilityOptions?: string[];
  courseOptions?: string[];
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  data,
  onChange,
  showFieldGuides = true,
  verticalOffset = 0,
  isAdjustMode = false,
  selectedFieldId = null,
  onSelectField = () => {},
  onUpdateFieldBox = () => {},
  zoomLevel = 1.0,
  isPreview = false,
  disabilityOptions,
  courseOptions,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const activeDisabilityOptions = disabilityOptions || DISABILITY_OPTIONS;
  const activeCourseOptions = courseOptions || COURSE_OPTIONS.map((c) => c.value);

  const [activeQuickPicker, setActiveQuickPicker] = useState<'date' | 'disability' | 'course' | null>(null);

  const positions = data.fieldPositions || DEFAULT_FIELD_POSITIONS;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange('photoDataUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange('signatureDataUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropPhoto = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange('photoDataUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Base styling for smart transparent inputs over the background image
  const isHandwritten = data.fontStyle !== 'print';
  const inkClass = data.inkColor === 'black' ? 'ink-pen-black' : 'ink-pen-blue';
  const textStyleClass = isHandwritten
    ? `font-handwriting font-bold ${inkClass} tracking-wide leading-tight`
    : 'font-doc-serif font-bold text-black tracking-normal';

  const fieldBaseClass = isPreview
    ? `w-full h-full ${textStyleClass} px-1 border-none outline-none bg-transparent select-text pointer-events-none`
    : `w-full h-full ${textStyleClass} px-1 border-none outline-none transition-colors select-text print:bg-transparent ${
        showFieldGuides && !isAdjustMode
          ? 'bg-amber-100/70 border border-dashed border-amber-500 hover:bg-amber-200/80 focus:bg-white focus:ring-1 focus:ring-blue-600'
          : isAdjustMode
          ? 'bg-transparent cursor-move'
          : 'bg-transparent hover:bg-blue-100/30 focus:bg-amber-50/70 focus:ring-1 focus:ring-blue-600'
      }`;

  if (!data.backgroundImageUrl) {
    return null;
  }

  return (
    <div
      id="referral-document-sheet"
      onClick={() => {
        onSelectField(null);
        setActiveQuickPicker(null);
      }}
      className="document-sheet relative bg-white shadow-2xl mx-auto my-0 print:shadow-none print:m-0 select-none"
      style={{
        width: '800px',
        height: '1131px', // Standard A4 (1:1.414 ratio)
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ================= 1. HIGH RESOLUTION BACKGROUND IMAGE ================= */}
      <img
        src={data.backgroundImageUrl}
        alt="Original PDF Background"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
      />

      {/* ================= 2. DRAGGABLE / LOCATED INPUT OVERLAYS ================= */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          transform: `translateY(${verticalOffset}px)`,
        }}
      >
        {/* 1. Dated Field with Custom Calendar Popover */}
        <DraggableFieldWrapper
          id="dated"
          label="Dated"
          box={positions.dated}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'dated'}
          onSelect={() => onSelectField('dated')}
          onChangeBox={(box) => onUpdateFieldBox('dated', box)}
          zoomLevel={zoomLevel}
          zIndex={activeQuickPicker === 'date' ? 100 : undefined}
        >
          <div className="relative w-full h-full flex items-center group">
            <input
              type="text"
              id="overlay-dated"
              disabled={isAdjustMode}
              value={data.dated}
              onChange={(e) => onChange('dated', e.target.value)}
              placeholder={showFieldGuides && !isAdjustMode ? 'DD/MM/YYYY' : ''}
              className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[20px]' : 'text-[15px]'}`}
            />

            {!isAdjustMode && !isPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveQuickPicker((prev) => (prev === 'date' ? null : 'date'));
                }}
                className="no-print absolute right-0 top-0 bottom-0 px-1 opacity-70 hover:opacity-100 hover:text-blue-700 text-slate-600 transition-opacity"
                title="Open calendar to pick date"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Custom Interactive Calendar Dropdown */}
            {!isAdjustMode && !isPreview && activeQuickPicker === 'date' && (
              <DatePickerDropdown
                value={data.dated}
                onChange={(newDate) => onChange('dated', newDate)}
                onClose={() => setActiveQuickPicker(null)}
              />
            )}
          </div>
        </DraggableFieldWrapper>

        {/* 2. Candidate Name (after Shri/Miss/Mrs.) */}
        <DraggableFieldWrapper
          id="candidateName"
          label="Candidate Name"
          box={positions.candidateName}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'candidateName'}
          onSelect={() => onSelectField('candidateName')}
          onChangeBox={(box) => onUpdateFieldBox('candidateName', box)}
          zoomLevel={zoomLevel}
        >
          <input
            type="text"
            id="overlay-candidate-name"
            disabled={isAdjustMode}
            value={data.candidateName}
            onChange={(e) => onChange('candidateName', e.target.value)}
            placeholder={showFieldGuides && !isAdjustMode ? 'Candidate Full Name' : ''}
            className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[22px]' : 'text-[15px]'}`}
          />
        </DraggableFieldWrapper>

        {/* 3. Other Disability with Quick Category Picker */}
        <DraggableFieldWrapper
          id="otherDisability"
          label="Disability Category"
          box={positions.otherDisability}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'otherDisability'}
          onSelect={() => onSelectField('otherDisability')}
          onChangeBox={(box) => onUpdateFieldBox('otherDisability', box)}
          zoomLevel={zoomLevel}
          zIndex={activeQuickPicker === 'disability' ? 100 : undefined}
        >
          <div className="relative w-full h-full flex items-center group">
            <input
              type="text"
              id="overlay-disability-other"
              disabled={isAdjustMode}
              value={data.otherDisabilityDetail || data.disabilityCategory}
              onChange={(e) => {
                onChange('otherDisabilityDetail', e.target.value);
                onChange('disabilityCategory', e.target.value);
              }}
              placeholder={showFieldGuides && !isAdjustMode ? 'Disability Category' : ''}
              className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[20px]' : 'text-[14px]'}`}
            />

            {!isAdjustMode && !isPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveQuickPicker((prev) => (prev === 'disability' ? null : 'disability'));
                }}
                className="no-print absolute right-0 top-0 bottom-0 px-1 opacity-70 hover:opacity-100 text-slate-600 hover:text-blue-700 transition-opacity"
                title="Select disability category"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick Disability Selector Dropdown */}
            {!isAdjustMode && !isPreview && activeQuickPicker === 'disability' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="no-print absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-300 ring-1 ring-black/10 z-[100] p-1.5 text-xs font-sans animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="font-semibold text-slate-500 px-2 py-1 text-[11px] uppercase tracking-wider">
                  Select Disability Category:
                </div>
                <div className="space-y-0.5">
                  {activeDisabilityOptions.map((opt) => {
                    const isSelected =
                      data.otherDisabilityDetail === opt || data.disabilityCategory === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          onChange('disabilityCategory', opt);
                          onChange('otherDisabilityDetail', opt);
                          setActiveQuickPicker(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-slate-800 font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DraggableFieldWrapper>

        {/* 4. Intake No. */}
        <DraggableFieldWrapper
          id="intakeNo"
          label="Intake No."
          box={positions.intakeNo}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'intakeNo'}
          onSelect={() => onSelectField('intakeNo')}
          onChangeBox={(box) => onUpdateFieldBox('intakeNo', box)}
          zoomLevel={zoomLevel}
        >
          <input
            type="text"
            id="overlay-intake-no"
            disabled={isAdjustMode}
            value={data.intakeNo}
            onChange={(e) => onChange('intakeNo', e.target.value)}
            placeholder={showFieldGuides && !isAdjustMode ? 'Intake Number' : ''}
            className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[20px]' : 'text-[14.5px]'}`}
          />
        </DraggableFieldWrapper>

        {/* 5. Course / Trade with Matching Dropdown Menu (1. English, 2. Computer, 3. IT, 4. Electronics) */}
        <DraggableFieldWrapper
          id="course"
          label="Course / Trade"
          box={positions.course}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'course'}
          onSelect={() => onSelectField('course')}
          onChangeBox={(box) => onUpdateFieldBox('course', box)}
          zoomLevel={zoomLevel}
          zIndex={activeQuickPicker === 'course' ? 100 : undefined}
        >
          <div className="relative w-full h-full flex items-center group">
            <input
              type="text"
              id="overlay-course"
              disabled={isAdjustMode}
              value={data.courseOrAdmissionDetails}
              onChange={(e) => onChange('courseOrAdmissionDetails', e.target.value)}
              placeholder={showFieldGuides && !isAdjustMode ? 'Select from dropdown (English / Computer / IT / Electronics) or type...' : ''}
              className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[21px]' : 'text-[15px]'}`}
            />

            {!isAdjustMode && !isPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveQuickPicker((prev) => (prev === 'course' ? null : 'course'));
                }}
                className="no-print absolute right-0 top-0 bottom-0 px-2 opacity-70 hover:opacity-100 text-slate-600 hover:text-blue-700 transition-opacity"
                title="Select course / subject"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {/* Course / Subject Dropdown Menu */}
            {!isAdjustMode && !isPreview && activeQuickPicker === 'course' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="no-print absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-slate-300 ring-1 ring-black/10 z-[100] p-1.5 text-xs font-sans animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="font-semibold text-slate-500 px-2 py-1 text-[11px] uppercase tracking-wider">
                  Select Course / Subject:
                </div>
                <div className="space-y-0.5">
                  {activeCourseOptions.map((c, idx) => {
                    const isSelected = data.courseOrAdmissionDetails === c;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onChange('courseOrAdmissionDetails', c);
                          setActiveQuickPicker(null);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded text-slate-800 font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[13px]">{idx + 1}. {c}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DraggableFieldWrapper>

        {/* 6. Candidate Photo Box */}
        <DraggableFieldWrapper
          id="photo"
          label="Photo Box"
          box={positions.photo}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'photo'}
          onSelect={() => onSelectField('photo')}
          onChangeBox={(box) => onUpdateFieldBox('photo', box)}
          zoomLevel={zoomLevel}
        >
          <div
            id="overlay-photo-box"
            onDragOver={handleDragOver}
            onDrop={handleDropPhoto}
            onClick={() => !isAdjustMode && !isPreview && photoInputRef.current?.click()}
            className={`w-full h-full flex items-center justify-center group overflow-hidden transition-colors ${
              isPreview
                ? ''
                : isAdjustMode
                ? 'cursor-move'
                : showFieldGuides && !data.photoDataUrl
                ? 'cursor-pointer ring-2 ring-blue-500 bg-blue-50/40 hover:bg-black/5'
                : 'cursor-pointer hover:bg-black/5'
            }`}
            title={isAdjustMode ? 'Drag to move photo box' : isPreview ? '' : 'Click or drop photo here'}
          >
            {data.photoDataUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={data.photoDataUrl}
                  alt="Candidate Photo"
                  className="w-full h-full object-cover"
                />
                {!isAdjustMode && !isPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('photoDataUrl', null);
                    }}
                    className="no-print absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : !isPreview ? (
              <div className="no-print opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs text-blue-800 font-sans font-semibold bg-white/90 p-2 rounded shadow-xs">
                <Upload className="w-4 h-4 mb-1 text-blue-600" />
                <span>Upload Photo</span>
              </div>
            ) : null}
          </div>
        </DraggableFieldWrapper>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {/* 7. Application Roll No. */}
        <DraggableFieldWrapper
          id="rollNo"
          label="Roll No."
          box={positions.rollNo}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'rollNo'}
          onSelect={() => onSelectField('rollNo')}
          onChangeBox={(box) => onUpdateFieldBox('rollNo', box)}
          zoomLevel={zoomLevel}
        >
          <input
            type="text"
            id="overlay-roll-no"
            disabled={isAdjustMode}
            value={data.applicationRollNo}
            onChange={(e) => onChange('applicationRollNo', e.target.value)}
            placeholder={showFieldGuides && !isAdjustMode ? 'Roll No.' : ''}
            className={`${fieldBaseClass} text-center ${isHandwritten ? 'text-[20px]' : 'text-sm'}`}
          />
        </DraggableFieldWrapper>

        {/* 8. Signature Area */}
        <DraggableFieldWrapper
          id="signature"
          label="Signature Box"
          box={positions.signature}
          isAdjustMode={isAdjustMode}
          isSelected={selectedFieldId === 'signature'}
          onSelect={() => onSelectField('signature')}
          onChangeBox={(box) => onUpdateFieldBox('signature', box)}
          zoomLevel={zoomLevel}
        >
          <div
            id="overlay-signature-box"
            onClick={() => !isAdjustMode && !isPreview && signatureInputRef.current?.click()}
            className={`w-full h-full flex items-center justify-center group transition-colors ${
              isPreview
                ? ''
                : isAdjustMode
                ? 'cursor-move'
                : showFieldGuides && !data.signatureDataUrl
                ? 'cursor-pointer border border-dashed border-emerald-500 bg-emerald-50/30 hover:bg-black/5'
                : 'cursor-pointer hover:bg-black/5'
            }`}
            title={isAdjustMode ? 'Drag to move signature box' : isPreview ? '' : 'Click to upload official signature'}
          >
            {data.signatureDataUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={data.signatureDataUrl}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain"
                />
                {!isAdjustMode && !isPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('signatureDataUrl', null);
                    }}
                    className="no-print absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Remove signature"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : !isPreview ? (
              <div className="no-print opacity-0 group-hover:opacity-100 text-[11px] text-blue-700 font-sans font-medium bg-white/80 px-2 py-0.5 rounded shadow-xs">
                + Upload Signature
              </div>
            ) : null}
          </div>
        </DraggableFieldWrapper>

        <input
          ref={signatureInputRef}
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
