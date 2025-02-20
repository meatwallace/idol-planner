import React from 'react';
import { Idol } from '../types';

// Import all idol images
import atlasRelic1x1 from '../images/AtlasRelic1x1.webp';
import atlasRelic1x2 from '../images/AtlasRelic1x2.webp';
import atlasRelic1x3 from '../images/AtlasRelic1x3.webp';
import atlasRelic2x1 from '../images/AtlasRelic2x1.webp';
import atlasRelic2x2 from '../images/AtlasRelic2x2.webp';
import atlasRelic3x1 from '../images/AtlasRelic3x1.webp';

interface GridIdolProps {
  idol: Idol;
  className?: string;
}

// Map of size dimensions to image paths
const sizeToImage: Record<string, string> = {
  '1x1': atlasRelic1x1,
  '1x2': atlasRelic1x2,
  '1x3': atlasRelic1x3,
  '2x1': atlasRelic2x1,
  '2x2': atlasRelic2x2,
  '3x1': atlasRelic3x1,
};

export const GridIdol: React.FC<GridIdolProps> = ({ idol, className = '' }) => {
  // Each grid cell is roughly 50px based on the grid container width of 300px
  // and 6 columns with a small gap
  const CELL_SIZE = 48;
  const GAP_SIZE = 2;

  // If the idol has a position, it's placed on the grid
  const isPlaced = Boolean(idol.position);

  // Safety check for idol size
  if (!idol.size?.width || !idol.size?.height) {
    return null;
  }

  // Get the corresponding image based on idol size
  const imagePath = sizeToImage[`${idol.size.width}x${idol.size.height}`];

  return (
    <div
      className={`
        rounded relative overflow-hidden
        ${isPlaced ? 'bg-slate-700' : 'bg-slate-700/30 border border-slate-600/40'}
        ${className}
      `}
      style={{
        width: `${idol.size.width * CELL_SIZE + (idol.size.width - 1) * GAP_SIZE}px`,
        height: `${idol.size.height * CELL_SIZE + (idol.size.height - 1) * GAP_SIZE}px`,
      }}
    >
      <img
        src={imagePath}
        alt={`${idol.size.width}x${idol.size.height} Idol`}
        className={`
          w-full h-full object-cover
          ${isPlaced ? 'opacity-100' : 'opacity-30'}
        `}
      />
    </div>
  );
};
