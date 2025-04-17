import '../static';
import { Jcrop } from '../constructor';
import { on, off, addClass, removeClass, data, trigger } from '../util';

/**
 * DialDrag handles custom rotational drag (e.g. for circular crops).
 */
export default class DialDrag {
  core: any;
  $btn!: HTMLElement;
  $targ!: HTMLElement;
  callback: (args: any[]) => void;
  ondone: (args: any[]) => void;
  offset: [number, number];
  angleOffset: number;
  distOffset: number;
  dragOffset: [number, number];

  constructor() {
    // initialization in init()
  }

  init(core: any, actuator?: HTMLElement, callback?: (args: any[]) => void): void {
    this.core = core;
    const btn = actuator || core.container;
    this.$btn = btn;
    this.$targ = btn;

    addClass(this.$btn, 'dialdrag');
    on(this.$btn, 'mousedown', this.mousedown());
    data(this.$btn, 'dialdrag', this);

    this.callback = typeof callback === 'function' ? callback : () => {};
    this.ondone = this.callback;
  }

  remove(): this {
    removeClass(this.$btn, 'dialdrag');
    off(this.$btn, 'mousedown');
    data(this.$btn, 'dialdrag', null);
    return this;
  }

  setTarget(obj: HTMLElement): this {
    this.$targ = obj;
    return this;
  }

  getOffset(): [number, number] {
    const rect = this.$targ.getBoundingClientRect();
    return [rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY];
  }

  relMouse(e: MouseEvent): [number, number, number, number] {
    const [ox, oy] = this.offset;
    const x = e.pageX - ox;
    const y = e.pageY - oy;
    const ang = Math.atan2(y, x) * (180 / Math.PI);
    const vec = Math.hypot(x, y);
    return [x, y, ang, vec];
  }

  mousedown(): (e: MouseEvent) => boolean {
    return (e: MouseEvent) => {
      this.offset = this.getOffset();
      const rel = this.relMouse(e);
      this.angleOffset = -this.core.ui.stage.angle + rel[2];
      this.distOffset = rel[3];
      this.dragOffset = [rel[0], rel[1]];
      trigger(this.core.container, 'croprotstart');

      const mouseMove = (ev: MouseEvent) => { this.callback(this.relMouse(ev)); };
      const mouseUp = (ev: MouseEvent) => {
        off(window, 'mousemove', mouseMove);
        off(window, 'mouseup', mouseUp);
        this.ondone(this.relMouse(ev));
        trigger(this.core.container, 'croprotend');
      };

      on(window, 'mousemove', mouseMove);
      on(window, 'mouseup', mouseUp);

      this.callback(this.relMouse(e));
      e.preventDefault();
      return false;
    };
  }
}

// Register component
(Jcrop as any).registerComponent('DialDrag', DialDrag);