import '../static';
import { Jcrop } from '../constructor';
import ImageStage from './Image';
import { ImageLoader } from '../component/ImageLoader';

/**
 * CSS transform based stage: translates, rotates, and scales an IMG.
 */
export default class TransformStage extends ImageStage {
  angle = 0;
  scale = 1;
  scaleMin = 0.2;
  scaleMax = 1.25;
  offset: [number, number] = [0, 0];
  $img!: HTMLImageElement;

  static isSupported(el: HTMLElement, o: any): boolean {
    return (Jcrop as any).supportsCSSTransforms && el.tagName === 'IMG';
  }

  static priority = 101;

  static create(el: HTMLImageElement, options: any, callback: (stage: TransformStage, opts: any) => void): void {
    ImageLoader.attach(el, (w, h) => {
      const obj = new TransformStage();
      const wrapper = document.createElement('div');
      wrapper.style.width = w + 'px';
      wrapper.style.height = h + 'px';
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      obj.element = wrapper;
      obj.$img = el;
      obj.imgsrc = el;
      callback(obj, options);
    });
  }

  init(core: any): void {
    this.core = core;
  }

  boundScale(v: number): number {
    if (v < this.scaleMin) return this.scaleMin;
    if (v > this.scaleMax) return this.scaleMax;
    return v;
  }

  setOffset(x: number, y: number): this {
    this.offset = [x, y];
    return this;
  }

  setAngle(v: number): this {
    this.angle = v;
    return this;
  }

  setScale(v: number): this {
    this.scale = this.boundScale(v);
    return this;
  }

  clear(): this {
    // CSS transform handles clearing
    return this;
  }

  triggerEvent(ev: string): this {
    this.$img.dispatchEvent(new Event(ev));
    return this;
  }

  redraw(): this {
    this.$img.style.transform =
      `translate(${-this.offset[0]}px, ${-this.offset[1]}px)` +
      ` rotate(${this.angle}deg)` +
      ` scale(${this.scale}, ${this.scale})`;
    this.$img.dispatchEvent(new Event('cropredraw'));
    return this;
  }
}

// Register stage type
(Jcrop as any).registerStageType('Transform', TransformStage);