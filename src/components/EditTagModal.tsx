import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Tag } from '../types';
import { tagService } from '../services/TagService';
import { emailService } from '../services/EmailService';
import { Trash2, Plus, X } from 'lucide-react';
import { TagPill } from './TagPill';

interface EditTagModalProps {
  tag: Tag;
  tags: Tag[];
  onClose: () => void;
  onSave: (updatedTag: Tag) => void;
}

export function EditTagModal({ tag, tags, onClose, onSave }: EditTagModalProps) {
  const [tagName, setTagName] = useState(tag.name);
  const [instructions, setInstructions] = useState<string[]>(() => {
    if (!tag.llmInstructions) return [];
    return Array.isArray(tag.llmInstructions) 
      ? tag.llmInstructions 
      : [tag.llmInstructions];
  });
  const [newInstruction, setNewInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Check if any changes were made
  const hasChanges = useMemo(() => {
    // Check if name changed
    const nameChanged = tagName.trim() !== tag.name;

    // Check if instructions changed
    const originalInstructions = Array.isArray(tag.llmInstructions) 
      ? tag.llmInstructions 
      : tag.llmInstructions 
        ? [tag.llmInstructions]
        : [];
    
    // Compare arrays by content
    const instructionsChanged = 
      instructions.length !== originalInstructions.length ||
      instructions.some((inst, index) => inst !== originalInstructions[index]);

    return nameChanged || instructionsChanged;
  }, [tagName, instructions, tag]);

  // Refs for focus management
  const tagNameInputRef = useRef<HTMLInputElement>(null);
  const deleteConfirmInputRef = useRef<HTMLInputElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    // Store last active element and focus tag name input when modal opens
    lastActiveElement.current = document.activeElement as HTMLElement;
    tagNameInputRef.current?.focus();

    // Cleanup: restore focus when modal closes
    return () => {
      lastActiveElement.current?.focus();
    };
  }, []);

  useEffect(() => {
    // Focus delete confirmation input when delete modal opens
    if (isRemoveModalOpen) {
      deleteConfirmInputRef.current?.focus();
    }
  }, [isRemoveModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isRemoveModalOpen) {
          setIsRemoveModalOpen(false);
          setDeleteConfirmText('');
          setDeleteError(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isRemoveModalOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (isRemoveModalOpen) {
          setIsRemoveModalOpen(false);
          setDeleteConfirmText('');
          setDeleteError(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRemoveModalOpen, onClose]);

  // Get email count for the tag
  const emailCount = useMemo(() => {
    const emailCounts = emailService.getTagUsageCounts();
    return emailCounts[tag.id] || 0;
  }, [tag.id]);

  // Find similar tags when typing
  const similarTags = useMemo(() => {
    if (!tagName.trim()) return [];
    return tags.filter(t => 
      t.id !== tag.id && 
      t.name.toLowerCase().includes(tagName.trim().toLowerCase())
    );
  }, [tags, tagName, tag.id]);

  const handleAddInstruction = () => {
    if (newInstruction.trim() && instructions.length < 5) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSave = () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    // Validate tag name if it changed
    if (tagName.trim() !== tag.name) {
      const validation = tagService.validateTagName(tagName.trim());
      
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      // Check for duplicate tags
      const isDuplicate = tags.some(t => 
        t.id !== tag.id && 
        t.name.toLowerCase() === tagName.trim().toLowerCase()
      );

      if (isDuplicate) {
        setError('A tag with this name already exists');
        return;
      }
    }

    // Save the updated tag
    onSave({
      ...tag,
      name: tagName.trim(),
      llmInstructions: instructions.length > 0 ? instructions : undefined
    });
  };

  const handleRemoveTag = () => {
    // Delete the tag
    const success = tagService.deleteTag(tag.id);
    if (success) {
      setIsRemoveModalOpen(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-tag-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-surface-dark-secondary rounded-lg max-w-md w-full shadow-xl"
        role="document"
      >
        <div className="flex justify-between items-center p-6 border-b border-border dark:border-border-dark">
          <h2 
            id="edit-tag-title"
            className="text-lg font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Edit Tag
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label 
              htmlFor="tag-name" 
              className="block mb-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary"
            >
              Tag Name
            </label>
            <input 
              id="tag-name"
              ref={tagNameInputRef}
              type="text"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md 
                         bg-white dark:bg-surface-dark 
                         text-text-primary dark:text-text-dark-primary 
                         focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent
                         transition-colors duration-200"
              placeholder="Enter tag name"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "tag-name-error" : undefined}
            />
            <div 
              className="mt-2 text-xs text-text-secondary dark:text-text-dark-secondary"
              aria-live="polite"
            >
              {emailCount} email{emailCount !== 1 ? 's' : ''} with this tag
            </div>
            {error && (
              <p 
                id="tag-name-error"
                className="text-sm text-red-500 dark:text-red-400 mt-2"
                role="alert"
              >
                {error}
              </p>
            )}
            {similarTags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-1">
                  Similar tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {similarTags.map(similarTag => (
                    <TagPill 
                      key={similarTag.id} 
                      tag={similarTag} 
                      className="cursor-default"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label 
              htmlFor="instructions" 
              className="block mb-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary"
            >
              Instructions ({instructions.length}/5)
            </label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-border dark:border-border-dark rounded-md 
                              bg-white dark:bg-surface-dark 
                              text-text-primary dark:text-text-dark-primary 
                              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent
                              transition-colors duration-200"
                    placeholder={`Instruction ${index + 1}`}
                    aria-label={`Edit instruction ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveInstruction(index)}
                    className="text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary p-1 rounded-lg transition-colors"
                    aria-label={`Remove instruction ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {instructions.length < 5 && (
                <div className="flex gap-2">
                  <input 
                    id="instructions"
                    type="text"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newInstruction.trim()) {
                        handleAddInstruction();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-border dark:border-border-dark rounded-md 
                              bg-white dark:bg-surface-dark 
                              text-text-primary dark:text-text-dark-primary 
                              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent
                              transition-colors duration-200"
                    placeholder="Add an instruction (press Enter)"
                    aria-label="New instruction"
                  />
                  <button
                    onClick={handleAddInstruction}
                    disabled={!newInstruction.trim() || instructions.length >= 5}
                    className="px-3 py-2 bg-primary dark:bg-accent text-white rounded-lg 
                              hover:bg-primary-dark dark:hover:bg-accent-dark 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors duration-200"
                    aria-label="Add instruction"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p 
              id="tag-name-error"
              className="text-sm text-red-500 dark:text-red-400 mt-2"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-border dark:border-border-dark">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-text-secondary dark:text-text-dark-secondary 
                       hover:bg-surface-secondary hover:text-text-primary
                       dark:hover:bg-surface-dark dark:hover:text-text-dark-primary 
                       rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={() => setIsRemoveModalOpen(true)}
            className="px-4 py-2 text-red-500 dark:text-red-400 rounded-lg
                       hover:bg-surface-secondary dark:hover:bg-surface-dark
                       transition-colors duration-200"
          >
            Delete
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg 
                     hover:bg-primary-dark dark:hover:bg-accent-dark 
                     transition-colors duration-200"
          >
            Save
          </button>
        </div>

        {isRemoveModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-tag-title"
          >
            <div 
              ref={modalRef}
              className="bg-white dark:bg-surface-dark-secondary rounded-lg max-w-sm w-full shadow-xl p-6"
              role="document"
            >
              <div className="flex items-center mb-4">
                <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400 mr-3" aria-hidden="true" />
                <h3 
                  id="delete-tag-title"
                  className="text-lg font-semibold text-text-primary dark:text-text-dark-primary"
                >
                  Delete Tag
                </h3>
              </div>

              <div className="space-y-6">
                <div 
                  className="text-text-secondary dark:text-text-dark-secondary"
                  role="status"
                >
                  <p className="mb-2">
                    This tag is currently used in:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{emailCount} email{emailCount !== 1 ? 's' : ''}</li>
                    <li>0 views</li>
                  </ul>
                </div>

                <div>
                  <p className="text-text-secondary dark:text-text-dark-secondary mb-2">
                    To confirm deletion, type the tag name "{tag.name}" below:
                  </p>
                  <input 
                    type="text"
                    ref={deleteConfirmInputRef}
                    value={deleteConfirmText}
                    onChange={(e) => {
                      setDeleteConfirmText(e.target.value);
                      setDeleteError(null);
                    }}
                    className="w-full px-3 py-2 border border-border dark:border-border-dark rounded-md 
                              bg-white dark:bg-surface-dark 
                              text-text-primary dark:text-text-dark-primary 
                              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent
                              transition-colors duration-200"
                    placeholder={`Type "${tag.name}" to confirm`}
                    aria-invalid={deleteError ? "true" : "false"}
                    aria-describedby={deleteError ? "delete-confirm-error" : undefined}
                  />
                  {deleteError && (
                    <p 
                      id="delete-confirm-error"
                      className="text-sm text-red-500 dark:text-red-400 mt-2"
                      role="alert"
                    >
                      {deleteError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => {
                    setIsRemoveModalOpen(false);
                    setDeleteConfirmText('');
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 text-text-secondary dark:text-text-dark-secondary 
                             hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary 
                             rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (deleteConfirmText !== tag.name) {
                      setDeleteError('Please type the exact tag name to confirm deletion');
                      return;
                    }
                    handleRemoveTag();
                  }}
                  className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg 
                             hover:bg-red-600 dark:hover:bg-red-700 
                             transition-colors duration-200"
                >
                  Delete Tag
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
