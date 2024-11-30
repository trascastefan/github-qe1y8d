import React, { useState, useMemo } from 'react';
import { RefreshCcw, Archive, Plus } from 'lucide-react';
import { Email, View, Tag } from '../types';
import { TagSelector } from './TagSelector';
import { TagPill } from './TagPill';

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
      return emailsState;
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
    console.log('New tag created:', tagName);
  };

  return (
    <main 
      className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 w-full"
      role="main"
      aria-label="Email list"
    >
      <div className="flex-none bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-4 h-5 w-5"
              aria-label="Select all emails" 
            />
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
              aria-label="Refresh emails"
              tabIndex={0}
            >
              <RefreshCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
              aria-label="Archive selected emails"
              tabIndex={0}
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

      <div 
        className="flex-1 overflow-y-auto w-full"
        role="list"
        aria-label="Email messages"
      >
        {filteredEmails.map((email, index) => (
          <div
            key={email.id}
            className="flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus-within:bg-gray-50 dark:focus-within:bg-gray-800 w-full"
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Handle email selection
                setSelectedEmail(email);
              }
            }}
          >
            <input 
              type="checkbox" 
              className="mr-4 h-5 w-5"
              aria-label={`Select email from ${email.sender}`}
              tabIndex={0}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="font-medium max-w-[calc(100%-100px)] break-words dark:text-white"
                  role="text"
                  aria-label={`From: ${email.sender}`}
                >
                  {email.sender}
                </span>
                <span 
                  className="ml-auto text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
                  role="text"
                  aria-label={`Sent on: ${email.date}`}
                >
                  {email.date}
                </span>
              </div>
              <div 
                className="text-sm text-gray-600 dark:text-gray-300"
                role="text"
                aria-label={`Subject: ${email.subject}`}
              >
                <div className="break-words">{email.subject}</div>
                <div 
                  className="text-gray-500 dark:text-gray-400 break-words"
                  aria-label={`Preview: ${email.preview}`}
                >
                  {email.preview}
                </div>
              </div>
              <div 
                className="flex gap-2 mt-2 flex-wrap"
                role="group"
                aria-label="Email tags"
              >
                {email.tags.map((tag) => (
                  <TagPill
                    key={tag}
                    tag={tags.find(t => t.id === tag)?.name || tag}
                    onRemove={() => handleRemoveTag(email.id, tag)}
                  />
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmail(email);
                    setShowTagSelector(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedEmail(email);
                      setShowTagSelector(true);
                    }
                  }}
                  className="inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium 
                    bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
                  aria-label="Add new tag"
                  tabIndex={0}
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
          tags={tags}
          onClose={() => {
            setShowTagSelector(false);
            setSelectedEmail(null);
          }}
          onAddNewTag={handleAddNewTag}
          onAddTags={handleAddTags}
        />
      )}
    </main>
  );
}