import { useState, useEffect } from 'react';
import { getStoredTheme, setStoredTheme, applyTheme } from '../utils/theme';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    isDark: document.documentElement.classList.contains('dark'),
  };
}
