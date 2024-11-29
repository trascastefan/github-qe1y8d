import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, X } from 'lucide-react';
import { View, TagCondition } from '../types';
import { TagSelector } from './TagSelector';
import { getEmailCount } from '../utils/emailFilters';
import emailData from '../data/emails.json';

interface ViewsConfigProps {
  views: View[];
  onUpdateViews: (views: View[]) => void;
}

export function ViewsConfig({ views, onUpdateViews }: ViewsConfigProps) {
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [activeView, setActiveView] = useState<{ viewId: string; conditionIndex: number } | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(views);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateViews(items);
  };

  const getUsedTagsInView = (viewId: string, excludeConditionIndex?: number): Set<string> => {
    const view = views.find(v => v.id === viewId);
    if (!view) return new Set();

    return new Set(
      view.conditions.flatMap((condition, index) => 
        index === excludeConditionIndex ? [] : condition.tags
      )
    );
  };

  const handleConditionTypeChange = (viewId: string, conditionIndex: number, type: TagCondition['type']) => {
    const updatedViews = views.map(view => {
      if (view.id === viewId) {
        const newConditions = [...view.conditions];
        newConditions[conditionIndex] = {
          ...newConditions[conditionIndex],
          type
        };
        return { ...view, conditions: newConditions };
      }
      return view;
    });
    onUpdateViews(updatedViews);
  };

  const handleRemoveCondition = (viewId: string, conditionIndex: number) => {
    const updatedViews = views.map(view => {
      if (view.id === viewId) {
        const newConditions = view.conditions.filter((_, index) => index !== conditionIndex);
        if (newConditions.length === 0) {
          newConditions.push({ type: 'includes-any', tags: [] });
        }
        return { ...view, conditions: newConditions };
      }
      return view;
    });
    onUpdateViews(updatedViews);
  };

  const handleAddCondition = (viewId: string) => {
    const updatedViews = views.map(view => {
      if (view.id === viewId) {
        return {
          ...view,
          conditions: [...view.conditions, { type: 'includes-any', tags: [] }]
        };
      }
      return view;
    });
    onUpdateViews(updatedViews);
  };

  const handleUpdateTags = (tags: string[]) => {
    if (!activeView) return;

    const updatedViews = views.map(view => {
      if (view.id === activeView.viewId) {
        const newConditions = [...view.conditions];
        newConditions[activeView.conditionIndex] = {
          ...newConditions[activeView.conditionIndex],
          tags
        };
        return { ...view, conditions: newConditions };
      }
      return view;
    });
    onUpdateViews(updatedViews);
    setShowTagSelector(false);
    setActiveView(null);
  };

  const getConditionColor = (type: TagCondition['type']) => {
    switch (type) {
      case 'includes-any':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'includes-all':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'excludes-any':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configure Views</h1>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="views">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {views.map((view, index) => {
                  const matchingEmails = getEmailCount(emailData.emails, view);
                  
                  return (
                    <Draggable key={view.id} draggableId={view.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white rounded-lg border p-4"
                        >
                          <div className="flex items-center mb-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-3 text-gray-400 hover:text-gray-600"
                              aria-label="Drag to reorder"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex items-center flex-1">
                              <span className="font-medium text-text-primary">{view.name}</span>
                              <span className="ml-2 text-sm text-secondary bg-surface-secondary px-2 py-0.5 rounded-full">
                                {matchingEmails} {matchingEmails === 1 ? 'email' : 'emails'}
                              </span>
                            </div>
                          </div>

                          <div className="relative space-y-3 pl-6">
                            {/* Vertical line for visual grouping */}
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                            {view.conditions.map((condition, conditionIndex) => (
                              <div key={`${view.id}-condition-${conditionIndex}`} className="flex items-start space-x-3">
                                <div className="flex-1">
                                  <select
                                    value={condition.type}
                                    onChange={(e) => handleConditionTypeChange(
                                      view.id,
                                      conditionIndex,
                                      e.target.value as TagCondition['type']
                                    )}
                                    className={`mb-2 px-3 py-1.5 border rounded-lg text-sm font-medium ${getConditionColor(condition.type)}`}
                                  >
                                    <option value="includes-any">Includes any</option>
                                    <option value="includes-all">Includes all</option>
                                    <option value="excludes-any">Excludes any</option>
                                  </select>

                                  <div className="flex flex-wrap gap-2">
                                    {condition.tags.map((tag) => (
                                      <span key={`${view.id}-${conditionIndex}-${tag}`} className="tag-pill group">
                                        {tag}
                                        <button
                                          onClick={() => handleUpdateTags(
                                            condition.tags.filter(t => t !== tag)
                                          )}
                                          className="tag-remove-button"
                                          aria-label={`Remove ${tag} tag`}
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </span>
                                    ))}
                                    <button
                                      onClick={() => {
                                        setActiveView({ viewId: view.id, conditionIndex });
                                        setShowTagSelector(true);
                                      }}
                                      className="tag-add-button"
                                      aria-label="Add new tag"
                                    >
                                      <Plus className="w-3.5 h-3.5 mr-1" />
                                      Add tag
                                    </button>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAddCondition(view.id)}
                                    className="p-1 hover:bg-surface-secondary rounded"
                                    aria-label="Add new condition"
                                  >
                                    <Plus className="w-4 h-4 text-secondary" />
                                  </button>
                                  {view.conditions.length > 1 && (
                                    <button
                                      onClick={() => handleRemoveCondition(view.id, conditionIndex)}
                                      className="p-1 hover:bg-surface-secondary rounded"
                                      aria-label="Remove condition"
                                    >
                                      <X className="w-4 h-4 text-secondary" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {showTagSelector && activeView && (
        <TagSelector
          existingTags={views.find(v => v.id === activeView.viewId)?.conditions[activeView.conditionIndex].tags || []}
          availableTags={Array.from(new Set(views.flatMap(view => view.conditions.flatMap(c => c.tags))))
            .filter(tag => !getUsedTagsInView(activeView.viewId, activeView.conditionIndex).has(tag))}
          onSave={handleUpdateTags}
          onClose={() => {
            setShowTagSelector(false);
            setActiveView(null);
          }}
        />
      )}
    </div>
  );
}