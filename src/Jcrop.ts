import { EventEmitter } from './lib/EventEmitter';
import { DomUtil } from './lib/DomUtil';
import { JcropOptions, Rect } from './types';
import { Selection } from './components/Selection';
import { DragState } from './components/DragState';
import { StageManager } from './components/StageManager';
import { ImageLoader } from './components/ImageLoader';
import { Touch } from './components/Touch';
import { KeyWatcher } from './components/KeyWatcher';
import { registerFilter, getFilterConstructor } from './filters/registry';
import { DEFAULT_OPTIONS } from './defaults';

/**
 * Main Jcrop class
 */
export class Jcrop extends EventEmitter {
  public container: HTMLElement;
  public options: JcropOptions;
  public ui: {
    multi: Selection[];
    selection: Selection | null;
    keyboard?: KeyWatcher;
    manager?: StageManager;
  };
  public state: DragState | null = null;
  public filter: Record<string, any> = {};

  /**
   * Create a new Jcrop instance
   */
  constructor(element: HTMLElement | string, options: JcropOptions = {}) {
    super();
    
    // Handle string selector
    if (typeof element === 'string') {
      const el = document.querySelector(element);
      if (!el) {
        throw new Error(`Element not found: ${element}`);
      }
      element = el as HTMLElement;
    }
    
    // Merge default options with user options
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Initialize container
    this.container = element;
    DomUtil.addClass(this.container, this.options.cssContainer || 'jcrop-active');
    
    // Initialize UI state
    this.ui = {
      multi: [],
      selection: null
    };
    
    // Initialize components
    this.init();
    
    // Apply additional options
    this.setOptions(options);
    
    // Apply size constraints
    this.applySizeConstraints();
    
    // Trigger init event
    this.emit('cropinit', this);
  }

  /**
   * Initialize Jcrop components
   */
  init(): void {
    // Initialize stage manager
    this.ui.manager = new StageManager(this);
    
    // Initialize keyboard support
    this.ui.keyboard = new KeyWatcher(this);
    
    // Apply filters
    this.applyFilters();
    
    // Add touch support if needed
    if ('ontouchstart' in window) {
      new Touch(this);
    }
    
    // Initialize event handlers
    this.initEvents();
  }

  /**
   * Apply size constraints based on image or specified dimensions
   */
  applySizeConstraints(): void {
    const opts = this.options;
    const img = opts.imgsrc;
    
    if (img) {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const bw = opts.boxWidth || iw;
      const bh = opts.boxHeight || ih;
      
      if ((iw > bw) || (ih > bh)) {
        const bx = Jcrop.getLargestBox(iw/ih, bw, bh);
        
        img.width = bx[0];
        img.height = bx[1];
        
        this.resizeContainer(bx[0], bx[1]);
        
        this.options.xscale = iw / bx[0];
        this.options.yscale = ih / bx[1];
      }
    }
    
    if (opts.trueSize) {
      const dw = opts.trueSize[0];
      const dh = opts.trueSize[1];
      const cs = this.getContainerSize();
      
      this.options.xscale = dw / cs[0];
      this.options.yscale = dh / cs[1];
    }
  }

  /**
   * Initialize component by name and arguments
   */
  initComponent<T>(name: string, ...args: any[]): T | undefined {
    // Component initialization will be added with component registry
    return undefined;
  }

  /**
   * Set options on the Jcrop instance
   */
  setOptions(options: JcropOptions, proptype?: any): this {
    // Merge options
    this.options = { ...this.options, ...options };
    
    // Handle setSelect option
    if (this.options.setSelect) {
      // If there is no current selection, create one
      if (!this.ui.multi.length) {
        this.newSelection();
      }
      
      // Update selection with these values
      this.setSelect(this.options.setSelect);
      
      // Clear setSelect option
      this.options.setSelect = null;
    }
    
    // Trigger update event
    this.emit('configupdate');
    
    return this;
  }

  /**
   * Destroy the Jcrop instance
   */
  destroy(): void {
    // Clean up keyboard events
    if (this.ui.keyboard) {
      this.ui.keyboard.destroy();
    }
    
    if (this.options.imgsrc) {
      // If we have an image, put it back where it was
      const img = this.options.imgsrc;
      DomUtil.before(this.container, img);
      DomUtil.remove(this.container);
      img.style.display = '';
    } else {
      // Otherwise just remove the container
      DomUtil.remove(this.container);
    }
  }

  /**
   * Apply configured filters
   */
  applyFilters(): void {
    if (!this.options.applyFilters) return;
    
    for (const filterName of this.options.applyFilters) {
      const FilterClass = getFilterConstructor(filterName);
      if (FilterClass) {
        const filter = new FilterClass();
        filter.core = this;
        if (filter.init) filter.init();
        this.filter[filterName] = filter;
      }
    }
  }

