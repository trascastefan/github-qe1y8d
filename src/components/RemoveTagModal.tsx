import React, { useState, useEffect } from 'react';
import { Tag, Email } from '../types';
import { X } from 'lucide-react';

interface RemoveTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addAsNegative: boolean) => void;
  tag: Tag;
  email: Email;
}

export function RemoveTagModal({ isOpen, onClose, onConfirm, tag, email }: RemoveTagModalProps) {
  const [addAsNegative, setAddAsNegative] = useState(false);

  const handleConfirm = () => {
    onConfirm(addAsNegative);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 dark:bg-black/50" 
              onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-surface dark:bg-surface-dark rounded-lg shadow-lg w-full max-w-md">
              <div className="absolute right-4 top-4">
                <button
                  onClick={onClose}
                  className="text-text-secondary dark:text-text-dark-secondary 
                           hover:text-text-primary dark:hover:text-text-dark-primary"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-4">
                  Remove Tag Confirmation
                </h2>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
                  Are you sure you want to remove the tag "{tag.name}" from this email?
                </p>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="negative-example"
                    checked={addAsNegative}
                    onChange={(e) => setAddAsNegative(e.target.checked)}
                    className="mr-3 h-4 w-4 rounded border-border dark:border-border-dark 
                             text-primary dark:text-accent focus:ring-primary/20 dark:focus:ring-accent/20"
                  />
                  <label 
                    htmlFor="negative-example" 
                    className="text-text-secondary dark:text-text-dark-secondary text-sm"
                  >
                    Add this email as a negative example on tag definition
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-text-secondary dark:text-text-dark-secondary 
                             hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary 
                             rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg 
                             hover:bg-primary-dark dark:hover:bg-accent-dark transition-colors"
                  >
                    Remove Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
