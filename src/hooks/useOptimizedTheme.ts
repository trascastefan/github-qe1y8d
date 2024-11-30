import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  applyTheme,
  getSystemTheme,
  prefersReducedMotion,
  observeThemeChanges,
  initializeTheme,
  cleanupTheme
} from '../utils/themePerformance';

interface ThemePreferences {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  reducedMotion: boolean;
}

const STORAGE_KEY = 'theme-preferences';

/**
 * Performance-optimized theme hook
 */
export function useOptimizedTheme() {
  // Memoize initial preferences to prevent unnecessary recalculations
  const initialPreferences = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        theme: 'system',
        highContrast: false,
        reducedMotion: prefersReducedMotion()
      };
    } catch {
      return {
        theme: 'system',
        highContrast: false,
        reducedMotion: prefersReducedMotion()
      };
    }
  }, []);

  // State management
  const [preferences, setPreferences] = useState<ThemePreferences>(initialPreferences);
  const [systemIsDark, setSystemIsDark] = useState(() => getSystemTheme());

  // Memoize current theme state
  const themeState = useMemo(() => ({
    theme: preferences.theme,
    isDark: preferences.theme === 'system' ? systemIsDark : preferences.theme === 'dark',
    isHighContrast: preferences.highContrast,
    reducedMotion: preferences.reducedMotion
  }), [preferences, systemIsDark]);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme(themeState);
    return cleanupTheme;
  }, []);

  // Observe system theme changes
  useEffect(() => {
    if (preferences.theme === 'system') {
      return observeThemeChanges(setSystemIsDark);
    }
  }, [preferences.theme]);

  // Apply theme changes
  useEffect(() => {
    applyTheme(themeState);
  }, [themeState]);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Handle storage errors silently
    }
  }, [preferences]);

  // Memoized update functions
  const setTheme = useCallback((theme: ThemePreferences['theme']) => {
    setPreferences(prev => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'system'
        ? (systemIsDark ? 'light' : 'dark')
        : prev.theme === 'dark'
          ? 'light'
          : 'dark'
    }));
  }, [systemIsDark]);

  const toggleHighContrast = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }));
  }, []);

  return {
    isDark: themeState.isDark,
    isHighContrast: themeState.isHighContrast,
    reducedMotion: themeState.reducedMotion,
    theme: preferences.theme,
    setTheme,
    toggleTheme,
    toggleHighContrast,
    toggleReducedMotion
  };
}
