import { Rect } from '../types';
import { registerFilter } from './registry';

/**
 * Enforces aspect ratio constraints on selections
 */
export class RatioFilter {
  public priority = 20;
  public core: any;
  public tag = 'ratio';

  /**
   * Initialize filter
   */
  init(): void {
    // Nothing to initialize
  }

  /**
   * Apply the filter
   */
  filter(rect: Rect, direction: string, selection: any): Rect {
    // Skip if no aspect ratio is set
    if (!selection.aspectRatio) return rect;
    
    // Make a copy of the rect
    const result: Rect = { ...rect };
    
    // Get required ratio
    const ratio = selection.aspectRatio;
    
    // Calculate target dimensions based on ratio
    let newW = result.w;
    let newH = result.h;
    
    // Determine which dimension to adjust based on drag direction
    if (direction === 'n' || direction === 's') {
      // Adjust width to match height
      newW = newH * ratio;
    } else if (direction === 'e' || direction === 'w') {
      // Adjust height to match width
      newH = newW / ratio;
    } else {
      // For corners or move, decide based on the larger dimension
      if (newW / newH > ratio) {
        // Width is too large
        newW = newH * ratio;
      } else {
        // Height is too large
        newH = newW / ratio;
      }
    }
    
    // Apply new dimensions while preserving the anchor point
    // Anchor point depends on the drag direction
    
    if (direction === 'n' || direction === 'nw' || direction === 'ne') {
      // North anchor is at bottom
      result.y = result.y2 - newH;
    }
    
    if (direction === 'w' || direction === 'nw' || direction === 'sw') {
      // West anchor is at right
      result.x = result.x2 - newW;
    }
    
    // Update dimensions
    result.w = newW;
    result.h = newH;
    result.x2 = result.x + newW;
    result.y2 = result.y + newH;
    
    return result;
  }
}

// Register the filter
registerFilter('ratio', RatioFilter);