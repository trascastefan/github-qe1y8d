import React, { useState, useEffect } from 'react';
import { View, TagCondition } from '../types';
import { X } from 'lucide-react';
import tags from '../tags.json';

interface TagConditionEditorProps {
  view: View;
  onSave: (viewId: string, conditions: TagCondition[]) => void;
  onClose: () => void;
}

export function TagConditionEditor({ view, onSave, onClose }: TagConditionEditorProps) {
  const [condition, setCondition] = useState<TagCondition>({
    type: 'include',
    operator: 'and',
    tags: []
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.length > 0) {
      const newCondition: TagCondition = {
        ...condition,
        tags: selectedTags
      };
      onSave(view.id, [...(view.conditions || []), newCondition]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl w-[500px] max-w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Add Condition to {view.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Condition Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCondition({ ...condition, type: 'include' })}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    condition.type === 'include'
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border hover:bg-surface-secondary'
                  }`}
                >
                  Include
                </button>
                <button
                  type="button"
                  onClick={() => setCondition({ ...condition, type: 'exclude' })}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    condition.type === 'exclude'
                      ? 'border-danger bg-danger/10 text-danger'
                      : 'border-border hover:bg-surface-secondary'
                  }`}
                >
                  Exclude
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Operator
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCondition({ ...condition, operator: 'and' })}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    condition.operator === 'and'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-surface-secondary'
                  }`}
                >
                  AND
                </button>
                <button
                  type="button"
                  onClick={() => setCondition({ ...condition, operator: 'or' })}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    condition.operator === 'or'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-surface-secondary'
                  }`}
                >
                  OR
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Select Tags
              </label>
              <div className="p-3 border border-border rounded-lg max-h-48 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center p-2 hover:bg-surface-secondary rounded">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id]);
                        } else {
                          setSelectedTags(selectedTags.filter(t => t !== tag.id));
                        }
                      }}
                      className="mr-3"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              disabled={selectedTags.length === 0}
            >
              Add Condition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}