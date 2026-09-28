/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { FieldBox } from '../types';
import { Move, CornerDownRight } from 'lucide-react';

interface DraggableFieldWrapperProps {
  id: string;
  label: string;
  box: FieldBox;
  isAdjustMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onChangeBox: (newBox: FieldBox) => void;
  zoomLevel: number;
  zIndex?: number;
  children: React.ReactNode;
}

export const DraggableFieldWrapper: React.FC<DraggableFieldWrapperProps> = ({
  id,
  label,
  box,
  isAdjustMode,
  isSelected,
  onSelect,
  onChangeBox,
  zoomLevel,
  zIndex,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
  }>({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Drag logic
  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if (!isAdjustMode) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: box.left,
      startTop: box.top,
      startWidth: box.width,
      startHeight: box.height,
    };
  };

  // Resize logic
  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (!isAdjustMode) return;
    e.stopPropagation();
    onSelect();
    setIsResizing(true);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: box.left,
      startTop: box.top,
      startWidth: box.width,
      startHeight: box.height,
    };
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { startX, startY, startLeft, startTop, startWidth, startHeight } = dragStartRef.current;
      const zoom = Math.max(0.2, zoomLevel);
      const deltaX = (e.clientX - startX) / zoom;
      const deltaY = (e.clientY - startY) / zoom;

      // Container is standard 800px x 1131px
      const deltaLeftPercent = (deltaX / 800) * 100;
      const deltaTopPercent = (deltaY / 1131) * 100;

      if (isDragging) {
        const nextLeft = Math.max(0, Math.min(100 - box.width, startLeft + deltaLeftPercent));
        const nextTop = Math.max(0, Math.min(98, startTop + deltaTopPercent));

        onChangeBox({
          ...box,
          left: Number(nextLeft.toFixed(2)),
          top: Number(nextTop.toFixed(2)),
        });
      } else if (isResizing) {
        const nextWidth = Math.max(4, Math.min(100 - box.left, startWidth + deltaLeftPercent));
        const nextHeight = Math.max(18, startHeight + deltaY);

        onChangeBox({
          ...box,
          width: Number(nextWidth.toFixed(2)),
          height: Math.round(nextHeight),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, box, onChangeBox, zoomLevel]);

  // Keyboard nudging when selected in Adjust Mode
  useEffect(() => {
    if (!isAdjustMode || !isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Don't intercept if actively typing in an input
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }

        e.preventDefault();
        const step = e.shiftKey ? 1.0 : 0.2; // approx 8px or 1.6px
        const stepY = e.shiftKey ? 1.0 : 0.2; // approx 11px or 2.2px

        let newLeft = box.left;
        let newTop = box.top;

        if (e.key === 'ArrowLeft') newLeft = Math.max(0, box.left - step);
        if (e.key === 'ArrowRight') newLeft = Math.min(100 - box.width, box.left + step);
        if (e.key === 'ArrowUp') newTop = Math.max(0, box.top - stepY);
        if (e.key === 'ArrowDown') newTop = Math.min(98, box.top + stepY);

        onChangeBox({
          ...box,
          left: Number(newLeft.toFixed(2)),
          top: Number(newTop.toFixed(2)),
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdjustMode, isSelected, box, onChangeBox]);

  return (
    <div
      ref={containerRef}
      id={`field-wrapper-${id}`}
      onClick={(e) => {
        if (isAdjustMode) {
          e.stopPropagation();
          onSelect();
        }
      }}
      className={`absolute transition-shadow ${
        isAdjustMode
          ? isSelected
            ? 'ring-2 ring-blue-600 bg-blue-100/40 shadow-md cursor-move'
            : 'ring-1 ring-blue-400/80 bg-blue-50/20 hover:bg-blue-100/30 cursor-move'
          : ''
      }`}
      style={{
        top: `${box.top}%`,
        left: `${box.left}%`,
        width: `${box.width}%`,
        height: `${box.height}px`,
        zIndex: zIndex ?? (isAdjustMode ? (isSelected ? 30 : 20) : (isSelected ? 25 : 10)),
      }}
    >
      {/* Visual Badge and Drag Handle in Adjust Mode */}
      {isAdjustMode && (
        <div
          onMouseDown={handleMouseDownDrag}
          className={`no-print absolute -top-5 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold shadow-xs select-none cursor-move whitespace-nowrap ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-blue-700'
          }`}
        >
          <Move className="w-2.5 h-2.5" />
          <span>{label}</span>
        </div>
      )}

      {/* Resize Handle in Adjust Mode */}
      {isAdjustMode && (
        <div
          onMouseDown={handleMouseDownResize}
          title="Drag to resize field"
          className="no-print absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-nwse-resize shadow z-40"
        >
          <CornerDownRight className="w-2.5 h-2.5" />
        </div>
      )}

      {/* Child input or component */}
      <div
        className="w-full h-full"
        onMouseDown={isAdjustMode ? handleMouseDownDrag : undefined}
      >
        {children}
      </div>
    </div>
  );
};
