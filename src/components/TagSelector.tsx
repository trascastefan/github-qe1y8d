import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Tag } from '../types';
import { TagPill } from './TagPill';

interface TagSelectorProps {
  existingTags: string[];
  availableTags: string[];
  tags: Tag[];
  onSave: (tags: string[]) => void;
  onClose: () => void;
  onAddNewTag?: (tagName: string) => void;
  className?: string;
}

export function TagSelector({
  existingTags,
  availableTags,
  tags,
  onSave,
  onClose,
  onAddNewTag,
  className = ''
}: TagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(existingTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Focus new tag input when showing
  useEffect(() => {
    if (showNewTagInput) {
      newTagInputRef.current?.focus();
    }
  }, [showNewTagInput]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showNewTagInput) {
          setShowNewTagInput(false);
          searchInputRef.current?.focus();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showNewTagInput]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowNewTagInput(false);
  };

  const handleShowNewTagInput = () => {
    setShowNewTagInput(true);
    setNewTagName(searchQuery);
  };

  const handleAddNewTag = () => {
    if (newTagName.trim() && onAddNewTag) {
      onAddNewTag(newTagName.trim());
      setSelectedTags([...selectedTags, newTagName.trim()]);
      setNewTagName('');
      setShowNewTagInput(false);
    }
  };

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-selector-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px] max-w-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 
            id="tag-selector-title" 
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Select Tags
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
            aria-label="Close tag selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg 
                text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
              aria-label="Search tags"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          <div 
            className="space-y-1 max-h-[280px] overflow-y-auto pr-2"
            role="listbox"
            aria-label="Available tags"
          >
            {filteredTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 
                  transition-colors group focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:ring-accent/20"
                role="option"
                aria-selected={selectedTags.includes(tag)}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => {
                    if (!selectedTags.includes(tag)) {
                      setSelectedTags([...selectedTags, tag]);
                    } else {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    }
                  }}
                  className="mr-3 h-4 w-4 rounded border-gray-300 dark:border-gray-600 
                    text-blue-500 dark:text-blue-400 
                    focus:ring-blue-500 dark:focus:ring-blue-400"
                  aria-label={`Select ${tag}`}
                />
                <span className="text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  {tag}
                </span>
              </label>
            ))}

            {showNewTagInput ? (
              <div className="p-2">
                <div className="flex gap-2">
                  <input
                    ref={newTagInputRef}
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter new tag name"
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg 
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTagName.trim()) {
                        handleAddNewTag();
                      } else if (e.key === 'Escape') {
                        setShowNewTagInput(false);
                        searchInputRef.current?.focus();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddNewTag}
                    disabled={!newTagName.trim()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 
                      text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleShowNewTagInput}
                className="flex items-center w-full p-2 text-blue-500 dark:text-blue-400 
                  hover:bg-gray-100 dark:hover:bg-gray-700/70 rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                aria-label="Create new tag"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Tag {searchQuery && `"${searchQuery}"`}
              </button>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                dark:hover:bg-gray-700/70 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedTags)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 
                text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}