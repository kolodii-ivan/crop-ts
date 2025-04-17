import '../static';
import '../defaults';
import { Jcrop } from '../constructor';
import { extend, on, off, addClass, removeClass, trigger } from '../util';

/**
 * Thumbnail preview component.
 */
export default class Thumbnailer {
  core: any;
  selection: any | null;
  fading: boolean;
  fadeDelay: number;
  fadeDuration: number;
  autoHide: boolean;
  width: number;
  height: number;
  _hiding: any;
  element!: HTMLElement;
  preview!: HTMLImageElement | HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  last: any;
  cW!: number;
  cH!: number;
  selectionTarget: any;

  static defaults = {
    selection: null,
    fading: true,
    fadeDelay: 1000,
    fadeDuration: 1000,
    autoHide: false,
    width: 80,
    height: 80,
    _hiding: null
  };

  constructor() {
    // init in init()
  }

  recopyCanvas(): void {
    const s = this.core.ui.stage;
    const cxt = s.context;
    this.context.putImageData(cxt.getImageData(0, 0, s.canvas.width, s.canvas.height), 0, 0);
  }

  init(core: any, options: any): void {
    this.core = core;
    extend(this, (Thumbnailer as any).defaults, options);
    this.initEvents();
    this.refresh();
    this.insertElements();
    if (this.selection) {
      this.renderSelection(this.selection);
      this.selectionTarget = this.selection.element;
    } else if (this.core.ui.selection) {
      this.renderSelection(this.core.ui.selection);
    }

    if (this.core.ui.stage.canvas) {
      this.context = (this.preview as HTMLCanvasElement).getContext('2d')!;
      on(this.core.container, 'cropredraw', (e: Event) => {
        this.recopyCanvas();
        this.refresh();
      });
    }
  }

  updateImage(imgel: HTMLImageElement): this {
    this.preview.remove();
    this.preview = (Jcrop as any).imageClone(imgel);
    this.element.appendChild(this.preview);
    this.refresh();
    return this;
  }

  insertElements(): void {
    this.preview = (Jcrop as any).imageClone(this.core.ui.stage.imgsrc);
    this.element = document.createElement('div');
    addClass(this.element, 'jcrop-thumb');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.appendChild(this.preview);
    this.core.container.appendChild(this.element);
  }

  resize(w: number, h: number): this {
    this.width = w;
    this.height = h;
    this.element.style.width = w + 'px';
    this.element.style.height = h + 'px';
    this.renderCoords(this.last);
    return this;
  }

  refresh(): this {
    this.cW = this.core.opt.xscale * this.core.container.clientWidth;
    this.cH = this.core.opt.yscale * this.core.container.clientHeight;
    if (this.last) {
      this.renderCoords(this.last);
    }
    return this;
  }

  renderCoords(c: any): this {
    const rx = this.width / c.w;
    const ry = this.height / c.h;
    const w = Math.round(rx * this.cW);
    const h = Math.round(ry * this.cH);
    (this.preview as HTMLElement).style.width = w + 'px';
    (this.preview as HTMLElement).style.height = h + 'px';
    (this.preview as HTMLElement).style.marginLeft = '-' + Math.round(rx * c.x) + 'px';
    (this.preview as HTMLElement).style.marginTop = '-' + Math.round(ry * c.y) + 'px';
    this.last = c;
    return this;
  }

  renderSelection(s: any): any {
    return this.renderCoords(this.core.unscale(s.get()));
  }

  selectionStart(s: any): void {
    this.renderSelection(s);
  }

  show(): void {
    if (this._hiding) clearTimeout(this._hiding);
    if (!this.fading) {
      this.element.style.opacity = '1';
    } else {
      this.element.style.transition = 'opacity 80ms';
      this.element.style.opacity = '1';
    }
  }

  hide(): void {
    if (!this.fading) {
      this.element.style.display = 'none';
    } else {
      this._hiding = setTimeout(() => {
        this._hiding = null;
        this.element.style.transition = `opacity ${this.fadeDuration}ms`;
        this.element.style.opacity = '0';
      }, this.fadeDelay);
    }
  }

  initEvents(): void {
    // Show/hide shading on events
    on(this.core.container, 'croprotstart', () => { this.show(); });
    on(this.core.container, 'croprotend', () => { if (this.autoHide) this.hide(); });
    // cropstart carries detail [selection, box]
    on(this.core.container, 'cropstart', (e: Event) => {
      const ce = e as CustomEvent; const [s] = ce.detail as any[];
      if (!this.selectionTarget || this.selectionTarget === (e.target as HTMLElement))
        this.selectionStart(s);
    });
    // cropmove carries detail [selection, box]
    on(this.core.container, 'cropmove', (e: Event) => {
      const ce = e as CustomEvent; const [, c] = ce.detail as any[];
      this.renderCoords(c);
    });
    // cropend carries detail [selection, box]
    on(this.core.container, 'cropend', (e: Event) => {
      const ce = e as CustomEvent; const [, c] = ce.detail as any[];
      this.renderCoords(c);
      if (this.autoHide) this.hide();
    });
    // cropimage carries detail [self, img]
    on(this.core.container, 'cropimage', (e: Event) => {
      const ce = e as CustomEvent; const [, , im] = ce.detail as any[];
      this.updateImage(im);
    });
  }
}

// Register component
(Jcrop as any).registerComponent('Thumbnailer', Thumbnailer);