import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Trash2, Search } from 'react-feather';
import { IdolSize, IdolModifier, Idol, ModifierType } from '../types';
import { useModifierData } from '../hooks/useModifierData';
import { createId } from '@paralleldrive/cuid2';
import Fuse from 'fuse.js';

// Import all idol images
import atlasRelic1x1 from '../images/AtlasRelic1x1.webp';
import atlasRelic1x2 from '../images/AtlasRelic1x2.webp';
import atlasRelic1x3 from '../images/AtlasRelic1x3.webp';
import atlasRelic2x1 from '../images/AtlasRelic2x1.webp';
import atlasRelic2x2 from '../images/AtlasRelic2x2.webp';
import atlasRelic3x1 from '../images/AtlasRelic3x1.webp';

interface IdolConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIdol: (name: string, size: IdolSize, modifiers: IdolModifier[]) => void;
  onEditIdol?: (id: string, name: string, size: IdolSize, modifiers: IdolModifier[]) => void;
  editingIdol?: Idol;
}

interface IdolFormData {
  name: string;
  size: IdolSize;
  modifiers: IdolModifier[];
}

// Map of size dimensions to display names and images
const SIZE_INFO: Record<string, { name: string; image: string }> = {
  '1x1': { name: 'Minor Idol', image: atlasRelic1x1 },
  '1x2': { name: 'Kamasan Idol', image: atlasRelic1x2 },
  '1x3': { name: 'Totemic Idol', image: atlasRelic1x3 },
  '2x1': { name: 'Noble Idol', image: atlasRelic2x1 },
  '2x2': { name: 'Conqueror Idol', image: atlasRelic2x2 },
  '3x1': { name: 'Burial Idol', image: atlasRelic3x1 },
};

const AVAILABLE_SIZES: IdolSize[] = [
  { width: 1, height: 1 }, // Minor Idol
  { width: 1, height: 2 }, // Kamasan Idol
  { width: 1, height: 3 }, // Totemic Idol
  { width: 2, height: 1 }, // Noble Idol
  { width: 2, height: 2 }, // Conqueror Idol
  { width: 3, height: 1 }, // Burial Idol
];

interface ModifierSearchProps {
  type: ModifierType;
  options: Array<{
    text: string;
    code: string;
    name: string;
    family: string;
  }>;
  onSelect: (text: string) => void;
  onClose: () => void;
}

