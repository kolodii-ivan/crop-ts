import '../static';
import { Jcrop } from '../constructor';

/**
 * Pre-loads an image and invokes callback with its dimensions
 */
export class ImageLoader {
  src: string;
  element: HTMLImageElement;
  callback?: (w: number, h: number) => void;

  constructor(src: string, element?: HTMLImageElement, cb?: (w: number, h: number) => void) {
    this.src = src;
    this.element = element || new Image();
    this.callback = cb;
    this.load();
  }

  /** Returns [width,height] if available */
  getDimensions(): [number, number] | null {
    const el = this.element;
    if (el.naturalWidth) {
      return [el.naturalWidth, el.naturalHeight];
    }
    if (el.width) {
      return [el.width, el.height];
    }
    return null;
  }

  /** Invoke the callback with dimensions */
  fireCallback(): void {
    this.element.onload = null;
    if (typeof this.callback === 'function') {
      const dims = this.getDimensions();
      if (dims) this.callback(dims[0], dims[1]);
    }
  }

  /** Returns true if image is already loaded */
  isLoaded(): boolean {
    return this.element.complete;
  }

  /** Start loading the image */
  load(): void {
    this.element.src = this.src;
    if (this.isLoaded()) {
      this.fireCallback();
    } else {
      this.element.onload = () => this.fireCallback();
    }
  }

  /** Static helper: create loader from existing <img> */
  static attach(el: HTMLImageElement, cb: (w: number, h: number) => void): ImageLoader {
    return new ImageLoader(el.src, el, cb);
  }
}

// Register component
(Jcrop as any).registerComponent('ImageLoader', ImageLoader);