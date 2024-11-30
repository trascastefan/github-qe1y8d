type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme-preference';

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
}

export function setStoredTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme: Theme) {
  // Request an animation frame to batch the theme change
  requestAnimationFrame(() => {
    // Remove transition class temporarily
    document.documentElement.classList.remove('theme-transition');
    
    // Force a reflow to ensure transitions are disabled
    document.documentElement.offsetHeight;
    
    // Apply the theme
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    
    // Use Intersection Observer to prioritize visible elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('theme-ready');
        }
      });
    }, { threshold: 0 });
    
    // Observe all major components
    document.querySelectorAll('.theme-transition-component').forEach(el => {
      observer.observe(el);
    });
    
    // After a brief delay to allow for DOM updates
    requestAnimationFrame(() => {
      // Re-enable transitions
      document.documentElement.classList.add('theme-transition');
      
      // Mark all remaining components as ready after visible ones
      setTimeout(() => {
        document.querySelectorAll('.theme-transition-component:not(.theme-ready)').forEach(el => {
          el.classList.add('theme-ready');
        });
        // Cleanup
        observer.disconnect();
      }, 100);
    });
  });
}

// Initialize theme system
export function initializeTheme() {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });

  // Listen for storage changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) {
      applyTheme(e.newValue as Theme);
    }
  });

  // Add keyboard shortcut (Ctrl/Cmd + D)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      const currentTheme = getStoredTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setStoredTheme(newTheme);
      applyTheme(newTheme);
    }
  });

  // Add time-based auto switching (optional)
  const hour = new Date().getHours();
  if (storedTheme === 'system' && !mediaQuery.matches) {
    // Switch to dark mode between 8 PM and 6 AM
    if (hour >= 20 || hour < 6) {
      applyTheme('dark');
    }
  }
}
