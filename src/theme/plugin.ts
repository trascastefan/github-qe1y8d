import plugin from 'tailwindcss/plugin';
import { colors } from './colors';

export const themePlugin = plugin(
  ({ addBase, addComponents, addUtilities, theme }) => {
    // Base styles
    addBase({
      ':root': {
        // Color scheme for OS-level dark mode
        colorScheme: 'light dark',
        // Base colors
        '--color-surface': theme('colors.surface.DEFAULT'),
        '--color-content': theme('colors.content.DEFAULT'),
        '--color-border': theme('colors.border.DEFAULT'),
        '--color-primary': theme('colors.primary.DEFAULT'),
        '--color-accent': theme('colors.accent.DEFAULT'),
      },
      '.dark': {
        '--color-surface': theme('colors.surface.dark'),
        '--color-content': theme('colors.content.dark'),
        '--color-border': theme('colors.border.dark'),
        '--color-primary': theme('colors.primary.dark'),
        '--color-accent': theme('colors.accent.dark'),
      },
      // High contrast mode
      '.high-contrast': {
        '--color-content': '#000000',
        '--color-surface': '#ffffff',
        '--color-primary': '#0000ee',
        '--color-accent': '#551a8b',
      },
      '.dark.high-contrast': {
        '--color-content': '#ffffff',
        '--color-surface': '#000000',
        '--color-primary': '#66b3ff',
        '--color-accent': '#d5b8ff',
      }
    });

    // Component styles
    addComponents({
      // Text components
      '.text-default': {
        color: 'var(--color-content)',
      },
      '.text-muted': {
        color: theme('colors.content.muted.DEFAULT'),
        '.dark &': {
          color: theme('colors.content.muted.dark'),
        },
      },
      '.text-subtle': {
        color: theme('colors.content.subtle.DEFAULT'),
        '.dark &': {
          color: theme('colors.content.subtle.dark'),
        },
      },

      // Surface components
      '.bg-surface': {
        backgroundColor: 'var(--color-surface)',
      },
      '.bg-surface-elevated': {
        backgroundColor: theme('colors.surface.elevated.DEFAULT'),
        '.dark &': {
          backgroundColor: theme('colors.surface.elevated.dark'),
        },
      },
      '.bg-surface-sunken': {
        backgroundColor: theme('colors.surface.sunken.DEFAULT'),
        '.dark &': {
          backgroundColor: theme('colors.surface.sunken.dark'),
        },
      },

      // Interactive components
      '.interactive': {
        '&:hover': {
          backgroundColor: theme('colors.surface.elevated.DEFAULT'),
        },
        '&:active': {
          backgroundColor: theme('colors.surface.sunken.DEFAULT'),
        },
        '.dark &:hover': {
          backgroundColor: theme('colors.surface.elevated.dark'),
        },
        '.dark &:active': {
          backgroundColor: theme('colors.surface.sunken.dark'),
        },
      }
    });

    // Utility classes
    addUtilities({
      // Border utilities
      '.border-default': {
        borderColor: 'var(--color-border)',
      },
      '.border-muted': {
        borderColor: theme('colors.border.muted.DEFAULT'),
        '.dark &': {
          borderColor: theme('colors.border.muted.dark'),
        },
      },

      // Shadow utilities
      '.shadow-default': {
        boxShadow: `0 1px 3px ${theme('colors.shadow.DEFAULT')}`,
        '.dark &': {
          boxShadow: `0 1px 3px ${theme('colors.shadow.dark')}`,
        },
      },
      '.shadow-colored': {
        boxShadow: `0 1px 3px ${theme('colors.shadow.colored.DEFAULT')}`,
        '.dark &': {
          boxShadow: `0 1px 3px ${theme('colors.shadow.colored.dark')}`,
        },
      },

      // Overlay utilities
      '.overlay': {
        backgroundColor: theme('colors.overlay.DEFAULT'),
        '.dark &': {
          backgroundColor: theme('colors.overlay.dark'),
        },
      },
      '.overlay-light': {
        backgroundColor: theme('colors.overlay.light.DEFAULT'),
        '.dark &': {
          backgroundColor: theme('colors.overlay.light.dark'),
        },
      }
    });
  },
  {
    theme: {
      extend: {
        colors
      }
    }
  }
);
