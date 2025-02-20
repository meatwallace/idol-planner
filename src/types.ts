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

export type Idol = {
  id: string;
  size: IdolSize;
  position?: {
    x: number;
    y: number;
  };
};
