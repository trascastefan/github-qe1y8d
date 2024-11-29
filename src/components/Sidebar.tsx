import React from 'react';
import { ChevronLeft, ChevronRight, Inbox, Mail, Star, FileEdit, Send, AlertOctagon, Trash2, FileText, Building2, Briefcase, GraduationCap, HomeIcon, CreditCard, Folder } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  views: View[];
  selectedView: string | null;
  onViewSelect: (view: string) => void;
  isCollapsed: boolean;
}

export function Sidebar({ views, selectedView, onViewSelect, isCollapsed }: SidebarProps) {
  const getViewIcon = (view: string) => {
    switch (view.toLowerCase()) {
      case 'docs':
        return <FileText className="w-4 h-4" />;
      case 'living':
        return <HomeIcon className="w-4 h-4" />;
      case 'banking':
        return <CreditCard className="w-4 h-4" />;
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      case 'business':
        return <Building2 className="w-4 h-4" />;
      case 'gov':
        return <Building2 className="w-4 h-4" />;
      case 'tax':
        return <FileText className="w-4 h-4" />;
      case 'health-ins':
        return <FileText className="w-4 h-4" />;
      case 'invest':
        return <CreditCard className="w-4 h-4" />;
      case 'housing':
        return <HomeIcon className="w-4 h-4" />;
      case 'job':
        return <Briefcase className="w-4 h-4" />;
      case 'prof':
        return <Briefcase className="w-4 h-4" />;
      case 'edu':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} flex-none bg-white dark:bg-gray-900 overflow-y-auto transition-all duration-200`}>
      <nav className="space-y-6 p-4">
        {/* Inbox Menu Item */}
        <div>
          <button
            onClick={() => onViewSelect('')} // Empty string or null to clear view selection
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg text-sm ${
              selectedView === null
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            {!isCollapsed && <span>Inbox</span>}
          </button>
        </div>

        {/* Views Section */}
        <div>
          <div className={`mb-2 ${isCollapsed ? 'text-center' : ''}`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {!isCollapsed && 'Views'}
            </span>
          </div>
          <div className="space-y-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewSelect(view.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 rounded-lg text-sm ${
                  selectedView === view.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {getViewIcon(view.id)}
                {!isCollapsed && <span>{view.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}