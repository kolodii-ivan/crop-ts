# Jcrop-TS

Image cropping widget in TypeScript. A modern, jQuery-free, rewrite of the classic Jcrop library.

## Features

- Pure TypeScript implementation with no dependencies
- Modern browser support
- Similar API to the original Jcrop for easy migration
- Support for multiple selections
- Aspect ratio constraints
- Animation support
- Touch support for mobile devices
- Customizable appearance
- Comprehensive test suite

## Installation

```bash
npm install jcrop-ts
```

## Basic Usage

```html
<img src="example.jpg" id="target">

<script type="module">
  import Jcrop from 'jcrop-ts';
  
  // Initialize Jcrop on an image
  const jcrop = Jcrop('#target', {
    setSelect: [100, 100, 400, 300]
  });
  
  // Listen for crop events
  document.querySelector('#target').parentElement.addEventListener('cropmove', (e) => {
    const [selection, coords] = e.detail;
    console.log('Selected coordinates:', coords);
  });
</script>
```

## API Reference

### Initialization

```js
// Initialize with a selector or DOM element
const jcrop = Jcrop(element, options);
```

### Options

```js
const options = {
  // Selection coordinates: [x, y, width, height]
  setSelect: [100, 100, 400, 300],
  
  // Aspect ratio (width/height)
  aspectRatio: 16/9,
  
  // Allow multiple selections
  multi: true,
  
  // Maximum number of selections
  multiMax: 3,
  
  // Animation settings
  animation: true,
  animDuration: 400,
  
  // Background appearance
  bgColor: 'black',
  bgOpacity: 0.6,
  
  // Selection constraints
  minSize: [50, 50],
  maxSize: [500, 500],
  
  // Handlers and UI elements
  allowSelect: true,
  canDelete: true,
  canDrag: true,
  canResize: true
};
```

### Methods

```js
// Set a specific selection area [x, y, width, height]
jcrop.setSelect([100, 100, 400, 300]);

// Animate selection to a new position
jcrop.animateTo([200, 200, 300, 300]);

// Get the current selection coordinates
const coords = jcrop.getSelection();

// Create a new selection
const selection = jcrop.newSelection();

// Delete the active selection
jcrop.deleteSelection();

// Set a different image
jcrop.setImage('new-image.jpg', (width, height) => {
  console.log('New image loaded:', width, height);
});

// Disable/enable the crop interface
jcrop.ui.manager.disable();
jcrop.ui.manager.enable();

// Destroy the Jcrop instance
jcrop.destroy();
```

### Events

```js
// Selection creation
element.addEventListener('cropcreate', (e) => {
  console.log('Selection created:', e.detail);
});

// Selection movement
element.addEventListener('cropmove', (e) => {
  const [selection, coords] = e.detail;
  console.log('Selection moved:', coords);
});

// Selection start (on mousedown/touchstart)
element.addEventListener('cropstart', (e) => {
  console.log('Started adjusting selection:', e.detail);
});

// Selection end (on mouseup/touchend)
element.addEventListener('cropend', (e) => {
  console.log('Finished adjusting selection:', e.detail);
});
```

## Building and Testing

```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build

# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Credits

This project is a TypeScript rewrite of [Jcrop](http://jcrop.org/), originally created by Tapmodo Interactive LLC.

## License

MIT License