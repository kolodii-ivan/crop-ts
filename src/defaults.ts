import { JcropOptions } from './types';

/**
 * Default options for Jcrop
 */
export const DEFAULT_OPTIONS: JcropOptions = {
  // Selection Behavior
  edge: { n: 0, s: 0, e: 0, w: 0 },
  setSelect: null,
  linked: true,
  linkCurrent: true,
  canDelete: true,
  canSelect: true,
  canDrag: true,
  canResize: true,

  // Stage Behavior
  allowSelect: true,
  multi: false,
  multiMax: false,
  multiCleanup: true,
  animation: true,
  animEasing: 'ease',
  animDuration: 400,
  fading: true,
  fadeDuration: 300,
  fadeEasing: 'ease',
  bgColor: 'black',
  bgOpacity: 0.5,

  // Startup options
  applyFilters: ['constrain', 'extent', 'backoff', 'ratio', 'shader', 'round'],
  borders: ['e', 'w', 's', 'n'],
  handles: ['n', 's', 'e', 'w', 'sw', 'ne', 'nw', 'se'],
  dragbars: ['n', 'e', 'w', 's'],

  xscale: 1,
  yscale: 1,

  boxWidth: null,
  boxHeight: null,

  // CSS Classes
  cssNoDrag: 'jcrop-nodrag',
  cssDrag: 'jcrop-drag',
  cssContainer: 'jcrop-active',
  cssShades: 'jcrop-shades',
  cssSelection: 'jcrop-selection',
  cssBorders: 'jcrop-border',
  cssHandles: 'jcrop-handle jcrop-drag',
  cssButton: 'jcrop-box jcrop-drag',
  cssNoResize: 'jcrop-noresize',
  cssDragBars: 'jcrop-dragbar jcrop-drag',
};