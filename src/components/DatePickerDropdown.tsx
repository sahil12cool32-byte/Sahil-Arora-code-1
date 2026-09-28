/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';

interface DatePickerDropdownProps {
  value: string; // DD/MM/YYYY
  onChange: (formattedDate: string) => void;
  onClose: () => void;
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  value,
  onChange,
  onClose,
}) => {
  // Parse initial date or default to current date
  const parseInitialDate = () => {
    if (value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      }
    }
    return new Date();
  };

  const initialDate = parseInitialDate();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  const handleSelectDay = (day: number) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(viewMonth + 1).padStart(2, '0');
    const yyyy = viewYear;
    onChange(`${dd}/${mm}/${yyyy}`);
    onClose();
  };

  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    onChange(`${dd}/${mm}/${yyyy}`);
    onClose();
  };

  // Determine if a day is currently selected
  const isSelectedDay = (day: number) => {
    if (!value) return false;
    const parts = value.split('/');
    if (parts.length === 3) {
      return (
        parseInt(parts[0], 10) === day &&
        parseInt(parts[1], 10) === viewMonth + 1 &&
        parseInt(parts[2], 10) === viewYear
      );
    }
    return false;
  };

  const today = new Date();
  const isTodayDay = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="no-print absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-3 text-xs font-sans animate-in fade-in zoom-in-95 duration-100 select-none text-slate-800"
    >
      {/* Header Month / Year Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
          title="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-bold text-slate-900 text-xs">
          {monthNames[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
          title="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-slate-400 mb-1">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {/* Empty slots before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-6" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const selected = isSelectedDay(day);
          const isToday = isTodayDay(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleSelectDay(day)}
              className={`h-6 w-full rounded flex items-center justify-center font-medium transition-colors ${
                selected
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : isToday
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={handleSetToday}
          className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
        >
          <CalendarIcon className="w-3 h-3" />
          <span>Today</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onChange('');
            onClose();
          }}
          className="text-slate-400 hover:text-red-600"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-medium text-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
