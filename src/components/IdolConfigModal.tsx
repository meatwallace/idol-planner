import React from 'react';
import { X } from 'react-feather';

interface IdolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
}

export const IdolConfigModal: React.FC<IdolConfigModalProps> = ({
  isOpen,
  onClose,
  isEditing = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className='fixed inset-0 bg-stone-950/70 transition-opacity z-40' />

      {/* Modal Content */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='bg-stone-900 rounded-lg shadow-xl w-full max-w-md'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-stone-800'>
            <h2 className='text-lg font-semibold'>{isEditing ? 'Edit Idol' : 'Create New Idol'}</h2>
            <button onClick={onClose} className='text-stone-400 hover:text-white transition-colors'>
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form className='p-4 space-y-4'>
            {/* Name Input */}
            <div className='space-y-2'>
              <label htmlFor='idolName' className='block text-sm font-medium'>
                Name
              </label>
              <input
                type='text'
                id='idolName'
                className='w-full bg-stone-800 border border-stone-700 rounded px-3 py-2 focus:outline-none focus:border-amber-600'
                placeholder='Enter idol name...'
              />
            </div>

            {/* Size Selection */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Size</label>
              <div className='grid grid-cols-3 gap-2'>
                <button
                  type='button'
                  className='bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded px-3 py-2 text-sm'
                >
                  1x1
                </button>
                <button
                  type='button'
                  className='bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded px-3 py-2 text-sm'
                >
                  2x2
                </button>
                <button
                  type='button'
                  className='bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded px-3 py-2 text-sm'
                >
                  1x3
                </button>
              </div>
            </div>

            {/* Preview will go here */}
            <div className='h-32 bg-stone-800 rounded flex items-center justify-center border border-stone-700'>
              <span className='text-stone-500'>Idol Preview</span>
            </div>

            {/* Actions */}
            <div className='flex justify-end space-x-2 pt-4 border-t border-stone-800'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 rounded'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm bg-amber-700/30 hover:bg-amber-600/40 rounded'
              >
                {isEditing ? 'Save Changes' : 'Create Idol'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