const ModifierSearch: React.FC<ModifierSearchProps> = ({ type, options, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fuse = useRef(
    new Fuse(options, {
      keys: ['text', 'name', 'family'],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      findAllMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true,
    })
  );

  useEffect(() => {
    inputRef.current?.focus();
    fuse.current = new Fuse(options, {
      keys: ['text', 'name', 'family'],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      findAllMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true,
    });

    // Handle clicks outside of the search box
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [options, onClose]);

  const results = search
    ? fuse.current
        .search(search)
        .slice(0, 10)
        .map((result) => result.item)
    : options.slice(0, 10);

  return (
    <div
      ref={containerRef}
      className='absolute inset-x-0 top-0 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-10'
    >
      <div className='p-2 border-b border-stone-800'>
        <div className='relative'>
          <Search size={14} className='absolute left-2 top-1/2 -translate-y-1/2 text-stone-400' />
          <input
            ref={inputRef}
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full bg-stone-800 border border-stone-700 rounded pl-8 pr-2 py-1 text-sm'
            placeholder={`Search ${type}s...`}
          />
        </div>
      </div>
      <div className='max-h-48 overflow-y-auto'>
        {results.map((mod) => (
          <button
            key={mod.code}
            onClick={() => {
              onSelect(mod.text);
              onClose();
            }}
            className={`
              w-full text-left px-2 py-1.5 text-sm hover:bg-stone-800
              ${type === 'prefix' ? 'text-blue-300' : 'text-purple-300'}
            `}
          >
            {mod.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export const IdolConfigForm: React.FC<IdolConfigFormProps> = ({
  isOpen,
  onClose,
  onAddIdol,
  onEditIdol,
  editingIdol,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<IdolFormData>({
    name: '',
    size: AVAILABLE_SIZES[0],
    modifiers: [],
  });
  const [errors, setErrors] = useState<{
    name?: string;
    modifiers?: string;
  }>({});
  const [activeSearch, setActiveSearch] = useState<{
    type: ModifierType;
    id: string;
  } | null>(null);

  const modifierData = useModifierData(formData.size);

  // Get available modifiers (excluding already selected ones)
  const availableModifiers = {
    prefixes: modifierData.prefixes.filter(
      (mod) => !formData.modifiers.some((m) => m.type === 'prefix' && m.code === mod.code)
    ),
    suffixes: modifierData.suffixes.filter(
      (mod) => !formData.modifiers.some((m) => m.type === 'suffix' && m.code === mod.code)
    ),
  };

  // Reset form when opening or when editingIdol changes
  useEffect(() => {
    if (isOpen) {
      if (editingIdol) {
        setFormData({
          name: editingIdol.name,
          size: editingIdol.size,
          modifiers: editingIdol.modifiers,
        });
      } else {
        setFormData({ name: '', size: AVAILABLE_SIZES[0], modifiers: [] });
      }
      setErrors({});
      nameInputRef.current?.focus();
    }
  }, [isOpen, editingIdol]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSizeSelect = (size: IdolSize) => {
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleAddModifier = (type: ModifierType) => {
    const prefixCount = formData.modifiers.filter((m) => m.type === 'prefix').length;
    const suffixCount = formData.modifiers.filter((m) => m.type === 'suffix').length;

    if (type === 'prefix') {
      if (prefixCount >= 2) {
        setErrors((prev) => ({ ...prev, modifiers: 'Maximum 2 prefixes allowed' }));
        return;
      }
      if (availableModifiers.prefixes.length === 0) {
        setErrors((prev) => ({ ...prev, modifiers: 'No more prefixes available' }));
        return;
      }
    }

    if (type === 'suffix') {
      if (suffixCount >= 2) {
        setErrors((prev) => ({ ...prev, modifiers: 'Maximum 2 suffixes allowed' }));
        return;
      }
      if (availableModifiers.suffixes.length === 0) {
        setErrors((prev) => ({ ...prev, modifiers: 'No more suffixes available' }));
        return;
      }
    }

    const id = createId();
    setFormData((prev) => ({
      ...prev,
      modifiers: [...prev.modifiers, { id, type, text: '', code: '' }],
    }));
    setActiveSearch({ type, id });
    setErrors((prev) => ({ ...prev, modifiers: undefined }));
  };

  const handleModifierSelect = (id: string, selectedText: string) => {
    setFormData((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((m) => {
        if (m.id !== id) return m;

        const modList =
          m.type === 'prefix' ? availableModifiers.prefixes : availableModifiers.suffixes;
        const selectedMod = modList.find((mod) => mod.text === selectedText);

        if (!selectedMod) return m;

        return {
          ...m,
          text: selectedMod.text,
          code: selectedMod.code,
        };
      }),
    }));
  };

  const handleRemoveModifier = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      modifiers: prev.modifiers.filter((m) => m.id !== id),
    }));
    setErrors((prev) => ({ ...prev, modifiers: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { name?: string; modifiers?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate that there is at least one prefix or suffix
    const hasPrefix = formData.modifiers.some((m) => m.type === 'prefix' && m.text.trim());
    const hasSuffix = formData.modifiers.some((m) => m.type === 'suffix' && m.text.trim());
    if (!hasPrefix && !hasSuffix) {
      newErrors.modifiers = 'At least one prefix or suffix is required';
    }

    // Only validate modifier text if there are any modifiers
    if (formData.modifiers.length > 0 && formData.modifiers.some((m) => !m.text.trim())) {
      newErrors.modifiers = 'All modifiers must have text';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingIdol) {
      onEditIdol?.(
        editingIdol.id,
        formData.name.trim(),
        formData.size,
        formData.modifiers.map((m) => ({ ...m, text: m.text.trim() }))
      );
    } else {
      onAddIdol(
        formData.name.trim(),
        formData.size,
        formData.modifiers.map((m) => ({ ...m, text: m.text.trim() }))
      );
    }
    onClose();
  };

  // Sort modifiers by type (prefixes first, then suffixes)
  const sortedModifiers = useMemo(() => {
    return [...formData.modifiers].sort((a, b) => {
      if (a.type === b.type) return 0;
      return a.type === 'prefix' ? -1 : 1;
    });
  }, [formData.modifiers]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className='fixed inset-0 bg-stone-950/70 transition-opacity z-40' onClick={onClose} />

      {/* Modal Content */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='bg-stone-900 rounded-lg shadow-xl w-full max-w-xl'>
          <div className='p-3'>
            {/* Header */}
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-base font-semibold'>
                {editingIdol ? 'Edit Idol' : 'Create New Idol'}
              </h2>
              <button
                onClick={onClose}
                className='text-stone-400 hover:text-white transition-colors'
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form className='space-y-3' onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className='space-y-1'>
                <label htmlFor='idolName' className='block text-sm font-medium'>
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  type='text'
                  id='idolName'
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`
                    w-full bg-stone-800 border rounded px-2 py-1.5 text-sm
                    focus:outline-none focus:border-blue-600
                    ${errors.name ? 'border-red-500' : 'border-stone-700'}
                  `}
                  placeholder='Enter idol name...'
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
              </div>

              {/* Size Selection */}
              <div className='space-y-1'>
                <label className='block text-sm font-medium'>Size</label>
                <div className='grid grid-cols-2 gap-1.5'>
                  {AVAILABLE_SIZES.map((size) => {
                    const sizeKey = `${size.width}x${size.height}`;
                    const sizeInfo = SIZE_INFO[sizeKey];
                    return (
                      <button
                        key={sizeKey}
                        type='button'
                        onClick={() => handleSizeSelect(size)}
                        className={`
                          border rounded px-2 py-2 text-sm flex items-center gap-2
                          ${
                            formData.size.width === size.width &&
                            formData.size.height === size.height
                              ? 'bg-blue-700/30 border-blue-600'
                              : 'bg-stone-800 border-stone-700 hover:bg-stone-700'
                          }
                        `}
                      >
                        <img
                          src={sizeInfo.image}
                          alt={sizeInfo.name}
                          className='w-8 h-8 object-contain opacity-70'
                        />
                        <div className='flex flex-col items-start flex-1'>
                          <span className='font-medium'>{sizeInfo.name}</span>
                          <span className='text-xs text-stone-400'>{sizeKey}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modifiers */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='block text-sm font-medium'>Modifiers</label>
                  <div className='flex gap-1.5'>
                    <button
                      type='button'
                      onClick={() => handleAddModifier('prefix')}
                      className='text-xs px-2 py-1 rounded bg-blue-900/30 hover:bg-blue-800/30'
                    >
                      Add Prefix
                    </button>
                    <button
                      type='button'
                      onClick={() => handleAddModifier('suffix')}
                      className='text-xs px-2 py-1 rounded bg-purple-900/30 hover:bg-purple-800/30'
                    >
                      Add Suffix
                    </button>
                  </div>
                </div>

                {errors.modifiers && <p className='text-red-500 text-xs'>{errors.modifiers}</p>}

                <div className='space-y-1.5'>
                  {sortedModifiers.map((modifier) => (
                    <div key={modifier.id} className='relative'>
                      <div
                        className={`
                          flex items-center gap-2
                          ${modifier.type === 'prefix' ? 'text-blue-300' : 'text-purple-300'}
                        `}
                      >
                        <button
                          type='button'
                          onClick={() => setActiveSearch({ type: modifier.type, id: modifier.id })}
                          className='flex-1 bg-stone-800 border border-stone-700 rounded px-2 py-1.5 text-sm text-left hover:bg-stone-700'
                        >
                          {modifier.text || `Click to select ${modifier.type}...`}
                        </button>
                        <button
                          type='button'
                          onClick={() => handleRemoveModifier(modifier.id)}
                          className='text-stone-400 hover:text-white'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {activeSearch?.id === modifier.id && (
                        <ModifierSearch
                          type={modifier.type}
                          options={
                            modifier.type === 'prefix'
                              ? availableModifiers.prefixes
                              : availableModifiers.suffixes
                          }
                          onSelect={(text) => handleModifierSelect(modifier.id, text)}
                          onClose={() => setActiveSearch(null)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className='flex justify-end space-x-2 pt-3 border-t border-stone-800'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-3 py-1.5 text-sm bg-stone-800 hover:bg-stone-700 rounded'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-3 py-1.5 text-sm bg-blue-700/30 hover:bg-blue-600/40 rounded'
                >
                  {editingIdol ? 'Save Changes' : 'Create Idol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
