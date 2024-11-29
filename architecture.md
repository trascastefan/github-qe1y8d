# Email Management Application Architecture

## Core Structure

### Components
1. **App.tsx** - Root component
   - Manages global state (selected view, current page, navigation menu state)
   - Controls sidebar visibility (hidden for Views and Tags pages)
   - Contains email data, view definitions, and tag data
   - Handles routing between main views (Home, Views, Tags)

2. **Header**
   - Main navigation bar with animated mail icon
   - Search functionality
   - Profile and settings access
   - Logo/branding with home navigation

3. **Sidebar** (Home page only)
   - Shows Inbox and Views in home page
   - Hidden on views and tags pages for full-width management
   - Dynamic navigation based on current page

4. **EmailList**
   - Displays emails with tags
   - Tag management (add/remove)
   - Shows checkbox selection
   - Empty state for non-Inbox views
   - Consistent tag styling across application

5. **NavigationMenu**
   - Slide-out menu for main navigation
   - Routes between Home, Views, and Tags pages

6. **ViewsConfig**
   - Full-width view management interface
   - Tag condition management
   - Drag-and-drop reordering
   - Email count display per view
   - Visual grouping of conditions

7. **TagsPage**
   - Full-width tag management interface
   - Horizontal tag organization
   - Tag creation and deletion
   - Search functionality

8. **TagSelector**
   - Reusable modal for tag selection
   - Search functionality
   - New tag creation
   - Used in both email tag management and view configuration

9. **TagModal**
   - Modal for creating new tags
   - Input validation
   - Consistent styling with other modals

### Data Models

1. **View**
   ```typescript
   {
     id: string
     name: string
     visible: boolean
     conditions: TagCondition[]
   }
   ```

2. **TagCondition**
   ```typescript
   {
     type: 'includes-any' | 'includes-all' | 'excludes-any'
     tags: string[]
   }
   ```

3. **Tag**
   ```typescript
   {
     id: string
     name: string
   }
   ```

4. **Email**
   ```typescript
   {
     id: number
     sender: string
     subject: string
     preview: string
     date: string
     tags: string[]
   }
   ```

## Key Features

1. **Tag Management**
   - Horizontal tag organization
   - Full-width interface for better organization
   - Tag addition/removal from emails
   - Consistent tag styling across components

2. **View System**
   - Horizontal view organization
   - Configurable views with tag conditions
   - Complex filtering with includes/excludes logic
   - Email count display
   - Condition grouping visualization

3. **Navigation**
   - Full-width layouts for Views and Tags pages
   - Slide-out navigation menu
   - Animated mail icon in header
   - Consistent navigation patterns

## UI/UX Features
- Modern, professional color scheme
- Responsive design with mobile-first approach
- Custom scrollbar styling
- Hover effects for interactive elements (desktop)
- Touch-optimized interactions (mobile)
- Modal interfaces for tag management
- Drag-and-drop interface for organization
- Full-width layouts where appropriate
- Consistent tag styling across components
- Visual hierarchy through typography and spacing

## Mobile Optimizations
1. **Component Layout**
   - Header overlays sidebar with proper z-indexing (z-30 for header, z-10 for sidebar)
   - Consistent 64px (h-16) header height across all viewports
   - Proper spacing in collapsed sidebar state to accommodate header
   - Full-width layouts for Views and Tags pages

2. **Navigation**
   - Collapsible sidebar with touch-friendly toggle
   - Mobile-optimized menu button placement in header
   - Proper spacing for touch targets (minimum 44px)
   - Smooth transitions for sidebar collapse/expand

3. **Content Organization**
   - Scrollable email list with fixed header
   - Responsive padding and margins using Tailwind's mobile-first classes
   - Touch-friendly button and interactive element sizes
   - Clear visual hierarchy maintained across screen sizes

4. **Performance**
   - Efficient DOM updates for smooth animations
   - Optimized event handlers for touch interactions
   - Proper handling of hover states for touch devices
   - Responsive image loading and scaling

## Data Management
- JSON-based email data store
- Tag filtering utilities
- View condition processing
- Real-time email count calculations

## Future Considerations
- Dark mode
- defining tags definition for prompting LLMs structured outputs to identify emails as having a specific tag
- Email actions (archive, delete, etc.)
- Accessibility features (keyboard navigation, screen readers, etc.)
- Creating column data model and integration with views and tags
- defining columns for prompting LLMs structured outputs
- defining UIs layers associated with columns
- creating database integration
- Search functionality
- Optimized performance for large datasets

- User authentication and account management
- Email attachments
- Send emails to LLMs for tagging
- Get Emails tags from LLMs
- create logic for associating columns to tags
- Understand the tags that are associated with views and what columns are associated with those tags based on views
- Enquire LLMs for structured input for columns