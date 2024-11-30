import { Config } from 'tailwindcss';

// Color palette with semantic naming
export const colorTokens = {
  // Surface colors
  surface: {
    DEFAULT: '#ffffff',
    dark: '#121212',
    elevated: {
      DEFAULT: '#f8f9fa',
      dark: '#1e1e1e'
    },
    sunken: {
      DEFAULT: '#f1f3f5',
      dark: '#0a0a0a'
    }
  },

  // Content colors
  content: {
    DEFAULT: '#1a1a1a',
    dark: '#e0e0e0',
    muted: {
      DEFAULT: '#666666',
      dark: '#a0a0a0'
    },
    subtle: {
      DEFAULT: '#999999',
      dark: '#808080'
    }
  },

  // Primary brand colors
  primary: {
    DEFAULT: '#0066cc',
    dark: '#4d9fff',
    muted: {
      DEFAULT: '#e6f0ff',
      dark: '#1a3d66'
    },
    subtle: {
      DEFAULT: '#f5f9ff',
      dark: '#0d1f33'
    }
  },

  // Accent colors
  accent: {
    DEFAULT: '#9333ea',
    dark: '#a855f7',
    muted: {
      DEFAULT: '#f3e8ff',
      dark: '#4a1d75'
    },
    subtle: {
      DEFAULT: '#faf5ff',
      dark: '#25103b'
    }
  },

  // Semantic status colors
  success: {
    DEFAULT: '#16a34a',
    dark: '#22c55e',
    muted: {
      DEFAULT: '#dcfce7',
      dark: '#14532d'
    }
  },
  warning: {
    DEFAULT: '#ca8a04',
    dark: '#eab308',
    muted: {
      DEFAULT: '#fef9c3',
      dark: '#633c01'
    }
  },
  error: {
    DEFAULT: '#dc2626',
    dark: '#ef4444',
    muted: {
      DEFAULT: '#fee2e2',
      dark: '#7f1d1d'
    }
  },

  // Border colors
  border: {
    DEFAULT: '#e5e5e5',
    dark: '#2e2e2e',
    muted: {
      DEFAULT: '#f0f0f0',
      dark: '#262626'
    }
  },

  // Shadow colors with opacity
  shadow: {
    DEFAULT: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.3)',
    colored: {
      DEFAULT: 'rgba(0, 102, 204, 0.15)',
      dark: 'rgba(77, 159, 255, 0.15)'
    }
  },

  // Overlay colors with opacity
  overlay: {
    DEFAULT: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
    light: {
      DEFAULT: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(255, 255, 255, 0.1)'
    }
  }
} as const;

// Color utilities
export const getColorValue = (colorPath: string): string => {
  return colorPath.split('.').reduce((obj: any, key) => obj?.[key], colorTokens) || colorPath;
};

// Tailwind color configuration
export const colors = {
  ...colorTokens,
  // Additional color utilities
  'surface-hover': {
    DEFAULT: getColorValue('surface.elevated.DEFAULT'),
    dark: getColorValue('surface.elevated.dark')
  },
  'surface-active': {
    DEFAULT: getColorValue('surface.sunken.DEFAULT'),
    dark: getColorValue('surface.sunken.dark')
  },
  'content-inverse': {
    DEFAULT: getColorValue('content.dark'),
    dark: getColorValue('content.DEFAULT')
  }
};
