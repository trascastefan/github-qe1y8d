import React, { useState, useEffect } from 'react';
import { View } from '../types';
import {
  Mail, Inbox, Archive, Star, Flag,
  Folder, Tag, Users, Calendar, Bell,
  MessageCircle, ShoppingCart, Heart, Bookmark,
  FileText, Settings, AlertCircle, CheckCircle,
  User, Briefcase, CreditCard
} from 'lucide-react';

interface EditViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: View | null;
  onSave: (view: View) => void;
}

const iconList = [
  // Communication
  "Mail", "Inbox", "Archive", "MessageCircle",

  // Organization
  "Folder", "Tag", "Flag", "Star",

  // Social & Calendar
  "Users", "Calendar", "Bell",

  // Content
  "FileText", "Bookmark", "Heart",

  // People & Work
  "User", "Briefcase", "CreditCard",

  // Shopping & Settings
  "ShoppingCart", "Settings",

  // Status
  "AlertCircle", "CheckCircle"
];

const iconMap = {
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
  CheckCircle,
  User,
  Briefcase,
  CreditCard
};

export function EditViewModal({ isOpen, onClose, view, onSave }: EditViewModalProps) {
  const [name, setName] = useState(view?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(view?.icon || 'Mail');

  // Reset icon when view changes
  useEffect(() => {
    setName(view?.name || '');
    setSelectedIcon(view?.icon || 'Mail');
  }, [view, isOpen]);

  const handleSave = () => {
    if (!view) return;
    onSave({
      ...view,
      name,
      icon: selectedIcon
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!view || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-view-title"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 
            id="edit-view-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            Edit View
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="View name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg max-h-[200px] overflow-y-auto">
              {iconList.map((iconName) => {
                const IconComponent = iconMap[iconName as keyof typeof iconMap];
                return (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent 
                      flex items-center justify-center
                      ${selectedIcon === iconName 
                        ? 'bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent border border-primary/50 dark:border-accent/50' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    aria-label={`Select ${iconName} icon`}
                    aria-pressed={selectedIcon === iconName}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white 
              bg-primary dark:bg-accent hover:bg-primary-dark dark:hover:bg-accent-dark 
              rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
