import '../static';
import { Jcrop } from '../constructor';
import { extend, on, off, trigger, addClass, removeClass } from '../util';

/**
 * StageDrag
 * Handles creating new selection by dragging on stage.
 */
export default class StageDrag {
  manager: any;
  core: any;
  offset: [number, number];
  active: boolean;
  minsize: [number, number];
  static defaults = {
    offset: [-8, -8],
    active: true,
    minsize: [20, 20]
  };

  constructor(manager: any, opt?: any) {
    extend(this, (StageDrag as any).defaults, opt || {});
    this.manager = manager;
    this.core = manager.core;
  }

  /** Start a drag operation to create a new selection */
  start(e: MouseEvent): any {
    const c = this.core;
    if (!c.opt.allowSelect) return;
    if (c.opt.multi && c.opt.multiMax && c.ui.multi.length >= c.opt.multiMax) return false;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const origx = e.pageX - (rect.left + window.scrollX) + this.offset[0];
    const origy = e.pageY - (rect.top + window.scrollY) + this.offset[1];
    if (!c.opt.multi) {
      if (c.opt.multiCleanup) {
        c.ui.multi.forEach((sel: any) => sel.remove());
        c.ui.multi = [];
      } else {
        c.removeSelection(c.ui.selection);
      }
    }
    addClass(c.container,'jcrop-dragging');
    const sel = c.newSelection()
      .updateRaw((Jcrop as any).wrapFromXywh([origx, origy, 1, 1]));
    trigger(sel.element, 'cropstart', [sel, c.unscale(sel.get())]);
    return sel.startDrag(e, 'se');
  }

  /** End the drag operation (cleanup) */
  end(x: number, y: number): void {
    const sel = this.manager.core.ui.selection;
    const b = sel.get();
    removeClass(this.core.container, 'jcrop-dragging');
    if (b.w < this.minsize[0] || b.h < this.minsize[1]) {
      this.core.requestDelete();
    } else {
      sel.focus();
    }
  }
}

// Register component
(Jcrop as any).registerComponent('StageDrag', StageDrag);