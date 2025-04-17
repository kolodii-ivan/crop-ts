import { extend, addClass, trigger, data, on, off } from './util';

/**
 * Core Jcrop class (constructor and static members attached via static.ts)
 */
export class Jcrop {
  opt: any;
  container: HTMLElement;
  ui: any;
  state: any;
  filter: any;
  // Core event manager instance
  event: any;

  constructor(element: HTMLElement, opt?: any) {
    const _ua = navigator.userAgent.toLowerCase();

    // Merge defaults and user options
    this.opt = extend({}, (Jcrop as any).defaults || {}, opt || {});

    // Element container
    this.container = element;

    this.opt.is_msie = /msie/.test(_ua);
    this.opt.is_ie_lt9 = /msie [1-8]\./.test(_ua);

    // Add active CSS class
    addClass(this.container, this.opt.css_container);

    // Initialize UI state
    this.ui = {};
    this.state = null;
    this.ui.multi = [];
    this.ui.selection = null;
    this.filter = {};

    // Initialize components and settings
    this.init();
    this.setOptions(opt);
    this.applySizeConstraints();
    // Emit 'cropinit' event
    trigger(this.container, 'cropinit', this);

    // For legacy IE
    if (this.opt.is_ie_lt9) {
      this.opt.dragEventTarget = document.body;
    }
  }

  /** Initialize components and events */
  init(): void {
    this.event = new this.opt.eventManagerComponent(this);
    this.ui.keyboard = new this.opt.keyboardComponent(this);
    this.ui.manager = new this.opt.stagemanagerComponent(this);
    this.applyFilters();
    if ((Jcrop as any).supportsTouch) {
      new (Jcrop as any).component.Touch(this);
    }
    this.initEvents();
  }

  /** Enforce image and container size constraints */
  applySizeConstraints(): void {
    const o = this.opt;
    const img = o.imgsrc as HTMLImageElement;
    if (img) {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const bw = o.boxWidth || iw;
      const bh = o.boxHeight || ih;
      if ((iw > bw) || (ih > bh)) {
        const bx = (Jcrop as any).getLargestBox(iw / ih, bw, bh) as [number, number];
        img.width = bx[0];
        img.height = bx[1];
        this.resizeContainer(bx[0], bx[1]);
        this.opt.xscale = iw / bx[0];
        this.opt.yscale = ih / bx[1];
      }
    }
    if (this.opt.trueSize) {
      const dw = this.opt.trueSize[0];
      const dh = this.opt.trueSize[1];
      const cs = this.getContainerSize();
      this.opt.xscale = dw / cs[0];
      this.opt.yscale = dh / cs[1];
    }
  }

  /** Initialize a component by name */
  initComponent(name: string, ...args: any[]): any {
    const Comp = (Jcrop as any).component[name];
    if (Comp) {
      const obj = new Comp();
      obj.init(this, ...args);
      return obj;
    }
  }

  /** Update options and handle setSelect */
  setOptions(opt: any = {}, proptype?: any): this {
    if (opt === null || typeof opt !== 'object') {
      opt = {};
    }
    extend(this.opt, opt);
    if (this.opt.setSelect) {
      if (!this.ui.multi.length) {
        this.newSelection();
      }
      this.setSelect(this.opt.setSelect);
      this.opt.setSelect = null;
    }
    this.event.trigger('configupdate');
    return this;
  }

  /** Remove Jcrop and restore original image */
  destroy(): void {
    const img = this.opt.imgsrc as HTMLImageElement;
    if (img) {
      if (img.parentElement) {
        img.parentElement.insertBefore(img, this.container);
      }
      this.container.remove();
      data(img, 'Jcrop', null);
      img.style.display = '';
    } else {
      this.container.remove();
    }
  }
  
  /** Blur current selection */
  // blur the current selection
  blur(): this {
    this.ui.selection.blur();
    return this;
  }

  /** Focus current selection */
  // focus the current selection
  focus(): this {
    this.ui.selection.focus();
    return this;
  }

