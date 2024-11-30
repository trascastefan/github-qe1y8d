import React from 'react';
import { useThemePreferences } from '../hooks/useThemePreferences';
import type { Theme } from '../utils/preferences';

export function ThemePreferences() {
  const {
    preferences,
    isDarkMode,
    updatePreferences,
    toggleTheme,
    toggleHighContrast,
    toggleReducedMotion,
    toggleSchedule,
    updateSchedule,
  } = useThemePreferences();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ theme: event.target.value as Theme });
  };

  const handleScheduleHourChange = (type: 'start' | 'end') => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const hour = parseInt(event.target.value, 10);
    if (type === 'start') {
      updateSchedule(hour, preferences.schedule.endHour);
    } else {
      updateSchedule(preferences.schedule.startHour, hour);
    }
  };

  return (
    <div className="p-4 space-y-6 bg-surface dark:bg-surface-dark rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-primary dark:text-primary-dark">
        Theme Preferences
      </h2>

      {/* Theme Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Theme
          <select
            value={preferences.theme}
            onChange={handleThemeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Toggle Theme ({isDarkMode ? 'Dark' : 'Light'})
        </button>
      </div>

      {/* Schedule Settings */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="schedule-enabled"
            checked={preferences.schedule.enabled}
            onChange={(e) => toggleSchedule(e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="schedule-enabled" className="ml-2 text-sm font-medium">
            Enable Scheduled Dark Mode
          </label>
        </div>

        {preferences.schedule.enabled && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="block text-sm font-medium">
              Start Time
              <select
                value={preferences.schedule.startHour}
                onChange={handleScheduleHourChange('start')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              End Time
              <select
                value={preferences.schedule.endHour}
                onChange={handleScheduleHourChange('end')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Accessibility Options */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Accessibility</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="high-contrast"
            checked={preferences.highContrast}
            onChange={() => toggleHighContrast()}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="high-contrast" className="ml-2 text-sm font-medium">
            High Contrast Mode
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="reduced-motion"
            checked={preferences.reducedMotion}
            onChange={() => toggleReducedMotion()}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="reduced-motion" className="ml-2 text-sm font-medium">
            Reduced Motion
          </label>
        </div>
      </div>

      {/* System Preference Sync */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="auto-switch"
          checked={preferences.autoSwitchOnSystem}
          onChange={(e) => updatePreferences({ autoSwitchOnSystem: e.target.checked })}
          className="rounded text-primary focus:ring-primary"
        />
        <label htmlFor="auto-switch" className="ml-2 text-sm font-medium">
          Automatically switch theme with system
        </label>
      </div>
    </div>
  );
}
