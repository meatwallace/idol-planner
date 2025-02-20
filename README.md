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

### User Interface Requirements

- Interactive grid where users can:
  - View the full grid layout
  - See blocked/unavailable squares
  - Place Idols of different sizes
  - Rotate Idols (if applicable)
  - Remove placed Idols
  - View bonuses from placed Idols
- Modifier management:
  - Display prefix and suffix slots for each Idol
  - Allow adding/removing modifiers within constraints
  - Clearly distinguish between prefix and suffix modifiers

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
