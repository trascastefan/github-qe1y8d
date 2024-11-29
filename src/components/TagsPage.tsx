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
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: tagName
    };
    onUpdateTags([...tags, newTag]);
  };

  return (
    <main className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TagsIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
                        className="bg-white rounded-lg border p-4"
                      >
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-3 text-gray-400 hover:text-gray-600"
                            aria-label={`Drag to reorder ${tag.name}`}
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{tag.name}</span>
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