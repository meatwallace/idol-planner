import { IdolGrid } from './components/Grid';
import { IdolInventory } from './components/IdolInventory';
import { IdolConfigForm } from './components/IdolConfigForm';
import { DragPreviewLayer } from './components/DragPreviewLayer';
import { GridCell, Idol, Grid, ModifierType, IdolSize } from './types';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ModifierList } from './components/ModifierList';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { createId } from '@paralleldrive/cuid2';

// Import all idol modifier data
import minorIdolMods from './data/minor_idol_mods.json';
import kamasanIdolMods from './data/kamasan_idol_mods.json';
import totemicIdolMods from './data/totemic_idol_mods.json';
import nobleIdolMods from './data/noble_idol_mods.json';
import conquerorIdolMods from './data/conqueror_idol_mods.json';
import burialIdolMods from './data/burial_idol_mods.json';

// Map of size dimensions to modifier data
const IDOL_MODS = {
  '1x1': minorIdolMods,
  '1x2': kamasanIdolMods,
  '1x3': totemicIdolMods,
  '2x1': nobleIdolMods,
  '2x2': conquerorIdolMods,
  '3x1': burialIdolMods,
} as const;

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

// Helper function to encode idols for URL
const encodeIdols = (idols: Idol[]): string => {
  // Split idols into placed and inventory
  const data = {
    p: idols
      .filter((idol) => idol.position)
      .map((idol) => [
        idol.name,
        [idol.size.width, idol.size.height],
        [idol.position!.x, idol.position!.y],
        idol.modifiers.map((m) => [m.type === 'prefix' ? 0 : 1, m.code]),
      ]),
    i: idols
      .filter((idol) => !idol.position)
      .map((idol) => [
        idol.name,
        [idol.size.width, idol.size.height],
        idol.modifiers.map((m) => [m.type === 'prefix' ? 0 : 1, m.code]),
      ]),
  };

  return compressToEncodedURIComponent(JSON.stringify(data));
};

// Helper function to decode idols from URL
const decodeIdols = (encoded: string): Idol[] => {
  try {
    const decompressed = decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return [];

    const decoded = JSON.parse(decompressed);

    // Helper function to get modifier text from code
    const getModifierText = (code: string, size: IdolSize, type: 'prefix' | 'suffix'): string => {
      const sizeKey = `${size.width}x${size.height}`;
      const mods = IDOL_MODS[sizeKey as keyof typeof IDOL_MODS];
      const list = type === 'prefix' ? mods?.prefixes : mods?.suffixes;
      const mod = list?.find((m: any) => m.Code === code);
      return mod?.Mod || '';
    };

    // Decode placed idols
    const placedIdols = (decoded.p || []).map((d: any) => {
      const size = { width: d[1][0], height: d[1][1] };
      return {
        id: createId(),
        name: d[0],
        size,
        position: { x: d[2][0], y: d[2][1] },
        modifiers: d[3].map((m: any) => {
          const type = m[0] === 0 ? 'prefix' : 'suffix';
          return {
            id: createId(),
            type,
            code: m[1],
            text: getModifierText(m[1], size, type),
          };
        }),
      };
    });

    // Decode inventory idols
    const inventoryIdols = (decoded.i || []).map((d: any) => {
      const size = { width: d[1][0], height: d[1][1] };
      return {
        id: createId(),
        name: d[0],
        size,
        modifiers: d[2].map((m: any) => {
          const type = m[0] === 0 ? 'prefix' : 'suffix';
          return {
            id: createId(),
            type,
            code: m[1],
            text: getModifierText(m[1], size, type),
          };
        }),
      };
    });

    return [...placedIdols, ...inventoryIdols];
  } catch (e) {
    console.error('Failed to decode idols from URL:', e);
    return [];
  }
};

