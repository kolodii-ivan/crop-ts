import '../static';
import { Jcrop } from '../constructor';
import StageDrag from './StageDrag';
import { on, off } from '../util';

/**
 * Manages stage-specific event wiring and configuration updates.
 */
export default class StageManager {
  core: any;
  ui: any;
  dragger: any;

  constructor(core: any) {
    this.core = core;
    this.ui = core.ui;
    this.init();
  }

  init(): void {
    this.setupEvents();
    this.dragger = new StageDrag(this.core);
  }

  tellConfigUpdate(options: any): void {
    this.ui.multi.forEach((sel: any) => {
      if (sel.setOptions && (sel.linked || (this.core.opt.linkCurrent && sel === this.ui.selection))) {
        sel.setOptions(options);
      }
    });
  }

  startDragHandler(): (e: MouseEvent) => any {
    return (e: MouseEvent) => {
      if (e.button === 0 || this.core.opt.is_ie_lt9) {
        return this.dragger.start(e);
      }
    };
  }

  removeEvents(): void {
    this.core.event.off('configupdate');
    off(this.core.container, 'mousedown');
  }

  shimLegacyHandlers(options: any): void {
    const core = this.core;
    Object.entries(core.opt.legacyHandlers).forEach(([oldEvt, newEvt]) => {
      const key = oldEvt as string;
      const fn = options[key];
      const evt = newEvt as string;
      if (fn) {
        on(core.container, evt, (e: Event) => {
          const ce = e as CustomEvent; const [s] = ce.detail as any[];
          fn.call(core, s);
        });
        delete options[key];
      }
    });
  }

  setupEvents(): void {
    const c = this.core;
    c.event.on('configupdate', () => {
      this.shimLegacyHandlers(c.opt);
      this.tellConfigUpdate(c.opt);
      this.core.container.dispatchEvent(new CustomEvent('cropconfig', { detail: [c, c.opt] }));
    });
    on(c.container, 'mousedown', this.startDragHandler());
  }
}

// Register component
(Jcrop as any).registerComponent('StageManager', StageManager);