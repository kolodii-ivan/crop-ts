import '../static';
import { Jcrop } from '../plugin';

/**
 * Move out-of-bounds selection into allowed position at same size.
 */
export default class BackoffFilter {
  tag = 'backoff';
  priority = 22;
  core: any;
  elw = 0;
  elh = 0;
  bound: { minx: number; miny: number; maxx: number; maxy: number } = { minx: 0, miny: 0, maxx: 0, maxy: 0 };

  /** Enforce bounds after scaling */
  refresh(sel: any): void {
    this.elw = sel.core.container.clientWidth;
    this.elh = sel.core.container.clientHeight;
    this.bound = {
      minx: sel.edge.w,
      miny: sel.edge.n,
      maxx: this.elw + sel.edge.e,
      maxy: this.elh + sel.edge.s
    };
  }

  /** Move box back into bounds */
  filter(b: any): any {
    const r = this.bound;
    if (b.x < r.minx) { b.x = r.minx; b.x2 = b.w + b.x; }
    if (b.y < r.miny) { b.y = r.miny; b.y2 = b.h + b.y; }
    if (b.x2 > r.maxx) { b.x2 = r.maxx; b.x = b.x2 - b.w; }
    if (b.y2 > r.maxy) { b.y2 = r.maxy; b.y = b.y2 - b.h; }
    return b;
  }
}

// Register filter
(Jcrop as any).registerFilter('backoff', BackoffFilter);