function App() {
  const [isInventoryCollapsed, setIsInventoryCollapsed] = useState(true);
  const [isConfigFormOpen, setIsConfigFormOpen] = useState(false);
  const [idols, setIdols] = useState<Idol[]>([]);
  const [grid, setGrid] = useState<Grid>(INITIAL_GRID);
  const [editingIdol, setEditingIdol] = useState<Idol | undefined>();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Load initial state from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedIdols = params.get('idols');

    if (encodedIdols) {
      // If URL has state, use it and update localStorage
      const decodedIdols = decodeIdols(encodedIdols);
      setIdols(decodedIdols);
      localStorage.setItem(
        'idolPlanner',
        JSON.stringify({
          idols: decodedIdols,
          grid: INITIAL_GRID,
        })
      );
    } else {
      // If no URL state, try to load from localStorage
      const savedState = localStorage.getItem('idolPlanner');
      if (savedState) {
        try {
          const { idols: savedIdols, grid: savedGrid } = JSON.parse(savedState);
          setIdols(savedIdols);
          setGrid(savedGrid);

          // Update URL with loaded state
          if (savedIdols.length > 0) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('idols', encodeIdols(savedIdols));
            window.history.replaceState({}, '', newUrl);
          }
        } catch (e) {
          console.error('Failed to load state from localStorage:', e);
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'idolPlanner',
      JSON.stringify({
        idols,
        grid,
      })
    );
  }, [idols, grid]);

  // Update URL when state changes
  useEffect(() => {
    if (idols.length > 0) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('idols', encodeIdols(idols));
      window.history.replaceState({}, '', newUrl);
    } else {
      // Clear URL params if no idols exist
      window.history.replaceState({}, '', window.location.pathname);
      // Also clear localStorage
      localStorage.removeItem('idolPlanner');
    }
  }, [idols]);

  const handleClearGrid = () => {
    // Reset grid to initial state
    setGrid(INITIAL_GRID);
    // Remove all placed idols
    setIdols((prev) => prev.filter((idol) => !idol.position));
    // Reset confirmation state
    setShowClearConfirm(false);
  };

  const handleDeleteIdol = (id: string) => {
    setIdols((prev) => prev.filter((idol) => idol.id !== id));
  };

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
      id: createId(),
      name,
      size,
      modifiers: modifiers.map((mod) => ({
        ...mod,
        id: createId(),
      })),
    };

    setIdols((prev) => [...prev, newIdol]);
    setIsConfigFormOpen(false);
  };

  const handleEditIdol = (
    id: string,
    name: string,
    size: { width: number; height: number },
    modifiers: { type: ModifierType; text: string; code: string }[] = []
  ) => {
    setIdols((prev) =>
      prev.map((idol) =>
        idol.id === id
          ? {
              ...idol,
              name,
              size,
              modifiers: modifiers.map((mod) => ({
                ...mod,
                id: createId(),
              })),
            }
          : idol
      )
    );
    setEditingIdol(undefined);
    setIsConfigFormOpen(false);
  };

  const handleStartEdit = (idol: Idol) => {
    setEditingIdol(idol);
    setIsConfigFormOpen(true);
    setIsInventoryCollapsed(false);
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
        id: createId(),
        position: { x: cell.x, y: cell.y },
        modifiers: idol.modifiers.map((m) => ({ ...m, id: createId() })),
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 2000);
      },
      (err) => {
        console.error('Failed to copy URL:', err);
      }
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='relative min-h-screen bg-stone-950 text-white'>
        {/* Share notification */}
        <div
          className={`
            fixed top-4 left-1/2 -translate-x-1/2 z-50
            bg-stone-800 text-stone-200 px-4 py-2 rounded-lg shadow-lg
            transition-all duration-300 ease-in-out
            ${showShareNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
          `}
        >
          URL copied to clipboard
        </div>

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
            <h2 className='text-3xl font-bold my-1'>Idol Planner</h2>
            <p className='text-xs text-stone-400'>
              SCUFFED, SORRY. ALSO NO UNIQUE IDOLS (PROBABLY EVER) 🤭
            </p>
            <p className='text-xs text-stone-400 underline'>
              <a href='https://github.com/meatwallace/idol-planner'>
                https://github.com/meatwallace/idol-planner
              </a>
            </p>
            <p className='text-s text-stone-400 font-bold'>
              !!! save your URLs before opening someone elses planner !!!
            </p>
          </header>

          {/* Main Content */}
          <main className='flex-1 flex relative'>
            {/* Left Side - Grid and Form */}
            <div className='flex-1 flex flex-col'>
              {/* Grid Container */}
              <div className='flex-1 flex flex-col items-center p-8 space-y-8'>
                <div className='w-[300px] relative'>
                  <IdolGrid
                    grid={grid}
                    onCellClick={handleCellClick}
                    onIdolDrop={handleIdolDrop}
                    placedIdols={placedIdols}
                  />
                  <div className='absolute -bottom-8 right-0 flex gap-2'>
                    <button
                      onClick={handleShare}
                      className='px-3 py-1.5 text-xs bg-blue-900/30 hover:bg-blue-800/40 rounded text-blue-300'
                    >
                      Share
                    </button>
                    <button
                      onClick={() =>
                        showClearConfirm ? handleClearGrid() : setShowClearConfirm(true)
                      }
                      onBlur={() => setTimeout(() => setShowClearConfirm(false), 200)}
                      className='px-3 py-1.5 text-xs bg-red-900/30 hover:bg-red-800/40 rounded text-red-300'
                    >
                      {showClearConfirm ? 'Click to confirm' : 'Clear Grid'}
                    </button>
                  </div>
                </div>

                {/* Modifier List */}
                <div className='w-[500px]'>
                  <ModifierList idols={placedIdols} />
                </div>
              </div>

              {/* Configuration Form */}
              <IdolConfigForm
                isOpen={isConfigFormOpen}
                onClose={() => {
                  setIsConfigFormOpen(false);
                  setEditingIdol(undefined);
                }}
                onAddIdol={handleAddIdol}
                onEditIdol={handleEditIdol}
                editingIdol={editingIdol}
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
                onDeleteIdol={handleDeleteIdol}
                onEditIdol={handleStartEdit}
              />
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
