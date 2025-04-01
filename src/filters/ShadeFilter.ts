import { Rect } from '../types';
import { registerFilter } from './registry';

/**
 * Updates shades when selection changes
 */
export class ShadeFilter {
  public priority = 100; // Run last
  public core: any;
  public tag = 'shader';

  /**
   * Initialize filter
   */
  init(): void {
    // Nothing to initialize
  }

  /**
   * Apply the filter
   */
  filter(rect: Rect): Rect {
    // Update shades if stage manager exists
    if (this.core.ui.manager) {
      this.core.ui.manager.update(rect);
    }
    
    return rect;
  }

  /**
   * Refresh method called when selection is refreshed
   */
  refresh(selection: any): void {
    if (selection.active && this.core.ui.manager) {
      // Show shades for active selection
      this.core.ui.manager.showShades();
      
      // Update shade positions
      this.core.ui.manager.update(selection.get());
    }
  }
}

// Register the filter
registerFilter('shader', ShadeFilter);