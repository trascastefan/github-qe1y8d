import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Tag } from '../types';
import { TagPill } from './TagPill';
import { tagService } from '../services/TagService';

interface TagSelectorProps {
  selectedTagIds: string[];
  onSave: (tagIds: string[]) => void;
  onClose: () => void;
  onAddNewTag?: (tagName: string) => void;
  className?: string;
}

export function TagSelector({
  selectedTagIds,
  onSave,
  onClose,
  onAddNewTag,
  className = ''
}: TagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showNewTagInput) {
      newTagInputRef.current?.focus();
    }
  }, [showNewTagInput]);

  const filteredTags = useMemo(() => {
    return tagService.searchTags(searchQuery);
  }, [searchQuery]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = () => {
    onSave(selectedTags);
    onClose();
  };

  const handleAddNewTag = () => {
    if (newTagName.trim() && onAddNewTag) {
      const newTag = tagService.addTag(newTagName.trim());
      setSelectedTags(prev => [...new Set([...prev, newTag.id])]);
      setNewTagName('');
      setShowNewTagInput(false);
      onAddNewTag(newTag.name);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-selector-title"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 
            id="tag-selector-title" 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            Add Tags
          </h2>
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
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-auto">
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => {
              const tag = tagService.getTagById(tagId);
              return tag ? (
                <TagPill
                  key={tag.id}
                  tag={tag}
                  onRemove={() => handleTagToggle(tag.id)}
                />
              ) : null;
            })}
          </div>

          {/* Available Tags */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredTags.length > 0 ? (
              <div className="space-y-2">
                {(showAllTags ? filteredTags : filteredTags.slice(0, 7)).map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white
                      ${selectedTags.includes(tag.id)
                        ? 'bg-primary/10 text-primary'
                        : ''
                      }`}
                  >
                    {tag.name}
                  </button>
                ))}
                {!showAllTags && filteredTags.length > 7 && (
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {filteredTags.length - 7} more tags available
                    <button
                      onClick={() => setShowAllTags(true)}
                      className="text-blue-500 hover:underline ml-2"
                    >
                      Show All
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                No tags found
              </div>
            )}
          </div>

          {searchQuery && filteredTags.length === 0 && onAddNewTag && (
            <button
              onClick={() => {
                const newTag = tagService.addTag(searchQuery.trim());
                setSelectedTags(prev => [...new Set([...prev, newTag.id])]);
                onAddNewTag(newTag.name);
                setSearchQuery('');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create '{searchQuery}' as a new tag
            </button>
          )}

          {onAddNewTag && !searchQuery && (
            <div>
              {showNewTagInput ? (
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
                      if (e.key === 'Enter') {
                        handleAddNewTag();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddNewTag}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 
                      text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewTagInput(true)}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add new tag
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 -mx-6 px-6">
          <div className="flex justify-between space-x-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedTags.length === 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary 
                hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed 
                rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}