import '../static';
import { Jcrop } from '../constructor';

/**
 * Snap selection edges to a grid of given step sizes.
 */
export default class GridFilter {
  tag = 'grid';
  priority = 19;
  core: any;
  stepx = 1;
  stepy = 1;

  /** Round box coordinates to nearest grid line */
  filter(b: any): any {
    const n: any = {
      x: Math.round(b.x / this.stepx) * this.stepx,
      y: Math.round(b.y / this.stepy) * this.stepy,
      x2: Math.round(b.x2 / this.stepx) * this.stepx,
      y2: Math.round(b.y2 / this.stepy) * this.stepy
    };
    n.w = n.x2 - n.x;
    n.h = n.y2 - n.y;
    return n;
  }
}

// Register filter
(Jcrop as any).registerFilter('grid', GridFilter);