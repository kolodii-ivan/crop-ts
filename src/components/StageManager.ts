import { DomUtil } from '../lib/DomUtil';

/**
 * Manages the cropping stage
 */
export class StageManager {
  public core: any;
  public shades: HTMLElement[] = [];
  private active = false;
  private initialized = false;

  /**
   * Create a new StageManager
   */
  constructor(core: any) {
    this.core = core;
    this.init();
  }

  /**
   * Initialize the stage manager
   */
  init(): void {
    this.createShades();
    this.initialized = true;
  }

  /**
   * Create the shades elements
   */
  createShades(): void {
    const cssShades = this.core.options.cssShades || 'jcrop-shades';
    
    // Create the four shade elements
    const shades = [
      DomUtil.createElement('div', { class: `${cssShades} ${cssShades}-north` }),
      DomUtil.createElement('div', { class: `${cssShades} ${cssShades}-east` }),
      DomUtil.createElement('div', { class: `${cssShades} ${cssShades}-south` }),
      DomUtil.createElement('div', { class: `${cssShades} ${cssShades}-west` })
    ];
    
    // Add them to the container
    for (const shade of shades) {
      this.core.container.appendChild(shade);
    }
    
    this.shades = shades;
    
    // Set shade styles
    const bgColor = this.core.options.bgColor || 'black';
    const bgOpacity = this.core.options.bgOpacity || 0.5;
    
    for (const shade of this.shades) {
      DomUtil.css(shade, {
        position: 'absolute',
        backgroundColor: bgColor,
        opacity: bgOpacity.toString(),
        zIndex: '5'
      });
    }
  }

  /**
   * Update shade positions based on the selection rectangle
   */
  updateShades(rect: { x: number; y: number; w: number; h: number }): void {
    if (!this.active) return;
    
    const fullWidth = this.core.container.offsetWidth;
    const fullHeight = this.core.container.offsetHeight;
    
    // North shade
    DomUtil.css(this.shades[0], {
      left: '0px',
      top: '0px',
      width: `${fullWidth}px`,
      height: `${rect.y}px`
    });
    
    // East shade
    DomUtil.css(this.shades[1], {
      left: `${rect.x + rect.w}px`,
      top: `${rect.y}px`,
      width: `${fullWidth - (rect.x + rect.w)}px`,
      height: `${rect.h}px`
    });
    
    // South shade
    DomUtil.css(this.shades[2], {
      left: '0px',
      top: `${rect.y + rect.h}px`,
      width: `${fullWidth}px`,
      height: `${fullHeight - (rect.y + rect.h)}px`
    });
    
    // West shade
    DomUtil.css(this.shades[3], {
      left: '0px',
      top: `${rect.y}px`,
      width: `${rect.x}px`,
      height: `${rect.h}px`
    });
  }

  /**
   * Show shades
   */
  showShades(): void {
    if (this.active) return;
    
    // Show shade elements
    for (const shade of this.shades) {
      DomUtil.css(shade, { display: 'block' });
    }
    
    this.active = true;
  }

  /**
   * Hide shades
   */
  hideShades(): void {
    if (!this.active) return;
    
    // Hide shade elements
    for (const shade of this.shades) {
      DomUtil.css(shade, { display: 'none' });
    }
    
    this.active = false;
  }

  /**
   * Enable the stage for use
   */
  enable(): void {
    this.showShades();
    DomUtil.addClass(this.core.container, 'jcrop-active');
  }

  /**
   * Disable the stage
   */
  disable(): void {
    this.hideShades();
    DomUtil.removeClass(this.core.container, 'jcrop-active');
  }
  
  /**
   * Update the stage
   */
  update(rect: { x: number; y: number; w: number; h: number }): void {
    this.updateShades(rect);
  }
}