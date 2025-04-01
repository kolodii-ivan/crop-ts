/**
 * KeyWatcher component
 * Handles keyboard events for selection manipulation
 */
import { EventEmitter } from '../lib/EventEmitter';

export class KeyWatcher extends EventEmitter {
  private core: any;
  private enabled: boolean = false;
  private element: HTMLElement;
  private onKeyDown: (e: KeyboardEvent) => void;

  /**
   * Create a new KeyWatcher
   */
  constructor(core: any) {
    super();
    this.core = core;
    this.element = core.container;
    
    // Create bound keydown handler
    this.onKeyDown = this.handleKeyDown.bind(this);
    
    // Start watching
    this.enable();
  }

  /**
   * Enable keyboard events
   */
  enable(): void {
    if (this.enabled) return;
    
    document.addEventListener('keydown', this.onKeyDown);
    this.enabled = true;
  }

  /**
   * Disable keyboard events
   */
  disable(): void {
    if (!this.enabled) return;
    
    document.removeEventListener('keydown', this.onKeyDown);
    this.enabled = false;
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(e: KeyboardEvent): void {
    // Only handle keys when a selection exists and has focus
    if (!this.core.ui.selection || !this.hasFocus()) return;
    
    // Handle arrow keys
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      
      const shift = e.shiftKey ? 10 : 1;
      
      switch (e.key) {
        case 'ArrowUp':
          this.core.nudge(0, -shift);
          break;
        case 'ArrowDown':
          this.core.nudge(0, shift);
          break;
        case 'ArrowLeft':
          this.core.nudge(-shift, 0);
          break;
        case 'ArrowRight':
          this.core.nudge(shift, 0);
          break;
      }
      
      this.emit('key', e.key, e);
    }
    
    // Handle delete/backspace to remove selection
    if ((e.key === 'Delete' || e.key === 'Backspace') && 
        this.core.ui.selection.canDelete) {
      e.preventDefault();
      this.core.requestDelete();
      this.emit('key', e.key, e);
    }
    
    // Handle escape to blur selection
    if (e.key === 'Escape') {
      e.preventDefault();
      this.core.blur();
      this.emit('key', e.key, e);
    }
  }

  /**
   * Check if the container or a selection has focus
   */
  hasFocus(): boolean {
    const active = document.activeElement;
    
    // Check if the container has focus
    if (this.element === active) return true;
    
    // Check if any of the selections have focus
    for (const selection of this.core.ui.multi) {
      if (selection.frame === active || selection.element.contains(active)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Clean up event listeners when destroying
   */
  destroy(): void {
    this.disable();
  }
}