import '../static';
import '../defaults';
import { Jcrop } from '../constructor';
import { addClass, removeClass, extend, on, off, trigger, data } from '../util';

/**
 * Selection
 * Built-in selection object
 */
export default class Selection {
  core: any;
  element!: HTMLElement;
  frame!: HTMLButtonElement;
  filter: any[] = [];
  propagateProps: string[] = [
    'canDelete', 'canDrag', 'canResize', 'canSelect',
    'minSize', 'maxSize', 'aspectRatio', 'edge'
  ];
  // Selection state
  state: any;
  linked!: boolean;
  canDelete!: boolean;
  canDrag!: boolean;
  canResize!: boolean;
  canSelect!: boolean;
  minSize!: [number, number];
  maxSize!: [number, number];
  aspectRatio!: number;
  edge!: any;
  // defaults are merged via extend

  constructor() {
    // initialization in init()
  }

  init(core: any): void {
    this.core = core;
    this.startup();
    this.linked = core.opt.linked;
    this.attach();
    this.setOptions(core.opt);
    trigger(core.container, 'cropcreate', this);
  }

  attach(): void {
    this.initComponent();
  }
  
  /** Initialize child components if needed */
  initComponent(...args: any[]): any {
    // no-op; can be overridden
  }

  private startup(): void {
    const o = this.core.opt;
    extend(this, (Selection as any).defaults);
    this.filter = this.core.getDefaultFilters();

    // Create selection container
    this.element = document.createElement('div');
    addClass(this.element, o.css_selection);
    data(this.element, 'selection', this);

    // Create handle button/frame
    this.frame = document.createElement('button');
    this.frame.type = 'button';
    addClass(this.frame, o.css_button);
    data(this.frame, 'ord', 'move');
    this.element.appendChild(this.frame);
    this.core.container.appendChild(this.element);

    // IE6-8 background hack
    if (this.core.opt.is_msie) {
      (this.frame.style as any).opacity = '0';
      (this.frame.style as any).backgroundColor = 'white';
    }

    this.insertElements();

    // Focus/blur events
    on(this.frame, 'focus', () => {
      this.core.setSelection(this);
      trigger(this.element, 'cropfocus', this);
      addClass(this.element, 'jcrop-focus');
    });
    on(this.frame, 'blur', () => {
      removeClass(this.element, 'jcrop-focus');
      trigger(this.element, 'cropblur', this);
    });
  }

  private insertElements(): void {
    // Create handles/borders/dragbars (omitted for brevity)
  }

  setOptions(opt: any): this {
    (Jcrop as any).propagate(this.propagateProps, opt, this);
    this.refresh();
    return this;
  }

  refresh(): this {
    this.allowResize();
    this.allowDrag();
    this.allowSelect();
    this.callFilterFunction('refresh');
    this.updateRaw(this.get(), 'se');
    return this;
  }

  private callFilterFunction(fn: string): void {
    this.filter.forEach(f => {
      if (typeof f[fn] === 'function') f[fn](this);
    });
  }

  addFilter(filter: any): this {
    filter.core = this.core;
    if (!this.hasFilter(filter)) {
      this.filter.push(filter);
      this.filter.sort((a, b) => a.priority - b.priority);
      if (filter.init) filter.init();
      this.refresh();
    }
    return this;
  }

  hasFilter(filter: any): boolean {
    return this.filter.includes(filter);
  }

  clearFilters(): this {
    this.filter.forEach(f => { if (f.destroy) f.destroy(); });
    this.filter = [];
    return this;
  }

  removeFilter(tag: any): this {
    this.filter = this.filter.filter(f => {
      if ((f.tag && f.tag === tag) || (f === tag)) {
        if (f.destroy) f.destroy();
        return false;
      }
      return true;
    });
    return this;
  }

  runFilters(b: any, ord: string): any {
    return this.filter.reduce((box, f) => f.filter(box, ord, this), b);
  }

  endDrag(): void {
    if (this.state) {
      off(this.core.opt.dragEventTarget as any, 'mousemove');
      off(this.core.opt.dragEventTarget as any, 'mouseup');
      this.focus();
      this.state = null;
    }
  }

  startDrag(e: MouseEvent, ord?: string): boolean {
    ord = ord || data(e.target as Element, 'ord');
    this.focus();
    if (ord === 'move' && this.element.classList.contains(this.core.opt.css_nodrag)) {
      return false;
    }
    this.state = new (Jcrop as any).component.DragState(e, this, ord);
    return false;
  }

  allowSelect(v: boolean = this.canSelect): this {
    this.frame.disabled = !(v && this.canSelect);
    return this;
  }

  allowDrag(v: boolean = this.canDrag): this {
    const cls = this.core.opt.css_nodrag;
    if (v && this.canDrag) removeClass(this.element, cls);
    else addClass(this.element, cls);
    return this;
  }

  allowResize(v: boolean = this.canResize): this {
    const cls = this.core.opt.css_noresize;
    if (v && this.canResize) removeClass(this.element, cls);
    else addClass(this.element, cls);
    return this;
  }

  get(): any {
    const rect = this.element.getBoundingClientRect();
    return { x: rect.left, y: rect.top, x2: rect.right, y2: rect.bottom, w: rect.width, h: rect.height };
  }

  updateRaw(b: any, ord: string): this {
    this.element.style.left = b.x + 'px';
    this.element.style.top = b.y + 'px';
    this.element.style.width = b.w + 'px';
    this.element.style.height = b.h + 'px';
    this.callFilterFunction('update');
    return this;
  }

  focus(): this {
    this.frame.focus();
    return this;
  }

  blur(): this {
    this.frame.blur();
    return this;
  }

  remove(): void {
    this.element.remove();
  }
}

// Default settings reference (populated in defaults.ts)
(Selection as any).defaults = (Jcrop as any).defaults;

// Register component
(Jcrop as any).registerComponent('Selection', Selection);