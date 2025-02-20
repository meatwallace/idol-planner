import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Idol } from '../types';
import { DragTypes } from '../App';
import { Trash2, Edit2 } from 'react-feather';
import { IdolTooltip } from './IdolTooltip';

interface DraggableIdolProps {
  idol: Idol;
  onDragStateChange?: (isDragging: boolean) => void;
  onDeleteClick?: (id: string) => void;
  onEditClick?: (idol: Idol) => void;
  showDeleteConfirm?: boolean;
  onConfirmDelete?: (id: string) => void;
}

export const DraggableIdol: React.FC<DraggableIdolProps> = ({
  idol,
  onDragStateChange,
  onDeleteClick,
  onEditClick,
  showDeleteConfirm,
  onConfirmDelete,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState({ top: 0, right: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag<Idol, unknown, { isDragging: boolean }>(() => ({
    type: DragTypes.IDOL,
    item: idol,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Use an empty image as the drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Notify parent of drag state changes
  useEffect(() => {
    onDragStateChange?.(isDragging);
  }, [isDragging, onDragStateChange]);

  // Update tooltip position when showing
  useEffect(() => {
    if (showTooltip && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipStyle({
        top: rect.top,
        right: window.innerWidth - rect.left + 8,
      });
    }
  }, [showTooltip]);

  // Apply the drag ref
  drag(ref);

  return (
    <div
      className='relative'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        ref={ref}
        className={`
          px-2 py-1.5 rounded cursor-move hover:bg-stone-800 group
          ${showDeleteConfirm ? 'bg-red-900/30' : ''}
        `}
      >
        <div className='flex items-center justify-between'>
          <div className='text-sm'>{idol.name}</div>
          {!idol.position && (
            <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(idol);
                }}
                className='text-stone-400 hover:text-white'
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (showDeleteConfirm) {
                    onConfirmDelete?.(idol.id);
                  } else {
                    onDeleteClick?.(idol.id);
                  }
                }}
                className={`
                  ${showDeleteConfirm ? 'text-red-300' : 'text-stone-400 hover:text-white'}
                `}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        {showDeleteConfirm && (
          <div className='text-xs text-red-300 mt-1'>Click again to confirm delete</div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <IdolTooltip
          idol={idol}
          style={{
            top: tooltipStyle.top,
            right: tooltipStyle.right,
          }}
        />
      )}
    </div>
  );
};
