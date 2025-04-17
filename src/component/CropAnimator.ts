import '../static';
import { Jcrop } from '../constructor';
import { addClass, removeClass, trigger } from '../util';

/**
 * Manages smooth cropping animation on selections.
 */
export default class CropAnimator {
  selection: any;
  core: any;

  constructor(selection: any) {
    this.selection = selection;
    this.core = selection.core;
  }

  getElement(): HTMLDivElement {
    const b = this.selection.get();
    const el = document.createElement('div');
    addClass(el, 'jcrop-crop-animator');
    el.style.position = 'absolute';
    el.style.top = b.y + 'px';
    el.style.left = b.x + 'px';
    el.style.width = b.w + 'px';
    el.style.height = b.h + 'px';
    return el;
  }

  animate(x: number, y: number, w: number, h: number, cb?: () => void): void {
    // TODO: implement smooth animation
    this.selection.allowResize(false);
    // Direct jump to final
    this.selection.updateRaw({ x, y, x2: x + w, y2: y + h, w, h }, 'se');
    this.selection.allowResize(true);
    if (cb) cb();
  }
}

// Register component under alias 'Animator'
(Jcrop as any).registerComponent('Animator', CropAnimator);