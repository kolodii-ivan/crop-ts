// Simple setup file for tests

// Mock requestAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0);
};

// Add mock node styles property to HTMLElement
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = jest.fn();
}

// Add simple CustomEvent support to ensure it exists in the test environment
if (typeof window.CustomEvent !== 'function') {
  class CustomEventPolyfill extends Event {
    detail: any;
    
    constructor(type: string, options: any = {}) {
      super(type, options);
      this.detail = options?.detail;
    }
  }
  
  // @ts-ignore
  window.CustomEvent = CustomEventPolyfill;
}

// Add a test helper to Element prototype for making custom events
if (!('makeCustomEvent' in Element.prototype)) {
  // @ts-ignore
  Element.prototype.makeCustomEvent = function(type: string, detail: any): void {
    const event = new CustomEvent(type, { 
      bubbles: true, 
      cancelable: true, 
      detail: detail 
    });
    this.dispatchEvent(event);
  };
}