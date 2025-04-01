import { EventEmitter } from '../lib/EventEmitter';
import { DomUtil } from '../lib/DomUtil';
import { Rect } from '../types';
import { DragState } from './DragState';
import { Animator } from './Animator';

/**
 * Default Selection properties
 */
const SELECTION_DEFAULTS = {
  minSize: [8, 8],
  maxSize: [0, 0],
  aspectRatio: 0,
  edge: { n: 0, s: 0, e: 0, w: 0 },
  bgColor: null,
  bgOpacity: null,
  last: null,

  state: null,
  active: true,
  linked: true,
  canDelete: true,
  canDrag: true,
  canResize: true,
  canSelect: true
};

/**
 * Selection component
 * Manages a single cropping selection
 */
export class Selection extends EventEmitter {
  public element!: HTMLElement;
  public frame!: HTMLButtonElement;
  public core: any;
  public filter: any[] = [];
  
  // Properties from defaults
  public minSize!: number[];
  public maxSize!: number[];
  public aspectRatio!: number;
  public edge!: { n: number; s: number; e: number; w: number };
  public bgColor!: string | null;
  public bgOpacity!: number | null;
  public last!: any;
  public state!: DragState | null;
  public active!: boolean;
  public linked!: boolean;
  public canDelete!: boolean;
  public canDrag!: boolean;
  public canResize!: boolean;
  public canSelect!: boolean;

  constructor() {
    super();
    
    // Initialize default properties
    Object.assign(this, SELECTION_DEFAULTS);
  }

  /**
   * Initialize selection
   */
  init(core: any): void {
    this.core = core;
    this.startup();
    this.linked = core.options.linked;
    this.attach();
    this.setOptions(core.options);
    
    // Trigger create event
    this.element.dispatchEvent(new CustomEvent('cropcreate', { detail: [this] }));
  }

  /**
   * Attach additional functionality
   * Hook for extending init sequence
   */
  attach(): void {
    // For extending init() sequence
  }

  /**
   * Setup selection element
   */
  startup(): void {
    const o = this.core.options;
    
    // Set default properties
    Object.assign(this, SELECTION_DEFAULTS);
    
    // Set filters
    this.filter = this.core.getDefaultFilters();
    
    // Create DOM elements
    this.element = DomUtil.createElement('div', { 
      class: o.cssSelection || 'jcrop-selection' 
    });
    this.element.dataset.selection = 'true';
    
    // Create frame/button
    this.frame = DomUtil.createElement('button', { 
      class: o.cssButton || 'jcrop-box jcrop-drag',
      type: 'button',
      'data-ord': 'move'
    });
    
    // Add elements to DOM
    this.element.appendChild(this.frame);
    this.core.container.appendChild(this.element);
    
    // Insert handle and border elements
    this.insertElements();
    
    // Bind focus/blur events
    this.frame.addEventListener('focus', () => {
      this.core.setSelection(this);
      this.element.dispatchEvent(new CustomEvent('cropfocus', { detail: this }));
      DomUtil.addClass(this.element, 'jcrop-focus');
    });
    
    this.frame.addEventListener('blur', () => {
      DomUtil.removeClass(this.element, 'jcrop-focus');
      this.element.dispatchEvent(new CustomEvent('cropblur', { detail: this }));
    });
  }

  /**
   * Properties to propagate from options
   */
  static propagateList = [
    'canDelete', 'canDrag', 'canResize', 'canSelect',
    'minSize', 'maxSize', 'aspectRatio', 'edge'
  ];

  /**
   * Set options on the selection
   */
  setOptions(options: any): this {
    // Copy relevant properties from options
    for (const prop of Selection.propagateList) {
      if (options[prop] !== undefined) {
        (this as any)[prop] = options[prop];
      }
    }
    
    this.refresh();
    return this;
  }

  /**
   * Refresh selection state
   */
  refresh(): void {
    this.allowResize();
    this.allowDrag();
    this.allowSelect();
    this.callFilterFunction('refresh');
    this.updateRaw(this.get(), 'se');
  }

