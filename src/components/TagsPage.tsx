import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tags as TagsIcon, GripVertical, Plus, X } from 'lucide-react';
import { Tag } from '../types';
import { TagModal } from './TagModal';

interface TagsPageProps {
  tags: Tag[];
  onUpdateTags: (tags: Tag[]) => void;
}

export function TagsPage({ tags, onUpdateTags }: TagsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tags);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateTags(items);
  };

  const handleAddTag = (tagName: string) => {
    // Create a base ID from the tag name (lowercase, no spaces)
    const baseId = tagName.toLowerCase().replace(/\s+/g, '');
    
    // Find the highest number used for this base ID
    const existingNumbers = tags
      .filter(t => t.id.startsWith(baseId))
      .map(t => {
        const num = parseInt(t.id.replace(baseId, ''), 10);
        return isNaN(num) ? 0 : num;
      });
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    
    const newTag: Tag = {
      id: `${baseId}${nextNumber}`,
      name: tagName
    };
    
    onUpdateTags([...tags, newTag]);
  };

  return (
    <main className="flex-1 p-8 bg-surface dark:bg-surface-dark overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TagsIcon className="w-6 h-6 text-secondary dark:text-text-dark-secondary mr-3" />
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Tags</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg hover:bg-primary-dark dark:hover:bg-accent-dark transition-colors"
            aria-label="Create new tag"
          >
            New Tag
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tags">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {tags.map((tag, index) => (
                  <Draggable key={tag.id} draggableId={tag.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white dark:bg-surface-dark-secondary rounded-lg border border-border dark:border-border-dark p-4 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-3 text-secondary dark:text-text-dark-secondary hover:text-gray-600 dark:hover:text-text-dark-primary transition-colors"
                            aria-label={`Drag to reorder ${tag.name}`}
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-text-primary dark:text-text-dark-primary">{tag.name}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTag}
        tags={tags}
      />
    </main>
  );
}