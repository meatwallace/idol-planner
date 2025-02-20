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
- [x] Grid cell click handling
- [x] Basic layout structure (grid, sidebar, bottom panel)

### Phase 2: Inventory UI Implementation ✅

- [x] Collapsible sidebar implementation
  - [x] Expand/collapse animation
  - [x] Toggle button with icon
  - [x] Smooth width transition
  - [x] Full-height layout
- [x] Inventory header
  - [x] Title when expanded
  - [x] Create idol button
  - [x] Consistent visibility in both states
- [x] Empty state messaging
- [x] Focus management
  - [x] Overlay backdrop effect
  - [x] Proper z-index layering
  - [x] Smooth opacity transitions

### Phase 3: Idol Configuration ✅

- [x] Configuration Panel UI
  - [x] Basic form layout
  - [x] Size selector (dropdown/buttons)
  - [x] Label/name input
  - [x] Basic preview
  - [x] Save/cancel buttons
  - [x] Form validation
- [x] Idol Template Management
  - [x] Create new template
  - [x] Template validation
  - [x] Save template to inventory
  - [x] Edit existing template
  - [x] Delete template confirmation

### Phase 4: Drag and Drop ✅

- [x] Basic DnD Implementation
  - [x] Drag source setup (inventory items)
  - [x] Drop target setup (grid)
  - [x] Cursor-attached preview
  - [x] Auto-collapse inventory during drag
  - [x] Fade out overlay during drag
- [x] Placement Validation
  - [x] Check for active cells
  - [x] Check for grid boundaries
  - [x] Check for overlapping
  - [x] Check all required cells for idol size
  - [x] Visual feedback during drag
- [x] Instance Management
  - [x] Create instance from template
  - [x] Update grid state for all occupied cells
  - [x] Remove instance

### Phase 5: Modifier System (Next)

- [ ] Modifier UI
  - [ ] Prefix/suffix selector
  - [ ] Modifier input fields
  - [ ] Modifier validation
  - [ ] Preview in template card
- [ ] Modifier Management
  - [ ] Add/remove modifiers
  - [ ] Validate modifier constraints
  - [ ] Update template/instance

### Phase 6: Grid Interactions (In Progress)

- [x] Placed Idol Management
  - [x] Highlight placed idols
  - [x] Show idol details on hover
  - [x] Remove idol from grid
- [x] Grid State Management
  - [x] Track occupied cells
  - [x] Update cell states
  - [x] Validate placement rules

### Phase 7: Polish & UX

- [x] Visual Feedback
  - [x] Loading states
  - [x] Error states
  - [x] Success notifications
  - [x] Drag preview styling
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

Moving from Phase 6 (Grid Interactions) to Phase 5 (Modifier System). Next steps:

1. Design and implement the modifier UI components
2. Add modifier validation logic
3. Update idol templates to support modifiers
4. Integrate modifier display in the inventory and grid
