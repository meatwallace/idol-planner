import { useMemo } from 'react';
import minorIdolMods from '../data/minor_idol_mods.json';
import kamasanIdolMods from '../data/kamasan_idol_mods.json';
import totemicIdolMods from '../data/totemic_idol_mods.json';
import nobleIdolMods from '../data/noble_idol_mods.json';
import conquerorIdolMods from '../data/conqueror_idol_mods.json';
import burialIdolMods from '../data/burial_idol_mods.json';
import { IdolSize } from '../types';

interface ModData {
  Name: string;
  Code: string;
  Mod: string;
  Family: string;
}

const IDOL_MODS = {
  '1x1': minorIdolMods,
  '1x2': kamasanIdolMods,
  '1x3': totemicIdolMods,
  '2x1': nobleIdolMods,
  '2x2': conquerorIdolMods,
  '3x1': burialIdolMods,
} as const;

export const useModifierData = (size?: IdolSize) => {
  const modifiers = useMemo(() => {
    if (!size) return { prefixes: [], suffixes: [] };

    const sizeKey = `${size.width}x${size.height}`;
    const mods = IDOL_MODS[sizeKey as keyof typeof IDOL_MODS];

    return {
      prefixes: (mods?.prefixes || []).map((mod: ModData) => ({
        text: mod.Mod,
        code: mod.Code,
        name: mod.Name,
        family: mod.Family,
      })),
      suffixes: (mods?.suffixes || []).map((mod: ModData) => ({
        text: mod.Mod,
        code: mod.Code,
        name: mod.Name,
        family: mod.Family,
      })),
    };
  }, [size]);

  return modifiers;
};
