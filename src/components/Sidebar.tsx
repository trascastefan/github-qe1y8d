import React, { useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  User,
  Briefcase,
  Tag,
  CreditCard,
  Heart,
  Mail, 
  Inbox, 
  Archive, 
  Star, 
  Flag,
  Folder, 
  Users, 
  Calendar, 
  Bell,
  MessageCircle, 
  ShoppingCart, 
  Bookmark,
  Settings, 
  AlertCircle, 
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import { View } from '../types';
import viewsData from '../data/views.json';

interface SidebarProps {
  views: View[];
  selectedView: string | null;
  onViewSelect: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Mail, 
  Inbox, 
  Archive, 
  Star, 
  Flag,
  Folder, 
  Tag,
  Users, 
  Calendar, 
  Bell,
  MessageCircle, 
  ShoppingCart, 
  Heart, 
  Bookmark,
  FileText,
  Settings, 
  AlertCircle, 
  CheckCircle,
  User,
  Briefcase,
  CreditCard
};

const hasLongWord = (text: string) => text.split(' ').some(word => word.length > 13);

export function Sidebar({ views, selectedView, onViewSelect, isCollapsed, onToggleCollapse }: SidebarProps) {
  // Load initial collapsed state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState !== null) {
      onToggleCollapse();
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const renderIcon = (iconName: string, className: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-36' : 'w-64'}
        flex-none bg-white dark:bg-gray-900 flex flex-col h-full
        transform-gpu transition-all duration-300 ease-in-out will-change-transform
        motion-reduce:transition-none overflow-hidden
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Inbox Menu Item */}
        <div className={!isCollapsed ? 'px-4' : 'px-2'}>
          <button
            onClick={() => onViewSelect('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewSelect('');
              }
            }}
            className={`
              relative group w-full flex items-center
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 rounded-lg
              ${selectedView === null
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }
              ${isCollapsed ? 'flex-col py-2' : 'px-3 py-2'}
              text-sm
              transform-gpu transition-transform duration-150
            `}
            aria-label="Inbox"
            aria-current={selectedView === null ? 'page' : undefined}
            role="tab"
            tabIndex={0}
          >
            <div className={`
              flex items-center justify-center
              transition-transform duration-200
              ${isCollapsed ? 'mb-1' : 'mr-2'}
              group-hover:rotate-[-5deg]
            `}>
              {renderIcon('FileText', 'w-5 h-5')}
            </div>
            {isCollapsed ? (
              <span className="text-center px-2 transition-opacity duration-200 group-hover:opacity-80">
                Inbox
              </span>
            ) : (
              <span className="flex-1 text-left">Inbox</span>
            )}
            <div className="absolute inset-0 hover:scale-[1.02] active:scale-[0.98] pointer-events-none" />
          </button>
        </div>

        {/* Views Section */}
        <div className={`
          ${!isCollapsed ? 'px-4' : 'px-2'}
          mt-4
        `}>
          {views.length > 0 && (
            <div className={`
              text-xs font-medium text-gray-500 dark:text-gray-400 mb-2
              ${isCollapsed ? 'text-center' : 'pl-3'}
            `}>
              VIEWS
            </div>
          )}
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewSelect(view.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewSelect(view.id);
                }
              }}
              className={`
                relative group w-full flex items-center
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 rounded-lg
                ${selectedView === view.id
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }
                ${isCollapsed ? 'flex-col py-2' : 'px-3 py-2'}
                text-sm
                transform-gpu transition-transform duration-150
                ${hasLongWord(view.name) ? 'truncate' : ''}
              `}
              aria-label={view.name}
              aria-current={selectedView === view.id ? 'page' : undefined}
              role="tab"
              tabIndex={0}
            >
              <div className={`
                flex items-center justify-center
                transition-transform duration-200
                ${isCollapsed ? 'mb-1' : ''}
                group-hover:rotate-[-5deg]
              `}>
                {renderIcon(view.icon, 'w-5 h-5')}
              </div>
              {isCollapsed ? (
                <div className={`
                  text-center px-2 transition-opacity duration-200 group-hover:opacity-80
                  ${hasLongWord(view.name) ? 'text-xs' : 'text-sm'}
                `}>
                  {view.name}
                </div>
              ) : (
                <span className="flex-1 text-left ml-2 transition-opacity duration-200 group-hover:opacity-80">
                  {view.name}
                </span>
              )}
              <div className="absolute inset-0 hover:scale-[1.02] active:scale-[0.98] pointer-events-none" />
            </button>
          ))}
        </div>
      </nav>

      {/* Toggle Button */}
      <div className={`
        transition-spacing duration-300 ease-in-out
        ${isCollapsed ? 'px-2 py-2' : 'px-4 py-2'}
      `}>
        <button
          onClick={onToggleCollapse}
          className={`
            relative group w-full flex items-center justify-center
            transition-all duration-200
            text-gray-600 dark:text-gray-400
            hover:text-gray-900 dark:hover:text-white
            hover:bg-gray-50 dark:hover:bg-gray-800
            ${isCollapsed ? 'flex-col py-2' : 'px-3 py-2 rounded-lg'}
            text-sm
            transform-gpu transition-transform duration-150
          `}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`
              w-5 h-5 transform
              transition-all duration-300 ease-in-out
              group-hover:scale-110
              ${isCollapsed ? 'rotate-180 mb-1' : ''}
            `}
          />
          {!isCollapsed && (
            <span className="ml-2 transition-opacity duration-200 group-hover:opacity-80">
              Collapse
            </span>
          )}
          {isCollapsed && (
            <span className="px-2 mt-1 transition-opacity duration-200 group-hover:opacity-80">
              Expand
            </span>
          )}
          <div className="absolute inset-0 hover:scale-[1.02] active:scale-[0.98] pointer-events-none" />
        </button>
      </div>
    </aside>
  );
}