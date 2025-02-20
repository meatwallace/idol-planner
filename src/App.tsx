import { IdolGrid } from './components/Grid';
import { IdolInventory } from './components/IdolInventory';
import { IdolConfigForm } from './components/IdolConfigForm';
import { DragPreviewLayer } from './components/DragPreviewLayer';
import { GridCell, Idol, Grid, IdolModifier, ModifierType } from './types';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ModifierList } from './components/ModifierList';

// Drag and drop type constants
export const DragTypes = {
  IDOL: 'idol',
} as const;

// Initial grid configuration
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

// Helper function to check if an idol can be placed at a given position
const canPlaceIdol = (grid: Grid, idol: Idol, cell: GridCell): boolean => {
  const { x, y } = cell;
  const { width, height } = idol.size;

  // Check grid boundaries
  if (x + width > grid.size.width || y + height > grid.size.height) {
    return false;
  }

  // Check if all required cells are active and unoccupied
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const targetCell = grid.cells[y + dy]?.[x + dx];
      if (!targetCell || !targetCell.isActive || targetCell.isOccupied) {
        return false;
      }
    }
  }

  return true;
};

function App() {
  const [isInventoryCollapsed, setIsInventoryCollapsed] = useState(true);
  const [isConfigFormOpen, setIsConfigFormOpen] = useState(false);
  const [idols, setIdols] = useState<Idol[]>([]);
  const [grid, setGrid] = useState<Grid>(INITIAL_GRID);

  const handleCellClick = (cell: GridCell) => {
    if (!cell.isActive) return;
  };

  const handleCreateIdol = () => {
    setIsConfigFormOpen(true);
    setIsInventoryCollapsed(false);
  };

  const handleAddIdol = (
    name: string,
    size: { width: number; height: number },
    modifiers: { type: ModifierType; text: string; code: string }[] = []
  ) => {
    const newIdol: Idol = {
      id: crypto.randomUUID(),
      name,
      size,
      modifiers: modifiers.map((mod) => ({
        ...mod,
        id: crypto.randomUUID(),
      })),
    };

    setIdols((prev) => [...prev, newIdol]);
    setIsConfigFormOpen(false);
  };

  const handleIdolDrop = (idol: Idol, cell: GridCell) => {
    // Handle deletion case
    if (cell.x === -1 && cell.y === -1) {
      // Remove the idol from the list
      setIdols((prev) => prev.filter((i) => i.id !== idol.id));
      return;
    }

    // Validate placement
    if (!canPlaceIdol(grid, idol, cell)) return;

    // Create a new grid state
    const newGrid = { ...grid };

    // If the idol was previously placed, clear its old position
    if (idol.position) {
      for (let dy = 0; dy < idol.size.height; dy++) {
        for (let dx = 0; dx < idol.size.width; dx++) {
          newGrid.cells[idol.position.y + dy][idol.position.x + dx].isOccupied = false;
        }
      }
    }

    // Mark the new position as occupied
    for (let dy = 0; dy < idol.size.height; dy++) {
      for (let dx = 0; dx < idol.size.width; dx++) {
        newGrid.cells[cell.y + dy][cell.x + dx].isOccupied = true;
      }
    }

    // If the idol was already placed, update its position
    if (idol.position) {
      setIdols((prev) =>
        prev.map((i) => (i.id === idol.id ? { ...i, position: { x: cell.x, y: cell.y } } : i))
      );
    } else {
      // Create a new instance of the idol with a new ID and position
      const newIdol: Idol = {
        ...idol,
        id: crypto.randomUUID(),
        position: { x: cell.x, y: cell.y },
        modifiers: [...idol.modifiers],
      };
      setIdols((prev) => [...prev, newIdol]);
    }

    setGrid(newGrid);
  };

  const handleDragStart = () => {
    setIsInventoryCollapsed(true);
  };

  const handleDragEnd = () => {
    // Keep it collapsed after drag ends
  };

  // Get the list of placed idols (those with a position)
  const placedIdols = idols.filter((idol) => idol.position);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='relative min-h-screen bg-stone-950 text-white'>
        {/* Drag Preview Layer */}
        <DragPreviewLayer />

        {/* Full-screen overlay */}
        <div
          className={`
            fixed inset-0 bg-stone-950
            transition-all duration-300 ease-in-out
            pointer-events-none z-10
            min-[900px]:hidden
            ${!isInventoryCollapsed ? 'opacity-50' : 'opacity-0'}
          `}
        />

        <div className='h-screen flex flex-col'>
          {/* Header */}
          <header className='p-4 text-center'>
            <h1 className='text-xl font-bold text-stone-200'>Legacy of Phrecia</h1>
            <h2 className='text-3xl font-bold'>Idol Planner</h2>
          </header>

          {/* Main Content */}
          <main className='flex-1 flex relative'>
            {/* Left Side - Grid and Form */}
            <div className='flex-1 flex flex-col'>
              {/* Grid Container */}
              <div className='flex-1 flex flex-col items-center p-8 space-y-8'>
                <div className='w-[300px]'>
                  <IdolGrid
                    grid={grid}
                    onCellClick={handleCellClick}
                    onIdolDrop={handleIdolDrop}
                    placedIdols={placedIdols}
                  />
                </div>

                {/* Modifier List */}
                <div className='w-[500px]'>
                  <ModifierList idols={placedIdols} />
                </div>
              </div>

              {/* Configuration Form */}
              <IdolConfigForm
                isOpen={isConfigFormOpen}
                onClose={() => setIsConfigFormOpen(false)}
                onAddIdol={handleAddIdol}
              />
            </div>

            {/* Inventory Sidebar */}
            <div className='z-20 relative'>
              <IdolInventory
                idols={idols}
                isCollapsed={isInventoryCollapsed}
                onCreateIdol={handleCreateIdol}
                onToggleCollapse={() => setIsInventoryCollapsed(!isInventoryCollapsed)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
