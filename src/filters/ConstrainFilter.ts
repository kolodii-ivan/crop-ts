import { Rect } from '../types';
import { registerFilter } from './registry';

/**
 * Constrains selection to the stage boundaries
 */
export class ConstrainFilter {
  public priority = 10;
  public core: any;
  public tag = 'constrain';

  /**
   * Initialize filter
   */
  init(): void {
    // Nothing to initialize
  }

  /**
   * Apply the filter
   */
  filter(rect: Rect, direction: string): Rect {
    const containerWidth = this.core.container.offsetWidth;
    const containerHeight = this.core.container.offsetHeight;
    
    // Make a copy of the rect
    const result: Rect = { ...rect };
    
    // Constrain to container bounds
    if (result.x < 0) result.x = 0;
    if (result.y < 0) result.y = 0;
    if (result.x2 > containerWidth) result.x2 = containerWidth;
    if (result.y2 > containerHeight) result.y2 = containerHeight;
    
    // Recalculate width and height
    result.w = result.x2 - result.x;
    result.h = result.y2 - result.y;
    
    return result;
  }
}

// Register the filter
registerFilter('constrain', ConstrainFilter);