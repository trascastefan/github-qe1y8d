import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Settings, HelpCircle, Mail, Moon, Sun, LogOut } from 'lucide-react';
import { Toggle } from './Toggle';
import { useGmail } from '../hooks/useGmail';

interface HeaderProps {
  onSelectView: (viewId: string) => void;
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onSelectView, onMenuClick, onSettingsClick }: HeaderProps) {
  const { userProfile, signOut } = useGmail();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mailIconRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const animateIcon = () => {
      if (mailIconRef.current) {
        mailIconRef.current.classList.remove('animate');
        void mailIconRef.current.offsetWidth;
        mailIconRef.current.classList.add('animate');
      }
    };

    const initialTimeout = setTimeout(animateIcon, 500);
    const interval = setInterval(animateIcon, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    onSelectView('Inbox');
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center px-4 py-2 bg-surface dark:bg-surface-dark">
      <div className="flex items-center">
        <button 
          className="p-2 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-full transition-colors"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-primary dark:text-accent" />
        </button>

        <button 
          onClick={handleLogoClick}
          className="flex items-center -ml-1 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-lg px-2 py-1 transition-colors"
          aria-label="Go to inbox"
        >
          <div ref={mailIconRef} className="mail-icon">
            <Mail className="w-8 h-8 text-primary dark:text-accent" />
          </div>
          <span className="ml-2 text-lg font-semibold text-primary dark:text-text-dark-primary">Assistant</span>
        </button>
      </div>

      <div className="flex-1 px-4 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-secondary dark:text-text-dark-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search in mail"
            className="w-full pl-10 pr-4 py-2 bg-surface-secondary dark:bg-surface-dark-secondary rounded-full text-sm text-text-primary dark:text-text-dark-primary placeholder-secondary dark:placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-full transition-colors"
        >
          <Settings className="w-6 h-6 text-secondary dark:text-text-dark-secondary" />
        </button>

        <div className="relative" ref={settingsRef}>
          <button 
            className="p-2 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-full transition-colors"
            aria-label="Settings"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="w-6 h-6 text-secondary dark:text-text-dark-secondary" />
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 py-2 w-56 bg-surface dark:bg-surface-dark shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
              <Toggle
                checked={isDarkMode}
                onChange={handleThemeChange}
                label="Dark Mode"
                icon={isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              />
              <button 
                className="w-full flex items-center px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-secondary dark:text-text-dark-secondary" />
                Help
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            type="button"
            className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity p-1 rounded-full cursor-pointer"
            aria-expanded={showDropdown}
            aria-haspopup="true"
            aria-controls="user-menu"
          >
            {userProfile?.picture ? (
              <img
                src={userProfile.picture}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-200"
                draggable={false}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <span className="text-gray-600 text-sm">
                  {userProfile?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </button>

          {showDropdown && (
            <div
              id="user-menu"
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              {userProfile && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-800 truncate">{userProfile.name}</div>
                  <div className="text-sm text-gray-500 truncate">{userProfile.email}</div>
                </div>
              )}
              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}