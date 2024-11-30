import React, { useState, useMemo, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Tag } from '../types';
import { TagPill } from './TagPill';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagName: string) => void;
  existingTags: Tag[];
}

export function TagModal({ isOpen, onClose, onSave, existingTags }: TagModalProps) {
  const [tagName, setTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredTags = useMemo(() => {
    return existingTags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [existingTags, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim the tag name and validate
    const trimmedName = tagName.trim();
    
    // Check if tag name is empty
    if (!trimmedName) {
      setError('Tag name cannot be empty');
      return;
    }

    // Check if tag already exists (case-insensitive)
    const existingTag = existingTags.find(
      (tag) => tag.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingTag) {
      setError('A tag with this name already exists');
      return;
    }

    // Save the tag
    onSave(trimmedName);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal only if click is on the overlay (outside the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px] max-w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Tag</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="p-4 space-y-4"
        >
          <div>
            <label 
              htmlFor="tagName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tag Name
            </label>
            <input
              id="tagName"
              type="text"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                setError(null);
              }}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search existing tags"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                  rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {filteredTags.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTags.slice(0, 5).map((tag) => (
                    <div 
                      key={tag.id} 
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 
                        flex items-center justify-between cursor-default"
                    >
                      <TagPill 
                        tag={tag} 
                        onRemove={() => {}} 
                        interactive={false} 
                      />
                    </div>
                  ))}
                  {filteredTags.length > 5 && (
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {filteredTags.length - 5} more tags available
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No tags found
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 -mx-4 px-4">
            <div className="flex justify-between space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary 
                  hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed 
                  rounded-md transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}