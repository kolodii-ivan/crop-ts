import '../static';
import { Jcrop } from '../constructor';
import ImageStage from './Image';
import { ImageLoader } from '../component/ImageLoader';

/**
 * Canvas-based stage with rotation and scaling.
 */
export default class CanvasStage extends ImageStage {
  angle = 0;
  scale = 1;
  scaleMin = 0.2;
  scaleMax = 1.25;
  offset: [number, number] = [0, 0];
  width!: number;
  height!: number;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  fillstyle = 'rgb(0,0,0)';

  /** Supported if canvas is available */
  static isSupported(el: HTMLElement, o: any): boolean {
    return (Jcrop as any).supportsCanvas && el.tagName === 'IMG';
  }

  /** Higher-than-Image priority */
  static priority = 60;

  /** Create a CanvasStage and hide original IMG */
  static create(el: HTMLImageElement, options: any, callback: (stage: CanvasStage, opts: any) => void): void {
    ImageLoader.attach(el, (w, h) => {
      const obj = new CanvasStage();
      el.style.display = 'none';
      obj.createCanvas(el, w, h);
      el.parentNode?.insertBefore(obj.element, el);
      obj.imgsrc = el;
      options.imgsrc = el;
      callback(obj, options);
      obj.redraw();
    });
  }

  init(core: any): void {
    this.core = core;
  }

  /** Set offset for rotation/scale pivot */
  setOffset(x: number, y: number): this {
    this.offset = [x, y];
    return this;
  }

  /** Set rotation angle */
  setAngle(v: number): this {
    this.angle = v;
    return this;
  }

  /** Set scale factor */
  setScale(v: number): this {
    this.scale = this.boundScale(v);
    return this;
  }

  /** Ensure scale within limits */
  boundScale(v: number): number {
    if (v < this.scaleMin) return this.scaleMin;
    if (v > this.scaleMax) return this.scaleMax;
    return v;
  }

  /** Create canvas element and wrapper */
  createCanvas(img: HTMLImageElement, w: number, h: number): void {
    this.width = w;
    this.height = h;
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.context = this.canvas.getContext('2d')!;
    this.fillstyle = 'rgb(0,0,0)';
    const wrapper = document.createElement('div');
    wrapper.style.width = w + 'px';
    wrapper.style.height = h + 'px';
    wrapper.appendChild(this.canvas);
    this.element = wrapper;
  }

  triggerEvent(ev: string): this {
    this.canvas.dispatchEvent(new Event(ev));
    return this;
  }

  /** Clear canvas to fillstyle */
  clear(): this {
    this.context.fillStyle = this.fillstyle;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  /** Draw rotated/scaled image onto canvas */
  redraw(): this {
    const ctx = this.context;
    ctx.save();
    this.clear();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.translate(this.offset[0] / this.core.opt.xscale, this.offset[1] / this.core.opt.yscale);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.drawImage(this.imgsrc, 0, 0, this.width, this.height);
    ctx.restore();
    this.canvas.dispatchEvent(new Event('cropredraw'));
    return this;
  }
}

// Register stage type
(Jcrop as any).registerStageType('Canvas', CanvasStage);