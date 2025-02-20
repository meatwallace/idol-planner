import { IdolGrid } from './components/Grid';
import { GridCell } from './types';

function App() {
  const handleCellClick = (cell: GridCell) => {
    if (!cell.isActive) return;
    console.log(`Clicked cell at (${cell.x}, ${cell.y})`);
  };

  return (
    <div className='min-h-screen bg-stone-950 text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Path of Exile - Idol Planner</h1>
        <div className='w-[600px] mx-auto'>
          <IdolGrid onCellClick={handleCellClick} />
        </div>
      </div>
    </div>
  );
}

export default App;
