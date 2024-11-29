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
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg z-50 p-4">
        <div className="space-y-2">
          <button
            onClick={(e) => handleClick(e, 'home')}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </button>
          <button
            onClick={(e) => handleClick(e, 'views')}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Layout className="w-5 h-5 mr-3" />
            Views
          </button>
          <button
            onClick={(e) => handleClick(e, 'tags')}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Tags className="w-5 h-5 mr-3" />
            Tags
          </button>
        </div>
      </div>
    </>
  );
}