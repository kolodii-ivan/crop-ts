import '../static';
import { Jcrop } from '../plugin';

/**
 * Implements minimum/maximum selection size constraints.
 */
export default class ExtentFilter {
  tag = 'extent';
  priority = 12;
  core: any;
  elw = 0;
  elh = 0;
  limits: { minw: number; minh: number; maxw: number; maxh: number } = { minw: 0, minh: 0, maxw: 0, maxh: 0 };

  /** Calculate new box coordinates based on corner alignments */
  private offsetFromCorner(corner: string, [w, h]: [number, number], b: any): [number, number, number, number] {
    switch (corner) {
      case 'bl': return [b.x2 - w, b.y, w, h];
      case 'tl': return [b.x2 - w, b.y2 - h, w, h];
      case 'br': return [b.x, b.y, w, h];
      case 'tr': return [b.x, b.y2 - h, w, h];
    }
    return [b.x, b.y, w, h];
  }

  /** Determine drag quadrant from DragState */
  private getQuadrant(s: any): string {
    const relx = s.opposite[0] - s.offsetx;
    const rely = s.opposite[1] - s.offsety;
    if (relx < 0 && rely < 0) return 'br';
    if (relx >= 0 && rely >= 0) return 'tl';
    if (relx < 0 && rely >= 0) return 'tr';
    return 'bl';
  }

  /** Apply min/max size when not moving */
  filter(b: any, ord: string, sel: any): any {
    if (ord === 'move' || !ord) return b;
    let w = b.w, h = b.h;
    const quad = sel.state ? this.getQuadrant(sel.state) : 'br';
    const r = this.limits;
    if (r.minw && w < r.minw) w = r.minw;
    if (r.minh && h < r.minh) h = r.minh;
    if (r.maxw && w > r.maxw) w = r.maxw;
    if (r.maxh && h > r.maxh) h = r.maxh;
    if (w === b.w && h === b.h) return b;
    return (Jcrop as any).wrapFromXywh(this.offsetFromCorner(quad, [w, h], b));
  }

  /** Store current limits from selection config */
  refresh(sel: any): void {
    this.limits = {
      minw: sel.minSize[0],
      minh: sel.minSize[1],
      maxw: sel.maxSize[0],
      maxh: sel.maxSize[1]
    };
    this.elw = sel.core.container.clientWidth;
    this.elh = sel.core.container.clientHeight;
  }
}

// Register filter
(Jcrop as any).registerFilter('extent', ExtentFilter);