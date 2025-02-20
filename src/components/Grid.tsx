import React, { useRef, useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Grid, GridCell, Idol } from '../types';
import { DragTypes } from '../App';
import { GridIdol } from './GridIdol';
import { IdolTooltip } from './IdolTooltip';
import { Trash2 } from 'react-feather';

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
          isActive: true,
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

interface DragItem extends Idol {
  source: 'grid' | 'inventory';
}

interface GridProps {
  grid?: Grid;
  onCellClick?: (cell: GridCell) => void;
  onIdolDrop?: (idol: Idol, cell: GridCell) => void;
  placedIdols?: Idol[];
}

interface GridCellProps {
  cell: GridCell;
  isPreview: boolean;
  isValidTarget: boolean;
  onClick?: (cell: GridCell) => void;
  placedIdol?: Idol;
  onDragStart?: () => void;
}

// Helper function to check if an idol can be placed at a given position
const canPlaceIdol = (
  grid: Grid,
  idol: Idol,
  cell: GridCell,
  placedIdols: Idol[] = []
): boolean => {
  const { x, y } = cell;
  const { width, height } = idol.size;

  // Check grid boundaries
  if (x + width > grid.size.width || y + height > grid.size.height) {
    return false;
  }

  // Check if all required cells are active and either unoccupied or occupied by the same idol
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const targetCell = grid.cells[y + dy]?.[x + dx];
      if (!targetCell || !targetCell.isActive) {
        return false;
      }

      // If the cell is occupied, check if it's occupied by the idol being moved
      if (targetCell.isOccupied) {
        const occupyingIdol = placedIdols.find(
          (placedIdol) =>
            placedIdol.position &&
            x + dx >= placedIdol.position.x &&
            x + dx < placedIdol.position.x + placedIdol.size.width &&
            y + dy >= placedIdol.position.y &&
            y + dy < placedIdol.position.y + placedIdol.size.height
        );

        // Only allow if the cell is occupied by the idol being moved
        if (!occupyingIdol || occupyingIdol.id !== idol.id) {
          return false;
        }
      }
    }
  }

  return true;
};

