import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-secondary dark:bg-surface-dark-secondary theme-transition-component">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md theme-transition-component ${
          theme === 'light'
            ? 'bg-white dark:bg-surface-dark-tertiary text-primary dark:text-primary-dark'
            : 'text-text-secondary dark:text-text-dark-secondary hover:bg-hover dark:hover:bg-hover-dark'
        }`}
        aria-label="Light mode"
      >
        <Sun size={20} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md theme-transition-component ${
          theme === 'system'
            ? 'bg-white dark:bg-surface-dark-tertiary text-primary dark:text-primary-dark'
            : 'text-text-secondary dark:text-text-dark-secondary hover:bg-hover dark:hover:bg-hover-dark'
        }`}
        aria-label="System theme"
      >
        <Monitor size={20} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md theme-transition-component ${
          theme === 'dark'
            ? 'bg-white dark:bg-surface-dark-tertiary text-primary dark:text-primary-dark'
            : 'text-text-secondary dark:text-text-dark-secondary hover:bg-hover dark:hover:bg-hover-dark'
        }`}
        aria-label="Dark mode"
      >
        <Moon size={20} />
      </button>
    </div>
  );
}
