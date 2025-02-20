import React from 'react';
import { Idol } from '../types';

interface IdolTooltipProps {
  idol: Idol;
  className?: string;
  style?: React.CSSProperties;
}

export const IdolTooltip: React.FC<IdolTooltipProps> = ({ idol, className = '', style }) => {
  // Generate tooltip content
  const tooltipContent = (
    <div className='flex flex-col gap-2'>
      {/* Header */}
      <div className='text-center pb-2'>
        <div className='text-stone-300 font-semibold'>{idol.name} Minor Idol</div>
      </div>

      {/* Modifiers */}
      <div className='text-center space-y-1'>
        {idol.modifiers.length > 0 ? (
          idol.modifiers.map((mod) => (
            <div
              key={mod.id}
              className={`text-sm mb-2 ${mod.type === 'prefix' ? 'text-blue-300' : 'text-purple-300'}`}
            >
              {mod.text}
            </div>
          ))
        ) : (
          <div className='text-stone-400 text-sm'>No modifiers found</div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`
        fixed
        pointer-events-none
        z-[100]
        bg-stone-900/95 border border-stone-700 rounded p-3 shadow-xl
        min-w-[300px] max-w-[400px]
        whitespace-normal
        transition-opacity duration-200
        ${className}
      `}
      style={style}
    >
      {tooltipContent}
    </div>
  );
};
