import React, { useState, useMemo } from 'react';
import { Tags as TagsIcon, Edit3, ArrowUpDown } from 'lucide-react';
import { Tag } from '../types';
import { TagModal } from './TagModal';
import { EditTagModal } from './EditTagModal';
import { emailService } from '../services/EmailService';

type SortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'usage-asc' | 'usage-desc';

interface TagsPageProps {
  onUpdateTags: (tags: Tag[]) => void;
  tags: Tag[];
}

export function TagsPage({ onUpdateTags, tags }: TagsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical-asc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Compute tag usage based on number of emails associated with each tag
  const tagUsage = useMemo(() => {
    const emailCounts = emailService.getTagUsageCounts();
    return tags.map(tag => ({
      ...tag,
      usage: emailCounts[tag.id] || 0
    }));
  }, [tags]);

  // Sort tags based on selected option
  const sortedTags = useMemo(() => {
    let sorted = [...tagUsage];
    
    switch (sortOption) {
      case 'alphabetical-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'alphabetical-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'usage-asc':
        return sorted.sort((a, b) => a.usage - b.usage);
      case 'usage-desc':
        return sorted.sort((a, b) => b.usage - a.usage);
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name)); // Default to alphabetical asc
    }
  }, [tagUsage, sortOption]);

  const handleAddTag = (tagName: string) => {
    // Call onUpdateTags to update tags
    onUpdateTags([...tags, { id: Math.random(), name: tagName, llmInstructions: [] }]);
    setIsModalOpen(false);
  };

  const handleEditTag = (updatedTag: Tag) => {
    // Call onUpdateTags to update tags
    onUpdateTags(tags.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
    setEditingTag(null);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'alphabetical-asc', label: 'Alphabetical (A-Z)' },
    { value: 'alphabetical-desc', label: 'Alphabetical (Z-A)' },
    { value: 'usage-asc', label: 'Usage (Low to High)' },
    { value: 'usage-desc', label: 'Usage (High to Low)' }
  ];

  return (
    <main className="flex-1 p-8 bg-surface dark:bg-surface-dark overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TagsIcon className="w-6 h-6 text-secondary dark:text-text-dark-secondary mr-3" />
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Tags</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center px-3 py-2 bg-surface-secondary dark:bg-surface-dark-secondary 
                           text-text-secondary dark:text-text-dark-secondary 
                           rounded-lg hover:bg-border dark:hover:bg-border-dark 
                           transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </button>
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark-secondary 
                                rounded-lg shadow-lg border border-border dark:border-border-dark 
                                z-10 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-surface-secondary 
                                  dark:hover:bg-surface-dark 
                                  ${sortOption === option.value 
                                    ? 'bg-surface-secondary dark:bg-surface-dark text-text-primary dark:text-text-dark-primary' 
                                    : 'text-text-secondary dark:text-text-dark-secondary'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg 
                         hover:bg-primary-dark dark:hover:bg-accent-dark transition-colors"
              aria-label="Create new tag"
            >
              New Tag
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sortedTags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white dark:bg-surface-dark-secondary rounded-lg border border-border 
                         dark:border-border-dark p-4 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-text-primary dark:text-text-dark-primary block">
                        {tag.name}
                      </span>
                      <div className="flex flex-col mt-1">
                        {tag.llmInstructions && Array.isArray(tag.llmInstructions) && (
                          <div className="text-xs text-text-secondary dark:text-text-dark-secondary space-y-0.5">
                            {tag.llmInstructions.map((instruction, index) => (
                              <p key={index} className="pl-3">
                                - {instruction}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="ml-2 p-1 text-text-secondary dark:text-text-dark-secondary 
                                 hover:text-text-primary dark:hover:text-text-dark-primary 
                                 transition-colors"
                      aria-label={`Edit ${tag.name}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <TagModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTag}
          tags={tags}
        />
      )}

      {editingTag && (
        <EditTagModal
          tag={editingTag}
          tags={tags}
          onClose={() => setEditingTag(null)}
          onSave={handleEditTag}
        />
      )}

      {/* Dropdown close overlay */}
      {isSortDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsSortDropdownOpen(false)}
        />
      )}
    </main>
  );
}