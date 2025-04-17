import { Jcrop } from './constructor';

/**
 * Default configuration for Jcrop instances
 */
(Jcrop as any).defaults = {
  // Selection Behavior
  edge: { n: 0, s: 0, e: 0, w: 0 },
  setSelect: null,
  linked: true,
  linkCurrent: true,
  canDelete: true,
  canSelect: true,
  canDrag: true,
  canResize: true,

  // Component constructors (to be registered via static.ts)
  eventManagerComponent:  (Jcrop as any).component.EventManager,
  keyboardComponent:      (Jcrop as any).component.Keyboard,
  dragstateComponent:     (Jcrop as any).component.DragState,
  stagemanagerComponent:  (Jcrop as any).component.StageManager,
  animatorComponent:      (Jcrop as any).component.Animator,
  selectionComponent:     (Jcrop as any).component.Selection,

  // Stage constructor
  stageConstructor:       (Jcrop as any).stageConstructor,

  // Stage Behavior
  allowSelect: true,
  multi: false,
  multiMax: false,
  multiCleanup: true,
  animation: true,
  animEasing: 'swing',
  animDuration: 400,
  fading: true,
  fadeDuration: 300,
  fadeEasing: 'swing',
  bgColor: 'black',
  bgOpacity: .5,

  // Startup options
  applyFilters: [ 'constrain', 'extent', 'backoff', 'ratio', 'shader', 'round' ],
  borders:        [ 'e', 'w', 's', 'n' ],
  handles:        [ 'n', 's', 'e', 'w', 'sw', 'ne', 'nw', 'se' ],
  dragbars:       [ 'n', 'e', 'w', 's' ],

  dragEventTarget: window,

  xscale: 1,
  yscale: 1,

  boxWidth: null,
  boxHeight: null,

  // CSS Classes
  css_nodrag:    'jcrop-nodrag',
  css_drag:      'jcrop-drag',
  css_container: 'jcrop-active',
  css_shades:    'jcrop-shades',
  css_selection: 'jcrop-selection',
  css_borders:   'jcrop-border',
  css_handles:   'jcrop-handle jcrop-drag',
  css_button:    'jcrop-box jcrop-drag',
  css_noresize:  'jcrop-noresize',
  css_dragbars:  'jcrop-dragbar jcrop-drag',

  legacyHandlers: {
    onChange: 'cropmove',
    onSelect: 'cropend'
  }
};

export {};