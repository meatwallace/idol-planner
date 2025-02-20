import React, { useMemo } from 'react';
import { Idol, AggregatedModifier } from '../types';

interface ModifierListProps {
  idols: Idol[];
  className?: string;
}

export const ModifierList: React.FC<ModifierListProps> = ({ idols, className = '' }) => {
  // Aggregate modifiers from all placed idols
  const aggregatedModifiers = useMemo(() => {
    const modifierMap = new Map<string, AggregatedModifier>();

    // Only process idols that are placed on the grid
    idols
      .filter((idol) => idol.position)
      .forEach((idol) => {
        idol.modifiers.forEach((modifier) => {
          const key = `${modifier.type}-${modifier.text}`;
          const existing = modifierMap.get(key);

          if (existing) {
            existing.count += 1;
          } else {
            modifierMap.set(key, {
              text: modifier.text,
              type: modifier.type,
              count: 1,
            });
          }
        });
      });

    // Convert map to array and sort by count (descending) and then by text
    return Array.from(modifierMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.text.localeCompare(b.text);
    });
  }, [idols]);

  if (aggregatedModifiers.length === 0) {
    return null;
  }

  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-lg p-4 ${className}`}>
      <h3 className='text-sm font-medium mb-2'>Active Modifiers</h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {aggregatedModifiers.map((modifier) => (
          <div
            key={`${modifier.type}-${modifier.text}`}
            className={`
              text-sm rounded px-2 py-1.5 flex items-center justify-between
              ${modifier.type === 'prefix' ? 'bg-blue-900/30' : 'bg-purple-900/30'}
            `}
          >
            <span className='truncate'>{modifier.text}</span>
            <span className='ml-2 text-xs opacity-70'>{modifier.count}×</span>
          </div>
        ))}
      </div>
    </div>
  );
};
