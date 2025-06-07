# Enyo Bejeweled

A Bejeweled clone built with the Enyo framework, designed to run on webOS devices.

## Features

- 8x8 grid of colorful gems
- Smooth gem swapping and matching animations
- Cascading matches (chain reactions)
- Score tracking
- Responsive design
- Touch-friendly interface

## Game Mechanics

- Match 3 or more gems of the same color in a row or column
- Gems can be swapped with adjacent gems
- Matches of 4 or more gems are supported
- Chain reactions occur when new matches are created
- Score increases by 10 points per matched gem

## Technical Details

### Dependencies
- Enyo 2.5.1
- Bower for dependency management

### Project Structure
```
enyojeweled/
├── bower_components/
│   └── enyo/
├── src/
│   ├── App.js
│   └── kinds.js
├── styles.css
├── index.html
├── package.json
└── bower.json
```

### Component Architecture

The game is built using Enyo's component system:

- `App`: Main application component
- `GameBoard`: Manages the game state and score
- `Grid`: Handles the game grid and gem interactions
- `Gem`: Individual gem components with animations

### Animations

- Smooth gem selection with scale and glow effects
- Animated gem swapping
- Match animation with scaling and fading
- Cascading match animations

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   bower install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:8080`

## Development

### Key Files

- `src/kinds.js`: Contains all game components and logic
- `styles.css`: Game styling and animations
- `index.html`: Main application entry point

### Adding New Features

1. Component modifications should be made in `src/kinds.js`
2. Style changes should be added to `styles.css`
3. New dependencies should be added to `bower.json`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with the Enyo framework
- Inspired by the classic Bejeweled game 