const GridCellComponent: React.FC<GridCellProps> = ({
  cell,
  isPreview,
  isValidTarget,
  onClick,
  placedIdol,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Check if this cell is part of the idol
  const isPartOfIdol =
    placedIdol &&
    placedIdol.position &&
    cell.x >= placedIdol.position.x &&
    cell.x < placedIdol.position.x + placedIdol.size.width &&
    cell.y >= placedIdol.position.y &&
    cell.y < placedIdol.position.y + placedIdol.size.height;

  // Only render the idol preview if this is the starting cell (top-left)
  const shouldRenderIdol =
    placedIdol &&
    placedIdol.position &&
    cell.x === placedIdol.position.x &&
    cell.y === placedIdol.position.y;

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(
    () => ({
      type: DragTypes.IDOL,
      item: () => ({ ...placedIdol!, source: 'grid' }),
      canDrag: () => Boolean(placedIdol && isPartOfIdol),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [placedIdol, cell.x, cell.y, isPartOfIdol]
  );

  // Handle mouse movement for tooltip positioning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div
      ref={(node) => {
        // If this cell is part of an idol, make it draggable
        if (isPartOfIdol) {
          drag(node);
        }
      }}
      className={`
        aspect-square rounded relative
        ${!isPreview && (cell.isActive ? 'bg-slate-700/30 cursor-pointer hover:bg-slate-600/40' : 'bg-stone-900/50')}
        ${cell.isOccupied && !shouldRenderIdol ? 'opacity-50' : ''}
        ${isPreview && isValidTarget ? 'bg-green-600/30 hover:bg-green-600/40' : ''}
        ${isPreview && !isValidTarget ? 'bg-red-600/30 hover:bg-red-600/40' : ''}
        ${isPartOfIdol ? 'cursor-move' : ''}
        transition-colors duration-150
      `}
      onClick={() => onClick?.(cell)}
      onMouseEnter={() => !isDragging && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      {shouldRenderIdol && (
        <div
          ref={previewRef}
          className='absolute inset-0 pointer-events-none'
          style={{
            width: `${placedIdol.size.width * 100}%`,
            height: `${placedIdol.size.height * 100}%`,
            opacity: isDragging ? 0.5 : 1,
          }}
        >
          <GridIdol idol={placedIdol} className='w-full h-full' />
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && shouldRenderIdol && !isDragging && placedIdol && (
        <IdolTooltip
          idol={placedIdol}
          style={{
            top: mousePos.y,
            right: window.innerWidth - mousePos.x + 16,
          }}
        />
      )}
    </div>
  );
};

interface DeleteZoneProps {
  onDelete: (idol: Idol) => void;
}

const DeleteZone: React.FC<DeleteZoneProps> = ({ onDelete }) => {
  const deleteRef = useRef<HTMLDivElement>(null);
  const [{ isOver, isDraggingFromGrid }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; isDraggingFromGrid: boolean }
  >(
    () => ({
      accept: DragTypes.IDOL,
      canDrop: (item) => item.source === 'grid',
      drop: (item) => onDelete(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isDraggingFromGrid: monitor.getItem()?.source === 'grid',
      }),
    }),
    [onDelete]
  );

  // Apply the drop ref
  drop(deleteRef);

  return (
    <div
      ref={deleteRef}
      className={`
        absolute bottom-1 right-1 w-10 h-10
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        text-stone-500
        ${isDraggingFromGrid ? 'opacity-100 scale-110 hover:opacity-100' : 'opacity-30 scale-100'}
        ${isOver ? 'text-red-500' : ''}
      `}
    >
      <Trash2 size={20} />
    </div>
  );
};

export const IdolGrid: React.FC<GridProps> = ({
  grid = INITIAL_GRID,
  onCellClick,
  onIdolDrop,
  placedIdols = [],
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(
    () => ({
      accept: DragTypes.IDOL,
      hover: (item, monitor) => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        // Get grid bounds
        const gridBounds = gridElement.getBoundingClientRect();
        const cellWidth = gridBounds.width / grid.size.width;
        const cellHeight = gridBounds.height / grid.size.height;

        // Get mouse position relative to grid
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const offsetX = clientOffset.x - gridBounds.left;
        const offsetY = clientOffset.y - gridBounds.top;

        // Calculate cell coordinates
        const x = Math.floor(offsetX / cellWidth);
        const y = Math.floor(offsetY / cellHeight);

        // Ensure coordinates are within bounds
        if (x >= 0 && x < grid.size.width && y >= 0 && y < grid.size.height) {
          const cell = grid.cells[y][x];
          setHoverCell(cell);
          setDragItem(item);
        } else {
          setHoverCell(null);
          setDragItem(null);
        }
      },
      drop: (item) => {
        if (!hoverCell) return;
        if (canPlaceIdol(grid, item, hoverCell, placedIdols)) {
          onIdolDrop?.(item, hoverCell);
        }
        // Clear drag state
        setHoverCell(null);
        setDragItem(null);
      },
      canDrop: (item) => {
        return hoverCell ? canPlaceIdol(grid, item, hoverCell, placedIdols) : false;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [grid, onIdolDrop, hoverCell, placedIdols]
  );

  // Apply the drop ref to the grid container
  drop(gridRef);

  // Clear drag state when drag ends
  useEffect(() => {
    if (!isOver && (hoverCell || dragItem)) {
      setHoverCell(null);
      setDragItem(null);
    }
  }, [isOver, hoverCell, dragItem]);

  const handleDelete = (idol: Idol) => {
    // Create a new grid state
    const newGrid = { ...grid };

    // Clear the cells occupied by the idol
    if (idol.position) {
      for (let dy = 0; dy < idol.size.height; dy++) {
        for (let dx = 0; dx < idol.size.width; dx++) {
          const y = idol.position.y + dy;
          const x = idol.position.x + dx;
          if (newGrid.cells[y] && newGrid.cells[y][x]) {
            newGrid.cells[y][x].isOccupied = false;
          }
        }
      }
    }

    // Call onIdolDrop with a removal indicator
    onIdolDrop?.(
      { ...idol, position: undefined }, // Clear the position to remove it from the grid
      { x: -1, y: -1, isActive: false, isOccupied: false } // Use invalid coordinates to indicate removal
    );
  };

  return (
    <div className='relative border-2 border-stone-800 rounded-lg p-1 my-1 bg-stone-900'>
      <div
        ref={gridRef}
        className='grid gap-0.5 relative'
        style={{
          gridTemplateColumns: `repeat(${grid.size.width}, minmax(0, 1fr))`,
        }}
      >
        {grid.cells.map((row, y) =>
          row.map((cell, x) => {
            // Calculate if this cell is part of the idol footprint
            const isPartOfIdol =
              isOver &&
              hoverCell &&
              dragItem &&
              x >= hoverCell.x &&
              x < hoverCell.x + dragItem.size.width &&
              y >= hoverCell.y &&
              y < hoverCell.y + dragItem.size.height;

            // Calculate if the placement is valid
            const isValidTarget = Boolean(
              isPartOfIdol &&
                hoverCell &&
                dragItem &&
                canPlaceIdol(grid, dragItem, hoverCell, placedIdols)
            );

            // Find placed idol at this position
            const placedIdol = placedIdols.find(
              (idol) =>
                idol.position &&
                x >= idol.position.x &&
                x < idol.position.x + idol.size.width &&
                y >= idol.position.y &&
                y < idol.position.y + idol.size.height
            );

            return (
              <GridCellComponent
                key={`${x}-${y}`}
                cell={cell}
                isPreview={Boolean(isPartOfIdol)}
                isValidTarget={isValidTarget}
                onClick={onCellClick}
                placedIdol={placedIdol}
                onDragStart={() => {}}
              />
            );
          })
        )}
      </div>

      {/* Delete Zone */}
      <DeleteZone onDelete={handleDelete} />
    </div>
  );
};
