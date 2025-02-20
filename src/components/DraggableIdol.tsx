import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Idol } from '../types';
import { DragTypes } from '../App';
import { Trash2 } from 'react-feather';

interface DraggableIdolProps {
  idol: Idol;
  onDragStateChange?: (isDragging: boolean) => void;
  onDeleteClick?: (id: string) => void;
  showDeleteConfirm?: boolean;
  onConfirmDelete?: (id: string) => void;
}

export const DraggableIdol: React.FC<DraggableIdolProps> = ({
  idol,
  onDragStateChange,
  onDeleteClick,
  showDeleteConfirm,
  onConfirmDelete,
}) => {
  const ref = useRef<HTMLDivElement>(null);

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

  // Apply the drag ref
  drag(ref);

  return (
    <div className='relative'>
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
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                ${showDeleteConfirm ? 'text-red-300' : 'text-stone-400 hover:text-white'}
              `}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        {showDeleteConfirm && (
          <div className='text-xs text-red-300 mt-1'>Click again to confirm delete</div>
        )}
      </div>
    </div>
  );
};
