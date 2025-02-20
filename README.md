# Path of Exile - Idol Planner

A web-based planner tool for Path of Exile's Idol system that helps players optimize their Idol grid layouts.

## Overview

The Idol system in Path of Exile allows players to socket special items called "Idols" into a grid-based interface. Each Idol provides specific bonuses to the character, and efficient placement of these Idols is crucial for maximizing character power.

## Core Features

### Grid System

- Fixed-size grid layout representing the Idol socket interface
- Support for blocked/unavailable grid squares
- Visual representation of the grid state
- Ability to view both empty and filled grid spaces

### Idol Mechanics

- Support for various Idol sizes. Example:
  - 1x1 (single square)
  - 2x2 (four squares)
  - 1x3 (three squares horizontally)
- Each Idol can have up to 4 modifiers:
  - Maximum of 2 prefix modifiers
  - Maximum of 2 suffix modifiers
  - Minimum of 1 modifier (can be either prefix or suffix)
- Idols cannot overlap with each other or blocked squares

### Idol Management

- Idol Configuration:
  - Configuration panel below the grid for creating new idols
  - Form to specify:
    - Idol size (1x1, 2x2, 1x3, etc.)
    - Label/name for the idol
    - Prefix and suffix modifiers
  - Preview of the idol being configured
  - Save idol to inventory
  - Edit existing idols
- Idol Inventory:
  - Sidebar panel displaying saved idols
  - List view with:
    - Idol name/label
    - Visual preview of size/shape
    - Quick view of modifiers
  - Actions:
    - Drag idol to grid for placement
    - Edit idol configuration
    - Delete idol from inventory
    - Duplicate existing idol

### Placement System

- Drag-and-Drop Interface:
  - Drag idols from inventory to grid
  - Visual preview of idol being placed
  - Visual feedback during dragging:
    - Show valid placement positions
    - Highlight invalid positions (blocked/occupied cells)
    - Preview of idol position while dragging
- Placement Rules:
  - Idols can only be placed on active grid cells
  - All cells required by the idol must be active
  - Cannot overlap with other idols or blocked cells
  - Must be fully contained within the grid
  - Visual indicator for valid/invalid placement during drag
- Grid Management:
  - Remove placed idols
  - Clear visual indication of placed idols
  - Hover state showing idol details

### User Interface Layout

- Main Grid Area:
  - Central placement of the idol grid
  - Clear visual hierarchy
- Idol Configuration (Bottom Panel):
  - Form for creating/editing idols
  - Size selection
  - Modifier configuration
  - Save/Update buttons
- Idol Inventory (Side Panel):
  - List of saved idols
  - Drag handles for placement
  - Quick actions (edit/delete)
  - Search/filter options

## Technical Requirements

- Review [.cursor/rules](.cursor/rules) for implementation guidelines

## Future Considerations

- Save/load functionality for different layouts
- Import/export of configurations
- Bonus calculation and optimization suggestions
- Integration with Path of Exile's API (if available)
- Support for different grid layouts/sizes
- Modifier database and filtering system
- Total modifier calculation across all placed Idols

## Development Status

🚧 This project is currently in early development. Features and requirements will be updated as more information about Path of Exile's Idol system becomes available.

## Development TODO List

### Phase 1: Core Grid Implementation ✅

- [x] Basic grid layout (6x7)
- [x] Active/inactive cell visualization
- [x] Grid cell hover states
- [ ] Grid cell click handling
- [ ] Basic layout structure (grid, sidebar, bottom panel)

### Phase 2: Idol Configuration

- [ ] Configuration Panel UI
  - [ ] Basic form layout
  - [ ] Size selector (dropdown/buttons)
  - [ ] Label/name input
  - [ ] Preview component
  - [ ] Save/cancel buttons
- [ ] Idol Template Management
  - [ ] Create new template
  - [ ] Template validation
  - [ ] Save template to inventory
  - [ ] Edit existing template
  - [ ] Delete template confirmation

### Phase 3: Inventory System

- [ ] State Management
  - [ ] Set up React Context for inventory
  - [ ] Template CRUD operations
  - [ ] Instance management
- [ ] Inventory Sidebar UI
  - [ ] List view of saved templates
  - [ ] Template preview cards
  - [ ] Drag handles
  - [ ] Quick actions (edit/delete)
  - [ ] Search/filter input

### Phase 4: Drag and Drop

- [ ] Basic DnD Implementation
  - [ ] Drag source setup (inventory items)
  - [ ] Drop target setup (grid)
  - [ ] Drag preview
- [ ] Placement Validation
  - [ ] Check for active cells
  - [ ] Check for grid boundaries
  - [ ] Check for overlapping
  - [ ] Visual feedback during drag
- [ ] Instance Management
  - [ ] Create instance from template
  - [ ] Update grid state
  - [ ] Remove instance
  - [ ] Return to inventory

### Phase 5: Modifier System

- [ ] Modifier UI
  - [ ] Prefix/suffix selector
  - [ ] Modifier input fields
  - [ ] Modifier validation
  - [ ] Preview in template card
- [ ] Modifier Management
  - [ ] Add/remove modifiers
  - [ ] Validate modifier constraints
  - [ ] Update template/instance

### Phase 6: Grid Interactions

- [ ] Placed Idol Management
  - [ ] Highlight placed idols
  - [ ] Show idol details on hover
  - [ ] Remove idol from grid
  - [ ] Rotate idol (if applicable)
- [ ] Grid State Management
  - [ ] Track occupied cells
  - [ ] Update cell states
  - [ ] Validate placement rules

### Phase 7: Polish & UX

- [ ] Visual Feedback
  - [ ] Loading states
  - [ ] Error states
  - [ ] Success notifications
  - [ ] Drag preview styling
- [ ] Responsive Design
  - [ ] Mobile layout
  - [ ] Touch interactions
  - [ ] Responsive grid sizing
- [ ] Accessibility
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Screen reader support

### Phase 8: Data Persistence

- [ ] Local Storage
  - [ ] Save inventory state
  - [ ] Save grid layout
  - [ ] Auto-save changes
- [ ] Import/Export
  - [ ] Export configuration
  - [ ] Import configuration
  - [ ] Validation of imported data

## Current Focus

Currently implementing Phase 1: Core Grid Implementation. Next steps:

1. Complete grid cell interactions
2. Set up basic layout structure
3. Begin idol configuration panel
