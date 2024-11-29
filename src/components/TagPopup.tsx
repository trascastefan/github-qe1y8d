import React, { useState } from 'react';
import { View } from '../types';

interface TagPopupProps {
  views: View[];
  existingTags: string[];
  onSave: (tags: string[]) => void;
  onClose: () => void;
}

export function TagPopup({ views, existingTags, onSave, onClose }: TagPopupProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = views.map(view => view.name);
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(search.toLowerCase()) &&
    !existingTags.includes(tag)
  );

  const handleSave = () => {
    onSave(selectedTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Add Tags</h2>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search tags..."
            className="w-full px-3 py-2 border rounded-lg mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto mb-4">
            {filteredTags.map((tag) => (
              <label key={tag} className="flex items-center p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag]);
                    } else {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    }
                  }}
                  className="mr-3"
                />
                {tag}
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}