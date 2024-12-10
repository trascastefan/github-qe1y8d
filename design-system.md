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
- Include proper ARIA labels and roles
- Implement focus management
- Support screen reader announcements
- Handle keyboard interactions (Enter, Space, Escape)
- Manage focus trapping in modals
- Support reduced motion preferences

### 3. Responsiveness
- Mobile-first approach
- Fluid layouts that adapt to different screen sizes
- Consistent behavior across devices
- Touch-friendly target sizes (minimum 44px)
- Touch gestures support for key interactions
- Adaptive layouts:
  - Components respond to available space
  - Smooth transitions for layout changes
  - Proper spacing in all viewport sizes
  - Content reflow on sidebar collapse/expand

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

## Mobile Interaction Guidelines
1. **Touch Targets**
   - Minimum touch target size: 44x44px
   - Adequate spacing between interactive elements
   - Visual feedback on touch interactions
   - Clear hit states for all interactive elements

2. **Gesture Support**
   - Swipe right: expand sidebar
   - Swipe left: collapse sidebar
   - Smooth transitions for gesture-based actions
   - Visual indicators for gesture availability
   - Haptic feedback for successful gestures

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
- **Visual Style**
  ```css
  --tag-bg: #f1f5f9
  --tag-text: #475569
  --tag-border: #e2e8f0
  --tag-hover-bg: #e2e8f0
  --tag-selected-bg: #bfdbfe
  --tag-selected-text: #1e40af
  ```

- **Dimensions**
  - Height: 24px
  - Padding: 4px 8px
  - Border radius: 4px
  - Gap between tags: 8px

- **Typography**
  - Font size: 12px
  - Font weight: 500
  - Line height: 16px

- **States**
  - Default: Light background, subtle text
  - Hover: Slightly darker background
  - Selected: Accent color background
  - Disabled: Reduced opacity
  - Focus: Blue outline (2px)

- **Instructions List**
  - Maximum 5 instructions per tag
  - Individual instruction fields with remove button
  - Add instruction button below list
  - Clear error states for validation
  - Consistent spacing between items (8px)
  - Full-width input fields
  - Placeholder text for new instructions
  - Remove button aligned to the right

### Modals
- **Layout**
  ```css
  --modal-bg: #ffffff
  --modal-border: #e2e8f0
  --modal-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
  --modal-backdrop: rgba(0, 0, 0, 0.5)
  ```

- **Dimensions**
  - Max width: 480px
  - Min height: 200px
  - Border radius: 8px
  - Padding: 24px

- **Animation**
  - Entry: Scale up (300ms ease-out)
  - Exit: Scale down (200ms ease-in)
  - Backdrop: Fade (200ms)

- **Typography**
  - Title: 18px, 600 weight
  - Content: 14px, 400 weight
  - Actions: 14px, 500 weight
  - Instructions: 14px, 400 weight, line-height 1.5

- **Spacing**
  - Header bottom margin: 16px
  - Content bottom margin: 24px
  - Action buttons gap: 12px
  - Between instructions: 8px
  - Instructions container padding: 16px

- **Focus Management**
  - Auto-focus first interactive element
  - Trap focus within modal
  - Restore focus on close
  - Visible focus indicators
  - Tab order follows visual layout

- **Button States**
  - Primary action maintains consistent style
  - Cancel and Delete aligned left
  - Save button right-aligned
  - Consistent hover states

### Sidebar
1. **Layout & Structure**
   - Fixed width in both states (256px expanded, 128px collapsed)
   - Full-height design with scrollable content area
   - Consistent padding and spacing:
     - 16px horizontal padding for containers
     - 12px padding for buttons
     - 8px spacing between icon and text

2. **States & Interactions**
   - Hover effects:
     - Expanded: Rounded corners (8px) with contained highlight
     - Collapsed: Full-width highlight with square edges
   - Active state: Filled background for selected items
   - Smooth transitions between states (200ms duration)

