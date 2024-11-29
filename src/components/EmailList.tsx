import React, { useState, useMemo } from 'react';
import { RefreshCcw, Archive, Plus, X } from 'lucide-react';
import { Email, View, Tag } from '../types';
import { TagSelector } from './TagSelector';

interface EmailListProps {
  emails: Email[];
  selectedView: string;
  views: View[];
  getParentView: (viewName: string) => string[];
  tags: Tag[];
}

export function EmailList({ emails, selectedView, views, getParentView, tags }: EmailListProps) {
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailsState, setEmailsState] = useState<Email[]>(emails);

  const filteredEmails = useMemo(() => {
    if (!selectedView) {
      return emailsState; // Show all emails when no view is selected (default home state)
    }
    
    const view = views.find(v => v.id === selectedView);
    if (!view) return emailsState;

    return emailsState.filter(email => {
      return view.conditions.some(condition => {
        if (condition.type === 'includes-any') {
          return email.tags.some(tag => condition.tags.includes(tag));
        }
        return false;
      });
    });
  }, [emailsState, selectedView, views]);

  const handleRemoveTag = (emailId: number, tagToRemove: string) => {
    setEmailsState(emailsState.map(email => {
      if (email.id === emailId) {
        return {
          ...email,
          tags: email.tags.filter(tag => tag !== tagToRemove)
        };
      }
      return email;
    }));
  };

  const handleAddTags = (newTags: string[]) => {
    if (selectedEmail) {
      setEmailsState(emailsState.map(email => {
        if (email.id === selectedEmail.id) {
          return {
            ...email,
            tags: [...new Set([...email.tags, ...newTags])]
          };
        }
        return email;
      }));
    }
    setShowTagSelector(false);
    setSelectedEmail(null);
  };

  const handleAddNewTag = (tagName: string) => {
    // In a real application, this would be handled by a global tag management system
    console.log('New tag created:', tagName);
  };

  return (
    <main className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex-none bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-4"
              aria-label="Select all emails" 
            />
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Refresh emails"
            >
              <RefreshCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Archive selected emails"
            >
              <Archive className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>{selectedView || 'All Emails'}</span>
            <span>·</span>
            <span>{filteredEmails.length} messages</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className="flex items-center px-4 py-2 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <input 
              type="checkbox" 
              className="mr-4"
              aria-label={`Select email from ${email.sender}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-medium max-w-[calc(100%-100px)] break-words dark:text-white">{email.sender}</span>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{email.date}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div className="break-words">{email.subject}</div>
                <div className="text-gray-500 dark:text-gray-400 break-words">{email.preview}</div>
              </div>
              <div className="flex gap-2 mt-1 flex-wrap">
                {email.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 group hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors"
                  >
                    {tags.find(t => t.id === tag)?.name || tag}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(email.id, tag);
                      }}
                      className="ml-1.5 hover:text-blue-800 dark:hover:text-blue-200"
                      aria-label={`Remove ${tags.find(t => t.id === tag)?.name || tag} tag`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmail(email);
                    setShowTagSelector(true);
                  }}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Add new tag"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add tag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showTagSelector && selectedEmail && (
        <TagSelector
          existingTags={selectedEmail.tags}
          availableTags={Array.from(new Set(views.flatMap(view => view.conditions.flatMap(c => c.tags))))}
          onClose={() => {
            setShowTagSelector(false);
            setSelectedEmail(null);
          }}
          onAddNewTag={handleAddNewTag}
          onAddTags={handleAddTags}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Tags</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(views.flatMap(view => view.conditions.flatMap(c => c.tags)))).map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedEmail.tags.includes(tag)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleAddTags([tag])}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  onClick={() => setShowTagSelector(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </TagSelector>
      )}
    </main>
  );
}