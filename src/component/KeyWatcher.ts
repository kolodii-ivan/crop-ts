import '../static';
import { Jcrop } from '../constructor';
import { extend, on, off } from '../util';

/**
 * Keyboard support for Jcrop
 */
export class KeyWatcher {
  core: any;
  eventName: string;
  passthru: number[];
  debug: boolean;
  
  // Default configuration
  static defaults = {
    eventName: 'keydown.jcrop',
    passthru: [9],
    debug: false
  };
  private handler?: (e: KeyboardEvent) => void;

  constructor(core: any) {
    this.core = core;
    this.init();
  }

  init(): void {
    // Merge default settings
    extend(this, KeyWatcher.defaults);
    this.enable();
  }

  disable(): void {
    // Remove all handlers for this event
    const type = this.eventName.split('.')[0];
    off(this.core.container, type, this.handler);
  }

  enable(): void {
    const m = this.core;
    const type = this.eventName.split('.')[0];
    this.handler = (e: KeyboardEvent) => {
      const nudge = e.shiftKey ? 16 : 2;
      if (this.passthru.includes(e.keyCode)) {
        return;
      }
      switch (e.keyCode) {
        case 37: m.nudge(-nudge, 0); break;
        case 38: m.nudge(0, -nudge); break;
        case 39: m.nudge(nudge, 0); break;
        case 40: m.nudge(0, nudge); break;
        case 46:
        case 8:
          m.requestDelete();
          e.preventDefault();
          return;
        default:
          if (this.debug) console.log('keycode:', e.keyCode);
          break;
      }
      if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
      }
    };
    on(this.core.container, type, this.handler);
  }
}

// Default settings
(KeyWatcher as any).defaults = {
  eventName: 'keydown.jcrop',
  passthru: [9],
  debug: false
};

// Register component
(Jcrop as any).registerComponent('Keyboard', KeyWatcher);