export type GridCell = {
  x: number;
  y: number;
  isActive: boolean;
  isOccupied: boolean;
};

export type GridSize = {
  width: number;
  height: number;
};

export type Grid = {
  size: GridSize;
  cells: GridCell[][];
};

// Idol types will be expanded later with modifier support
export type IdolSize = {
  width: number;
  height: number;
};

export type ModifierType = 'prefix' | 'suffix';

export type IdolModifier = {
  id: string;
  type: ModifierType;
  text: string;
  code: string;
};

export type Idol = {
  id: string;
  name: string;
  size: IdolSize;
  position?: {
    x: number;
    y: number;
  };
  modifiers: IdolModifier[];
};

// Helper type for the modifier list display
export type AggregatedModifier = {
  text: string;
  type: ModifierType;
  code: string;
  count: number;
};
