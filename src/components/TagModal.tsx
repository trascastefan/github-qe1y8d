import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag } from '../types';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagName: string) => void;
  tags: Tag[];
}

export function TagModal({ isOpen, onClose, onSave, tags }: TagModalProps) {
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTagName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = tagName.trim();
    
    if (!trimmedName) {
      setError('Tag name cannot be empty');
      return;
    }

    // Check for duplicate tag names
    if (tags.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('A tag with this name already exists');
      return;
    }

    onSave(trimmedName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl dark:shadow-card-dark w-[400px] max-w-full">
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
          <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">Add New Tag</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-secondary dark:text-text-dark-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <label htmlFor="tagName" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                error ? 'border-red-500' : 'border-border dark:border-border-dark'
              } bg-white dark:bg-surface-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent`}
              placeholder="Enter tag name"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-primary dark:text-text-dark-primary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg hover:bg-primary-dark dark:hover:bg-accent-dark transition-colors"
            >
              Add Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}