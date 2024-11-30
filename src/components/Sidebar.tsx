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

  // Split label into words for stacked display
  const getStackedLabel = (label: string) => {
    return label.split(' ').map((word, index) => (
      <span key={index} className="block text-center leading-tight">
        {word}
      </span>
    ));
  };

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-32' : 'w-64'
      } flex-none bg-white dark:bg-gray-900 flex flex-col h-full transition-all duration-200 ease-in-out`}
    >
      <nav className="flex-1 overflow-y-auto">
        {/* Inbox Menu Item */}
        <div className={!isCollapsed ? 'px-4' : ''}>
          <button
            onClick={() => onViewSelect('')}
            className={`w-full flex items-center transition-colors duration-200 ${
              selectedView === null
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
            } ${isCollapsed ? 'flex-col py-3' : 'px-3 py-2 rounded-lg'} text-sm`}
            aria-label="Inbox"
          >
            <Inbox className={`w-5 h-5 ${isCollapsed ? 'mb-1' : 'mr-2'}`} />
            {isCollapsed ? (
              <span className="text-center px-3">{getStackedLabel('Inbox')}</span>
            ) : (
              <span className="flex-1 text-left">Inbox</span>
            )}
          </button>
        </div>

        {/* Views Section */}
        <div className={isCollapsed ? '' : 'px-4 mt-6'}>
          <div className={`text-xs font-semibold text-gray-400 dark:text-gray-500 ${
            isCollapsed ? 'py-3 flex justify-center' : 'mb-2 px-3'
          }`}>
            <span className={isCollapsed ? 'px-3 text-center' : ''}>Views</span>
          </div>
          <div className="space-y-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewSelect(view.id)}
                className={`w-full flex items-center transition-colors duration-200 ${
                  selectedView === view.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isCollapsed ? 'flex-col py-3' : 'px-3 py-2 rounded-lg'} text-sm`}
                aria-label={view.name}
              >
                {getViewIcon(view.id, 'w-5 h-5')}
                {isCollapsed ? (
                  <div className="mt-1 text-center px-3">
                    {getStackedLabel(view.name)}
                  </div>
                ) : (
                  <span className="flex-1 text-left ml-2">{view.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Toggle Button */}
      <div className={isCollapsed ? '' : 'px-4 py-4'}>
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center justify-center transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 ${
            isCollapsed ? 'flex-col py-3' : 'px-3 py-2 rounded-lg'
          } text-sm`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`w-5 h-5 transform transition-transform duration-200 ${
              isCollapsed ? 'rotate-180 mb-1' : ''
            }`}
          />
          {!isCollapsed && <span className="ml-2">Collapse</span>}
          {isCollapsed && <span className="mt-1 px-3">Expand</span>}
        </button>
      </div>
    </aside>
  );
}