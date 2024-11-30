import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Eye, EyeOff, Edit3, Plus, X,
  Mail, Inbox, Archive, Star, Flag,
  Folder, Tag, Users, Calendar, Bell,
  MessageCircle, ShoppingCart, Heart, Bookmark,
  FileText, Settings, AlertCircle, CheckCircle,
  LucideIcon
} from 'lucide-react';
import { View, TagCondition } from '../types';
import { TagSelector } from './TagSelector';
import { getEmailCount } from '../utils/emailFilters';
import { TagPill } from './TagPill';
import { tagService } from '../services/TagService';
import emailData from '../data/emails.json';
import { EditViewModal } from './EditViewModal';

interface ViewsConfigProps {
  views: View[];
  onUpdateViews: (views: View[]) => void;
}

export function ViewsConfig({ views, onUpdateViews }: ViewsConfigProps) {
  const [editingView, setEditingView] = useState<View | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // Add state to manage the opening and closing of the TagModal

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(views);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onUpdateViews(items);
  };

  const toggleViewVisibility = (index: number) => {
    const newViews = [...views];
    newViews[index] = {
      ...newViews[index],
      visible: !newViews[index].visible
    };
    onUpdateViews(newViews);
  };

  const handleEditView = (view: View) => {
    setEditingView(view);
    setIsModalOpen(true);
  };

  const handleSaveView = (updatedView: View) => {
    const newViews = views.map(view => 
      view.id === updatedView.id ? { ...view, icon: updatedView.icon } : view
    );
    onUpdateViews(newViews);
    setIsModalOpen(false);
    setEditingView(null);
  };

  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleSaveTag = (tagIds: string[]) => {
    // Logic to save the new tags
    setIsTagModalOpen(false);
  };

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
                {views.map((view, index) => (
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
                            {(() => {
                              const iconMap: Record<string, LucideIcon> = {
                                Mail,
                                Inbox,
                                Archive,
                                MessageCircle,
                                Folder,
                                Tag,
                                Flag,
                                Star,
                                Users,
                                Calendar,
                                Bell,
                                FileText,
                                Bookmark,
                                Heart,
                                ShoppingCart,
                                Settings,
                                AlertCircle,
                                CheckCircle
                              };
                              
                              // Log view icon for debugging
                              console.log(`View: ${view.name}, Icon: ${view.icon}`);

                              // Use Mail as default fallback icon if not found
                              const IconComponent = iconMap[view.icon] || Mail;
                              return (
                                <IconComponent 
                                  className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400 
                                    group-hover:text-gray-900 dark:group-hover:text-white 
                                    transition-colors duration-200"
                                />
                              );
                            })()}
                            <span className="font-medium text-text-primary dark:text-text-dark-primary">
                              {view.name}
                            </span>
                            <span className="ml-2 text-sm text-secondary dark:text-text-dark-secondary bg-surface-secondary dark:bg-surface-dark-tertiary px-2 py-0.5 rounded-full">
                              {getEmailCount(emailData.emails, view)} {getEmailCount(emailData.emails, view) === 1 ? 'email' : 'emails'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleViewVisibility(index)}
                              className="p-1.5 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-lg transition-colors ml-2"
                              aria-label={view.visible ? "Hide view" : "Show view"}
                            >
                              {view.visible ? (
                                <Eye className="w-5 h-5 text-green-500 dark:text-green-400" />
                              ) : (
                                <EyeOff className="w-5 h-5 text-red-500 dark:text-red-400" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditView(view)}
                              className="ml-2 p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded transition-colors"
                              aria-label="Edit view"
                            >
                              <Edit3 className="w-5 h-5 text-secondary dark:text-text-dark-secondary" />
                            </button>
                          </div>
                        </div>

                        <div className="relative space-y-3 pl-6">
                          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                          {view.conditions.map((condition, conditionIndex) => (
                            <div key={`${view.id}-condition-${conditionIndex}`} className="flex items-start space-x-3">
                              <div className="flex-1">
                                <select
                                  value={condition.type}
                                  onChange={(e) => {
                                    const updatedViews = views.map(v => {
                                      if (v.id === view.id) {
                                        const newConditions = [...v.conditions];
                                        newConditions[conditionIndex] = {
                                          ...newConditions[conditionIndex],
                                          type: e.target.value as TagCondition['type']
                                        };
                                        return { ...v, conditions: newConditions };
                                      }
                                      return v;
                                    });
                                    onUpdateViews(updatedViews);
                                  }}
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
                                        onRemove={() => {
                                          const updatedViews = views.map(v => {
                                            if (v.id === view.id) {
                                              const newConditions = [...v.conditions];
                                              newConditions[conditionIndex] = {
                                                ...newConditions[conditionIndex],
                                                tags: newConditions[conditionIndex].tags.filter(t => t !== tagId)
                                              };
                                              return { ...v, conditions: newConditions };
                                            }
                                            return v;
                                          });
                                          onUpdateViews(updatedViews);
                                        }}
                                      />
                                    ) : null;
                                  })}
                                  <button
                                    onClick={handleOpenTagModal}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                                      bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Add new tag"
                                  >
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Add Tag
                                  </button>
                                </div>
                              </div>

                              {view.conditions.length > 1 && (
                                <button
                                  onClick={() => {
                                    const updatedViews = views.map(v => {
                                      if (v.id === view.id) {
                                        const newConditions = v.conditions.filter((_, index) => index !== conditionIndex);
                                        if (newConditions.length === 0) {
                                          newConditions.push({ type: 'includes-any', tags: [] });
                                        }
                                        return { ...v, conditions: newConditions };
                                      }
                                      return v;
                                    });
                                    onUpdateViews(updatedViews);
                                  }}
                                  className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded transition-colors"
                                  aria-label="Remove condition"
                                >
                                  <X className="w-4 h-4 text-secondary dark:text-text-dark-secondary" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            const updatedViews = views.map(v => {
                              if (v.id === view.id) {
                                return {
                                  ...v,
                                  conditions: [...v.conditions, { type: 'includes-any', tags: [] }]
                                };
                              }
                              return v;
                            });
                            onUpdateViews(updatedViews);
                          }}
                          className="mt-2 ml-6 inline-flex items-center px-2 py-1 text-sm text-secondary dark:text-text-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded transition-colors"
                          aria-label="Add new condition"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add condition
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <EditViewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingView(null);
          }}
          view={editingView}
          onSave={handleSaveView}
        />

        {isTagModalOpen && (
          <TagSelector
            selectedTagIds={[]}
            onSave={handleSaveTag}
            onClose={() => setIsTagModalOpen(false)}
            onAddNewTag={(tagName) => {
              tagService.addTag(tagName);
              setIsTagModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

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

export default ViewsConfig;