import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Tag } from '../types';
import { TagPill } from './TagPill';
import { tagService } from '../services/TagService';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagName: string) => void;
  tags?: Tag[];
  existingTags?: Tag[];
}

export function TagModal({ 
  isOpen, 
  onClose, 
  onSave, 
  tags, 
  existingTags 
}: TagModalProps) {
  const availableTags = tags || existingTags || [];

  const [tagName, setTagName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if tag already exists
  const existingTagMatch = useMemo(() => {
    return availableTags.find(tag => 
      tag.name.toLowerCase() === tagName.trim().toLowerCase()
    );
  }, [availableTags, tagName]);

  // Similar tags for suggestions
  const similarTags = useMemo(() => {
    if (!tagName.trim()) return [];
    return availableTags.filter(tag => 
      tag.name.toLowerCase().includes(tagName.trim().toLowerCase())
    );
  }, [availableTags, tagName]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTagName('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim the tag name
    const trimmedTagName = tagName.trim();

    // Check if tag is empty
    if (!trimmedTagName) {
      setError('Tag name cannot be empty');
      return;
    }

    // Check for existing tag
    if (existingTagMatch) {
      setError('A tag with this name already exists');
      return;
    }

    // Validate tag name
    const validation = tagService.validateTagName(trimmedTagName);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Save the tag
    onSave(trimmedTagName);
    onClose();
  };

  // Handle key events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return isOpen ? (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog" 
      aria-modal="true"
      aria-labelledby="tag-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-surface-dark-secondary rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 
            id="tag-modal-title" 
            className="text-xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Add New Tag
          </h2>
          <button 
            onClick={onClose}
            className="text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark 
                         rounded-md focus:outline-none focus:ring-2 focus:ring-primary 
                         dark:focus:ring-accent text-text-primary dark:text-text-dark-primary 
                         bg-white dark:bg-surface-dark-tertiary"
              aria-describedby="tag-error tag-suggestions"
              aria-invalid={!!error}
            />
            {error && (
              <p 
                id="tag-error" 
                className="text-error dark:text-error-dark text-sm mt-1"
              >
                {error}
              </p>
            )}
          </div>

          {similarTags.length > 0 && (
            <div 
              id="tag-suggestions" 
              className="mt-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-md p-3"
            >
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">
                Similar existing tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {similarTags.map(tag => (
                  <TagPill 
                    key={tag.id} 
                    tag={tag} 
                    className="cursor-default"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary dark:text-text-dark-secondary 
                         hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary 
                         rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!!existingTagMatch || !tagName.trim()}
              className="px-4 py-2 bg-primary dark:bg-accent text-white 
                         rounded-md hover:bg-primary-dark dark:hover:bg-accent-dark 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}