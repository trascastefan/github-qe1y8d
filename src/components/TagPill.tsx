import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '../types';

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
}

export function TagPill({ tag, onRemove, className = '' }: TagPillProps) {
  return (
    <span 
      className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium 
        bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 
        group hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors ${className}`}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 hover:text-blue-800 dark:hover:text-blue-200 rounded
            hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
}