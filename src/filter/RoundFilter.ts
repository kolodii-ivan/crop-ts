import '../static';
import { Jcrop } from '../constructor';

/**
 * Rounds selection coordinates to integer pixel values.
 */
export default class RoundFilter {
  tag = 'round';
  priority = 90;

  /** Round all box edges to nearest integer */
  filter(b: any): any {
    const n: any = {
      x: Math.round(b.x),
      y: Math.round(b.y),
      x2: Math.round(b.x2),
      y2: Math.round(b.y2)
    };
    n.w = n.x2 - n.x;
    n.h = n.y2 - n.y;
    return n;
  }
}

// Register filter
(Jcrop as any).registerFilter('round', RoundFilter);