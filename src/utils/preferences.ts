type Theme = 'light' | 'dark' | 'system';

interface ThemeSchedule {
  enabled: boolean;
  startHour: number;  // 0-23
  endHour: number;    // 0-23
}

interface ThemePreferences {
  theme: Theme;
  schedule: ThemeSchedule;
  autoSwitchOnSystem: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  lastModified: number;
}

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: 'system',
  schedule: {
    enabled: false,
    startHour: 20, // 8 PM
    endHour: 6,    // 6 AM
  },
  autoSwitchOnSystem: true,
  highContrast: false,
  reducedMotion: false,
  lastModified: Date.now(),
};

const PREFERENCES_KEY = 'theme-preferences';
const SYNC_CHANNEL = 'theme-preferences-sync';

// Broadcast channel for cross-tab synchronization
const broadcastChannel = typeof BroadcastChannel !== 'undefined' 
  ? new BroadcastChannel(SYNC_CHANNEL)
  : null;

export function getStoredPreferences(): ThemePreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const preferences = JSON.parse(stored) as ThemePreferences;
    return {
      ...DEFAULT_PREFERENCES,
      ...preferences,
      schedule: { ...DEFAULT_PREFERENCES.schedule, ...preferences.schedule },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setStoredPreferences(preferences: Partial<ThemePreferences>) {
  const current = getStoredPreferences();
  const updated = {
    ...current,
    ...preferences,
    lastModified: Date.now(),
  };

  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  broadcastChannel?.postMessage(updated);

  return updated;
}

export function shouldUseDarkMode(): boolean {
  const preferences = getStoredPreferences();

  // If theme is explicitly set
  if (preferences.theme !== 'system') {
    return preferences.theme === 'dark';
  }

  // Check schedule if enabled
  if (preferences.schedule.enabled) {
    const currentHour = new Date().getHours();
    const { startHour, endHour } = preferences.schedule;

    if (startHour < endHour) {
      // Simple range (e.g., 8 AM to 5 PM)
      return currentHour >= startHour && currentHour < endHour;
    } else {
      // Overnight range (e.g., 8 PM to 6 AM)
      return currentHour >= startHour || currentHour < endHour;
    }
  }

  // Fall back to system preference
  if (preferences.autoSwitchOnSystem) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

// Listen for changes from other tabs
if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    const preferences = event.data as ThemePreferences;
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent('themePreferencesChanged', { detail: preferences }));
  };
}

// Export types
export type { Theme, ThemeSchedule, ThemePreferences };