  /** Set up event handlers */
  initEvents(): void {
    // Prevent text selection
    on(this.container, 'selectstart', (e: Event) => { e.preventDefault(); });
    // Delegate mousedown on drag handles
    on(this.container, 'mousedown', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const handle = target.closest('.' + this.opt.css_drag) as HTMLElement;
      if (!handle) return;
      e.preventDefault();
      e.stopPropagation();
      this.startDrag()(e);
    });
  }

  /** Select the entire image */
  maxSelect(): this {
    const [w, h] = this.getContainerSize();
    this.setSelect([0, 0, w, h]);
    return this;
  }

  /** Nudge current selection by (x,y) */
  nudge(x: number, y: number): this {
    const s = this.ui.selection;
    const b = s.get();
    b.x += x; b.x2 += x; b.y += y; b.y2 += y;
    const [cw, ch] = this.getContainerSize();
    if (b.x < 0) { b.x2 = b.w; b.x = 0; }
    else if (b.x2 > cw) { b.x2 = cw; b.x = b.x2 - b.w; }
    if (b.y < 0) { b.y2 = b.h; b.y = 0; }
    else if (b.y2 > ch) { b.y2 = ch; b.y = b.y2 - b.h; }
    trigger(s.element, 'cropstart', [s, this.unscale(b)]);
    s.updateRaw(b, 'move');
    trigger(s.element, 'cropend', [s, this.unscale(b)]);
    return this;
  }

  /** Refresh all selections */
  refresh(): this {
    (this.ui.multi as any[]).forEach(s => s.refresh());
    return this;
  }

  /** Send all selections to back */
  blurAll(): this {
    (this.ui.multi as any[]).forEach(s => s.toBack());
    return this;
  }

  /** Scale selection coords by inverse of xscale/yscale */
  scale(b: any): any {
    const xs = this.opt.xscale, ys = this.opt.yscale;
    return { x: b.x / xs, y: b.y / ys, x2: b.x2 / xs, y2: b.y2 / ys, w: b.w / xs, h: b.h / ys };
  }

  /** Scale selection coords by xscale/yscale */
  unscale(b: any): any {
    const xs = this.opt.xscale, ys = this.opt.yscale;
    return { x: b.x * xs, y: b.y * ys, x2: b.x2 * xs, y2: b.y2 * ys, w: b.w * xs, h: b.h * ys };
  }

  /** Conditionally delete selection */
  requestDelete(): any {
    if ((this.ui.multi as any[]).length > 1 && this.ui.selection.canDelete) {
      return this.deleteSelection();
    }
  }

  /** Delete the current selection */
  deleteSelection(): this {
    if (this.ui.selection) {
      this.removeSelection(this.ui.selection);
      if ((this.ui.multi as any[]).length) {
        (this.ui.multi as any[])[0].focus();
      }
      this.ui.selection.refresh();
    }
    return this;
  }

  /** Animate selection to a given box */
  animateTo(box: any): this {
    if (this.ui.selection) this.ui.selection.animateTo(box);
    return this;
  }

  /** Set selection from [x,y,w,h] */
  setSelect(box: [number, number, number, number]): this {
    if (this.ui.selection) {
      this.ui.selection.update((Jcrop as any).wrapFromXywh(box));
    }
    return this;
  }

  /** Handle drag start event */
  startDrag(): (e: MouseEvent) => boolean {
    return (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const selEl = target.closest('.' + this.opt.css_selection) as HTMLElement;
      if (!selEl) return true;
      const selection = data(selEl, 'selection');
      const ord = data(target, 'ord');
      trigger(this.container, 'cropstart', [selection, this.unscale(selection.get())]);
      selection.startDrag(e, ord);
      e.preventDefault(); e.stopPropagation();
      return false;
    };
  }

  /** Get container [width,height] */
  getContainerSize(): [number, number] {
    return [this.container.clientWidth, this.container.clientHeight];
  }

  /** Resize container and refresh */
  resizeContainer(w: number, h: number): this {
    this.container.style.width = w + 'px';
    this.container.style.height = h + 'px';
    return this.refresh();
  }

  /** Change the source image */
  setImage(src: string, cb?: (w: number, h: number) => void): boolean {
    const targ = this.opt.imgsrc as HTMLImageElement;
    if (!targ) return false;
    new (Jcrop as any).component.ImageLoader(src, null, (w: number, h: number) => {
      this.resizeContainer(w, h);
      targ.src = src;
      targ.width = w; targ.height = h;
      this.applySizeConstraints();
      this.refresh();
      trigger(this.container, 'cropimage', [this, targ]);
      if (cb) cb.call(this, w, h);
    });
    return true;
  }

  /** Update selection bounding box */
  update(b: any): this {
    if (this.ui.selection) this.ui.selection.update(b);
    return this;
  }

  /** Apply all configured filters */
  applyFilters(): void {
    this.opt.applyFilters.forEach((fname: string) => {
      const Filter = (Jcrop as any).filter[fname];
      if (Filter) {
        const obj = new Filter();
        obj.core = this;
        if (obj.init) obj.init();
        this.filter[fname] = obj;
      }
    });
  }

  /** Return active filters ordered by priority */
  getDefaultFilters(): any[] {
    const rv: any[] = [];
    this.opt.applyFilters.forEach((fname: string) => {
      if (this.filter[fname]) rv.push(this.filter[fname]);
    });
    rv.sort((a, b) => a.priority - b.priority);
    return rv;
  }

  /** Bring a selection to front */
  setSelection(sel: any): any {
    const m = this.ui.multi as any[];
    const n: any[] = [];
    m.forEach((s: any) => { s.toBack(); if (s !== sel) n.push(s); });
    n.unshift(sel);
    this.ui.multi = n;
    this.ui.selection = sel;
    sel.toFront();
    return sel;
  }

  /** Get current selection box */
  getSelection(raw?: boolean): any {
    return this.ui.selection ? this.ui.selection.get() : null;
  }

  /** Create a new selection */
  newSelection(sel?: any): any {
    const obj = sel || new this.opt.selectionComponent();
    obj.init(this);
    this.setSelection(obj);
    return obj;
  }

  /** Check if a selection exists */
  hasSelection(sel: any): boolean {
    return this.ui.multi.includes(sel);
  }

  /** Remove and destroy a selection */
  removeSelection(sel: any): any[] {
    const m = this.ui.multi as any[];
    this.ui.multi = m.filter((s: any) => {
      if (s === sel) s.remove();
      return s !== sel;
    });
    return this.ui.multi;
  }

  /** Add a filter to current selections */
  addFilter(filter: any): this {
    this.ui.multi.forEach((s: any) => s.addFilter(filter));
    return this;
  }

  /** Remove a filter from current selections */
  removeFilter(filter: any): this {
    this.ui.multi.forEach((s: any) => s.removeFilter(filter));
    return this;
  }

}