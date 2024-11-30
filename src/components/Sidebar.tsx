import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Inbox, Mail, Star, FileEdit, Send, AlertOctagon, Trash2, FileText, Building2, Briefcase, GraduationCap, HomeIcon, CreditCard, Folder } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  views: View[];
  selectedView: string | null;
  onViewSelect: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

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

  const getViewIcon = (view: string, size: string) => {
    switch (view.toLowerCase()) {
      case 'docs':
        return <FileText className={size} />;
      case 'living':
        return <HomeIcon className={size} />;
      case 'banking':
        return <CreditCard className={size} />;
      case 'work':
        return <Briefcase className={size} />;
      case 'education':
        return <GraduationCap className={size} />;
      case 'business':
        return <Building2 className={size} />;
      case 'gov':
        return <Building2 className={size} />;
      case 'tax':
        return <FileText className={size} />;
      case 'health-ins':
        return <FileText className={size} />;
      case 'invest':
        return <CreditCard className={size} />;
      case 'housing':
        return <HomeIcon className={size} />;
      case 'job':
        return <Briefcase className={size} />;
      case 'prof':
        return <Briefcase className={size} />;
      case 'edu':
        return <GraduationCap className={size} />;
      default:
        return <Folder className={size} />;
    }
  };

  const getStackedLabel = (label: string) => {
    return label.split(' ').map((word, index) => (
      <span key={index} className="block text-center leading-tight">
        {word}
      </span>
    ));
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
              <Inbox className="w-5 h-5" />
            </div>
            {isCollapsed ? (
              <span className="text-center px-2 transition-opacity duration-200 group-hover:opacity-80">
                {getStackedLabel('Inbox')}
              </span>
            ) : (
              <span className="flex-1 text-left transition-opacity duration-200 group-hover:opacity-80">
                Inbox
              </span>
            )}
            <div className="absolute inset-0 hover:scale-[1.02] active:scale-[0.98] pointer-events-none" />
          </button>
        </div>

        {/* Views Section */}
        <div className={`
          transition-spacing duration-300 ease-in-out mt-4
          ${isCollapsed ? 'px-2' : 'px-4'}
        `}
          role="tablist"
          aria-label="Email views"
        >
          <div className={`
            text-xs font-semibold text-gray-400 dark:text-gray-500
            transition-all duration-300
            ${isCollapsed ? 'py-2 flex justify-center' : 'mb-2 px-3'}
          `}>
            <span className={`
              transition-all duration-300
              ${isCollapsed ? 'text-center' : ''}
            `}>
              Views
            </span>
          </div>
          <div className="space-y-1">
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
                `}
                aria-label={`${view.name} view`}
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
                  {getViewIcon(view.id, 'w-5 h-5')}
                </div>
                {isCollapsed ? (
                  <div className="text-center px-2 transition-opacity duration-200 group-hover:opacity-80">
                    {getStackedLabel(view.name)}
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