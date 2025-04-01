/**
 * Touch support for mobile devices
 */
export class Touch {
  private core: any;

  /**
   * Create a new Touch handler
   */
  constructor(core: any) {
    this.core = core;
    this.init();
  }

  /**
   * Initialize touch handlers
   */
  init(): void {
    // Add touch-specific class to container
    this.core.container.classList.add('jcrop-touch');
    
    // Prevent default touchmove behavior (scrolling)
    this.core.container.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();
    }, { passive: false });
    
    // Prevent contextmenu on long-press
    this.core.container.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault();
      return false;
    });
    
    // Handle tap events to create selections if none exist
    this.core.container.addEventListener('touchstart', this.onTouchStart.bind(this));
  }

  /**
   * Handle touch start event
   */
  onTouchStart(e: TouchEvent): void {
    // If we have no selections and tap is not on a handle/control element
    if (this.core.ui.multi.length === 0 && 
        !(e.target as HTMLElement).classList.contains(this.core.options.cssDrag || 'jcrop-drag')) {
      
      // Only handle single touch
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const containerRect = this.core.container.getBoundingClientRect();
      
      // Calculate position relative to container
      const x = touch.clientX - containerRect.left;
      const y = touch.clientY - containerRect.top;
      
      // Create a new selection at tap point
      this.core.newSelection();
      
      // Set a small initial selection around tap point
      const size = 100;
      this.core.ui.selection.update({
        x: Math.max(0, x - size/2),
        y: Math.max(0, y - size/2),
        x2: Math.min(containerRect.width, x + size/2),
        y2: Math.min(containerRect.height, y + size/2),
        w: Math.min(size, containerRect.width),
        h: Math.min(size, containerRect.height)
      });
    }
  }
}