import { IdolGrid } from './components/Grid';
import { IdolInventory } from './components/IdolInventory';
import { GridCell } from './types';
import { useState } from 'react';

function App() {
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);

  const handleCellClick = (cell: GridCell) => {
    if (!cell.isActive) return;
    console.log(`Clicked cell at (${cell.x}, ${cell.y})`);
  };

  const handleCreateIdol = () => {
    console.log('Create idol clicked');
  };

  return (
    <div className='relative min-h-screen bg-stone-950 text-white'>
      {/* Full-screen overlay */}
      <div
        className={`
          fixed inset-0 bg-stone-950
          transition-all duration-300 ease-in-out
          pointer-events-none z-10
          ${isInventoryExpanded ? 'opacity-50' : 'opacity-0'}
        `}
      />

      <div className='h-screen flex flex-col'>
        {/* Header */}
        <header className='p-8'>
          <h1 className='text-3xl font-bold'>Idol Planner</h1>
        </header>

        {/* Main Content */}
        <main className='flex-1 flex relative'>
          {/* Grid Container */}
          <div className='flex-1 flex items-start justify-center p-8'>
            <div className='w-[300px]'>
              <IdolGrid onCellClick={handleCellClick} />
            </div>
          </div>

          {/* Inventory Sidebar */}
          <div className='z-20 relative'>
            <IdolInventory
              onCreateIdol={handleCreateIdol}
              onExpandChange={setIsInventoryExpanded}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
