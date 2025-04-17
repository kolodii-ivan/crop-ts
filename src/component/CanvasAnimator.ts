import '../static';
import { Jcrop } from '../constructor';
import { extend, on, off, addClass, removeClass, trigger } from '../util';

/**
 * Manages smooth cropping animation on the canvas stage.
 */
export default class CanvasAnimator {
  stage: any;
  core: any;
  angle: number;
  scale: number;
  offset: [number, number];

  constructor(stage: any) {
    this.stage = stage;
    this.core = stage.core;
    this.cloneStagePosition();
  }

  cloneStagePosition(): void {
    const s = this.stage;
    this.angle = s.angle;
    this.scale = s.scale;
    this.offset = s.offset;
  }

  getElement(): HTMLDivElement {
    const s = this.stage;
    const el = document.createElement('div');
    const [top, left] = s.offset;
    addClass(el, 'jcrop-canvas-animator');
    el.style.position = 'absolute';
    el.style.top = top + 'px';
    el.style.left = left + 'px';
    el.style.width = this.angle + 'px';
    el.style.height = this.scale + 'px';
    return el;
  }

  animate(cb?: () => void): void {
    // TODO: implement smooth animation using requestAnimationFrame or Web Animations API
    // For now, directly apply final state and invoke callbacks
    this.cloneStagePosition();
    trigger(this.stage.element, 'croprotstart');
    // Finalize
    trigger(this.stage.element, 'croprotend');
    if (cb) cb();
  }
}

// Factory on Canvas stage
(Jcrop as any).stage.Canvas.prototype.getAnimator = function() {
  return new CanvasAnimator(this);
};
// Register component
(Jcrop as any).registerComponent('CanvasAnimator', CanvasAnimator);