import { useState, useEffect, useCallback } from 'react';
import { 
  ThemePreferences,
  getStoredPreferences,
  setStoredPreferences,
  shouldUseDarkMode
} from '../utils/preferences';
import { updateMetaThemeColor, initializeThemeColor } from '../utils/themeColor';
import { themeTransitions } from '../utils/transitions';

export function useThemePreferences() {
  const [preferences, setPreferences] = useState<ThemePreferences>(getStoredPreferences);
  const [isDarkMode, setIsDarkMode] = useState(() => shouldUseDarkMode());

  // Initialize transitions
  useEffect(() => {
    themeTransitions.initialize();
    return () => {
      themeTransitions.disableTransitions();
    };
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<ThemePreferences>) => {
    // Temporarily disable transitions for instant updates
    themeTransitions.disableTransitions();
    
    const updated = setStoredPreferences(updates);
    setPreferences(updated);
    const newIsDark = shouldUseDarkMode();
    setIsDarkMode(newIsDark);
    updateMetaThemeColor(newIsDark);

    // Re-enable transitions after update
    requestAnimationFrame(() => {
      themeTransitions.enableTransitions();
    });
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (preferences.autoSwitchOnSystem && preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => setIsDarkMode(shouldUseDarkMode());
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [preferences.autoSwitchOnSystem, preferences.theme]);

  // Listen for scheduled changes
  useEffect(() => {
    if (preferences.schedule.enabled) {
      const checkSchedule = () => setIsDarkMode(shouldUseDarkMode());
      const interval = setInterval(checkSchedule, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [preferences.schedule]);

  // Listen for preference changes from other tabs
  useEffect(() => {
    const handler = (event: CustomEvent<ThemePreferences>) => {
      setPreferences(event.detail);
      setIsDarkMode(shouldUseDarkMode());
    };

    window.addEventListener('themePreferencesChanged', handler as EventListener);
    return () => window.removeEventListener('themePreferencesChanged', handler as EventListener);
  }, []);

  // Initialize theme color on mount
  useEffect(() => {
    initializeThemeColor();
  }, []);

  // Update theme color when dark mode changes
  useEffect(() => {
    updateMetaThemeColor(isDarkMode);
  }, [isDarkMode]);

  // Update reduced motion preference
  useEffect(() => {
    themeTransitions.updateReducedMotion(preferences.reducedMotion);
  }, [preferences.reducedMotion]);

  // Apply theme to document
  useEffect(() => {
    // Disable transitions before theme change
    themeTransitions.disableTransitions();

    requestAnimationFrame(() => {
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
      document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);

      // Re-enable transitions after theme change
      requestAnimationFrame(() => {
        themeTransitions.enableTransitions();
      });
    });
  }, [isDarkMode, preferences.highContrast, preferences.reducedMotion]);

  return {
    preferences,
    isDarkMode,
    updatePreferences,
    toggleTheme: () => updatePreferences({ 
      theme: isDarkMode ? 'light' : 'dark' 
    }),
    toggleHighContrast: () => updatePreferences({ 
      highContrast: !preferences.highContrast 
    }),
    toggleReducedMotion: () => updatePreferences({ 
      reducedMotion: !preferences.reducedMotion 
    }),
    toggleSchedule: (enabled: boolean) => updatePreferences({
      schedule: { ...preferences.schedule, enabled }
    }),
    updateSchedule: (startHour: number, endHour: number) => updatePreferences({
      schedule: { ...preferences.schedule, startHour, endHour }
    }),
  };
}
