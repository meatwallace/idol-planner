import React, { useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';
import { IdolSize } from '../types';

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

const AVAILABLE_SIZES: IdolSize[] = [
  { width: 1, height: 1 }, // AtlasRelic1x1
  { width: 1, height: 2 }, // AtlasRelic1x2
  { width: 1, height: 3 }, // AtlasRelic1x3
  { width: 2, height: 1 }, // AtlasRelic2x1
  { width: 2, height: 2 }, // AtlasRelic2x2
  { width: 3, height: 1 }, // AtlasRelic3x1
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
                <div className='grid grid-cols-3 gap-1.5'>
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={`${size.width}x${size.height}`}
                      type='button'
                      onClick={() => handleSizeSelect(size)}
                      className={`
                        border rounded px-2 py-1.5 text-sm
                        ${
                          formData.size.width === size.width && formData.size.height === size.height
                            ? 'bg-amber-700/30 border-amber-600'
                            : 'bg-stone-800 border-stone-700 hover:bg-stone-700'
                        }
                      `}
                    >
                      {size.width}x{size.height}
                    </button>
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
