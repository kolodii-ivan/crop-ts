import '../static';
import { Jcrop } from '../constructor';
import { on, off, trigger, data } from '../util';

/**
 * Manages a dragging interaction on a selection handle.
 */
export class DragState {
  core: any;
  x: number;
  y: number;
  selection: any;
  eventTarget: Element;
  orig: any;
  elx: number;
  ely: number;
  offsetx: number;
  offsety: number;
  ord: string;
  opposite: [number, number];

  constructor(e: MouseEvent, selection: any, ord: string) {
    const t = this;
    t.core = selection.core;
    t.x = e.pageX;
    t.y = e.pageY;
    t.selection = selection;
    t.eventTarget = t.core.opt.dragEventTarget;
    t.orig = selection.get();
    selection.callFilterFunction('refresh');
    const rect = t.core.container.getBoundingClientRect();
    t.elx = rect.left + window.scrollX;
    t.ely = rect.top + window.scrollY;
    t.offsetx = 0;
    t.offsety = 0;
    t.ord = ord;
    t.opposite = t.getOppositeCornerOffset();
    t.initEvents();
  }

  private getOppositeCornerOffset(): [number, number] {
    const o = this.orig;
    const relx = this.x - this.elx - o.x;
    const rely = this.y - this.ely - o.y;
    switch (this.ord) {
      case 'nw': case 'w':
        return [o.w - relx, o.h - rely];
      case 'sw':
        return [o.w - relx, -rely];
      case 'se': case 's': case 'e':
        return [-relx, -rely];
      case 'ne': case 'n':
        return [-relx, o.h - rely];
    }
    return [0, 0];
  }

  private initEvents(): void {
    on(this.eventTarget, 'mousemove', this.createDragHandler());
    on(this.eventTarget, 'mouseup', this.createStopHandler());
  }

  private dragEvent(e: MouseEvent): void {
    this.offsetx = e.pageX - this.x;
    this.offsety = e.pageY - this.y;
    this.selection.updateRaw(this.getBox(), this.ord);
  }

  private endDragEvent(e: MouseEvent): void {
    this.selection.core.container.classList.remove('jcrop-dragging');
    // Trigger cropend with selection and its unscaled bounds
    trigger(
      this.selection.element,
      'cropend',
      [ this.selection, this.selection.core.unscale(this.selection.get()) ]
    );
    this.selection.focus();
  }

  private createStopHandler(): (e: MouseEvent) => boolean {
    return (e: MouseEvent) => {
      off(this.eventTarget, 'mousemove');
      off(this.eventTarget, 'mouseup');
      this.endDragEvent(e);
      return false;
    };
  }

  private createDragHandler(): (e: MouseEvent) => boolean {
    return (e: MouseEvent) => {
      this.dragEvent(e);
      return false;
    };
  }

  /** Move internal offsets */
  update(x: number, y: number): void {
    this.offsetx = x - this.x;
    this.offsety = y - this.y;
  }

  /** Create normalized bounding box from two corners */
  private resultWrap(d: [number, number, number, number]): any {
    const b: any = {
      x: Math.min(d[0], d[2]),
      y: Math.min(d[1], d[3]),
      x2: Math.max(d[0], d[2]),
      y2: Math.max(d[1], d[3])
    };
    b.w = b.x2 - b.x;
    b.h = b.y2 - b.y;
    return b;
  }

  /** Compute box based on handle order */
  private getBox(): any {
    const o = this.orig;
    const _c: any = { x2: o.x + o.w, y2: o.y + o.h };
    switch (this.ord) {
      case 'n': return this.resultWrap([o.x, this.offsety + o.y, _c.x2, _c.y2]);
      case 's': return this.resultWrap([o.x, o.y, _c.x2, this.offsety + _c.y2]);
      case 'e': return this.resultWrap([o.x, o.y, this.offsetx + _c.x2, _c.y2]);
      case 'w': return this.resultWrap([o.x + this.offsetx, o.y, _c.x2, _c.y2]);
      case 'sw': return this.resultWrap([o.x + this.offsetx, o.y, _c.x2, this.offsety + _c.y2]);
      case 'se': return this.resultWrap([o.x, o.y, this.offsetx + _c.x2, this.offsety + _c.y2]);
      case 'ne': return this.resultWrap([o.x, this.offsety + o.y, this.offsetx + _c.x2, _c.y2]);
      case 'nw': return this.resultWrap([o.x + this.offsetx, o.y + this.offsety, _c.x2, _c.y2]);
      case 'move':
        const nx = o.x + this.offsetx;
        const ny = o.y + this.offsety;
        return this.resultWrap([nx, ny, nx + o.w, ny + o.h]);
    }
    return this.resultWrap([o.x, o.y, _c.x2, _c.y2]);
  }
}

// Register component
(Jcrop as any).registerComponent('DragState', DragState);