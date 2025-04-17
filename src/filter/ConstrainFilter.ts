import '../static';
import { Jcrop } from '../constructor';

/**
 * Constrains crop selection within the bounding container.
 */
export default class ConstrainFilter {
  tag = 'constrain';
  priority = 5;
  core: any;
  elw = 0;
  elh = 0;
  minx = 0;
  miny = 0;
  maxx = 0;
  maxy = 0;

  /** Setup boundaries from selection settings */
  refresh(sel: any): void {
    this.elw = sel.core.container.clientWidth;
    this.elh = sel.core.container.clientHeight;
    this.minx = sel.edge.w;
    this.miny = sel.edge.n;
    this.maxx = this.elw + sel.edge.e;
    this.maxy = this.elh + sel.edge.s;
  }

  /** Adjust box to remain within bounds */
  filter(b: any, ord: string): any {
    if (ord === 'move') {
      if (b.x < this.minx) { b.x = this.minx; b.x2 = b.x + b.w; }
      if (b.y < this.miny) { b.y = this.miny; b.y2 = b.y + b.h; }
      if (b.x2 > this.maxx) { b.x2 = this.maxx; b.x = b.x2 - b.w; }
      if (b.y2 > this.maxy) { b.y2 = this.maxy; b.y = b.y2 - b.h; }
    } else {
      if (b.x < this.minx) { b.x = this.minx; }
      if (b.y < this.miny) { b.y = this.miny; }
      if (b.x2 > this.maxx) { b.x2 = this.maxx; }
      if (b.y2 > this.maxy) { b.y2 = this.maxy; }
    }
    b.w = b.x2 - b.x;
    b.h = b.y2 - b.y;
    return b;
  }
}

// Register filter
(Jcrop as any).registerFilter('constrain', ConstrainFilter);