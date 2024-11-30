interface ThemeColors {
  light: string;
  dark: string;
}

const defaultColors: ThemeColors = {
  light: '#ffffff',
  dark: '#121212'
};

/**
 * Updates the meta theme-color based on the current theme and color scheme
 * @param isDark - Whether dark mode is currently active
 * @param colors - Optional custom colors for light and dark modes
 */
export function updateMetaThemeColor(isDark: boolean, colors: Partial<ThemeColors> = {}) {
  const themeColors = { ...defaultColors, ...colors };
  const color = isDark ? themeColors.dark : themeColors.light;

  // Update or create meta tags
  updateOrCreateMetaTag(color); // Default
  updateOrCreateMetaTag(themeColors.light, '(prefers-color-scheme: light)');
  updateOrCreateMetaTag(themeColors.dark, '(prefers-color-scheme: dark)');
}

/**
 * Updates an existing meta theme-color tag or creates a new one
 * @param color - The color value to set
 * @param media - Optional media query for the meta tag
 */
function updateOrCreateMetaTag(color: string, media?: string) {
  // Try to find existing meta tag with matching media query
  const selector = media 
    ? `meta[name="theme-color"][media="${media}"]`
    : 'meta[name="theme-color"]:not([media])';
  
  let meta = document.querySelector(selector);

  if (meta) {
    // Update existing tag
    meta.setAttribute('content', color);
  } else {
    // Create new tag
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', color);
    if (media) {
      meta.setAttribute('media', media);
    }
    document.head.appendChild(meta);
  }
}

/**
 * Initializes theme color meta tags with default values
 */
export function initializeThemeColor() {
  updateMetaThemeColor(
    document.documentElement.classList.contains('dark')
  );
}

/**
 * Removes all theme-color meta tags
 */
export function cleanupThemeColor() {
  const metaTags = document.querySelectorAll('meta[name="theme-color"]');
  metaTags.forEach(tag => tag.remove());
}

// Export types
export type { ThemeColors };
