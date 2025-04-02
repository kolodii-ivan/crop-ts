// Type augmentations for testing
interface HTMLElement {
  dispatchCustomEvent(type: string, detail: any): boolean;
  makeCustomEvent?(type: string, detail: any): void;
}

interface Element {
  dispatchCustomEvent?(type: string, detail: any): boolean;
  makeCustomEvent?(type: string, detail: any): void;
}

// Extend the default export from src/index.ts to include static properties
declare module '../src/index' {
  import { Jcrop } from '../src/Jcrop';
  import { JcropOptions } from '../src/types';
  
  interface JcropFactory extends Function {
    (element: HTMLElement | string, options?: any): Jcrop;
    attach(element: HTMLElement, options?: any): Jcrop;
    defaults: JcropOptions;
    Jcrop: typeof Jcrop;
  }
  
  const create: JcropFactory;
  export default create;
}