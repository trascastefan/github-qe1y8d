import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, X } from 'lucide-react';
import { View, TagCondition } from '../types';
import { TagSelector } from './TagSelector';
import { getEmailCount } from '../utils/emailFilters';
import { TagPill } from './TagPill';
import { tagService } from '../services/TagService';
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

  const initialViews: View[] = [
    {
      id: '1',
      name: 'Official Documents',
      conditions: [
        { type: 'includes-any', tags: ['gov1', 'tax1'] }
      ]
    },
    {
      id: '2',
      name: 'Personal Correspondence',
      conditions: [
        { type: 'includes-any', tags: ['prof1', 'job1'] }
      ]
    },
    {
      id: '3',
      name: 'Work Related',
      conditions: [
        { type: 'includes-any', tags: ['work1', 'prof1'] }
      ]
    },
    {
      id: '4',
      name: 'Promotions',
      conditions: [
        { type: 'includes-any', tags: ['bank1', 'invest1'] }
      ]
    },
    {
      id: '5',
      name: 'Newsletters',
      conditions: [
        { type: 'includes-any', tags: ['edu1', 'util1'] }
      ]
    }
  ];

  const [viewsState, setViewsState] = useState<View[]>(initialViews);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-surface dark:bg-surface-dark">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-text-dark-primary">Configure Views</h1>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="views">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {viewsState.map((view, index) => {
                  const matchingEmails = getEmailCount(emailData.emails, view);
                  
                  return (
                    <Draggable key={view.id} draggableId={view.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white dark:bg-surface-dark-secondary rounded-lg border border-border dark:border-border-dark p-4 transition-colors duration-200"
                        >
                          <div className="flex items-center mb-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-3 text-secondary dark:text-text-dark-secondary hover:text-gray-600 dark:hover:text-text-dark-primary transition-colors"
                              aria-label="Drag to reorder"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex items-center flex-1">
                              <span className="font-medium text-text-primary dark:text-text-dark-primary">
                                {view.name}
                              </span>
                              <span className="ml-2 text-sm text-secondary dark:text-text-dark-secondary bg-surface-secondary dark:bg-surface-dark-tertiary px-2 py-0.5 rounded-full">
                                {matchingEmails} {matchingEmails === 1 ? 'email' : 'emails'}
                              </span>
                            </div>
                          </div>

                          <div className="relative space-y-3 pl-6">
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

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
                                    {condition.tags.map((tagId) => {
                                      const tag = tagService.getTagById(tagId);
                                      return tag ? (
                                        <TagPill
                                          key={`${view.id}-${conditionIndex}-${tagId}`}
                                          tag={tag}
                                          onRemove={() => handleUpdateTags(
                                            condition.tags.filter(t => t !== tagId)
                                          )}
                                        />
                                      ) : null;
                                    })}
                                    <button
                                      onClick={() => {
                                        setActiveView({ viewId: view.id, conditionIndex });
                                        setShowTagSelector(true);
                                      }}
                                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                                        bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                                        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                                    className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded transition-colors"
                                    aria-label="Add new condition"
                                  >
                                    <Plus className="w-4 h-4 text-secondary dark:text-text-dark-secondary" />
                                  </button>
                                  {view.conditions.length > 1 && (
                                    <button
                                      onClick={() => handleRemoveCondition(view.id, conditionIndex)}
                                      className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded transition-colors"
                                      aria-label="Remove condition"
                                    >
                                      <X className="w-4 h-4 text-secondary dark:text-text-dark-secondary" />
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
          selectedTagIds={viewsState.find(v => v.id === activeView.viewId)?.conditions[activeView.conditionIndex].tags || []}
          onSave={(updatedTagIds) => {
            const updatedViews = viewsState.map(view => {
              if (view.id === activeView.viewId) {
                const updatedConditions = view.conditions.map((condition, index) => {
                  if (index === activeView.conditionIndex) {
                    return { ...condition, tags: updatedTagIds };
                  }
                  return condition;
                });
                return { ...view, conditions: updatedConditions };
              }
              return view;
            });
            setViewsState(updatedViews);
            setShowTagSelector(false);
            setActiveView(null);
          }}
          onClose={() => {
            setShowTagSelector(false);
            setActiveView(null);
          }}
          onAddNewTag={(newTagName) => {
            const newTag = tagService.addTag(newTagName);
            const updatedViews = viewsState.map(view => {
              if (view.id === activeView.viewId) {
                const updatedConditions = view.conditions.map((condition, index) => {
                  if (index === activeView.conditionIndex) {
                    return { ...condition, tags: [...condition.tags, newTag.id] };
                  }
                  return condition;
                });
                return { ...view, conditions: updatedConditions };
              }
              return view;
            });
            setViewsState(updatedViews);
          }}
        />
      )}
    </div>
  );
}