import { Point } from '../types';

/**
 * Manages state during drag operations
 */
export class DragState {
  public startX: number;
  public startY: number;
  public ox: number;
  public oy: number;
  public direction: string;
  public xmod: number = 0;
  public ymod: number = 0;
  public offsetX: number = 0;
  public offsetY: number = 0;
  public selection: any;
  public onMove: (e: MouseEvent | TouchEvent) => void;
  public onEnd: (e: MouseEvent | TouchEvent) => void;

  /**
   * Create a new DragState
   */
  constructor(e: MouseEvent | TouchEvent, selection: any, direction: string) {
    this.selection = selection;
    this.direction = direction;
    
    const pos = this.getEventPosition(e);
    const selectionRect = selection.get();
    
    this.startX = pos.x;
    this.startY = pos.y;
    this.ox = selectionRect.x;
    this.oy = selectionRect.y;
    
    this.onMove = this.createMoveHandler();
    this.onEnd = this.createEndHandler();
    
    // Set document-level event handlers
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
    document.addEventListener('touchmove', this.onMove, { passive: false });
    document.addEventListener('touchend', this.onEnd);
  }

  /**
   * Get position from event (handles both mouse and touch events)
   */
  getEventPosition(e: MouseEvent | TouchEvent): Point {
    let pageX: number, pageY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length) {
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;
      } else {
        // touchend may not have touches
        return { x: this.startX, y: this.startY };
      }
    } else {
      // Mouse event
      pageX = e.pageX;
      pageY = e.pageY;
    }
    
    // Get position relative to container
    const containerRect = this.selection.core.container.getBoundingClientRect();
    const docScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const docScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return {
      x: pageX - (containerRect.left + docScrollLeft),
      y: pageY - (containerRect.top + docScrollTop)
    };
  }

  /**
   * Create the move event handler
   */
  createMoveHandler(): (e: MouseEvent | TouchEvent) => void {
    return (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      
      const pos = this.getEventPosition(e);
      const diffX = pos.x - this.startX;
      const diffY = pos.y - this.startY;
      
      // Update the selection based on the drag direction
      this.updateSelection(diffX, diffY);
    };
  }

  /**
   * Create the end event handler
   */
  createEndHandler(): (e: MouseEvent | TouchEvent) => void {
    return (e: MouseEvent | TouchEvent) => {
      this.selection.endDrag();
      e.preventDefault();
    };
  }

  /**
   * Update selection based on drag movement
   */
  updateSelection(diffX: number, diffY: number): void {
    const selection = this.selection;
    const rect = selection.get();
    const direction = this.direction;
    
    // Make a copy of the rectangle that we can modify
    const newRect = { ...rect };
    
    // Handle different drag directions
    switch (direction) {
      case 'move':
        newRect.x = this.ox + diffX;
        newRect.y = this.oy + diffY;
        newRect.x2 = newRect.x + rect.w;
        newRect.y2 = newRect.y + rect.h;
        break;
        
      case 'n':
        newRect.y = this.oy + diffY;
        newRect.h = rect.h - diffY;
        break;
        
      case 's':
        newRect.h = rect.h + diffY;
        break;
        
      case 'e':
        newRect.w = rect.w + diffX;
        break;
        
      case 'w':
        newRect.x = this.ox + diffX;
        newRect.w = rect.w - diffX;
        break;
        
      case 'nw':
        newRect.x = this.ox + diffX;
        newRect.y = this.oy + diffY;
        newRect.w = rect.w - diffX;
        newRect.h = rect.h - diffY;
        break;
        
      case 'ne':
        newRect.y = this.oy + diffY;
        newRect.w = rect.w + diffX;
        newRect.h = rect.h - diffY;
        break;
        
      case 'sw':
        newRect.x = this.ox + diffX;
        newRect.w = rect.w - diffX;
        newRect.h = rect.h + diffY;
        break;
        
      case 'se':
        newRect.w = rect.w + diffX;
        newRect.h = rect.h + diffY;
        break;
    }
    
    // Ensure x2/y2 are updated
    newRect.x2 = newRect.x + newRect.w;
    newRect.y2 = newRect.y + newRect.h;
    
    // Update the selection
    selection.element.dispatchEvent(
      new CustomEvent('cropstart', { 
        detail: [selection, selection.core.unscale(newRect)] 
      })
    );
    
    selection.updateRaw(newRect, direction);
  }
}