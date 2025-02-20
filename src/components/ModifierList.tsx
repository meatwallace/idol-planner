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
          const key = `${modifier.type}-${modifier.code}`;
          const existing = modifierMap.get(key);

          if (existing) {
            existing.count += 1;
          } else {
            modifierMap.set(key, {
              text: modifier.text,
              type: modifier.type,
              code: modifier.code,
              count: 1,
            });
          }
        });
      });

    const sortedModifiers = Array.from(modifierMap.values()).sort((a, b) => {
      return a.code.localeCompare(b.code);
    });

    return sortedModifiers;
  }, [idols]);

  // Function to process modifier text and calculate totals
  const processModifierText = (text: string, count: number): string => {
    // Match patterns like "+25%" or "-10%"
    const percentageMatch = text.match(/([+-])(\d+)%/);
    if (percentageMatch) {
      const [fullMatch, sign, number] = percentageMatch;
      const totalValue = parseInt(number) * count;
      // Replace the percentage in the text with the calculated total
      return text.replace(fullMatch, `${sign}${totalValue}%`);
    }
    return text;
  };

  if (aggregatedModifiers.length === 0) {
    return null;
  }

  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-lg p-4 ${className}`}>
      <h3 className='text-xs font-medium mb-3'>Atlas Modifiers</h3>
      <p className='text-xs text-stone-400 mb-3'>
        If these modifiers are calculated wrong - sorry 😊
      </p>
      <div className='flex flex-col gap-2 mx-auto'>
        {aggregatedModifiers.map((modifier) => {
          const displayText = processModifierText(modifier.text, modifier.count);
          return (
            <div
              key={`${modifier.type}-${modifier.code}`}
              className={`
                text-xs rounded px-3 py-1.5 bg-slate-600/30
              `}
            >
              {displayText}
            </div>
          );
        })}
      </div>
    </div>
  );
};
