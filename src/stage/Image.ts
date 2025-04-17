import '../static';
import { Jcrop } from '../constructor';
import AbstractStage from './Abstract';
import { ImageLoader } from '../component/ImageLoader';

/**
 * Basic image stage: wraps an IMG in a positioned container.
 */
export default class ImageStage extends AbstractStage {
  imgsrc!: HTMLImageElement;

  /** Supported if element is an IMG */
  static isSupported(el: HTMLElement, o: any): boolean {
    return el.tagName === 'IMG';
  }

  /** Medium priority */
  static priority = 90;

  /** Create a new ImageStage for <img> */
  static create(el: HTMLImageElement, options: any, callback: (stage: ImageStage, opts: any) => void): void {
    ImageLoader.attach(el, (w, h) => {
      const obj = new ImageStage();
      const wrapper = document.createElement('div');
      wrapper.style.width = w + 'px';
      wrapper.style.height = h + 'px';
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      obj.element = wrapper;
      obj.imgsrc = el;
      callback(obj, options);
    });
  }

  init(core: any): void {
    this.core = core;
  }
}

// Register stage type
(Jcrop as any).registerStageType('Image', ImageStage);