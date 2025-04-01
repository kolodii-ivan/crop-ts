# Jcrop-ts Development Guide

## Build Commands
- `npm install` - Install dependencies
- `grunt` - Build both JS and CSS
- `grunt js` - Build JavaScript only
- `grunt css` - Build CSS only
- `grunt watch` - Watch for file changes and rebuild

## Code Style Guidelines
- Indentation: 2 spaces
- Naming: camelCase for methods and variables
- Documentation: Use `/* */` comment blocks for functions
- Function markers: Use `//functionName: function(){{{` and `//}}}` patterns
- Module pattern with constructors and prototypes
- jQuery convention: Use `$` prefix for DOM element variables
- Use `$.extend()` for adding methods to prototypes
- Error handling: Validate parameters and return `this` for chainability
- Component-based architecture
- Logical organization of functionality into filter/ and component/ modules

## Repository Organization
- `/src` - Source files
- `/js` - Compiled JavaScript
- `/css` - Compiled CSS
- `/demos` - Example implementations