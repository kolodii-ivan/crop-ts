import '../static';
import { Jcrop } from '../plugin';
import { addClass } from '../util';

/**
 * A filter that implements div-based shading around the selection.
 */
export default class ShadeFilter {
  tag = 'shader';
  priority = 95;
  fade = true;
  fadeSpeed = 320;
  fadeEasing = 'swing';
  core: any;
  container!: HTMLDivElement;
  shades!: { top: HTMLDivElement; right: HTMLDivElement; bottom: HTMLDivElement; left: HTMLDivElement };
  elw = 0;
  elh = 0;
  visible = false;
  color: string;
  opacity: number;
  _hiding: any;

  constructor(opacity?: number, color?: string) {
    this.opacity = opacity ?? 0.5;
    this.color = color ?? 'black';
    this.core = null;
  }

  init(core: any): void {
    this.core = core;
    if (!this.container) {
      this.container = document.createElement('div');
      addClass(this.container, core.opt.css_shades);
      this.container.style.display = 'none';
      core.container.prepend(this.container);
      this.elw = core.container.clientWidth;
      this.elh = core.container.clientHeight;
      this.shades = {
        top: this.createShade(),
        right: this.createShade(),
        bottom: this.createShade(),
        left: this.createShade()
      };
    }
  }

  destroy(): void {
    this.container.remove();
  }

  private createShade(): HTMLDivElement {
    const d = document.createElement('div');
    d.style.position = 'absolute';
    d.style.backgroundColor = this.color;
    d.style.opacity = this.opacity.toString();
    this.container.appendChild(d);
    return d;
  }

  setColor(color: string): this {
    this.color = color;
    Object.values(this.shades).forEach(el => {
      el.style.backgroundColor = color;
    });
    return this;
  }

  setOpacity(opacity: number): this {
    this.opacity = opacity;
    Object.values(this.shades).forEach(el => {
      el.style.opacity = opacity.toString();
    });
    return this;
  }

  refresh(sel: any): void {
    this.setColor(sel.bgColor ?? this.core.opt.bgColor ?? this.color);
    this.setOpacity(sel.bgOpacity ?? this.core.opt.bgOpacity ?? this.opacity);
    this.elh = this.core.container.clientHeight;
    this.elw = this.core.container.clientWidth;
    this.shades.right.style.height = this.elh + 'px';
    this.shades.left.style.height = this.elh + 'px';
  }

  filter(b: any): any {
    if (!this.core.ui.selection.active) return b;
    const s = this.shades;
    s.top.style.left = b.x + 'px';
    s.top.style.width = b.w + 'px';
    s.top.style.height = b.y + 'px';
    s.bottom.style.top = b.y2 + 'px';
    s.bottom.style.left = b.x + 'px';
    s.bottom.style.width = b.w + 'px';
    s.bottom.style.height = (this.elh - b.y2) + 'px';
    s.right.style.left = b.x2 + 'px';
    s.right.style.width = (this.elw - b.x2) + 'px';
    s.left.style.width = b.x + 'px';
    if (!this.visible) {
      this.container.style.display = '';
      this.visible = true;
    }
    return b;
  }
}

// Register filter
(Jcrop as any).registerFilter('shader', ShadeFilter);