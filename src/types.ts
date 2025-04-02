/**
 * Jcrop TypeScript Core Types
 */

// Add customEvent methods to the global HTMLElement interface
declare global {
  interface HTMLElement {
    dispatchCustomEvent?: (type: string, detail: any) => boolean;
    makeCustomEvent?: (type: string, detail: any) => void;
  }
  
  interface Element {
    dispatchCustomEvent?: (type: string, detail: any) => boolean;
    makeCustomEvent?: (type: string, detail: any) => void;
  }
}

export interface JcropOptions {
  // Selection Behavior
  edge?: { n: number; s: number; e: number; w: number };
  setSelect?: number[] | null;
  linked?: boolean;
  linkCurrent?: boolean;
  canDelete?: boolean;
  canSelect?: boolean;
  canDrag?: boolean;
  canResize?: boolean;

  // Stage Behavior
  allowSelect?: boolean;
  multi?: boolean;
  multiMax?: number | boolean;
  multiCleanup?: boolean;
  animation?: boolean;
  animEasing?: string;
  animDuration?: number;
  fading?: boolean;
  fadeDuration?: number;
  fadeEasing?: string;
  bgColor?: string;
  bgOpacity?: number;

  // Startup options
  applyFilters?: string[];
  borders?: string[];
  handles?: string[];
  dragbars?: string[];

  xscale?: number;
  yscale?: number;

  boxWidth?: number | null;
  boxHeight?: number | null;

  // CSS Classes
  cssNoDrag?: string;
  cssDrag?: string;
  cssContainer?: string;
  cssShades?: string;
  cssSelection?: string;
  cssBorders?: string;
  cssHandles?: string;
  cssButton?: string;
  cssNoResize?: string;
  cssDragBars?: string;

  // Components
  imgsrc?: HTMLImageElement;
  trueSize?: [number, number];
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
}

export interface DragState {
  startX: number;
  startY: number;
  ox: number;
  oy: number;
  direction: string;
  xmod: number;
  ymod: number;
  offsetX?: number;
  offsetY?: number;
}

export type EventCallback = (event: Event, ...args: any[]) => void;

export interface Filter {
  priority: number;
  filter: (rect: Rect, direction: string, selection: any) => Rect;
  init?: () => void;
  destroy?: () => void;
  tag?: string;
}