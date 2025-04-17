import '../static';
import { Jcrop } from '../constructor';

/**
 * Enforce a fixed aspect ratio on selections.
 */
export default class RatioFilter {
  tag = 'ratio';
  priority = 15;
  core: any;
  ratio = 0;
  elw = 0;
  elh = 0;

  private offsetFromCorner(corner: string, box: [number, number], b: any): [number, number, number, number] {
    const [w, h] = box;
    switch (corner) {
      case 'bl': return [b.x2 - w, b.y, w, h];
      case 'tl': return [b.x2 - w, b.y2 - h, w, h];
      case 'br': return [b.x, b.y, w, h];
      case 'tr': return [b.x, b.y2 - h, w, h];
    }
    return [b.x, b.y, w, h];
  }

  private getQuadrant(s: any): string {
    const relx = s.opposite[0] - s.offsetx;
    const rely = s.opposite[1] - s.offsety;
    if (relx < 0 && rely < 0) return 'br';
    if (relx >= 0 && rely >= 0) return 'tl';
    if (relx < 0 && rely >= 0) return 'tr';
    return 'bl';
  }

  /** Calculate largest box that fits ratio */
  filter(b: any, ord: string, sel: any): any {
    if (!this.ratio) return b;
    if (ord === 'move') return b;
    // Possibly adjust edges for cardinal drags
    switch (ord) {
      case 'n': b.x2 = this.elw; b.w = b.x2 - b.x; break;
      case 's': b.x2 = this.elw; b.w = b.x2 - b.x; break;
      case 'e': b.y2 = this.elh; b.h = b.y2 - b.y; break;
      case 'w': b.y2 = this.elh; b.h = b.y2 - b.y; break;
    }
    const quad = sel.state ? this.getQuadrant(sel.state) : 'br';
    // Constrain to ratio
    const box = (Jcrop as any).getLargestBox(this.ratio, b.w, b.h);
    return (Jcrop as any).wrapFromXywh(this.offsetFromCorner(quad, box, b));
  }

  /** Refresh based on selection config */
  refresh(sel: any): void {
    this.ratio = sel.aspectRatio;
    this.elw = sel.core.container.clientWidth;
    this.elh = sel.core.container.clientHeight;
  }
}

// Register filter
(Jcrop as any).registerFilter('ratio', RatioFilter);