  /**
   * Get default filters sorted by priority
   */
  getDefaultFilters(): any[] {
    if (!this.options.applyFilters) return [];
    
    const filters = [];
    
    for (const filterName of this.options.applyFilters) {
      if (this.filter[filterName]) {
        filters.push(this.filter[filterName]);
      }
    }
    
    return filters.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Set the active selection
   */
  setSelection(selection: Selection): Selection {
    const m = this.ui.multi;
    const n: Selection[] = [];
    
    for (let i = 0; i < m.length; i++) {
      if (m[i] !== selection) {
        n.push(m[i]);
        m[i].toBack();
      }
    }
    
    n.unshift(selection);
    this.ui.multi = n;
    this.ui.selection = selection;
    selection.toFront();
    
    return selection;
  }

  /**
   * Get the current selection
   */
  getSelection(): Rect {
    if (!this.ui.selection) return { x: 0, y: 0, x2: 0, y2: 0, w: 0, h: 0 };
    return this.ui.selection.get();
  }

  /**
   * Create a new selection
   */
  newSelection(selection?: Selection): Selection {
    if (!selection) {
      selection = new Selection();
    }
    
    selection.init(this);
    this.setSelection(selection);
    
    return selection;
  }

  /**
   * Check if a selection exists
   */
  hasSelection(selection: Selection): boolean {
    return this.ui.multi.includes(selection);
  }

  /**
   * Remove a selection
   */
  removeSelection(selection: Selection): Selection[] {
    const m = this.ui.multi;
    const n: Selection[] = [];
    
    for (let i = 0; i < m.length; i++) {
      if (selection !== m[i]) {
        n.push(m[i]);
      } else {
        m[i].remove();
      }
    }
    
    this.ui.multi = n;
    
    // Update current selection if needed
    if (n.length && this.ui.selection === selection) {
      this.ui.selection = n[0];
    } else if (!n.length) {
      this.ui.selection = null;
    }
    
    return n;
  }

  /**
   * Add a filter to all selections
   */
  addFilter(filter: any): this {
    for (let i = 0; i < this.ui.multi.length; i++) {
      this.ui.multi[i].addFilter(filter);
    }
    
    return this;
  }

  /**
   * Remove a filter from all selections
   */
  removeFilter(filter: any): this {
    for (let i = 0; i < this.ui.multi.length; i++) {
      this.ui.multi[i].removeFilter(filter);
    }
    
    return this;
  }

  /**
   * Blur the current selection
   */
  blur(): this {
    if (this.ui.selection) {
      this.ui.selection.blur();
    }
    return this;
  }

  /**
   * Focus the current selection
   */
  focus(): this {
    if (this.ui.selection) {
      this.ui.selection.focus();
    }
    return this;
  }

  /**
   * Initialize event handlers
   */
  initEvents(): void {
    // Prevent text selection
    this.container.addEventListener('selectstart', e => e.preventDefault());
    
    // Handle drag start events
    this.container.addEventListener('mousedown', this.startDrag.bind(this));
  }

  /**
   * Select max area
   */
  maxSelect(): void {
    const cs = this.getContainerSize();
    this.setSelect([0, 0, cs[0], cs[1]]);
  }

  /**
   * Nudge selection
   */
  nudge(x: number, y: number): void {
    if (!this.ui.selection) return;
    
    const s = this.ui.selection;
    const b = s.get();
    
    b.x += x;
    b.x2 += x;
    b.y += y;
    b.y2 += y;
    
    // Keep within bounds
    if (b.x < 0) {
      b.x2 = b.w;
      b.x = 0;
    } else if (b.x2 > this.getContainerSize()[0]) {
      b.x2 = this.getContainerSize()[0];
      b.x = b.x2 - b.w;
    }
    
    if (b.y < 0) {
      b.y2 = b.h;
      b.y = 0;
    } else if (b.y2 > this.getContainerSize()[1]) {
      b.y2 = this.getContainerSize()[1];
      b.y = b.y2 - b.h;
    }
    
    s.element.dispatchEvent(new CustomEvent('cropstart', { detail: [s, this.unscale(b)] }));
    s.updateRaw(b, 'move');
    s.element.dispatchEvent(new CustomEvent('cropend', { detail: [s, this.unscale(b)] }));
  }

  /**
   * Refresh all selections
   */
  refresh(): void {
    for (let i = 0; i < this.ui.multi.length; i++) {
      this.ui.multi[i].refresh();
    }
  }

  /**
   * Blur all selections
   */
  blurAll(): void {
    for (const selection of this.ui.multi) {
      selection.toBack();
    }
  }

  /**
   * Scale coordinates from real to display
   */
  scale(b: Rect): Rect {
    const xs = this.options.xscale || 1;
    const ys = this.options.yscale || 1;
    
    return {
      x: b.x / xs,
      y: b.y / ys,
      x2: b.x2 / xs,
      y2: b.y2 / ys,
      w: b.w / xs,
      h: b.h / ys
    };
  }

  /**
   * Unscale coordinates from display to real
   */
  unscale(b: Rect): Rect {
    const xs = this.options.xscale || 1;
    const ys = this.options.yscale || 1;
    
    return {
      x: b.x * xs,
      y: b.y * ys,
      x2: b.x2 * xs,
      y2: b.y2 * ys,
      w: b.w * xs,
      h: b.h * ys
    };
  }

  /**
   * Request to delete current selection
   */
  requestDelete(): void {
    if (this.ui.multi.length > 1 && this.ui.selection && this.ui.selection.canDelete) {
      this.deleteSelection();
    }
  }

  /**
   * Delete current selection
   */
  deleteSelection(): void {
    if (this.ui.selection) {
      this.removeSelection(this.ui.selection);
      if (this.ui.multi.length && this.ui.selection) {
        this.ui.selection.refresh();
      }
    }
  }

  /**
   * Animate selection to coordinates
   */
  animateTo(box: number[]): this {
    if (this.ui.selection) {
      this.ui.selection.animateTo(box);
    }
    return this;
  }

  /**
   * Set selection coordinates
   */
  setSelect(box: number[] | null): this {
    if (this.ui.selection && box) {
      this.ui.selection.update(Jcrop.wrapFromXywh(box));
    }
    return this;
  }

  /**
   * Handle drag start
   */
  startDrag(e: MouseEvent): void {
    // Only left mouse button
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    if (!target) return;
    
    // Check if target has the drag class
    if (!target.classList.contains(this.options.cssDrag || 'jcrop-drag')) return;
    
    // Find the selection that contains this target
    let selection: Selection | null = null;
    const selectionEl = target.closest(`.${this.options.cssSelection || 'jcrop-selection'}`);
    
    if (selectionEl) {
      selection = this.ui.multi.find(s => s.element === selectionEl) || null;
    }
    
    if (!selection) return;
    
    // Get drag direction
    const direction = target.getAttribute('data-ord') || 'move';
    
    // Trigger cropstart event
    this.container.dispatchEvent(
      new CustomEvent('cropstart', { detail: [selection, this.unscale(selection.get())] })
    );
    
    // Start dragging
    selection.startDrag(e, direction);
    
    e.preventDefault();
  }

  /**
   * Get container size
   */
  getContainerSize(): [number, number] {
    return [
      this.container.offsetWidth,
      this.container.offsetHeight
    ];
  }

  /**
   * Resize container
   */
  resizeContainer(w: number, h: number): void {
    this.container.style.width = `${w}px`;
    this.container.style.height = `${h}px`;
    this.refresh();
  }

  /**
   * Set image source
   */
  setImage(src: string, callback?: (w: number, h: number) => void): boolean {
    const targ = this.options.imgsrc;
    if (!targ) return false;
    
    ImageLoader.load(src, (w, h) => {
      this.resizeContainer(w, h);
      
      targ.src = src;
      targ.width = w;
      targ.height = h;
      
      this.applySizeConstraints();
      this.refresh();
      
      this.container.dispatchEvent(
        new CustomEvent('cropimage', { detail: [this, targ] })
      );
      
      if (typeof callback === 'function') {
        callback.call(this, w, h);
      }
    });
    
    return true;
  }

  /**
   * Update selection coordinates
   */
  update(b: Rect): void {
    if (this.ui.selection) {
      this.ui.selection.update(b);
    }
  }

  /**
   * Calculate largest box for given aspect ratio and dimensions
   */
  static getLargestBox(ratio: number, maxw: number, maxh: number): [number, number] {
    let tw = maxw;
    let th = maxw / ratio;
    
    if (th > maxh) {
      th = maxh;
      tw = maxh * ratio;
    }
    
    return [Math.round(tw), Math.round(th)];
  }

  /**
   * Convert x, y, w, h array to a rect object
   */
  static wrapFromXywh(arr: number[]): Rect {
    if (arr.length !== 4) {
      throw new Error('Coordinate array must have 4 values');
    }
    
    return {
      x: arr[0],
      y: arr[1],
      x2: arr[0] + arr[2],
      y2: arr[1] + arr[3],
      w: arr[2],
      h: arr[3]
    };
  }
}