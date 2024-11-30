/**
 * Performance-optimized theme management system
 */

// Constants for theme management
const THEME_ATTRIBUTE = 'data-theme' as const;
const THEME_COLOR_ATTRIBUTE = 'data-theme-color' as const;
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)' as const;
const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const;

// Theme types
type Theme = 'light' | 'dark' | 'system';
type ThemeColor = 'default' | 'high-contrast';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  isHighContrast: boolean;
  reducedMotion: boolean;
}

// Performance optimization: Cache DOM queries
const docEl = document.documentElement;
const mediaQueryList = window.matchMedia(PREFERS_DARK_QUERY);
const motionQueryList = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY);

// Use RAF for batching DOM updates
let themeRAF: number | null = null;
let transitionRAF: number | null = null;

/**
 * Efficiently applies theme changes using CSS containment and batched updates
 */
export function applyTheme(state: ThemeState): void {
  if (themeRAF) {
    cancelAnimationFrame(themeRAF);
  }

  themeRAF = requestAnimationFrame(() => {
    // Temporarily disable transitions
    disableTransitions();

    // Apply containment to optimize paint performance
    docEl.style.contain = 'paint layout';

    // Batch DOM updates
    docEl.setAttribute(THEME_ATTRIBUTE, state.isDark ? 'dark' : 'light');
    docEl.setAttribute(THEME_COLOR_ATTRIBUTE, state.isHighContrast ? 'high-contrast' : 'default');
    
    // Update classes in a single operation
    const classList = [
      state.isDark ? 'dark' : 'light',
      state.isHighContrast ? 'high-contrast' : '',
      state.reducedMotion ? 'reduced-motion' : ''
    ].filter(Boolean);
    
    docEl.className = classList.join(' ');

    // Schedule transition re-enable
    requestAnimationFrame(() => {
      // Remove containment after paint
      docEl.style.contain = '';
      // Re-enable transitions
      enableTransitions();
    });
  });
}

/**
 * Efficiently checks system dark mode preference
 */
export function getSystemTheme(): boolean {
  return mediaQueryList.matches;
}

/**
 * Checks if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return motionQueryList.matches;
}

/**
 * Disables transitions temporarily
 */
function disableTransitions(): void {
  if (transitionRAF) {
    cancelAnimationFrame(transitionRAF);
  }
  docEl.classList.add('disable-transitions');
}

/**
 * Re-enables transitions
 */
function enableTransitions(): void {
  transitionRAF = requestAnimationFrame(() => {
    docEl.classList.remove('disable-transitions');
  });
}

/**
 * Optimized theme change observer
 */
export function observeThemeChanges(callback: (isDark: boolean) => void): () => void {
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQueryList.addEventListener('change', handler);
  return () => mediaQueryList.removeEventListener('change', handler);
}

/**
 * Performance-optimized initial theme setup
 */
export function initializeTheme(initialState: ThemeState): void {
  // Prevent FOUC (Flash of Unstyled Content)
  const style = document.createElement('style');
  style.textContent = `
    .disable-transitions * {
      transition: none !important;
    }
    [data-theme] {
      contain: paint layout;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Apply initial theme without transitions
  disableTransitions();
  applyTheme(initialState);

  // Enable transitions after first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      enableTransitions();
    });
  });
}

/**
 * Cleanup theme management resources
 */
export function cleanupTheme(): void {
  if (themeRAF) {
    cancelAnimationFrame(themeRAF);
  }
  if (transitionRAF) {
    cancelAnimationFrame(transitionRAF);
  }
}
