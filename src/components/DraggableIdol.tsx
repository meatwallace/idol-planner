import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Idol } from '../types';
import { DragTypes } from '../App';

interface DraggableIdolProps {
  idol: Idol;
  onDragStateChange?: (isDragging: boolean) => void;
}

export const DraggableIdol: React.FC<DraggableIdolProps> = ({ idol, onDragStateChange }) => {
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
    <div
      ref={ref}
      className={`
        px-2 py-1.5 rounded cursor-move hover:bg-stone-800
      `}
    >
      <div className='text-sm'>{idol.name}</div>
    </div>
  );
};
