import '../static';
import { Jcrop } from '../constructor';

/**
 * Simple event manager to replace jQuery eventing on the Jcrop instance
 */
export class EventManager {
  core: any;
  private handlers: Map<string, Function[]> = new Map();

  constructor(core: any) {
    this.core = core;
  }

  /** Register an event handler */
  on(event: string, cb: (...args: any[]) => void): void {
    const list = this.handlers.get(event) || [];
    list.push(cb);
    this.handlers.set(event, list);
  }

  /** Unregister handlers; if cb provided removes only that, else removes all */
  off(event: string, cb?: (...args: any[]) => void): void {
    const list = this.handlers.get(event);
    if (!list) return;
    if (cb) {
      this.handlers.set(event, list.filter(fn => fn !== cb));
    } else {
      this.handlers.delete(event);
    }
  }

  /** Trigger all handlers for an event, passing args */
  trigger(event: string, ...args: any[]): void {
    const list = this.handlers.get(event);
    if (!list) return;
    list.slice().forEach(fn => {
      try { fn.apply(this.core, args); }
      catch (e) { console.error(e); }
    });
  }
}

// Register component
(Jcrop as any).registerComponent('EventManager', EventManager);