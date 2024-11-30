# Email Management Application Design System

## Core Design Principles

### 1. Consistency
- Use consistent spacing, typography, and color schemes
- Maintain uniform component behavior across the application
- Follow established patterns for similar interactions
- Ensure visual hierarchy remains consistent

### 2. Accessibility
- Maintain WCAG 2.1 AA compliance
- Use semantic HTML elements
- Ensure sufficient color contrast (minimum 4.5:1 for normal text)
- Provide clear focus indicators
- Support keyboard navigation
- Include proper ARIA labels

### 3. Responsiveness
- Mobile-first approach
- Fluid layouts that adapt to different screen sizes
- Consistent behavior across devices
- Touch-friendly target sizes (minimum 44px)

### 4. Performance
- Optimize component rendering
- Minimize unnecessary re-renders
- Efficient state management
- Lazy loading for improved initial load time

## Color System

### Light Mode
```css
--surface-default: #ffffff
--surface-secondary: #f8fafc
--text-primary: #1e293b
--text-secondary: #475569
--border: #e2e8f0
```

### Dark Mode
```css
--surface-dark-default: #111827
--surface-dark-secondary: #1f2937
--text-dark-primary: #f1f5f9
--text-dark-secondary: #94a3b8
--border-dark: #374151
```

### Brand Colors
```css
--primary: #2563eb
--primary-dark: #3b82f6
--accent: #0ea5e9
--accent-dark: #38bdf8
```

### Semantic Colors
```css
--success: #059669
--success-dark: #10b981
--danger: #dc2626
--danger-dark: #ef4444
```

## Theme System

### Color System

Our color system is built with semantic tokens that adapt to both light and dark modes while maintaining accessibility and visual hierarchy.

```typescript
// Example color tokens
colors: {
  primary: {
    DEFAULT: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
    active: 'var(--color-primary-active)',
  },
  surface: {
    DEFAULT: 'var(--color-surface)',
    elevated: 'var(--color-surface-elevated)',
    inverse: 'var(--color-surface-inverse)',
  },
  text: {
    DEFAULT: 'var(--color-text)',
    secondary: 'var(--color-text-secondary)',
    inverse: 'var(--color-text-inverse)',
  }
}
```

### Dark Mode Guidelines

1. **Color Usage**
   - Use semantic color tokens for consistent theming
   - Maintain proper contrast ratios (WCAG AA/AAA)
   - Implement content-aware contrast
   - Support high contrast mode

2. **Performance Optimizations**
   - Use CSS containment for paint optimization
   - Implement hardware acceleration for transitions
   - Batch theme-related DOM updates
   - Cache computed styles and DOM queries

3. **Transitions**
   - Smooth theme transitions (150-200ms)
   - Hardware-accelerated properties
   - Respect reduced motion preferences
   - Disable during theme changes

4. **Best Practices**
   - Test color combinations in both themes
   - Validate contrast ratios
   - Support system preferences
   - Maintain consistent visual hierarchy

### Implementation

```css
/* Example CSS implementation */
:root {
  /* Light theme variables */
  --color-primary: #0066cc;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
}

:root[data-theme="dark"] {
  /* Dark theme variables */
  --color-primary: #66b3ff;
  --color-surface: #1a1a1a;
  --color-text: #ffffff;
}

/* Performance optimizations */
.theme-transition {
  transition: background-color 200ms, color 200ms;
  will-change: background-color, color;
  contain: paint;
}

@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition: none;
  }
}
```

## Typography

### Font Family
- Primary: Inter
- Fallback: system-ui, -apple-system, sans-serif

### Font Sizes
```css
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

## Spacing System

### Base Units
```css
--spacing-1: 0.25rem
--spacing-2: 0.5rem
--spacing-3: 0.75rem
--spacing-4: 1rem
--spacing-6: 1.5rem
--spacing-8: 2rem
```

## Component Guidelines

### Buttons
- Clear hover and active states
- Consistent padding (0.5rem 1rem)
- Rounded corners (0.375rem)
- Loading states when applicable
- Disabled states with reduced opacity

### Inputs
- Clear focus states with rings
- Consistent padding (0.5rem)
- Error states with red borders
- Helper text for additional context
- Placeholder text styling

### Cards
- Consistent padding (1rem)
- Subtle shadows
- Hover states when interactive
- Proper spacing between elements

### Tags
- Compact design
- Clear remove buttons
- Hover states
- Color coding for different types
- Maximum width with ellipsis

### Modals
- Centered positioning
- Backdrop blur
- Smooth animations
- Clear close buttons
- Focus trap

## Animation Guidelines

### Transitions
- Duration: 200ms
- Timing: ease-in-out
- Properties: opacity, transform, background-color

### Hover States
- Subtle background color changes
- Scale transforms where appropriate
- Color transitions

### Loading States
- Smooth animations
- Clear indication of progress
- Non-blocking where possible

## Best Practices

### Component Architecture
- Single responsibility principle
- Proper prop typing
- Default prop values
- Error boundary implementation
- Performance optimization

### State Management
- Minimize prop drilling
- Use context where appropriate
- Local state for UI-only concerns
- Proper error handling

### Code Organization
- Consistent file structure
- Clear naming conventions
- Proper code documentation
- Type definitions
- Utility functions

### Testing
- Component unit tests
- Integration tests
- Accessibility tests
- Visual regression tests
- Performance monitoring

## Mobile Considerations

### Touch Targets
- Minimum size: 44x44px
- Proper spacing between elements
- Clear feedback on touch
- Avoid hover-dependent interactions

### Layout
- Stack views on smaller screens
- Proper text wrapping
- Responsive images
- Collapsible sections

### Navigation
- Bottom navigation when appropriate
- Clear back buttons
- Gesture support
- Proper keyboard handling

## Performance Guidelines

### Optimization
- Code splitting
- Tree shaking
- Image optimization
- Lazy loading
- Memoization

### Monitoring
- Performance metrics
- Error tracking
- Usage analytics
- Load time monitoring

## Accessibility Checklist

### Semantic HTML
- Proper heading hierarchy
- ARIA labels
- Role attributes
- Form labels

### Keyboard Navigation
- Focus management
- Tab order
- Keyboard shortcuts
- Focus trapping in modals

### Screen Readers
- Alternative text
- Descriptive labels
- Status updates
- Error announcements

## Documentation Guidelines

### Component Documentation
- Props interface
- Usage examples
- Edge cases
- Accessibility notes
- Performance considerations

### Style Documentation
- Color usage
- Typography examples
- Spacing guidelines
- Animation specifications

### Code Examples
- Basic usage
- Complex scenarios
- Error handling
- Customization options