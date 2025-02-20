import React, { useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';
import { IdolSize } from '../types';

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
  onAddIdol: (name: string, size: IdolSize) => void;
  isEditing?: boolean;
}

interface IdolFormData {
  name: string;
  size: IdolSize;
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

export const IdolConfigForm: React.FC<IdolConfigFormProps> = ({
  isOpen,
  onClose,
  onAddIdol,
  isEditing = false,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<IdolFormData>({
    name: '',
    size: AVAILABLE_SIZES[0],
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', size: AVAILABLE_SIZES[0] });
      setErrors({});
      nameInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSizeSelect = (size: IdolSize) => {
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddIdol(formData.name.trim(), formData.size);
  };

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
                {isEditing ? 'Edit Idol' : 'Create New Idol'}
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
                    focus:outline-none focus:border-amber-600
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
                              ? 'bg-amber-700/30 border-amber-600'
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
                  className='px-3 py-1.5 text-sm bg-amber-700/30 hover:bg-amber-600/40 rounded'
                >
                  {isEditing ? 'Save Changes' : 'Create Idol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
