import { Jcrop } from '../constructor';
import { trigger } from '../util';

/**
 * Fallback stage that directly uses the target element.
 */
export default class AbstractStage {
  // Reference to Jcrop core instance
  core: any;
  element!: HTMLElement;

  /** Always supported */
  static isSupported(el: HTMLElement, o: any): boolean {
    return true;
  }

  /** Lowest priority */
  static priority = 100;

  /** Create a new AbstractStage over the element */
  static create(el: HTMLElement, options: any, callback: (stage: AbstractStage, opts: any) => void): void {
    const obj = new AbstractStage();
    obj.element = el;
    callback(obj, options);
  }

  /** Attach to Jcrop core */
  attach(core: any): void {
    this.init(core);
    core.ui.stage = this;
  }

  /** Initialize with Jcrop core */
  init(core: any): void {
    this.core = core;
  }

  /** Trigger a stage event */
  triggerEvent(ev: string): this {
    trigger(this.element, ev);
    return this;
  }

  /** Return the stage element */
  getElement(): HTMLElement {
    return this.element;
  }
}

// Register stage type
(Jcrop as any).registerStageType('Block', AbstractStage);