  /**
   * Call a function on all filters
   */
  callFilterFunction(funcName: string): this {
    for (let i = 0; i < this.filter.length; i++) {
      if (this.filter[i][funcName]) {
        this.filter[i][funcName](this);
      }
    }
    return this;
  }

  /**
   * Add a filter to this selection
   */
  addFilter(filter: any): void {
    filter.core = this.core;
    
    if (!this.hasFilter(filter)) {
      this.filter.push(filter);
      this.sortFilters();
      
      if (filter.init) filter.init();
      this.refresh();
    }
  }

  /**
   * Check if filter is already added
   */
  hasFilter(filter: any): boolean {
    return this.filter.includes(filter);
  }

  /**
   * Sort filters by priority
   */
  sortFilters(): void {
    this.filter.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    for (const filter of this.filter) {
      if (filter.destroy) filter.destroy();
    }
    
    this.filter = [];
  }

  /**
   * Remove a specific filter
   */
  removeFilter(filterOrTag: any): void {
    const newFilters = [];
    
    for (const filter of this.filter) {
      if ((filter.tag && filter.tag === filterOrTag) || filter === filterOrTag) {
        if (filter.destroy) filter.destroy();
      } else {
        newFilters.push(filter);
      }
    }
    
    this.filter = newFilters;
  }

  /**
   * Run all filters on rectangle
   */
  runFilters(rect: Rect, direction: string): Rect {
    let result = { ...rect };
    
    for (const filter of this.filter) {
      result = filter.filter(result, direction, this);
    }
    
    return result;
  }

  /**
   * End drag operation
   */
  endDrag(): void {
    if (this.state) {
      document.removeEventListener('mousemove', this.state.onMove);
      document.removeEventListener('mouseup', this.state.onEnd);
      document.removeEventListener('touchmove', this.state.onMove);
      document.removeEventListener('touchend', this.state.onEnd);
      
      this.focus();
      this.state = null;
    }
  }

  /**
   * Start drag operation
   */
  startDrag(e: MouseEvent | TouchEvent, direction?: string): boolean {
    if (!direction) {
      const target = e.target as HTMLElement;
      direction = target.dataset.ord || 'move';
    }
    
    this.focus();
    
    // Check if dragging is disabled for this handle
    if (direction === 'move' && 
        DomUtil.hasClass(this.element, this.core.options.cssNoDrag || 'jcrop-nodrag')) {
      return false;
    }
    
    // Create drag state
    this.state = new DragState(e, this, direction);
    return false;
  }

  /**
   * Set whether selection can be selected
   */
  allowSelect(value?: boolean): this {
    if (value === undefined) value = this.canSelect;
    
    this.frame.disabled = !value || !this.canSelect;
    
    return this;
  }

  /**
   * Set whether selection can be dragged
   */
  allowDrag(value?: boolean): this {
    if (value === undefined) value = this.canDrag;
    
    const cssNoDrag = this.core.options.cssNoDrag || 'jcrop-nodrag';
    
    if (value && this.canDrag) {
      DomUtil.removeClass(this.element, cssNoDrag);
    } else {
      DomUtil.addClass(this.element, cssNoDrag);
    }
    
    return this;
  }

  /**
   * Set whether selection can be resized
   */
  allowResize(value?: boolean): this {
    if (value === undefined) value = this.canResize;
    
    const cssNoResize = this.core.options.cssNoResize || 'jcrop-noresize';
    
    if (value && this.canResize) {
      DomUtil.removeClass(this.element, cssNoResize);
    } else {
      DomUtil.addClass(this.element, cssNoResize);
    }
    
    return this;
  }

  /**
   * Remove the selection
   */
  remove(): void {
    this.element.dispatchEvent(new CustomEvent('cropremove', { detail: this }));
    DomUtil.remove(this.element);
  }

  /**
   * Move selection to back
   */
  toBack(): void {
    this.active = false;
    DomUtil.removeClass(this.element, 'jcrop-current');
    DomUtil.removeClass(this.element, 'jcrop-focus');
  }

  /**
   * Move selection to front
   */
  toFront(): void {
    this.active = true;
    DomUtil.addClass(this.element, 'jcrop-current');
    this.callFilterFunction('refresh');
    this.refresh();
  }

