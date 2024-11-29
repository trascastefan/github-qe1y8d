import React from 'react';
import { Home, Layout, Tags } from 'lucide-react';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function NavigationMenu({ isOpen, onClose, onNavigate }: NavigationMenuProps) {
  if (!isOpen) return null;

  const handleClick = (e: React.MouseEvent, page: string) => {
    e.stopPropagation();
    onNavigate(page);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-200"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-surface-dark shadow-lg dark:shadow-2xl z-50 transition-all duration-200">
        <div className="p-4 space-y-1">
          <button
            onClick={(e) => handleClick(e, 'home')}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            Home
          </button>
          <button
            onClick={(e) => handleClick(e, 'views')}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors duration-200"
          >
            <Layout className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            Views
          </button>
          <button
            onClick={(e) => handleClick(e, 'tags')}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors duration-200"
          >
            <Tags className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            Tags
          </button>
        </div>
      </div>
    </>
  );
}