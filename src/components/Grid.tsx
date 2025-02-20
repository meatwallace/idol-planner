import React from 'react';
import { Grid, GridCell } from '../types';

// Initial grid configuration based on the image
// 6x7 grid with specific inactive cells
const INITIAL_GRID: Grid = {
  size: { width: 6, height: 7 },
  cells: Array(7)
    .fill(null)
    .map((_, y) =>
      Array(6)
        .fill(null)
        .map((_, x) => ({
          x,
          y,
          isActive: true, // All cells start as active
          isOccupied: false,
        }))
    ),
};

// Set the inactive cells based on the provided coordinates
const INACTIVE_CELLS = [
  [1, 1], // x, y coordinates
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 4],
  [4, 4],
  [5, 3],
  [5, 4],
  [5, 5],
  [6, 7],
].map(([x, y]) => [x - 1, y - 1]); // Convert to 0-based indices

INACTIVE_CELLS.forEach(([x, y]) => {
  if (INITIAL_GRID.cells[y] && INITIAL_GRID.cells[y][x]) {
    INITIAL_GRID.cells[y][x].isActive = false;
  }
});

interface GridProps {
  grid?: Grid;
  onCellClick?: (cell: GridCell) => void;
}

export const IdolGrid: React.FC<GridProps> = ({ 
  grid = INITIAL_GRID, 
  onCellClick 
}: GridProps) => {
  return (
    <div className='relative border-4 border-stone-800 rounded-lg p-2 bg-stone-900'>
      <div
        className='grid gap-1'
        style={{
          gridTemplateColumns: `repeat(${grid.size.width}, minmax(0, 1fr))`,
        }}
      >
        {grid.cells.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square rounded
                ${
                  cell.isActive
                    ? 'bg-amber-700/30 cursor-pointer hover:bg-amber-600/40'
                    : 'bg-stone-800/50'
                }
                ${cell.isOccupied ? 'opacity-50' : ''}
              `}
              onClick={() => onCellClick?.(cell)}
            >
              {cell.isActive && (
                <div className='w-full h-full flex items-center justify-center'>
                  <div className='w-6 h-6 bg-amber-600/40 rounded-sm' />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Decorative corners */}
      <div className='absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-700/60 rounded-tl-lg' />
      <div className='absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-amber-700/60 rounded-tr-lg' />
      <div className='absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-amber-700/60 rounded-bl-lg' />
      <div className='absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-700/60 rounded-br-lg' />
    </div>
  );
};
