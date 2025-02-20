import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'react-feather';
import { Idol, IdolSize } from '../types';
import { DraggableIdol } from './DraggableIdol';

// Import all atlas relic images for the section headers
import atlasRelic1x1 from '../images/AtlasRelic1x1.webp';
import atlasRelic1x2 from '../images/AtlasRelic1x2.webp';
import atlasRelic1x3 from '../images/AtlasRelic1x3.webp';
import atlasRelic2x1 from '../images/AtlasRelic2x1.webp';
import atlasRelic2x2 from '../images/AtlasRelic2x2.webp';
import atlasRelic3x1 from '../images/AtlasRelic3x1.webp';

interface IdolInventoryProps {
  idols: Idol[];
  isCollapsed: boolean;
  onCreateIdol: () => void;
  onToggleCollapse: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

// Map of size dimensions to image paths and display names
const IDOL_SECTIONS = [
  { size: { width: 1, height: 1 }, image: atlasRelic1x1, name: 'Small Atlas Relic' },
  { size: { width: 1, height: 2 }, image: atlasRelic1x2, name: 'Tall Atlas Relic' },
  { size: { width: 1, height: 3 }, image: atlasRelic1x3, name: 'Grand Atlas Relic' },
  { size: { width: 2, height: 1 }, image: atlasRelic2x1, name: 'Wide Atlas Relic' },
  { size: { width: 2, height: 2 }, image: atlasRelic2x2, name: 'Large Atlas Relic' },
  { size: { width: 3, height: 1 }, image: atlasRelic3x1, name: 'Greater Atlas Relic' },
] as const;

interface SectionHeaderProps {
  size: IdolSize;
  image: string;
  name: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ size, image, name }) => (
  <div className='flex items-center gap-2 py-2 px-1 border-b border-stone-800'>
    <img src={image} alt={name} className='w-5 h-5 object-contain opacity-70' />
    <div className='text-xs font-medium text-stone-300 flex-1'>{name}</div>
    <div className='text-xs text-stone-500 pr-2'>
      {size.width}x{size.height}
    </div>
  </div>
);

export const IdolInventory: React.FC<IdolInventoryProps> = ({
  idols,
  isCollapsed,
  onCreateIdol,
  onToggleCollapse,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStateChange = (isDragging: boolean) => {
    if (isDragging) {
      onDragStart();
    } else {
      onDragEnd();
    }
  };

  // Group idols by size
  const groupedIdols = IDOL_SECTIONS.map((section) => ({
    ...section,
    idols: idols.filter(
      (idol) =>
        idol.size.width === section.size.width &&
        idol.size.height === section.size.height &&
        !idol.position // Only show idols that aren't placed on the grid
    ),
  }));

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
          onClick={onToggleCollapse}
          className='absolute -left-3 top-4 bg-stone-900 border border-stone-800 rounded-full p-1 hover:bg-stone-800 cursor-pointer z-10'
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className='flex-1 flex flex-col'>
          <div className='p-4 border-b border-stone-800 flex items-center justify-between'>
            {!isCollapsed && <h2 className='font-semibold'>Idols</h2>}
            <button
              onClick={() => onCreateIdol()}
              className='ml-auto bg-amber-700/30 hover:bg-amber-600/40 rounded p-2'
              title='Create New Idol'
            >
              <Plus size={16} />
            </button>
          </div>

          {!isCollapsed && (
            <div className='flex-1 overflow-y-auto'>
              {idols.length === 0 ? (
                <div className='text-stone-400 text-sm text-center flex items-center justify-center h-full'>
                  <div>
                    No idols created yet.
                    <br />
                    Click the + button to create one.
                  </div>
                </div>
              ) : (
                <div className='flex flex-col divide-y divide-stone-800/50'>
                  {groupedIdols.map((section) =>
                    section.idols.length > 0 ? (
                      <div
                        key={`${section.size.width}x${section.size.height}`}
                        className='flex flex-col'
                      >
                        <SectionHeader
                          size={section.size}
                          image={section.image}
                          name={section.name}
                        />
                        <div className='flex flex-col py-1'>
                          {section.idols.map((idol) => (
                            <DraggableIdol
                              key={idol.id}
                              idol={idol}
                              onDragStateChange={handleDragStateChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
