import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'react-feather';

interface IdolInventoryProps {
  onCreateIdol: () => void;
  onExpandChange: (isExpanded: boolean) => void;
}

export const IdolInventory: React.FC<IdolInventoryProps> = ({ onCreateIdol, onExpandChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Notify parent of expand/collapse changes
  useEffect(() => {
    onExpandChange(!isCollapsed);
  }, [isCollapsed, onExpandChange]);

  return (
    <div className='absolute top-0 right-0 h-full'>
      <div
        className={`
          flex flex-col
          h-full
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-12' : 'w-64'}
          bg-stone-900 border-l border-stone-800
          shadow-xl
          relative z-10
        `}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -left-3 top-4 bg-stone-900 border border-stone-800 rounded-full p-1 hover:bg-stone-800 z-10'
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className='flex-1 flex flex-col'>
          <div className='p-4 border-b border-stone-800 flex items-center justify-between'>
            {!isCollapsed && <h2 className='font-semibold'>Idols</h2>}
            <button
              onClick={onCreateIdol}
              className='ml-auto bg-amber-700/30 hover:bg-amber-600/40 rounded p-2'
              title='Create New Idol'
            >
              <Plus size={16} />
            </button>
          </div>

          {!isCollapsed && (
            <div className='flex-1 p-4 text-stone-400 text-sm text-center flex items-center justify-center'>
              <div>
                No idols created yet.
                <br />
                Click the + button to create one.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
