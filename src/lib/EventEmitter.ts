/**
 * Simple EventEmitter implementation to replace jQuery events
 */
export class EventEmitter {
  private events: Map<string, Set<Function>> = new Map();

  /**
   * Add an event listener
   */
  on(event: string, callback: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return this;
  }

  /**
   * Remove an event listener
   */
  off(event: string, callback?: Function): this {
    if (!this.events.has(event)) return this;
    
    if (callback) {
      this.events.get(event)!.delete(callback);
    } else {
      this.events.delete(event);
    }
    return this;
  }

  /**
   * Trigger an event
   */
  emit(event: string, ...args: any[]): this {
    if (!this.events.has(event)) return this;
    
    this.events.get(event)!.forEach(callback => {
      try {
        callback(...args);
      } catch (e) {
        console.error('Error in event handler:', e);
      }
    });
    return this;
  }
}