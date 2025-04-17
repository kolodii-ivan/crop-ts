import '../static';
import { Jcrop } from '../constructor';
import { on, addClass } from '../util';

/**
 * Touch support for mobile devices (simulates mouse events)
 */
export default class JcropTouch {
  core: any;

  constructor(core: any) {
    this.core = core;
    this.init();
  }

  static support(): boolean {
    return ('ontouchstart' in window) || (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch;
  }

  init(): void {
    const DragStateProto = (Jcrop as any).component.DragState.prototype;
    if (!DragStateProto.touch) {
      this.initEvents();
      this.shimDragState();
      this.shimStageDrag();
      DragStateProto.touch = true;
    }
  }

  shimDragState(): void {
    const t = this;
    const proto = (Jcrop as any).component.DragState.prototype;
    proto.initEvents = function(e: any) {
      const evType = e.type.substr(0, 5);
      if (evType === 'touch') {
        on(this.eventTarget, 'touchmove', t.dragWrap(this.createDragHandler()));
        on(this.eventTarget, 'touchend', this.createStopHandler());
      } else {
        on(this.eventTarget, 'mousemove', this.createDragHandler());
        on(this.eventTarget, 'mouseup', this.createStopHandler());
      }
    };
  }

  shimStageDrag(): void {
    const c = this.core;
    addClass(c.container, 'jcrop-touch');
    on(c.container, 'touchstart', this.dragWrap(c.ui.manager.startDragHandler()));
  }

  dragWrap(cb: (e: any) => any): (e: any) => any {
    return (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const evType = e.type.substr(0, 5);
      if (evType === 'touch') {
        const touch = e.changedTouches[0];
        e.pageX = touch.pageX;
        e.pageY = touch.pageY;
        return cb(e);
      }
      return false;
    };
  }

  initEvents(): void {
    const c = this.core;
    on(c.container, 'touchstart', (e: any) => {
      const target = (e.target as HTMLElement).closest('.' + c.opt.css_drag);
      if (target) {
        this.dragWrap(c.startDrag())(e);
      }
    });
  }
}

// Register component
(Jcrop as any).registerComponent('Touch', JcropTouch);