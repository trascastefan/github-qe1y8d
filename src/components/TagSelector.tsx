import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const filteredTags = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tags
      .filter(tag => 
        !selectedTags.includes(tag.id) && 
        (tag.name.toLowerCase().includes(query) || tag.id.toLowerCase().includes(query))
      )
      .filter(tag => availableTags.includes(tag.id));
  }, [searchQuery, selectedTags, tags, availableTags]);

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-selector-title"
    >
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-xl w-[500px] max-w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 
            id="tag-selector-title" 
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Add Tags
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                const tagName = tag ? tag.name : tagId;
                return (
                  <TagPill
                    key={tagId}
                    tag={tagName}
                    onRemove={() => {
                      setSelectedTags(selectedTags.filter(id => id !== tagId));
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTags([...selectedTags, tag.id])}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
              >
                {tag.name}
              </button>
            ))}

            {searchQuery && !filteredTags.length && !showNewTagInput && onAddNewTag && (
              <button
                onClick={() => {
                  setNewTagName(searchQuery);
                  setShowNewTagInput(true);
                }}
                className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary dark:text-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create "{searchQuery}"
              </button>
            )}
          </div>

          {showNewTagInput && (
            <div className="p-2">
              <div className="flex gap-2">
                <input
                  ref={newTagInputRef}
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter new tag name"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg 
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
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
              dark:hover:bg-gray-800/70 rounded-lg transition-colors"
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
  );
}