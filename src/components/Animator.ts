/**
 * Handles animation of selections
 */
export class Animator {
  private selection: any;
  private core: any;

  /**
   * Create a new Animator
   */
  constructor(selection: any) {
    this.selection = selection;
    this.core = selection.core;
  }

  /**
   * Animate a selection to new coordinates
   */
  animate(x: number, y: number, w: number, h: number, callback?: () => void): void {
    if (!this.core.options.animation) {
      // If animation is disabled, update selection immediately
      this.selection.updateRaw({
        x,
        y,
        x2: x + w,
        y2: y + h,
        w,
        h
      }, 'se');
      
      if (typeof callback === 'function') {
        callback();
      }
      return;
    }
    
    // Get current coordinates
    const current = this.selection.get();
    
    // Animation settings
    const duration = this.core.options.animDuration || 400;
    const startTime = performance.now();
    
    // Animation step function
    const step = (timestamp: number) => {
      // Calculate progress (0 to 1)
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate interpolated values
      const newX = current.x + (x - current.x) * progress;
      const newY = current.y + (y - current.y) * progress;
      const newW = current.w + (w - current.w) * progress;
      const newH = current.h + (h - current.h) * progress;
      
      // Update selection
      this.selection.updateRaw({
        x: newX,
        y: newY,
        x2: newX + newW,
        y2: newY + newH,
        w: newW,
        h: newH
      }, 'se');
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (typeof callback === 'function') {
        callback();
      }
    };
    
    // Start animation
    requestAnimationFrame(step);
  }
}