3. **Typography & Icons**
   - Icons: 20x20px (w-5 h-5) for consistency
   - Labels: 
     - Expanded: Left-aligned, single line
     - Collapsed: Centered, max 3 lines with ellipsis
   - Section labels: 12px semibold, muted color

4. **Responsive Behavior**
   - Desktop: Fixed position with smooth state transitions
   - Mobile: Slide-out menu with overlay background
   - Touch targets minimum 44px height
   - State persistence across sessions

5. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - Sufficient color contrast for text and icons
   - Reduced motion support

## View Configuration Design Guidelines

### Icon System
- **Icon Library**: Lucide React
- **Selection Criteria**:
  - Semantic representation of view purpose
  - Clear, minimalistic design
  - Consistent stroke width
  - Scalable to multiple sizes (16px, 24px, 32px)

### View Icon Management
```typescript
interface ViewIcon {
  name: string;        // Lucide icon name
  category: 'system' | 'user' | 'business';
  color?: string;      // Optional color override
  size?: number;       // Optional size override
}
```

### Icon Design Principles
1. **Consistency**
   - Uniform stroke width
   - Pixel-perfect alignment
   - Consistent padding
   - Matching visual weight

2. **Semantic Representation**
   - Choose icons that clearly represent view purpose
   - Avoid ambiguous or overly complex icons
   - Support internationalization through universal design

3. **Accessibility**
   - High contrast ratio
   - Clear visibility in light and dark modes
   - Support for screen readers
   - Meaningful aria-labels

4. **Performance**
   - Lightweight SVG icons
   - Minimal DOM nodes
   - GPU-accelerated rendering
   - Efficient icon loading strategy

### View Configuration UI Guidelines
- **EditViewModal**
  - Grid-based icon selection
  - Hover effects for icon preview
  - Current icon pre-selection
  - Smooth transitions between icon states

- **Sidebar Icon Display**
  - Adaptive display in collapsed/expanded states
  - Hover rotation effect (-5 degrees)
  - Consistent sizing (w-5 h-5)
  - Opacity transitions

### Color and Theming
- **Icon Color Modes**
  ```css
  .view-icon {
    --icon-color-light: #1e293b;
    --icon-color-dark: #f1f5f9;
    --icon-color-hover: #2563eb;
  }
  ```

- **Hover and Active States**
  - Subtle color shift
  - Minimal scale transformation
  - Consistent transition duration (200ms)

### Technical Implementation
```typescript
function renderIcon(iconName: string, className?: string) {
  const IconComponent = lucideIcons[iconName];
  return (
    <IconComponent 
      className={`
        view-icon 
        transition-transform 
        group-hover:rotate-[-5deg]
        ${className}
      `}
    />
  );
}
```

## Animation Guidelines

### Transitions
- Use consistent timing functions (ease-in-out)
- Standard durations:
  - Quick: 150ms (scale, opacity)
  - Medium: 200ms (color changes)
  - Smooth: 300ms (layout changes)
- Hardware acceleration for transforms
- Support reduced motion preferences
- Avoid layout shifts during animations

### Hover States
- Scale transforms: 102% on hover, 98% on active
- Icon rotations: -5 degrees on hover
- Opacity changes: 80% on hover for text
- Color transitions: 200ms duration
- Clear visual feedback
- No layout shifts or scrollbars
- Hardware-accelerated transforms

### Touch Interactions
- Minimum touch target size: 44px
- Clear visual feedback
- No accidental triggers
- Proper spacing between elements
- Support for touch gestures
- Smooth transitions

### Component-Specific Animations

#### Sidebar
- Collapse/Expand:
  - Width transition: 300ms ease-in-out
  - Hardware-accelerated transform
  - Smooth content fade
  - No layout shifts
- Hover Effects:
  - Icon rotation: -5 degrees
  - Scale up: 102%
  - Text opacity: 80%
  - GPU-accelerated transforms
- Performance:
  - Use transform-gpu
  - Contain layout/paint
  - Overflow control
  - Reduced motion support

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