  /**
   * Redraw the selection at specified coordinates
   */
  redraw(rect: Rect): this {
    this.moveTo(rect.x, rect.y);
    this.resize(rect.w, rect.h);
    this.last = { ...rect };
    return this;
  }

  /**
   * Update the selection using scaled coordinates
   */
  update(rect: Rect): this {
    return this.updateRaw(this.core.scale(rect), 'se');
  }

  /**
   * Update the selection using raw coordinates
   */
  updateRaw(rect: Rect, direction: string): this {
    const filtered = this.runFilters(rect, direction);
    this.redraw(filtered);
    
    this.element.dispatchEvent(
      new CustomEvent('cropmove', { 
        detail: [this, this.core.unscale(filtered)] 
      })
    );
    
    return this;
  }

  /**
   * Animate selection to coordinates
   */
  animateTo(box: number[], callback?: () => void): void {
    const animator = new Animator(this);
    const rect = this.core.scale({
      x: box[0],
      y: box[1],
      w: box[2],
      h: box[3],
      x2: box[0] + box[2],
      y2: box[1] + box[3]
    });
    
    animator.animate(rect.x, rect.y, rect.w, rect.h, callback);
  }

  /**
   * Center the selection
   */
  center(instant: boolean = false): this {
    const b = this.get();
    const m = this.core;
    const containerWidth = m.container.offsetWidth;
    const containerHeight = m.container.offsetHeight;
    
    const box = [
      (containerWidth - b.w) / 2,
      (containerHeight - b.h) / 2,
      b.w,
      b.h
    ];
    
    if (instant) {
      this.setSelect(box);
    } else {
      this.animateTo(box);
    }
    
    return this;
  }

  /**
   * Create element for handles and borders
   */
  createElement(type: string, direction: string): HTMLElement {
    const el = DomUtil.createElement('div', {
      class: `${type} ord-${direction}`,
      'data-ord': direction
    });
    
    return el;
  }

  /**
   * Move selection to coordinates
   */
  moveTo(x: number, y: number): void {
    DomUtil.css(this.element, {
      top: `${y}px`,
      left: `${x}px`
    });
  }

  /**
   * Blur the selection
   */
  blur(): this {
    this.frame.blur();
    return this;
  }

  /**
   * Focus the selection
   */
  focus(): this {
    this.core.setSelection(this);
    this.frame.focus();
    return this;
  }

  /**
   * Resize the selection
   */
  resize(w: number, h: number): void {
    DomUtil.css(this.element, {
      width: `${w}px`,
      height: `${h}px`
    });
  }

  /**
   * Get selection coordinates
   */
  get(): Rect {
    const position = DomUtil.getPosition(this.element);
    const width = DomUtil.width(this.element);
    const height = DomUtil.height(this.element);
    
    const rect: Rect = { 
      x: position.left, 
      y: position.top,
      x2: position.left + width,
      y2: position.top + height,
      w: width,
      h: height
    };
    
    return rect;
  }

  /**
   * Set selection by coordinates
   */
  setSelect(box: number[]): this {
    if (box.length !== 4) {
      throw new Error('Coordinate array must have 4 values');
    }
    
    const rect = {
      x: box[0],
      y: box[1],
      x2: box[0] + box[2],
      y2: box[1] + box[3],
      w: box[2],
      h: box[3]
    };
    
    this.update(rect);
    return this;
  }

  /**
   * Insert handle and border elements
   */
  insertElements(): void {
    const o = this.core.options;
    
    // Add dragbars
    if (o.dragbars) {
      for (const dir of o.dragbars) {
        this.element.appendChild(
          this.createElement(o.cssDragBars || 'jcrop-dragbar jcrop-drag', dir)
        );
      }
    }
    
    // Add handles
    if (o.handles) {
      for (const dir of o.handles) {
        this.element.appendChild(
          this.createElement(o.cssHandles || 'jcrop-handle jcrop-drag', dir)
        );
      }
    }
    
    // Add borders
    if (o.borders) {
      for (const dir of o.borders) {
        this.element.appendChild(
          this.createElement(o.cssBorders || 'jcrop-border', dir)
        );
      }
    }
  }
}